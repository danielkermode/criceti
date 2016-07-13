import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import { App } from '../components/App';
import { Canvas } from '../components/Canvas';
import { ChallengeButtons } from '../components/ChallengeButtons';
import { Messages } from '../components/Messages';
import { RoomButton } from '../components/RoomButton';
import { RoomQuestion } from '../components/RoomQuestion';

test('<App />', (t) => {
  const hamsters = {
    all: {},
    username: '',
    room: '',
    startCoods: {},
    id: ''
  };
  const messages = {
    list: []
  };
  const wrapper = shallow(<App hamsters={hamsters} messages={messages} />);
  hamsters.room = 'this is a room';
  const wrapperWithRoom = shallow(<App hamsters={hamsters} messages={messages} />);
  t.equal(wrapper.find('Messages').length, 1, 'has a Messages component');
  t.equal(wrapper.find('Canvas').length, 1, 'has a Canvas component');
  t.equal(wrapper.find('ChallengeButtons').length, 1, 'has a ChallengeButtons component if given no room');
  t.equal(wrapper.find('RoomButton').length, 0, 'has no RoomButton component if given no room');
  t.equal(wrapperWithRoom.find('ChallengeButtons').length, 0, 'has no ChallengeButtons component if given a room');
  t.equal(wrapperWithRoom.find('RoomButton').length, 1, 'has a RoomButton component if given a room');
  t.end();
});

test('<Canvas />', (t) => {
  const wrapper = shallow(<Canvas sock={{}} bounds={{}} />);
  t.equal(wrapper.find('canvas').length, 1, 'has one canvas');
  t.end();
});

test('<ChallengeButtons />', (t) => {
  const canChallenge = [{ name: 'one' }, { name: 'two' }];
  const ham = { name: 'ham' };
  ham.canChallenge = canChallenge;
  const wrapper = shallow(<ChallengeButtons sock={{}} ham={ham} />);
  t.equal(wrapper.find('button').length, 3, 'has a button for each hamster available to challenge');
  t.end();
});

test('<Messages />', (t) => {
  const messagesPlay = [{ play: true, Add: 'additional info', Id: 'someone', Data: 'data' }];
  const messagesNoPlay = [{ play: false, Add: 'additional info', Id: 'someone', Data: 'data' }];
  const wrapper = shallow(<Messages sock={{}} messages={messagesPlay} />);
  const wrapperNoPlay = shallow(<Messages sock={{}} messages={messagesNoPlay} />);
  t.equal(wrapper.find('button').length, 2, 'has two buttons for message with "play"');
  t.equal(wrapperNoPlay.find('button').length, 0, 'has no buttons for message without "play"');
  t.end();
});

test('<RoomButton />', (t) => {
  const room = 'hi this is room';
  const wrapper = shallow(<RoomButton sock={{}} room={room} />);
  t.equal(wrapper.find('button').length, 1, 'has one button');
  t.equal(wrapper.find('h4').text(), 'In room: ' + room, 'renders correct text for given room');
  t.end();
});

test('<RoomQuestion />', (t) => {
  const sabotaged = 'Your alone time has been sabotaged! Kindly tell your "friend" to leave.';
  const hamsters = {
    all: {
      hamtaro: 'yo'
    },
    aloneTime: true
  };

  const questions = {
    list: ['where?'],
    activeQuestion: 0

  };

  const wrapper = shallow(<RoomQuestion questions={questions} hamsters={hamsters} addQuestions={f => f} />);
  t.equal(wrapper.find('span').text(), questions.list[0], 'renders correct text for single hamster alone time');
  hamsters.all.pikachu = 'pikaaa!';
  const wrapperSabotaged = shallow(<RoomQuestion questions={questions} hamsters={hamsters} addQuestions={f => f} />);
  t.equal(wrapperSabotaged.find('span').text(), sabotaged, 'renders correct text for interrupted alone time');
  t.end();
});