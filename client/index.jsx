import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/app';
import ReconnectingWebSocket from './lib/reconnecting-websocket.min.js';
import Hamster from './lib/hamster';

const reactRoot = document.getElementById('app');
const wsuri = location.protocol.replace('http', 'ws') + '//' + location.host + '/entry';
const bounds = { x: 274, y: 132 };
const startCoods = { x: getRandomInt(0, bounds.x), y: getRandomInt(0, bounds.y) };
let hamsters = {};
let sockId, username;
let messages = [];
let sock = null;
let room = '';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sendDummy() {
  const dummy = {
    id: '',
    data: '',
    type: 'dummy'
  };
  sock.send(JSON.stringify(dummy));
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
      case 'busy':
        messages.push({ Id: served.Id, Add: 'is busy at the moment.'});
        break;
      case 'challenge':
        messages.push({ Id: served.Id, Add: 'has asked to play with you!', play: true });
        break;
      case 'chat':
        messages.push(served);
        break;
      case 'connect':
        messages.push({ Id: served.Id, Add: 'has connected.' });
        if(hamsters[username] && username != served.Id) {
          sock.send(JSON.stringify({
            id: sockId,
            data: '{ "x": ' + hamsters[username].x + ', "y": ' + hamsters[username].y + '}',
            type: 'move'
          }));
        }
        break;
      case 'disconnect':
        messages.push({ Id: served.Id, Add: 'has disconnected.' });
        delete hamsters[served.Id];
        break;
      case 'leave':
        messages.push({ Id: served.Id, Add: 'has left the room.' });
        delete hamsters[served.Id];
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
      case 'room':
        messages = [];
        const hamX = hamsters[username].x;
        const hamY = hamsters[username].y;
        hamsters = {};
        room =  served.Data;
        //send default coods
        sock.send(JSON.stringify({
          id: sockId,
          data: '{ "x":' + hamX + ', "y": '+ hamY + ' }',
          type: 'move'
        }));
        break;
      case 'setId':
      //this is the one time I expect the actual id and not the username as the served if.
        sockId = served.Id;
        sock.send(JSON.stringify({
          id: sockId,
          data: location.pathname.split('/').pop(),
          type: 'username'
        }));
        break;
      case 'username':
        username = served.Data;
        //send default coods
        sock.send(JSON.stringify({
          id: sockId,
          data: '{ "x": 6, "y": 6 }',
          type: 'move'
        }));
        break;
      default:
        console.warn('No specified action for message type ' + served.Type);
    }
    ReactDOM.render(
      <App sock={sock} startCoods={startCoods} bounds={bounds} messages={messages}
      hamsters={hamsters} username={username} sockId={sockId} room={room}/>,
      reactRoot
    );
    // scroll message div to bottom, to see new messages immediately
    const elem = document.getElementById('message');
    elem.scrollTop = elem.scrollHeight;
  }

  ReactDOM.render(
    <App sock={sock} startCoods={startCoods} bounds={bounds} messages={messages}
    hamsters={hamsters} username={username} sockId={sockId} room={room}/>,
    reactRoot
  );

};

