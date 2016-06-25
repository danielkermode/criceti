import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/app';
import ReconnectingWebSocket from './lib/reconnecting-websocket.min.js';

const reactRoot = document.getElementById('app');

let sock = null;
const wsuri = location.protocol.replace("http","ws") + "//" + location.host + "/entry";
let messages = [];
let sockId, username;

window.onload = function() {
  console.log('onload');

  sock = new ReconnectingWebSocket(wsuri);

  sock.onopen = function() {
    console.log('connected to ' + wsuri);

  }

  sock.onclose = function(e) {
    console.log('connection closed (' + e.code + ')');
  }

  sock.onmessage = function(e) {
    console.log('message received: ' + e.data);
    const served = JSON.parse(e.data)
    switch(served.Type) {
      case 'username':
        username = served.Data;
        break;
      case 'chat':
        messages.push({ id: served.Data, message: 'says ' + served.Data });
        break;
      case 'connect':
        messages.push({ id: served.Data, message: 'has connected.' });
        break;
      case 'disconnect':
        messages.push({ id: served.Data, message: 'has disconnected.' });
        break;
      case 'setId':
        sockId = served.Id;
        sock.send(JSON.stringify({
          id: sockId,
          data: location.pathname.split('/').pop(),
          type: 'username'
        }));
        break;
      default:
        console.warn('No specified action for message type ' + served.Type);
    }
    sockId = served.Id;
    ReactDOM.render(
      <App sock={sock} messages={messages} sockId={sockId}/>,
      reactRoot
    );
    // scroll message div to bottom, to see new messages immediately
    const elem = document.getElementById('message');
    elem.scrollTop = elem.scrollHeight;
  }

  ReactDOM.render(
    <App sock={sock}/>,
    reactRoot
  );

};

