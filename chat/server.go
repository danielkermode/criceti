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

func (s *Server) sendAll(msg *Message) {
	for _, c := range s.clients {
		c.Write(msg)
	}
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
			log.Println("Delete client")
			oldname := s.ids[c.id]
			msg := &Message{strconv.Itoa(c.id), oldname, "disconnect"}
			s.sendAll(msg)
			// delete all server data (*client, id: username, and username: true)
			delete(s.clients, c.id)
			delete(s.ids, c.id)
			delete(s.users, oldname)

		// broadcast message for all clients
		case msg := <-s.sendAllCh:
			switch msg.Type {
			case "username":
				i, _ := strconv.Atoi(msg.Id)
				current := s.clients[i]
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
				cmsg := &Message{msg.Id, username, "connect"}
				s.sendAll(cmsg)
			default:
				//echo the message to all sockets
				s.messages = append(s.messages, msg)
				s.sendAll(msg)
			}
		case err := <-s.errCh:
			log.Println("Error:", err.Error())

		case <-s.doneCh:
			return
		}
	}
}
