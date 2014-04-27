'use strict';

var Ranger = function(game, x, y, frame,squad,index) {

    Phaser.Sprite.call(this, game, x, y, 'ranger', frame);

    var walk_fps = 15;

    this.animations.add('walk_front', Phaser.Animation.generateFrameNames('crew_member_front', 0, 7, '.png', 4), walk_fps, true);
    this.animations.add('walk_back', Phaser.Animation.generateFrameNames('crew_member_back', 0, 7, '.png', 4), walk_fps, true);
    this.animations.add('walk_left', Phaser.Animation.generateFrameNames('crew_member_left', 0, 4, '.png', 4), walk_fps, true);
    this.animations.add('walk_right', Phaser.Animation.generateFrameNames('crew_member_right', 0, 4, '.png', 4), walk_fps, true);
    this.animations.add('idle', Phaser.Animation.generateFrameNames('crew_member_front', 0, 1, '.png', 4), 0, true);

    this.animations.play('idle');

    this.anchor.setTo(0.5,0.5);
    this.squad= squad;

    this.moveSpeed = 600;
    this.bulletSpeed = 1000;
    this.members = null;



    this.lagZone = 100;

    this.stancePosRadius = 35;

    this.index = index;

    this.game.physics.arcade.enableBody(this);

    this.body.maxVelocity.x = this.moveSpeed;
    this.body.maxVelocity.y = this.moveSpeed;

    this.body.drag.x = 1000;
    this.body.drag.y = 1000;

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

    var minVelocity = this.moveSpeed*0.1;

    if( Math.abs(this.body.velocity.x) < minVelocity && Math.abs(this.body.velocity.y) < minVelocity){
        //this.body.velocity.x = this.body.velocity.y = 0;
        this.animations.play('idle');

    }else{


        var verticalVelocity = this.body.velocity.y;
        var horizontalVelocity = this.body.velocity.x;

        if(Math.abs(horizontalVelocity)>Math.abs(verticalVelocity)){
            if(horizontalVelocity>0){
                this.animations.play('walk_right');
            }else{
                this.animations.play('walk_left');
            }
        }else{
            if(this.body.velocity.y >0){
                this.animations.play('walk_front');
            }else{
                this.animations.play('walk_back');
            }
        }
    }

    //animations
    //if(this.body.velocity.x > )
    //if()

};

module.exports = Ranger;
