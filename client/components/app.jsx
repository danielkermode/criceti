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
      id: this.props.username,
      data: this.state.message,
      type: 'chat'
    }));
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
    return (
      <div>
        <h1>Criceti</h1>
        <div>Your hamster is called <b>{this.props.username}</b>.</div>
        <hr/>
        <div>
          <input onKeyDown={this.onEnter} onChange={this.handleChange} type="text" placeholder="Enter message" />
        </div>
        <button className="btn btn-default" onClick={this.sendMessage}>Send</button>
        <hr/>
        <div id="message" style={messageDiv}>
          {this.props.messages &&
            this.props.messages.map(message => {
              return message.Add ?
              (<div><b>{message.Id}</b> {message.Add}</div>) :
              (<div><b>{message.Id}</b> says: {message.Data}</div>)
            })
          }
        </div>
        <Canvas sock={this.props.sock} bounds={this.props.bounds}
        hamsters={this.props.hamsters} username={this.props.username}/>
      </div>
    );
  }
}