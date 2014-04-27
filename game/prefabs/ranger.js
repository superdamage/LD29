'use strict';



var Ranger = function(game, x, y, frame,squad,index) {

    Phaser.Sprite.call(this, game, x, y, 'ranger', frame);



    var walk_fps = 15;

    this.animations.add('walk_front', Phaser.Animation.generateFrameNames('crew_member_front', 0, 7, '.png', 4), walk_fps, true);
    this.animations.add('walk_back', Phaser.Animation.generateFrameNames('crew_member_back', 0, 7, '.png', 4), walk_fps, true);
    this.animations.add('walk_left', Phaser.Animation.generateFrameNames('crew_member_left', 0, 4, '.png', 4), walk_fps, true);
    this.animations.add('walk_right', Phaser.Animation.generateFrameNames('crew_member_right', 0, 4, '.png', 4), walk_fps, true);

    this.animations.add('idle_front', Phaser.Animation.generateFrameNames('crew_member_front', 0, 1, '.png', 4), 0, true);
    this.animations.add('idle_back', Phaser.Animation.generateFrameNames('crew_member_back', 0, 1, '.png', 4), 0, true);
    this.animations.add('idle_left', Phaser.Animation.generateFrameNames('crew_member_left', 0, 1, '.png', 4), 0, true);
    this.animations.add('idle_right', Phaser.Animation.generateFrameNames('crew_member_right', 0, 1, '.png', 4), 0, true);


    this.animations.play('idle_front');

    this.anchor.setTo(0.5,1);
    this.squad= squad;

    this.moveSpeed = squad.moveSpeed*1.2;




    this.members = null;

    this.lagZone = 100;

    this.stancePosRadius = 35;

    this.index = index;

    this.game.physics.arcade.enableBody(this);

    this.body.maxVelocity.x = this.moveSpeed;
    this.body.maxVelocity.y = this.moveSpeed;

    this.body.drag.x = this.moveSpeed*20;
    this.body.drag.y = this.moveSpeed*20;

    this.body.collideWorldBounds = true;




};

Ranger.prototype = Object.create(Phaser.Sprite.prototype);
Ranger.prototype.constructor = Ranger;

Ranger.prototype.getStancePoint = function(numSquadMembers){

    if(!numSquadMembers)numSquadMembers = this.squad.members.length;

    var stancePos_angle = (360/numSquadMembers)*(this.index) - 90;
    stancePos_angle *= 0.0174532925;
    var stanceOffset = new Phaser.Point( Math.cos( stancePos_angle ) * this.stancePosRadius, Math.sin( stancePos_angle ) * this.stancePosRadius );
    return  new Phaser.Point(this.squad.x+stanceOffset.x,this.squad.y+stanceOffset.y);

}

Ranger.prototype.pointsToDirection = function point_direction(fromPoint,toPoint){
    var x1 = fromPoint.x;
    var y1 = fromPoint.y;

    var x2 = toPoint.x;
    var y2 = toPoint.y;

    //y2 *= -1;
    var angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    angle += 45;
    if(angle<0)angle += 360;

    if(angle<90){
        return "R";
    }else if(angle<180){
        return "B";
    }else if(angle<270){
        return "L";
    }else{
        return "T";
    }


}

Ranger.prototype.update = function() {

    //var stancePos_angle = (360/this.squad.members.length)*(this.index) - 90;
    //stancePos_angle *= 0.0174532925;


    var stancePoint = this.getStancePoint();

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

    var minVelocity = this.moveSpeed*0.5;

    var walking = true;
    if( Math.abs(this.body.velocity.x) < minVelocity && Math.abs(this.body.velocity.y) < minVelocity){
        walking = false;
    }

    if (this.game.input.activePointer.isDown) {

        switch(this.pointsToDirection(this.body,this.squad.crosshair)){

            case "R":
                this.animations.play(walking?'walk_right':'idle_right');
                break;

            case "B":
                this.animations.play(walking?'walk_front':'idle_front');
                break;

            case "L":
                this.animations.play(walking?'walk_left':'idle_left');
                break;

            case "T":
                this.animations.play(walking?'walk_back':'idle_back');
                break;
        }

    }else{

        if(walking == false){
            //this.body.velocity.x = this.body.velocity.y = 0;
            this.animations.play('idle_front');

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

    }





};

Ranger.prototype.gunOffset = function(){

    var offset = new Phaser.Point(0,0)

    //console.log(this.animations.currentAnim.name);

    var n = this.animations.currentAnim.name;

    if(n == "idle_front" || n == "walk_front"){
        offset.x = 2;
        offset.y = 40;

    }else if(n == "idle_back" || n == "walk_back"){
        offset.x = -6;
        offset.y = 16;

    }else if(n == "idle_right" || n == "walk_right"){
        offset.x = 25;
        offset.y = 25;

    }else if(n == "idle_left" || n == "walk_left"){
        offset.x = -15;
        offset.y = 25;
    }


    /*
    switch(this.animations.currentAnim.name){

        case "idle_front" || "walk_front" :
            offset.x = 2;
            offset.y = 40;
            break;

        case "idle_back" || "walk_back" :
            offset.x = -6;
            offset.y = 16;
            break;

        case "idle_right" || "walk_right" :
            offset.x = 25;
            offset.y = 25;
            break;

        case "idle_left" || "walk_left" :
            offset.x = -15;
            offset.y = 25;
            break;
    }
    */

    return offset;

}



module.exports = Ranger;
