'use strict';

var Elemental = require('./elemental');

var ElementalSpawner = function(game,squad) {
    Phaser.Group.call(this,game);



    this.minEnemies = 1;
    this.spawnRate = 2000;
    this.squad = squad;
    this.spawnTimer = this.game.time.now + this.spawnRate;



    //this.spawn();

};

ElementalSpawner.prototype = Object.create(Phaser.Group.prototype);
//ElementalSpawner.prototype = Phaser.Utils.extend(true, Phaser.Group.prototype, PIXI.Sprite.prototype);
//ElementalSpawner.prototype.super = Phaser.Group.prototype;
ElementalSpawner.prototype.constructor = ElementalSpawner;




ElementalSpawner.prototype.update = function() {

    if(this.spawnTimer < this.game.time.now) {

        this.spawnTimer = this.game.time.now + this.spawnRate;

        if(this.countLiving()<this.minEnemies){
            this.spawn();
        }

    }

    // super
    var i = this.children.length;

    while (i--)
    {
        this.children[i].update();
    }

};


/*
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
 */

ElementalSpawner.prototype.spawn = function() {

    var spawnPoint = new Phaser.Point(this.game.camera.x + this.game.width/2,
                                      this.game.camera.y + this.game.height/2);

    console.log("spawn "+spawnPoint);

    var elemental = this.getFirstExists(false);
    if(!elemental){

        elemental = new Elemental(this.game,this.squad,spawnPoint.x,spawnPoint.y);
        this.add(elemental);
    }

    elemental.revive();
    elemental.reset(spawnPoint.x, spawnPoint.y);


}


module.exports = ElementalSpawner;
