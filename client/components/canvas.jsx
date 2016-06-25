import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export class Canvas extends Component {

  static propTypes = {

  };

  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
  }

  componentDidMount() {
    let canvas = ReactDOM.findDOMNode(this.refs.myCanvas);
    let ctx = canvas.getContext('2d');


  }

  render() {
    return (
      <canvas ref="myCanvas" style={{
        border: '1px solid #000000',
        width: '600px',
        height: '300px'
      }}/>
    );
  }
}