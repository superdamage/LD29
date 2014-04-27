'use strict';

var Rock = function(game, x, y, frame) {

    Phaser.Sprite.call(this, game, x, y, 'rock', frame);
    this.anchor.setTo(0.5, 0.5);

    this.game.physics.arcade.enableBody(this);

    this.body.immovable = true;

};

Rock.prototype = Object.create(Phaser.Sprite.prototype);
Rock.prototype.constructor = Rock;

Rock.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Rock;
