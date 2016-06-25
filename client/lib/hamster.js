function Hamster(name, imgUrl, x, y) {
  this.name = name || '';
  this.x = x || 0;
  this.y = y || 0;

  const img = new Image();   // Create new img element
  img.src = imgUrl;
  this.img = img;

  img.addEventListener("load", () => {
    // execute drawImage statements here
    // this.draw();
  }, false);

}

Hamster.prototype.draw = function(ctx) {
  ctx.font = "7px Georgia";
  ctx.fillText(this.name, this.x, this.y);
  ctx.drawImage(this.img, this.x, this.y);

}

export default Hamster;