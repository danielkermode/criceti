import React, { Component, PropTypes } from 'react';
import { Canvas } from './canvas';
import { Messages } from './messages';

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

  act = (name, type) => {
    const send = this.props.sock.send;
    return (e) => {
      const toSend = {
        id: this.props.sockId,
        data: name,
        type
      };
      send(JSON.stringify(toSend));
    };
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
              const play = message.play &&
              (<div>
                <button className="btn btn-success">Accept</button>
                <button className="btn btn-warning">No grazie</button>
              </div>);
              return (
              message.Add ?
              (<div>
                <div><b>{message.Id}</b> {message.Add}</div>
                <div>{play}</div>
              </div>) :
              (<div><b>{message.Id}</b> says: {message.Data}</div>)
              );
            })
          }
        </div>
        <hr/>
        <div>
          <button onClick={this.act(this.props.username, 'changeRoom')} className="btn btn-default">
            Play with yourself!
          </button>
          {ham && ham.canChallenge &&
            ham.canChallenge.map(hamster => {
              return (<button onClick={this.act(hamster.name, 'challenge')}
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