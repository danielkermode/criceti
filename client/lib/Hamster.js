function Hamster(name, imgUrl, x, y) {
  this.name = name || '';
  this.x = x || 0;
  this.y = y || 0;
  this.width = 21;
  this.height = 22;

  const img = new Image();   // Create new img element
  img.src = imgUrl;
  this.img = img;
  this.loaded = false;
  this.canChallenge = [];

}

Hamster.prototype.draw = function(ctx) {
  if(this.loaded) {
    ctx.imageSmoothingEnabled = false;
    ctx.font = '7px Georgia';
    ctx.fillStyle = "white";
    ctx.fillText(this.name, this.x, this.y - 3);

    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  } else {
    this.img.addEventListener('load', () => {
      // execute drawImage statements here
      ctx.imageSmoothingEnabled = false;
      ctx.font = '7px Georgia';
      ctx.fillStyle = "white";
      ctx.fillText(this.name, this.x, this.y - 3);
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      this.loaded = true;
    }, false);
  }
};

Hamster.prototype.checkBounds = function(other) {
  return !(this.x + this.width < other.x ||
           other.x + other.width < this.x ||
           this.y + this.height < other.y ||
           other.y + other.height < this.y);
};

export default Hamster;