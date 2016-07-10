import React, { Component, PropTypes } from 'react';
import { Canvas } from './Canvas';
import { Messages } from './Messages';
import { ChallengeButtons } from './ChallengeButtons';
import { RoomButton } from './RoomButton';

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
    this.props.sock.send(JSON.stringify({
      id: this.props.sockId,
      data: this.state.message,
      type: 'chat'
    }));
    document.getElementById('input').value = '';
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
    const ham = this.props.hamsters[this.props.username];
    return (
      <div>
        <h1>Criceti</h1>
        <div>Your hamster is called <b>{this.props.username}</b>.</div>
        <hr/>
        <div>
          <input id="input" onKeyDown={this.onEnter} onChange={this.handleChange} type="text" placeholder="Enter message" />
        </div>
        <button className="btn btn-default" onClick={this.sendMessage}>Send</button>
        <hr/>
        <Messages messages={this.props.messages}/>
        <hr/>
        {!this.props.room ?
          <ChallengeButtons
            sock={this.props.sock}
            sockId={this.props.sockId}
            ham={ham}
            username={this.props.username}/> :
          <RoomButton
            sock={this.props.sock}
            sockId={this.props.sockId}
            room={this.props.room}
            username={this.props.username}/>
        }
        <br/>
        <Canvas sock={this.props.sock} bounds={this.props.bounds} sockId={this.props.sockId}
        hamsters={this.props.hamsters} username={this.props.username}/>
      </div>
    );
  }
}