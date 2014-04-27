'use strict';

var Bullet = function(game, x, y, frame) {

    this.size = 20;
    this.color = '#925bb2';

    this.bmd = game.add.bitmapData(this.size, this.size);
    this.createTexture();
    Phaser.Sprite.call(this, game, x, y, this.bmd);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.setColor = function(color) {
    this.color = color;
    this.createTexture();
};

Bullet.prototype.createTexture = function() {
    this.bmd.clear();
    this.bmd.ctx.beginPath();

    this.bmd.ctx.arc(0, 0, this.size, 0, Math.PI*2, true);
    //this.bmd.ctx.rect(0,0,this.size,this.size);
    this.bmd.ctx.fillStyle = this.color;
    this.bmd.ctx.fill();
    this.bmd.ctx.closePath();
    this.bmd.render();
    this.bmd.refreshBuffer();
};

module.exports = Bullet;
