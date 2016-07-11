import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from './components/App';
import ReconnectingWebSocket from './lib/reconnecting-websocket.min.js';
import Hamster from './lib/Hamster';
import configureStore from './redux/store';
import { Provider } from 'react-redux';
import * as hamsterActions from './redux/reducers/hamsters';
import * as messageActions from './redux/reducers/messages';
//redux setup
const store = configureStore();

//store.dispatch(hamsterActions.addHamster(new Hamster('yo')));

const reactRoot = document.getElementById('app');
const wsuri = location.protocol.replace('http', 'ws') + '//' + location.host + '/entry';
let currentState = {};
let message = '';
let sock = null;

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
  //rerender so App has access to socket now
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer sock={sock} />
    </Provider>,
    reactRoot
  );

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
        message = { Id: served.Id, Add: 'is busy at the moment.'};
        store.dispatch(messageActions.addMessage(message));
        break;
      case 'cancelChallenge':
        message = { Id: served.Id, Add: 'has cancelled the challenge.' };
        store.dispatch(messageActions.addMessage(message));
        store.dispatch(hamsterActions.setChallenging(''));
        break;
      case 'challenge':
        message = { Id: served.Id, Add: 'has asked to play with you!', play: true };
        store.dispatch(messageActions.addMessage(message));
        store.dispatch(hamsterActions.setChallenging(served.Id));
        break;
      case 'chat':
        store.dispatch(messageActions.addMessage(served));
        break;
      case 'connect':
        message = { Id: served.Id, Add: 'has connected.' };
        store.dispatch(messageActions.addMessage(message));
        currentState = store.getState();
        const ham = currentState.hamsters.all[currentState.hamsters.username];
        if(ham && currentState.hamsters.username != served.Id) {
          sock.send(JSON.stringify({
            id: currentState.hamsters.id,
            data: '{ "x": ' + ham.x + ', "y": ' + ham.y + '}',
            type: 'move'
          }));
        }
        break;
      case 'disconnect':
        message = { Id: served.Id, Add: 'has disconnected.' };
        store.dispatch(messageActions.addMessage(message));
        store.dispatch(hamsterActions.deleteHamster(served.Id));
        break;
      case 'leave':
        message = { Id: served.Id, Add: 'has left the room.' };
        store.dispatch(messageActions.addMessage(message));
        store.dispatch(hamsterActions.deleteHamster(served.Id));
        break;
      case 'move':
        if(served.Id) {
          currentState = store.getState();
          const coords = JSON.parse(served.Data);
          if(!currentState.hamsters.all[served.Id] && served.Data) {
            const hamUrl = '/resources/hamster-yellow.png';
            const newHamster = new Hamster(served.Id, hamUrl, coords.x, coords.y);
            store.dispatch(hamsterActions.addHamster(newHamster));
          } else {
            store.dispatch(hamsterActions.updateCoords(served.Id, coords));
          }
        }
        break;
      case 'room':
        currentState = store.getState();
        const hamX = currentState.hamsters.all[currentState.hamsters.username].x;
        const hamY = currentState.hamsters.all[currentState.hamsters.username].x;
        store.dispatch(hamsterActions.setRoom(served.Data));
        store.dispatch(hamsterActions.setChallenging(''));
        store.dispatch(hamsterActions.clearHamsters());
        store.dispatch(messageActions.clearMessages());
        //send default coods
        sock.send(JSON.stringify({
          id: currentState.hamsters.id,
          data: '{ "x":' + hamX + ', "y": '+ hamY + ' }',
          type: 'move'
        }));
        break;
      case 'setId':
        store.dispatch(hamsterActions.setId(served.Id));
        currentState = store.getState();
        sock.send(JSON.stringify({
          id: currentState.hamsters.id,
          data: location.pathname.split('/').pop(),
          type: 'username'
        }));
        break;
      case 'username':
        currentState = store.getState();
        store.dispatch(hamsterActions.setUsername(served.Data));
        const startCoords = store.getState().hamsters.startCoords;
        //send default coods
        sock.send(JSON.stringify({
          id: currentState.hamsters.id,
          data: '{ "x": ' + startCoords.x + ', "y": ' + startCoords.y + ' }',
          type: 'move'
        }));
        break;
      default:
        console.warn('No specified action for message type ' + served.Type);
    }
    // scroll message div to bottom, to see new messages immediately
    const elem = document.getElementById('message');
    elem.scrollTop = elem.scrollHeight;
  }

  ReactDOM.render(
    <Provider store={store}>
      <AppContainer sock={sock} />
    </Provider>,
    reactRoot
  );

};

