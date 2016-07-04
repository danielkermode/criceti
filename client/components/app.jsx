import React, { Component, PropTypes } from 'react';
import { Canvas } from './canvas'

const messageDiv = {
  width: '1000px',
  height: '100px',
  overflow: 'scroll'
};

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

  onEnter = (e) => {
    if (e.keyCode === 13) {
      // 13 is enter
      this.sendMessage();
    }
  };

  challenge = (name) => {
    const send = this.props.sock.send
    return (e) => {
      const toSend = {
        id: this.props.sockId,
        data: name,
        type: 'challenge'
      };
      send(JSON.stringify(toSend));
    };
  };

  changeRoom = (e, name) => {
    const toSend = {
      id: this.props.sockId,
      data: name,
      type: 'changeRoom'
    };
    console.log(toSend)
    this.props.sock.send(JSON.stringify(toSend));
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
        <div id="message" style={messageDiv}>
          {this.props.messages &&
            this.props.messages.map(message => {
              return message.Add ?
              (<div><b>{message.Id}</b> {message.Add}</div>) :
              (<div><b>{message.Id}</b> says: {message.Data}</div>);
            })
          }
        </div>
        <hr/>
        <div>
          <button onClick={this.changeRoom.bind(this.props.username)} className="btn btn-default">
            Play with yourself!
          </button>
          {ham && ham.canChallenge &&
            ham.canChallenge.map(hamster => {
              return (<button onClick={this.challenge(hamster.name)}
              className="btn btn-default">Play with {hamster.name}!</button>);
            })
          }
        </div>
        <br/>
        <Canvas sock={this.props.sock} bounds={this.props.bounds} sockId={this.props.sockId}
        hamsters={this.props.hamsters} username={this.props.username}/>
      </div>
    );
  }
}