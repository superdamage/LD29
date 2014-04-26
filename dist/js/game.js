(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'ld29');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('intro', require('./states/intro'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  game.state.add('surface', require('./states/surface'));
  

  game.state.start('boot');
};
},{"./states/boot":4,"./states/gameover":5,"./states/intro":6,"./states/menu":7,"./states/play":8,"./states/preload":9,"./states/surface":10}],2:[function(require,module,exports){
'use strict';

var Ranger = function(game, x, y, frame,squad) {

    Phaser.Sprite.call(this, game, x, y, 'ranger', frame);
    this.anchor.setTo(0.5,0.5);
    this.squad= squad;
};

Ranger.prototype = Object.create(Phaser.Sprite.prototype);
Ranger.prototype.constructor = Ranger;

Ranger.prototype.update = function() {
    //console.log(this.squad.x);

    this.x += (this.squad.x-this.x)/10;
    this.y += (this.squad.y-this.y)/10;
};

module.exports = Ranger;

},{}],3:[function(require,module,exports){
'use strict';

var Ranger= require('./ranger');

var Squad = function(game, x, y, frame) {
    Phaser.Sprite.call(this, game, x, y, 'crosshair', frame);
    this.anchor.setTo(0.5,0.5);

    this.moveSpeed = 600;
    this.bulletSpeed = 1000;
    this.members = null;

    this.game.physics.arcade.enableBody(this);

    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

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

}

Squad.prototype.createMembers = function(squadSize){
    this.maxSquadSize = 1;
    this.members = this.game.add.group();
    for(var i=0; i<this.maxSquadSize; i++){

        this.addRanger();

    }
}

Squad.prototype.addRanger = function(){
    var ranger = new Ranger(this.game,this.x,this.y,null,this);
    this.members.add(ranger);
}

module.exports = Squad;

},{"./ranger":2}],4:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],5:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],6:[function(require,module,exports){
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

        this.add.tween(this.logo).to({alpha:0},400, Phaser.Easing.Cubic.Out,true,2000).onComplete.add(this.onAlphaComplete,this);

    },

    onAlphaComplete: function(){

        this.game.state.start('menu');
    }

};

module.exports = Intro;

},{}],7:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};

    //this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    //this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, 'SUBSURFACE\nRANGER SQUAD', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click To Start', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    //this.sprite.angle = -20;
    //this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('surface');
    }
  }
};

module.exports = Menu;

},{}],8:[function(require,module,exports){

  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.sprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'yeoman');
      this.sprite.inputEnabled = true;
      
      this.game.physics.arcade.enable(this.sprite);
      this.sprite.body.collideWorldBounds = true;
      this.sprite.body.bounce.setTo(1,1);
      this.sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
      this.sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);

      this.sprite.events.onInputDown.add(this.clickListener, this);
    },
    update: function() {

    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };
  
  module.exports = Play;
},{}],9:[function(require,module,exports){

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
    this.load.image('surface_tile', 'assets/surface_tile_big_light.png');
    this.load.image('ranger', 'assets/ranger_masked.png');
    this.load.image('crosshair', 'assets/crosshair.png');

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      //this.game.state.start('intro');

        this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}],10:[function(require,module,exports){
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

        this.squad.createMembers();

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
},{"../prefabs/ranger":2,"../prefabs/squad":3}]},{},[1])