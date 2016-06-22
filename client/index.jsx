import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/app';

const reactRoot = document.getElementById('app');

var sock = null;
var wsuri = location.protocol.replace("http","ws") + "//" + location.host + "/entry";
var messages = []

window.onload = function() {
  console.log('onload');

  sock = new WebSocket(wsuri);

  sock.onopen = function() {
    console.log('connected to ' + wsuri);
  }

  sock.onclose = function(e) {
    console.log('connection closed (' + e.code + ')');
  }

  sock.onmessage = function(e) {
    console.log('message received: ' + e.data);
    messages.push(JSON.parse(e.data));
    ReactDOM.render(
      <App sock={sock} messages={messages}/>,
      reactRoot
    );
  }

  ReactDOM.render(
    <App sock={sock}/>,
    reactRoot
  );

};

