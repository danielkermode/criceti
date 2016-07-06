#!/bin/bash

function copychat {
  start="./chat/"
  for file in `ls chat | grep -v ".*_test\.go$"`
  do
    cp $start$file ./vendor/github.com/danielkermode/criceti/chat
  done
}

case $1 in
  deploy)
    copychat
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
    copychat
    go install
    criceti &
    inotifywait -e close_write,moved_to,create  . ./chat |
    while read -r directory events filename; do
      ./build.sh watch
    done
    ;;
  test)
    cd chat
    go test -v
    ;;
  heroku)
    git push heroku master
    ;;
  *)
esac

