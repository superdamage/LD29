'use strict';

var Ranger = require('../prefabs/ranger');
var Squad = require('../prefabs/squad');
var Rock = require('../prefabs/rock');

function Surface() {
    this.land = null;
    //this.player = null;
    this.squad = null;
    this.worldSize = 3;
    this.props = null;
}

Surface.prototype = {
    create: function() {



        this.game.physics.startSystem(Phaser.Physics.ARCADE);


        //this.land = this.game.add.tileSprite(0, 0, this.game.width*3, this.game.height*3, 'surface_tile');



        this.land = this.game.add.tileSprite(0, 0, this.game.width*this.worldSize, this.game.height*this.worldSize, 'surface_tile');
        //this.land.anchor.setTo(0.5, 0.5);


        this.game.world.setBounds(0, 0, this.game.width*this.worldSize, this.game.height*this.worldSize);

        this.squad = new Squad(this.game,this.game.world.width/2,this.game.world.height/2);

        this.squad.createMembers();

        this.game.add.existing(this.squad);
        this.game.camera.follow(this.squad,Phaser.Camera.FOLLOW_LOCKON);

        this.props = this.game.add.group();

        for(var i=0; i<60; i++){

            var rockPos = new Phaser.Point(0,0);
            rockPos.x = Math.random()*this.game.world.width;
            rockPos.y = Math.random()*this.game.world.height;
            var rock = new Rock(this.game,rockPos.x,rockPos.y);
            this.props.add(rock);

        }



    },

    update: function() {

        this.game.physics.arcade.collide(this.squad.members, this.props, this.propCollisionHandler, null, this);
        this.game.physics.arcade.collide(this.squad.members, this.squad.members, null, null, this);
    },

    propCollisionHandler: function(squadMember, prop){

    }



};

module.exports = Surface;