'use strict';

var Ranger= require('../prefabs/ranger');
var Squad= require('../prefabs/squad');

function Surface() {
    this.land = null;
    //this.player = null;
    this.squad = null;
    this.worldSize = 3;
}

Surface.prototype = {
    create: function() {



        this.game.physics.startSystem(Phaser.Physics.ARCADE);


        //this.land = this.game.add.tileSprite(0, 0, this.game.width*3, this.game.height*3, 'surface_tile');



        this.land = this.game.add.tileSprite(0, 0, this.game.width*this.worldSize, this.game.height*this.worldSize, 'surface_tile');
        //this.land.anchor.setTo(0.5, 0.5);


        this.game.world.setBounds(0, 0, this.game.width*this.worldSize, this.game.height*this.worldSize);




        this.squad = new Squad(this.game,this.game.world.width/2,this.game.world.height/2);
        this.game.add.existing(this.squad);



        this.game.camera.follow(this.squad,Phaser.Camera.FOLLOW_LOCKON);

        //this.game.camera.follow(this.squad,Phaser.Camera.FOLLOW_TOPDOWN);


        //this.squad = Ranger(this.game,0, 0);
        //this.game.add.existing(this.squad);


    },
    update: function() {

    }
};

module.exports = Surface;