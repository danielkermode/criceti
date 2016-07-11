import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Hamster from '../lib/Hamster';

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
    const ham = new Hamster(this.props.username, '', this.props.startCoords.x, this.props.startCoords.y);
    this.setState({ ctx, canvas });

    document.addEventListener("keydown", (e) => {
      e = e || window.event;

      const sendCoods = () => {
        const coods = { x: ham.x, y: ham.y };
        this.props.sock.send(JSON.stringify({
          id: this.props.sockId,
          data: JSON.stringify(coods),
          type: 'move'
        }));
      };

      switch(e.keyCode) {
        // up arrow
        case 38:
          if(ham.y > 6) ham.y -= 6;
          sendCoods();
          break;
        // down arrow
        case 40:
          if(ham.y < this.props.bounds.y) ham.y += 6;
          sendCoods();
          break;
        // left arrow
        case 37:
          if(ham.x > 6) ham.x -= 6;
          sendCoods();
          break;
        //right arrow
        case 39:
          if(ham.x < this.props.bounds.x) ham.x += 6;
          sendCoods();
          break;
        default:
          //do nothing
      }
    }, false);
  }

  render() {
    if(this.state.ctx && this.state.canvas && this.props.hamsters) {
      const hams = this.props.hamsters;
      const username = this.props.username;
      let potentialHams = [];
      this.state.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
      Object.keys(hams).forEach(id => {
        hams[id].draw(this.state.ctx)
        //if player hamster is colliding with other hamsters, add them to potential challenge targets
        if(id != username && hams[username] && hams[username].checkBounds(hams[id])) {
          potentialHams.push(hams[id]);
        }
      });
      if(hams[username]) {
        hams[username].canChallenge = potentialHams;
      }
    }
    return (
      <canvas ref="myCanvas" style={{
        border: '1px solid #000000',
        width: this.props.bounds.x * 3 + 'px',
        height: this.props.bounds.y * 3 + 'px'
      }}/>
    );
  }
}