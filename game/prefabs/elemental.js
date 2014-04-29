'use strict';

var Elemental = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'elemental', frame);

  // initialize your prefab here
  
};

Elemental.prototype = Object.create(Phaser.Sprite.prototype);
Elemental.prototype.constructor = Elemental;

Elemental.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Elemental;
