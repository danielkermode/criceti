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

      const sendCoords = () => {
        const coords = { x: ham.x, y: ham.y };
        this.props.updateCoords(this.props.username, coords);
        this.props.sock.send(JSON.stringify({
          id: this.props.sockId,
          data: JSON.stringify(coords),
          type: 'move'
        }));
      };
      //w: 87 a: 65 s: 83 d: 68
      //up: 38 down: 40 left: 37 right: 38
      switch(e.keyCode) {
        // up arrow
        case 87:
          if(ham.y > 6) ham.y -= 6;
          sendCoords();
          break;
        // down arrow
        case 83:
          if(ham.y < this.props.bounds.y) ham.y += 6;
          sendCoords();
          break;
        // left arrow
        case 65:
          if(ham.x > 6) ham.x -= 6;
          sendCoords();
          break;
        //right arrow
        case 68:
          if(ham.x < this.props.bounds.x) ham.x += 6;
          sendCoords();
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