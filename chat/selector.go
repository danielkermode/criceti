package chat

import (
	"log"
	"strconv"
)

func (s *Server) Selector() {
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
			msg := &Message{oldname, "", "disconnect"}
			s.sendToRoom(msg, c.room)
			// delete all server data (*client, id: username, and username: true)
			delete(s.clients, c.id)
			delete(s.ids, c.id)
			delete(s.users, oldname)

		// message from clients
		case msg := <-s.sendAllCh:
			switch msg.Type {
			case "acceptChallenge":
				current, _ := s.getCurrent(msg.Id)
				other := s.getByUsername(msg.Data)
				if current != nil && other != nil {
					current.challenging = false
					other.challenging = false
					current.room = msg.Data
					other.room = msg.Data
					current.Write(&Message{"", current.room, "room"})
					other.Write(&Message{"", other.room, "room"})
				}
			case "cancelChallenge":
				current, i := s.getCurrent(msg.Id)
				other := s.getByUsername(msg.Data)
				if current != nil && other != nil {
					current.challenging = false
					other.challenging = false
					current.Write(&Message{s.ids[i], "", "cancelChallenge"})
					other.Write(&Message{s.ids[i], "", "cancelChallenge"})
				}
			case "challenge":
				current, i := s.getCurrent(msg.Id)
				other := s.getByUsername(msg.Data)
				if current != nil && other != nil && !other.challenging {
					current.challenging = true
					other.challenging = true
					other.Write(&Message{s.ids[i], "", "challenge"})
				} else if current != nil && other != nil && other.challenging {
					current.Write(&Message{msg.Data, "", "busy"})
				}
			case "changeRoom":
				current, i := s.getCurrent(msg.Id)
				if current != nil {
					leavemsg := &Message{s.ids[i], "", "leave"}
					s.broadcastToRoom(leavemsg, current.room, current)
					current.room = msg.Data
					joinmsg := &Message{s.ids[i], "", "connect"}
					s.broadcastToRoom(joinmsg, current.room, current)
					current.Write(&Message{msg.Id, current.room, "room"})
				}
			case "username":
				current, i := s.getCurrent(msg.Id)
				if current != nil {
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
}
