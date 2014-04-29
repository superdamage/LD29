
'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;

    this.game.defaultCursor = "none";
    this.game.state.start('preload');

    Phaser.InputHandler.useHandCursor = false;

  }
};

module.exports = Boot;
