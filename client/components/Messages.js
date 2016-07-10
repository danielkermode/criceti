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

  render() {
    return (
      <div id="message" style={messageDiv}>
        {this.props.messages &&
          this.props.messages.map((message, key) => {
            const play = message.play &&
            (<div>
              <button className="btn btn-success">Accept</button>
              <button className="btn btn-warning">No grazie</button>
            </div>);
            return (
            message.Add ?
            (<div key={key}>
              <div><b>{message.Id}</b> {message.Add}</div>
              <div>{play}</div>
            </div>) :
            (<div key={key}><b>{message.Id}</b> says: {message.Data}</div>)
            );
          })
        }
      </div>
    );
  }
}