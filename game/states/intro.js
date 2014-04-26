'use strict';
function Intro() {
    this.logo = null;
}

Intro.prototype = {

    create: function() {

        this.logo = this.game.add.sprite(this.game.width/2, this.game.height/2, 'superdamage');
        this.logo.anchor.setTo(0.5, 0.5);

        this.logo.scale.x = this.logo.scale.y = 0.2;
        this.add.tween(this.logo.scale).to({x:1,y:1},500, Phaser.Easing.Back.Out,true).onComplete.add(this.onBounceComplete,this);

    },

    update: function() {
        if(this.game.input.activePointer.justPressed()) {
            //this.game.state.start('menu');
        }
    },

    onBounceComplete: function(){

        this.add.tween(this.logo).to({alpha:0},400, Phaser.Easing.Cubic.Out,true,3000).onComplete.add(this.onAlphaComplete,this);

    }, 

    onAlphaComplete: function(){

        this.game.state.start('menu');
    }

};

module.exports = Intro;
