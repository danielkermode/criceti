package chat_test

import (
	"github.com/danielkermode/criceti/chat"
	"testing"
	"time"
)

func TestServerAdd(t *testing.T) {
	server := chat.NewServer("entry")
	time.AfterFunc(2*time.Second, server.Done)
	server.Listen()
}
