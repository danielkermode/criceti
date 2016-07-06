package chat_test

import (
	"github.com/danielkermode/criceti/chat"
	"testing"
	"time"
)

func TestServer(t *testing.T) {
	server := chat.NewServer("entry")
	time.AfterFunc(1*time.Second, server.Done)
	server.Listen()
}
asd