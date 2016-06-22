import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/app';

const reactRoot = document.getElementById('app');

let sock = null;
const wsuri = location.protocol.replace("http","ws") + "//" + location.host + "/entry";
let messages = [];
let sockId;

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
    const served = JSON.parse(e.data)
    switch(served.Type) {
      case 'chat':
        messages.push({ id: served.Id, message: 'says ' + served.Data });
        break;
      case 'connect':
        messages.push({ id: served.Id, message: 'has connected.' });
        break;
      case 'disconnect':
        messages.push({ id: served.Id, message: 'has disconnected.' });
        break;
      case 'setId':
        sockId = served.Id;
        break;
      default:
        console.warn('No specified action for message type ' + served.Type);
    }

    ReactDOM.render(
      <App sock={sock} messages={messages} sockId={sockId}/>,
      reactRoot
    );
  }

  ReactDOM.render(
    <App sock={sock}/>,
    reactRoot
  );

};

