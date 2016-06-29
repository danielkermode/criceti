function Hamster(name, imgUrl, x, y) {
  this.name = name || '';
  this.x = x || 0;
  this.y = y || 0;

  const img = new Image();   // Create new img element
  img.src = imgUrl;
  this.img = img;
  this.loaded = false;

}

Hamster.prototype.draw = function(ctx) {
  if(this.loaded) {
    ctx.font = "10px Georgia";
    ctx.fillText(this.name, this.x, this.y);

    ctx.drawImage(this.img, this.x, this.y, 14, 15);
  } else {
    this.img.addEventListener("load", () => {
      // execute drawImage statements here
      ctx.imageSmoothingEnabled = false;
      ctx.font = "10px Georgia";
      ctx.fillText(this.name, this.x, this.y);
      ctx.drawImage(this.img, this.x, this.y, 14, 15);
      this.loaded = true;
    }, false);
  }
};

export default Hamster;