// Listen and serve.
// It serves client connection and broadcast request.
package chat

import (
	"golang.org/x/net/websocket"
	"log"
	"net/http"
)

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
	s.Selector()
}
