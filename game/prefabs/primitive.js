'use strict';

var Primitive = function(game, x, y, size, color) {


    this.size = size;
    this.color = color;

    this.bmd = game.add.bitmapData(this.size, this.size);
    this.createTexture();
    Phaser.Sprite.call(this, game, x, y, this.bmd);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;


  
};

Primitive.prototype = Object.create(Phaser.Sprite.prototype);
Primitive.prototype.constructor = Primitive;

Primitive.prototype.setColor = function(color) {
    this.color = color;
    this.createTexture();
};

Primitive.prototype.createTexture = function() {
    this.bmd.clear();
    this.bmd.ctx.beginPath();
    this.bmd.ctx.rect(0,0,this.size,this.size);
    this.bmd.ctx.fillStyle = this.color;
    this.bmd.ctx.fill();
    this.bmd.ctx.closePath();
    this.bmd.render();
    this.bmd.refreshBuffer();
};

module.exports = Primitive;
