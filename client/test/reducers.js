//test reducers here
import test from 'tape';
import * as hamster from '../redux/reducers/hamsters';
import * as message from '../redux/reducers/messages';
import configureStore from '../redux/store';

test('hamster reducer', (t) => {
  const store = configureStore();
  const ham = { name: 'hamtaro' };
  const pikachu = { name: 'pikachu' };

  store.dispatch(hamster.addHamster(ham));
  t.deepEqual(store.getState().hamsters.all.hamtaro, ham, 'addHamster correctly adds a hamster object');

  const coords = { x: 12, y: 12 }
  store.dispatch(hamster.updateCoords(ham.name, coords));
  t.equal(store.getState().hamsters.all.hamtaro.x, coords.x, 'updateCoords updates x coordinate of hamster');
  t.equal(store.getState().hamsters.all.hamtaro.y, coords.y, 'updateCoords updates y coordinate of hamster');

  store.dispatch(hamster.deleteHamster(ham.name));
  t.notOk(store.getState().hamsters.all.hamtaro, 'deleteHamster correctly deletes a hamster object');

  store.dispatch(hamster.addHamster(ham));
  store.dispatch(hamster.addHamster(pikachu));
  store.dispatch(hamster.clearHamsters());
  t.deepEqual(store.getState().hamsters.all, {}, 'clearHamsters clears all hamsters');

  const username = 'dan';
  store.dispatch(hamster.setUsername(username));
  t.equal(store.getState().hamsters.username, username, 'setUsername works');

  const room = 'a room';
  store.dispatch(hamster.setRoom(room));
  t.equal(store.getState().hamsters.room, room, 'setRoom works');

  const id = 'an id';
  store.dispatch(hamster.setId(id));
  t.equal(store.getState().hamsters.id, id, 'setId works');

  const challenging = 'pikachu';
  store.dispatch(hamster.setChallenging(challenging));
  t.equal(store.getState().hamsters.challenging, challenging, 'setChallenging works');

  t.end();
});

test('message reducer', (t) => {
  const store = configureStore();
  const messageOne = { Id: 'dan', Data: 'some chit chat', Type: 'chat' };
  const messageTwo = { Id: 'dan', Data: 'has connected', Type: 'connect' };

  store.dispatch(message.addMessage(messageOne));
  t.equal(store.getState().messages.list.length, 1, 'addMessage adds only one message');
  t.deepEqual(store.getState().messages.list[0], messageOne, 'addMessage correctly adds a message object');

  store.dispatch(message.addMessage(messageTwo));
  store.dispatch(message.deleteMessage(0));
  t.equal(store.getState().messages.list.length, 1, 'deleteMessage deletes only one message');
  t.deepEqual(store.getState().messages.list[0], messageTwo, 'deleteMessage correctly deletes a message object');

  store.dispatch(message.addMessage(messageOne));
  store.dispatch(message.addMessage(messageOne));
  store.dispatch(message.clearMessages());
  t.equal(store.getState().messages.list.length, 0, 'clearMessages clears all messages');

  t.end();
});