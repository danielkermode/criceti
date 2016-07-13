import React, { Component, PropTypes } from 'react';
import { setChallenging } from '../redux/reducers/hamsters';

export class ChallengeButtons extends Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
  }

  act = (name, type) => {
    const send = this.props.sock.send;
    return (e) => {
      if(type === 'challenge') {
        this.props.setChallenging(name);
      } else if(type === 'changeRoom') {
        this.props.toggleAloneTime(true);
      }

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
      {!this.props.challenging ?
      <div>
        <button onClick={this.act(this.props.username, 'changeRoom')} className="btn btn-default">
          Go to your house!
        </button>
        {ham && ham.canChallenge &&
          ham.canChallenge.map((hamster, key) => {
            return (<button key={key} onClick={this.act(hamster.name, 'challenge')}
            className="btn btn-default">Invite {hamster.name} to your house!</button>);
          })
        }
      </div> :
      <div>
        <div> Talking to {this.props.challenging}... </div>
        <button
          onClick={this.act(this.props.challenging, 'cancelChallenge')}
          className="btn btn-warning">
          Cancel
        </button>
      </div>
      }
    </div>
    );
  }
}
