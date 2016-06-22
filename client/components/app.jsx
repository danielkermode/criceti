import React, { Component, PropTypes } from 'react';

export class App extends Component {

  static propTypes = {
    userCount: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
  }

  sendMessage = () => {
    this.props.sock.send(JSON.stringify({
      Id: 'anon',
      data: this.state.message
    }));
  };

  handleChange = (e) => {
    this.setState({ message: e.target.value });
  };

  render() {
    return (
      <div>
      <h1>WebSocket Echo Test</h1>
        <p>
          Message: <input onKeyDown={this.onEnter} onChange={this.handleChange} type="text" placeholder="Enter your name" />
        </p>
      <button onClick={this.sendMessage}>Send Message</button>
      {this.props.messages &&
        this.props.messages.map(message => {
          return (<div>
              <span>{message.Id} says: </span>
              <span>{message.Data}</span>
            </div>)
        })
      }
      </div>
    );
  }
}