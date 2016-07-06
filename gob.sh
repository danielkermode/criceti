#!/bin/bash
cp -r ~/Desktop/code/gocode/src/github.com/danielkermode/criceti/vendor/github.com/danielkermode/criceti/chat/ ~/Desktop/code/gocode/src/github.com/danielkermode/criceti/
git add .
git commit -m $1
git push
govendor update github.com/danielkermode/criceti/chat
