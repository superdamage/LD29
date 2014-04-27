'use strict';

var Ranger = function(game, x, y, frame,squad,index) {

    Phaser.Sprite.call(this, game, x, y, 'ranger', frame);
    this.anchor.setTo(0.5,0.5);
    this.squad= squad;

    this.moveSpeed = 700;
    this.bulletSpeed = 1000;
    this.members = null;


    this.lagZone = 100;

    this.stancePosRadius = 50;

    this.index = index;

    this.game.physics.arcade.enableBody(this);

    this.body.collideWorldBounds = true;
};

Ranger.prototype = Object.create(Phaser.Sprite.prototype);
Ranger.prototype.constructor = Ranger;

Ranger.prototype.update = function() {

    var stancePos_angle = (360/this.squad.members.length)*(this.index) - 90;
    stancePos_angle *= 0.0174532925;

    var stanceOffset = new Phaser.Point( Math.cos( stancePos_angle ) * this.stancePosRadius, Math.sin( stancePos_angle ) * this.stancePosRadius );
    //console.log(this.index, pointOnCircle.x, pointOnCircle.y);sa

    var stancePoint =  new Phaser.Point(this.squad.x+stanceOffset.x,this.squad.y+stanceOffset.y);

    var leftKey = this.x > stancePoint.x;
    var rightKey = this.x < stancePoint.x;
    var upKey = this.y > stancePoint.y;
    var downKey = this.y < stancePoint.y;

    var xDif = (stancePoint.x - this.x) / this.lagZone;
    var yDif = (stancePoint.y - this.y) / this.lagZone;

    if(leftKey)xDif*=-1;
    if(upKey)yDif*=-1;

    xDif = Math.max(0,xDif); yDif = Math.max(0,yDif);
    xDif = Math.min(1,xDif); yDif = Math.min(1,yDif);

    this.body.velocity.x = this.body.velocity.y = 0;

    if(leftKey) { //LEFT
        this.body.velocity.x = -this.moveSpeed*xDif;
    }
    if(rightKey) { //RIGHT
        this.body.velocity.x = this.moveSpeed*xDif;
    }
    if(downKey) { //DOWN
        this.body.velocity.y = this.moveSpeed*yDif;
    }
    if(upKey) { //UP
        this.body.velocity.y = -this.moveSpeed*yDif;
    }

    //this.x += (this.squad.x-this.x)/10;
    //this.y += (this.squad.y-this.y)/10;
};

module.exports = Ranger;
