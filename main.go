package main

import (
	"fmt"
	"github.com/danielkermode/criceti/chat"
	"log"
	"net/http"
	"os"
	"strings"
)

func roomHandler(w http.ResponseWriter, r *http.Request) {
	currentUrl := r.URL.Path
	user := currentUrl[strings.LastIndex(currentUrl, "/"):len(currentUrl)]
	//if there is nothing after '/'
	if len(user) == 0 {
		http.Redirect(w, r, "/room/anon", http.StatusFound)
		return
	}
	http.ServeFile(w, r, "public/room.html")
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
	http.Handle("/", http.FileServer(http.Dir("public")))
	http.HandleFunc("/register", regHandler)
	http.HandleFunc("/room/", roomHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}
	fmt.Println("listening on port " + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
