import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addQuestions } from '../redux/reducers/questions';

export class RoomQuestion extends Component {
  static propTypes = {

  };

  componentDidMount() {
    this.props.addQuestions();
  }

  render() {
    return (
    <div>
    {Object.keys(this.props.hamsters.all).length > 1 && this.props.hamsters.aloneTime ?
      <span>Your alone time has been sabotaged! Kindly tell your "friend" to leave.</span> :
      <span>{this.props.questions.list[this.props.questions.activeQuestion]}</span>
    }
    </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    questions: state.questions,
    hamsters: state.hamsters
  };
}

function mapDispatchToProps (dispatch) {
  return {
    addQuestions: () => {
      dispatch(addQuestions());
    }
  };
}

export const RoomQuestionContainer = connect(mapStateToProps, mapDispatchToProps)(RoomQuestion);