'use strict';

var Ranger = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'ranger', frame);
  this.anchor.setTo(0.5,0.5);
};

Ranger.prototype = Object.create(Phaser.Sprite.prototype);
Ranger.prototype.constructor = Ranger;

Ranger.prototype.update = function() {

};

module.exports = Ranger;
