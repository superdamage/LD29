'use strict';

var Squad = require('./squad');

var Elemental = function(game,squad, x, y, frame) {
    Phaser.Sprite.call(this, game, x, y, 'elemental', frame);

    this.game.physics.arcade.enableBody(this);

    var walk_fps = 4;
    var attack_fps = 6;
    this.animations.add('move', Phaser.Animation.generateFrameNames('enemy_v1_left', 0, 5, '.png', 4), walk_fps, true);
    this.animations.add('attack', Phaser.Animation.generateFrameNames('enemy_v1_attack_left', 0, 5, '.png', 4), attack_fps, true);


    this.anchor.setTo(0.4,1);

    this.squad = squad;
    this.target = null;

    this.speed = 100;
    this.minDistance = 30;

};

Elemental.prototype = Object.create(Phaser.Sprite.prototype);
Elemental.prototype.constructor = Elemental;

Elemental.prototype.update = function() {

    if(this.target==null){
        this.target = this.squad.getClosestLiving(this);
    }else{
        if(this.target.alive == false){
            this.target = this.squad.getClosestLiving(this);
        }
    }

    if(this.target!=null){



        if(this.target.x < this.x){
            this.scale.x = 1;
        }else{
            this.scale.x = -1;
        }

        var canMove = false;

        if(this.game.physics.arcade.distanceBetween(this,this.target)>=this.minDistance){ // moving

            canMove = true;
            this.animations.play('move');

        }else{


            this.animations.play('attack');
            //attack
        }

        this.game.physics.arcade.moveToObject(this,this.target, canMove?this.speed:0);

    }






};





module.exports = Elemental;
