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
},{"./states/boot":6,"./states/gameover":7,"./states/intro":8,"./states/menu":9,"./states/play":10,"./states/preload":11,"./states/surface":12}],2:[function(require,module,exports){
'use strict';

var Bullet = function(game, x, y, frame) {

    //this.size = 20;
    //this.color = '#925bb2';

    //this.bmd = game.add.bitmapData(this.size, this.size);
    //this.createTexture();
    Phaser.Sprite.call(this, game, x, y, 'bullet', frame);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;
/*
Bullet.prototype.setColor = function(color) {
    this.color = color;
    this.createTexture();
};

Bullet.prototype.createTexture = function() {
    this.bmd.clear();
    this.bmd.ctx.beginPath();

    this.bmd.ctx.arc(0, 0, 100, 0, Math.PI*2, true);
    //this.bmd.ctx.rect(0,0,this.size,this.size);
    this.bmd.ctx.fillStyle = this.color;
    this.bmd.ctx.fill();
    this.bmd.ctx.closePath();
    this.bmd.render();
    this.bmd.refreshBuffer();
};
*/
module.exports = Bullet;

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

var Rock = function(game, x, y, frame) {

    Phaser.Sprite.call(this, game, x, y, 'rock', frame);
    this.anchor.setTo(0.5, 0.5);

    this.game.physics.arcade.enableBody(this);

    this.body.immovable = true;

};

Rock.prototype = Object.create(Phaser.Sprite.prototype);
Rock.prototype.constructor = Rock;

Rock.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Rock;

},{}],5:[function(require,module,exports){
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

    return new Phaser.Point(ranger.body.x+gunOffset.x,ranger.body.y+gunOffset.y);
}

Squad.prototype.fire = function() {

    if(this.fireTimer < this.game.time.now) {
        //this.shootSound.play();
        var bullet = this.bullets.getFirstExists(false);

        if (!bullet) {
            bullet = new Bullet(this.game, 0, 0);
            this.bullets.add(bullet);
        }

        var gunPos = this.nextGunPosition();

        bullet.reset(gunPos.x, gunPos.y);
        bullet.revive();
        this.game.physics.arcade.moveToPointer(bullet, this.bulletSpeed);
        this.fireTimer = this.game.time.now + this.fireRate;
    }
};

Squad.prototype.createMembers = function(squadSize){
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
    this.bullets = this.game.add.group();
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

},{"./bullet":2,"./ranger":3}],6:[function(require,module,exports){

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

},{}],7:[function(require,module,exports){

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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){

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

},{}],10:[function(require,module,exports){

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
},{}],11:[function(require,module,exports){

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
      //this.game.state.start('intro');

        this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}],12:[function(require,module,exports){
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
    this.crosshair = null;
    this.crosshair = null;
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

        this.crosshair = this.game.add.sprite(this.game.width/2, this.game.height/2, 'crosshair');
        this.crosshair.fixedToCamera = true;
        this.crosshair.blendMode = Phaser.blendModes.DARKEN;
        this.crosshair.anchor.setTo(0.5,0.5);

        this.squad.crosshair = this.crosshair;

        // LIGHT EFFECTS

        var lightSprite = this.game.add.image(0, 0, 'light');
        lightSprite.fixedToCamera = true;
        lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

        this.interactive = true;
        this.buttonMode = true;

        var darkSprite = this.game.add.image(0, 0, 'dark');
        darkSprite.fixedToCamera = true;
        darkSprite.blendMode = Phaser.blendModes.MULTIPLY;


        this.game.canvas.style.cursor = "none";
    },

    update: function() {

        this.crosshair.cameraOffset.x = this.game.input.mousePointer.x;
        this.crosshair.cameraOffset.y = this.game.input.mousePointer.y;





        this.game.physics.arcade.collide(this.squad.members, this.props, this.propCollisionHandler, null, this);
        this.game.physics.arcade.collide(this.squad.members, this.squad.members, null, null, this);



    },

    propCollisionHandler: function(squadMember, prop){

    }



};

module.exports = Surface;
},{"../prefabs/ranger":3,"../prefabs/rock":4,"../prefabs/squad":5}]},{},[1])