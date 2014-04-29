'use strict';

var Ranger= require('./ranger');
var Bullet= require('./bullet');

var Squad = function(game, x, y, frame) {
    Phaser.Sprite.call(this, game, x, y, 'crosshair', frame);
    this.alpha = 0;
    this.anchor.setTo(0.5,0.5);

    this.moveSpeed = 450;
    this.members = null;
    this.crosshair;


    this.game.physics.arcade.enableBody(this);

    this.body.maxVelocity.x = this.moveSpeed;
    this.body.maxVelocity.y = this.moveSpeed;

    this.body.drag.x = this.moveSpeed*10;
    this.body.drag.y = this.moveSpeed*10;

    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

    this.body.collideWorldBounds = true;

    this.maxSquadSize = 0;
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

    if (this.game.input.activePointer.isDown) {
        this.fire();
    }

}

Squad.prototype.nextGunPosition = function(){
    this.lastFiredMemberIndex ++;
    if(this.lastFiredMemberIndex>this.members.length-1){
        this.lastFiredMemberIndex = 0;
    }

    var ranger = this.members.getAt(this.lastFiredMemberIndex);
    var gunOffset = ranger.gunOffset();
    var gunPoint = new Phaser.Point(ranger.body.x+gunOffset.x,ranger.body.y+gunOffset.y)

    return gunPoint;
}


Squad.prototype.pointsToAngle = function(fromPoint,toPoint){
    var x1 = fromPoint.x;
    var y1 = fromPoint.y;

    var x2 = toPoint.x;
    var y2 = toPoint.y;




    //y2 *= -1;
    return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    //return Math.atan2(y2 - y1, x2 - x1);

}

Squad.prototype.fire = function() {

    if(this.fireTimer < this.game.time.now) {
        //this.shootSound.play();
        var bullet = this.bullets.getFirstExists(false);

        if (!bullet) {
            bullet = new Bullet(this.game, 0, 0);
            this.bullets.add(bullet);
        }

        bullet.revive();
        var gunPos = this.nextGunPosition();
        bullet.reset(gunPos.x, gunPos.y);

        this.game.physics.arcade.moveToPointer(bullet, this.bulletSpeed);
        var targetAngle = this.game.math.angleBetween(
            gunPos.x, gunPos.y,
            this.game.input.activePointer.worldX, this.game.input.activePointer.worldY
        );

        bullet.rotation = -(targetAngle - (90*0.0174532925));

        this.fireTimer = this.game.time.now + this.fireRate;
    }
};

Squad.prototype.createMembers = function(squadSize){

    this.bullets = this.game.add.group();

    this.maxSquadSize = 4;
    this.members = this.game.add.group();
    var i=0;
    for(i=0; i<this.maxSquadSize; i++){
        var ranger = this.addRanger();
        var stancePoint = ranger.getStancePoint(this.maxSquadSize);
        ranger.x = stancePoint.x;
        ranger.y = stancePoint.y;

    }

    this.bulletSpeed = 1000;

    this.bullets.enableBody = true;
    this.bullets.bodyType = Phaser.Physics.Arcade.Body;
    this.fireTimer = 0;
    this.lastFiredMemberIndex = 0;
    this.fireRate = 50;

}

Squad.prototype.addRanger = function(){
    var ranger = new Ranger(this.game,this.x,this.y,null,this,this.members.length);
    this.members.add(ranger);
    return ranger;
}

module.exports = Squad;
