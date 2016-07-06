#!/bin/bash
pkill -f criceti
cp -r ~/Desktop/code/gocode/src/github.com/danielkermode/criceti/chat/ ~/Desktop/code/gocode/src/github.com/danielkermode/criceti/vendor/github.com/danielkermode/criceti/
go install
criceti &
inotifywait -e close_write,moved_to,create  . |
while read -r directory events filename; do
  ./gor.sh
done
