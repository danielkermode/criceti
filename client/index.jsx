import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/app';
import ReconnectingWebSocket from './lib/reconnecting-websocket.min.js';
import Hamster from './lib/hamster';

const reactRoot = document.getElementById('app');
const wsuri = location.protocol.replace('http', 'ws') + '//' + location.host + '/entry';
const hamsters = {};
const bounds = { x: 274, y: 132 };
const startCoods = { x: getRandomInt(0, bounds.x), y: getRandomInt(0, bounds.y) };

let sockId, username;
let messages = [];
let sock = null;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sendDummy() {
  sock.send('DUMMY');
}

//stop 55s inactive disconnect in heroku
setInterval(sendDummy, 50000);

window.onload = function() {
  sock = new ReconnectingWebSocket(wsuri);

  sock.onopen = function() {
    console.log('connected to ' + wsuri);

  }

  sock.onclose = function(e) {
    console.log('connection closed (' + e.code + ')');
  }

  sock.onmessage = function(e) {
    const served = JSON.parse(e.data);
    switch(served.Type) {
      case 'username':
        username = served.Data;
        sock.send(JSON.stringify({
          id: username,
          data: '{ "x": 6, "y": 6 }',
          type: 'move'
        }));
        break;
      case 'chat':
        messages.push(served);
        break;
      case 'connect':
        messages.push({ Id: served.Data, Add: 'has connected.' });
        if(hamsters[username] && username != served.Data) {
          sock.send(JSON.stringify({
            id: username,
            data: '{ "x": ' + hamsters[username].x + ', "y": ' + hamsters[username].y + '}',
            type: 'move'
          }));
        }
        break;
      case 'disconnect':
        messages.push({ Id: served.Data, Add: 'has disconnected.' });
        delete hamsters[served.Data];
        break;
      case 'setId':
        sockId = served.Id;
        sock.send(JSON.stringify({
          id: sockId,
          data: location.pathname.split('/').pop(),
          type: 'username'
        }));
        break;
      case 'move':
        if(served.Id) {
          const coords = JSON.parse(served.Data);
          if(!hamsters[served.Id] && served.Data) {
            const hamUrl = served.Id === username ? '/resources/hamster-yellow.png' : '/resources/hamster-yellow.png';
            hamsters[served.Id] = new Hamster(served.Id, hamUrl, coords.x, coords.y);
          } else {
            hamsters[served.Id].x = coords.x;
            hamsters[served.Id].y = coords.y;
          }
        }
        break;
      default:
        console.warn('No specified action for message type ' + served.Type);
    }
    sockId = served.Id;
    ReactDOM.render(
      <App sock={sock} startCoods={startCoods} bounds={bounds} messages={messages}
      hamsters={hamsters} username={username} sockId={sockId}/>,
      reactRoot
    );
    // scroll message div to bottom, to see new messages immediately
    const elem = document.getElementById('message');
    elem.scrollTop = elem.scrollHeight;
  }

  ReactDOM.render(
    <App sock={sock} startCoods={startCoods} bounds={bounds} messages={messages}
    hamsters={hamsters} username={username} sockId={sockId}/>,
    reactRoot
  );

};

