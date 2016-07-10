import React, { Component, PropTypes } from 'react';

export class ChallengeButtons extends Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
    this.state = {
      challenging: ''
    };
  }

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
    const ham = this.props.ham;
    return (
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
    );
  }
}