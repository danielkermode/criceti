import React, { Component, PropTypes } from 'react';

const messageDiv = {
  width: '1000px',
  height: '100px',
  overflow: 'scroll'
};

export class Messages extends Component {

  static propTypes = {

  };

  constructor(props) {
    super(props);
  }

  accept = (name, messageInd) => {
    const send = this.props.sock.send;
    return (e) => {
      this.props.deleteMessage(messageInd);
      const toSend = {
        id: this.props.sockId,
        data: name,
        type: 'acceptChallenge'
      };
      send(JSON.stringify(toSend));
    };
  };

  cancel = (name, messageInd) => {
    const send = this.props.sock.send;
    return (e) => {
      this.props.deleteMessage(messageInd);
      const toSend = {
        id: this.props.sockId,
        data: name,
        type: 'cancelChallenge'
      };
      send(JSON.stringify(toSend));
    };
  };

  render() {
    return (
      <div id="message" style={messageDiv}>
        {this.props.messages &&
          this.props.messages.map((message, key) => {
            const play = (key) => {
              return message.play &&
              (<div>
                <button
                  onClick={this.accept(this.props.challenging, key)}
                  className="btn btn-success">
                  Accept
                </button>
                <button
                  onClick={this.cancel(this.props.challenging, key)}
                  className="btn btn-warning">
                  No grazie
                </button>
              </div>);
            };
            return (
            message.Add ?
            (<div key={key}>
              <div><b>{message.Id}</b> {message.Add}</div>
              <div>{play(key)}</div>
            </div>) :
            (<div key={key}><b>{message.Id}</b> says: {message.Data}</div>)
            );
          })
        }
      </div>
    );
  }
}