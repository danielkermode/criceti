function Hamster(x, y, img, ctx) {
  this.x = x || 0;
  this.y = y || 0;
  const img = new Image();   // Create new img element
  img.addEventListener("load", function() {
    // execute drawImage statements here
    ctx.drawImage(img, 0, 0);
  }, false);
  img.src = '/resources/hamster-yellow.png';
  this.img = img || '';
}

Hamster.prototype.draw = function() {
  ctx.fillStyle = this.fill;
  ctx.fillRect(this.x, this.y, this.w, this.h);
}