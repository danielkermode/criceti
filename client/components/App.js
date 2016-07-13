import React, { Component, PropTypes } from 'react';
import { Canvas } from './Canvas';
import { Messages } from './Messages';
import { ChallengeButtons } from './ChallengeButtons';
import { RoomButton } from './RoomButton';
import { connect } from 'react-redux';
import { setChallenging, updateCoords, toggleAloneTime } from '../redux/reducers/hamsters';
import { deleteMessage } from '../redux/reducers/messages';

export class App extends Component {

  static propTypes = {

  };

  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
  }

  sendMessage = () => {
    if(this.state.message) {
      this.props.sock.send(JSON.stringify({
        id: this.props.hamsters.id,
        data: this.state.message,
        type: 'chat'
      }));
      document.getElementById('input').value = '';
      this.setState({ message: '' });
    }
  };

  handleChange = (e) => {
    this.setState({ message: e.target.value });
  };

  onEnter = (e) => {
    if (e.keyCode === 13) {
      // 13 is enter
      this.sendMessage();
    }
  };

  render() {
    const ham = this.props.hamsters.all[this.props.hamsters.username];
    return (
      <div>
        <h1>Criceti</h1>
        <div>Your hamster is called <b>{this.props.hamsters.username}</b>.</div>
        <div>Move: <b>W S A D</b></div>
        <hr/>
        <div>
          <input id="input" onKeyDown={this.onEnter} onChange={this.handleChange} type="text" placeholder="Enter message" />
        </div>
        <button className="btn btn-default" onClick={this.sendMessage}>Send</button>
        <hr/>
        <Messages
          challenging={this.props.hamsters.challenging}
          messages={this.props.messages.list}
          deleteMessage={this.props.deleteMessage}
          sock={this.props.sock}
          sockId={this.props.hamsters.id}/>
        <hr/>
        {!this.props.hamsters.room ?
          <ChallengeButtons
            challenging={this.props.hamsters.challenging}
            setChallenging={this.props.setChallenging}
            toggleAloneTime={this.props.toggleAloneTime}
            sock={this.props.sock}
            sockId={this.props.hamsters.id}
            ham={ham}
            username={this.props.hamsters.username}/> :
          <RoomButton
            toggleAloneTime={this.props.toggleAloneTime}
            sock={this.props.sock}
            sockId={this.props.hamsters.id}
            room={this.props.hamsters.room}
            username={this.props.hamsters.username}/>
        }
        <br/>
        <Canvas sock={this.props.sock} bounds={this.props.hamsters.bounds} sockId={this.props.hamsters.id} updateCoords={this.props.updateCoords}
        hamsters={this.props.hamsters.all} username={this.props.hamsters.username} startCoords={this.props.hamsters.startCoords}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state
  };
}

function mapDispatchToProps (dispatch) {
  return {
    setChallenging: (name) => {
      dispatch(setChallenging(name));
    },
    deleteMessage: (ind) => {
      dispatch(deleteMessage(ind));
    },
    updateCoords: (name, coords) => {
      dispatch(updateCoords(name, coords));
    },
    toggleAloneTime: (toggle) => {
      dispatch(toggleAloneTime(toggle));
    }
  };
}

export const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);