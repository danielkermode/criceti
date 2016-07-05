package chat

import (
	"golang.org/x/net/websocket"
	"log"
	"net/http"
	"strconv"
)

// Chat server.
type Server struct {
	pattern   string
	messages  []*Message
	clients   map[int]*Client
	addCh     chan *Client
	delCh     chan *Client
	sendAllCh chan *Message
	doneCh    chan bool
	errCh     chan error
	users     map[string]bool
	ids       map[int]string
}

// Create new chat server.
func NewServer(pattern string) *Server {
	messages := []*Message{}
	clients := make(map[int]*Client)
	addCh := make(chan *Client)
	delCh := make(chan *Client)
	sendAllCh := make(chan *Message)
	doneCh := make(chan bool)
	errCh := make(chan error)
	users := make(map[string]bool)
	ids := make(map[int]string)

	return &Server{
		pattern,
		messages,
		clients,
		addCh,
		delCh,
		sendAllCh,
		doneCh,
		errCh,
		users,
		ids,
	}
}

func (s *Server) Add(c *Client) {
	s.addCh <- c
}

func (s *Server) Del(c *Client) {
	s.delCh <- c
}

func (s *Server) SendAll(msg *Message) {
	s.sendAllCh <- msg
}

func (s *Server) Done() {
	s.doneCh <- true
}

func (s *Server) Err(err error) {
	s.errCh <- err
}

func (s *Server) sendPastMessages(c *Client) {
	for _, msg := range s.messages {
		c.Write(msg)
	}
}

func (s *Server) sendToRoom(msg *Message, room string) {
	for _, c := range s.clients {
		if c.room == room {
			c.Write(msg)
		}
	}
}

func (s *Server) broadcastToRoom(msg *Message, room string, cli *Client) {
	for _, c := range s.clients {
		if c.room == room && c.id != cli.id {
			c.Write(msg)
		}
	}
}

func (s *Server) getCurrent(id string) (*Client, int) {
	//get a client based on a string id (this is the form of data sent by the browser to the server)
	i, _ := strconv.Atoi(id)
	if _, ok := s.clients[i]; !ok {
		return nil, 0
	}

	current := s.clients[i]
	return current, i

}

func (s *Server) getByUsername(user string) *Client {
	for id, name := range s.ids {
		if name == user {
			return s.clients[id]
		}
	}
	return nil
}

// Listen and serve.
// It serves client connection and broadcast request.
func (s *Server) Listen() {

	log.Println("Listening server...")

	// websocket handler
	onConnected := func(ws *websocket.Conn) {
		defer func() {
			err := ws.Close()
			if err != nil {
				s.errCh <- err
			}
		}()

		client := NewClient(ws, s)
		s.Add(client)
		client.Listen()
	}
	http.Handle(s.pattern, websocket.Handler(onConnected))
	log.Println("Created handler")

	for {
		select {

		// Add new a client
		case c := <-s.addCh:
			log.Println("Added new client")
			s.clients[c.id] = c
			c.Write(&Message{strconv.Itoa(c.id), "", "setId"})
			// s.sendPastMessages(c)

		// del a client
		case c := <-s.delCh:
      //Extract this into a function
			log.Println("Delete client")
			oldname := s.ids[c.id]
			msg := &Message{oldname, "", "disconnect"}
			s.sendToRoom(msg, c.room)
			// delete all server data (*client, id: username, and username: true)
			delete(s.clients, c.id)
			delete(s.ids, c.id)
			delete(s.users, oldname)

		// message from clients
		case msg := <-s.sendAllCh:
			switch msg.Type {
			case "username":
				current, i := s.getCurrent(msg.Id)
				username := ""
				if _, ok := s.users[msg.Data]; ok {
					// if username exists on the server, set the username to be "username + _id"
					username = msg.Data + "_" + msg.Id
				} else {
					// otherwise send back just username and add it to users on the server
					username = msg.Data
					s.users[username] = true
				}
				s.ids[i] = username
				current.Write(&Message{msg.Id, username, "username"})
				// send a "connected" message to all sockets
				cmsg := &Message{username, "", "connect"}
				s.sendToRoom(cmsg, current.room)
			case "changeRoom":
				current, i := s.getCurrent(msg.Id)
				if current != nil {
					leavemsg := &Message{s.ids[i], "", "leave"}
					s.broadcastToRoom(leavemsg, current.room, current)
					current.room = msg.Data
					current.Write(&Message{msg.Id, current.room, "room"})
				}
			case "challenge":
				current, i := s.getCurrent(msg.Id)
				other := s.getByUsername(msg.Data)
				if current != nil && other != nil && !other.challenging {
					other.Write(&Message{s.ids[i], "", "challenge"})
					current.challenging = true
					other.challenging = true
				} else if current != nil && other != nil && other.challenging {
					current.Write(&Message{msg.Data, "", "busy"})
				}
			default:
				//echo the message to all sockets
				current, i := s.getCurrent(msg.Id)
				if current != nil {
					s.messages = append(s.messages, msg)
					s.sendToRoom(&Message{s.ids[i], msg.Data, msg.Type}, current.room)
				}
			}
		case err := <-s.errCh:
			log.Println("Error:", err.Error())

		case <-s.doneCh:
			return
		}
	}
}// this is a 200 line file with not tests. Split it out and test at least some of it!
