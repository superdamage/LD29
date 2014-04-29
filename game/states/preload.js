
'use strict';
function Preload() {
    this.asset = null;
    this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    //this.load.image('yeoman', 'assets/yeoman-logo.png');
    this.load.image('superdamage', 'assets/superdamage.png');
    this.load.image('surface_tile', 'assets/ground_tile0003_v2.png');
    //this.load.image('ranger', 'assets/ranger_masked.png');
    this.load.atlasJSONHash('ranger', 'assets/ranger_masked_animation.png', 'assets/ranger_masked_animation.json');
    this.load.atlasJSONHash('elemental', 'assets/elemental.png', 'assets/elemental.json');
    this.load.image('crosshair', 'assets/crosshair.png');
    this.load.image('rock', 'assets/rock.png');
    this.load.image('bullet', 'assets/bullet.png');

    this.game.load.image('dark', 'assets/illumination_dark0001.png');
    this.game.load.image('light', 'assets/illumination_light0001.png');

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      //this.game.state.start('intro'); // RELEASE
      this.game.state.start('menu'); // DEVELOPMENT
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
