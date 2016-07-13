import React, { Component, PropTypes } from 'react';
import { RoomQuestionContainer } from './RoomQuestion';

export class RoomButton extends Component {
  static propTypes = {

  };

  act = (name, type) => {
    const send = this.props.sock.send;
    return (e) => {
      this.props.toggleAloneTime(false);
      const toSend = {
        id: this.props.sockId,
        data: name,
        type
      };
      send(JSON.stringify(toSend));
    };
  };

  render() {
    return (
    <div>
      <h4>In room: <b>{this.props.room}</b></h4>
      <button onClick={this.act('', 'changeRoom')} className="btn btn-default">
        Back to main room
      </button>
      <RoomQuestionContainer sock={this.props.sock} />
    </div>
    );
  }
}