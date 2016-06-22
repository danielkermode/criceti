import React, { Component, PropTypes } from 'react';
import { Canvas } from './canvas'

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
          <Canvas />
          <p>
            Message: <input onKeyDown={this.onEnter} onChange={this.handleChange} type="text" placeholder="Enter your name" />
          </p>
        <button onClick={this.sendMessage}>Send Message</button>
        {this.props.messages &&
          this.props.messages.map(message => {
            return (<div><b>{message.id}</b> {message.message}</div>)
          })
        }
      </div>
    );
  }
}