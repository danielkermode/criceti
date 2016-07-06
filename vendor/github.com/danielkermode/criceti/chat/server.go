package chat

import (
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
