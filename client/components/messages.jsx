import React, { Component, PropTypes } from 'react';

export class Messages extends Component {

  static propTypes = {

  };

  constructor(props) {
    super(props);
  }

  render() {
    const ham = this.props.hamsters[this.props.username];
    return (
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
    );
  }
}