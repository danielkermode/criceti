# criceti

A hamster chat room.

```$ go get github.com/danielkermode/criceti``` or

```$ git clone``` this repo and ```$ go install```.

```$ criceti```. A server will be running at localhost:5000.

To build the client, ```$ cd client && npm i && npm run build```

I've added a shell script that aids my Go code development.
```$ ./build.sh <cmd> [msg]``` where ```cmd``` is one of:
```deploy``` does git/govendor stuff, commits with ```msg```.
```watch``` sets up a restarting Go server (works like nodemon).
```test``` runs tests.

WIP.