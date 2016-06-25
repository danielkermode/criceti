package main

import (
	"fmt"
	"github.com/danielkermode/criceti/chat"
	"log"
	"net/http"
	"os"
)

func main() {
	log.SetFlags(log.Lshortfile)

	// websocket server
	server := chat.NewServer("/entry")
	go server.Listen()

	// static files
	http.Handle("/", http.FileServer(http.Dir("public")))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Println("listening on port " + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
