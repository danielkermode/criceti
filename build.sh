#!/bin/bash

case  $1  in
  deploy)
    cp -r ~/Desktop/code/gocode/src/github.com/danielkermode/criceti/chat/ ~/Desktop/code/gocode/src/github.com/danielkermode/criceti/vendor/github.com/danielkermode/criceti/
    git add .
    git commit -m "$2"
    git push
    govendor fetch github.com/danielkermode/criceti/chat
    git add .
    git commit -m "govendor update"
    git push
    ;;
  watch)
    pkill -f criceti
    cp -r ./chat/ ./vendor/github.com/danielkermode/criceti/
    go install
    criceti &
    inotifywait -e close_write,moved_to,create  . ./chat |
    while read -r directory events filename; do
      ./gor.sh
    done
    ;;
  test)
    cd chat
    go test -v
    ;;
     *)
esac