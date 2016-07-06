package chat_test

import (
	"github.com/danielkermode/criceti/chat"
	"testing"
	"time"
)

var origin = "http://localhost/"

func TestServer(t *testing.T) {
	server := chat.NewServer("entry")
	time.AfterFunc(1*time.Second, server.Done)
	server.Listen()
}
