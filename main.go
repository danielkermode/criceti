package main

import (
	"fmt"
	"github.com/danielkermode/criceti/chat"
	"github.com/danielkermode/criceti/gzip"
	"log"
	"net/http"
	"os"
)

func roomHandler(w http.ResponseWriter, r *http.Request) {
	m := r.URL.Path
	// if url is length 6 no username has been entered
	if len(m) == 6 {
		http.Redirect(w, r, "/room/anon", http.StatusFound)
		return
	}
	gzip.ServeFile(w, r, "public/room.html")
}

func regHandler(w http.ResponseWriter, r *http.Request) {
	body := r.FormValue("body")
	http.Redirect(w, r, "/room/"+body, http.StatusFound)
}

func main() {
	log.SetFlags(log.Lshortfile)

	// websocket server
	server := chat.NewServer("/entry")
	go server.Listen()

	// static files
	http.Handle("/", gzip.FileServer(http.Dir("public")))
	http.HandleFunc("/register", regHandler)
	http.HandleFunc("/room/", roomHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Println("listening on port " + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
