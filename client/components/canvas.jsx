import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Hamster from '../lib/hamster';


export class Canvas extends Component {

  static propTypes = {

  };

  constructor(props) {
    super(props);
    this.state = {
      ctx: null,
      canvas: null
    };
  }

  componentDidMount() {
    let canvas = ReactDOM.findDOMNode(this.refs.myCanvas);
    let ctx = canvas.getContext('2d');
    const ham = new Hamster('sddasd', '', 0, 0);
    this.setState({ ctx, canvas });

    document.addEventListener("keydown", (e) => {
      e = e || window.event;
      // clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      switch(e.keyCode) {
        // up arrow
        case 38:
          ham.y += -6;
          break;
        // down arrow
        case 40:
          ham.y += 6;
          break;
        // left arrow
        case 37:
          ham.x += -6;
          break;
        //right arrow
        case 39:
          ham.x += 6;
          break;
      }
      this.props.sock.send(JSON.stringify({
        id: this.props.username,
        data: '{ "x": ' + ham.x + ', "y": ' + ham.y + '}',
        type: 'move'
      }));

    }, false);
  }

  render() {
    if(this.state.ctx && this.state.canvas && this.props.hamsters) {
      const hams = this.props.hamsters;
      this.state.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
      Object.keys(hams).forEach(id => {
        hams[id].draw(this.state.ctx)
      });
    }
    return (
      <canvas ref="myCanvas" style={{
        border: '1px solid #000000',
        width: '600px',
        height: '300px'
      }}/>
    );
  }
}