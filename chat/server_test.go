package chat_test

import (
	"github.com/danielkermode/criceti/chat"
	"testing"
)

func TestServerAdd(t *testing.T) {
	server := chat.NewServer("entry")
	server.Listen()
	defer server.Done()
}
