'use strict';

var Squad = function(game, x, y, frame) {
    Phaser.Sprite.call(this, game, x, y, 'crosshair', frame);
    this.anchor.setTo(0.5,0.5);

    this.moveSpeed = 600;
    this.bulletSpeed = 1000;

    this.game.physics.arcade.enableBody(this);

    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

};

Squad.prototype = Object.create(Phaser.Sprite.prototype);
Squad.prototype.constructor = Squad;

Squad.prototype.update = function() {

    this.body.velocity.x = this.body.velocity.y = 0;

    if(this.leftKey.isDown) {
        this.body.velocity.x = -this.moveSpeed;
    }
    if(this.rightKey.isDown) {
        this.body.velocity.x = this.moveSpeed;
    }
    if(this.downKey.isDown) {
        this.body.velocity.y = this.moveSpeed;
    }
    if(this.upKey.isDown) {
        this.body.velocity.y = -this.moveSpeed;
    }

}
module.exports = Squad;
