#!/bin/bash
pkill -f criceti
cp -r ./chat/ ./vendor/github.com/danielkermode/criceti/
go install
criceti &
inotifywait -e close_write,moved_to,create  . ./chat |
while read -r directory events filename; do
  ./gor.sh
done
