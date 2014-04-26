'use strict';

var Ranger = function(game, x, y, frame,squad) {

    Phaser.Sprite.call(this, game, x, y, 'ranger', frame);
    this.anchor.setTo(0.5,0.5);
    this.squad= squad;
};

Ranger.prototype = Object.create(Phaser.Sprite.prototype);
Ranger.prototype.constructor = Ranger;

Ranger.prototype.update = function() {
    //console.log(this.squad.x);

    this.x += (this.squad.x-this.x)/10;
    this.y += (this.squad.y-this.y)/10;
};

module.exports = Ranger;
