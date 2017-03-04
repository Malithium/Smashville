// Last Updated: 20/01/2017

// Core-game variables
var debug = false;
var debugButton;
var debugPressed;

// Sprite Variables
var player;
var enemies = [];

// Level values
var map;
var levelNum;
var playerNum;
var GroundLayer;
var playerName;

var playState = {
    preload: function() {
    // Load in Assets
        // Used for FPS counter
        game.time.advancedTiming = true;
    }, //preload();

    create: function() {
        loadLevel();
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 350;

        player = new Player(GAMEWIDTH/2, GAMEHEIGHT/2, false);

        debugButton = game.input.keyboard.addKey(Phaser.Keyboard.TAB);
    }, // create()

    update: function() {
        // Update Object states
        player.playerUpdate();
        mapEffects();
        for (var i = 0; i < enemies.length; i++) {
            enemies[i].playerUpdate();
        }

        if(debugButton.isDown && !debugPressed) {
            if (debug) {debug = false; }
            else {debug = true; }
            debugPressed = true;
        }
        else if (debugButton.isUp) {debugPressed = false;}
        if (player.lastX != player.x || player.lastY != player.y) {
            sendPacket("move player", {x: player.x, y: player.y});
        }
    }, // update()

    render: function() {
        // Render text to screen
        game.debug.reset();
        if (debug) {
            game.debug.text(game.time.fps || "--", 2, 14, "#00ff00"); // Prints FPS
            game.debug.body(player.playerSprite);
            game.debug.cameraInfo(game.camera, 32, 32);
        }
        game.debug.text(player.percentage, 0, 540, "#00ff00"); // Prints FPS
        for (var i = 0; i < enemies.length; i++) {
            game.debug.text(enemies[i].percentage, 30*(i+1), 540, "#00ff00"); // Prints FPS
        }
    } // render()

};

function loadLevel() {
    //very early map loader implementation, will have to look into moving this to a different class
    map = game.add.tilemap("map" + levelNum);
    if(levelNum === 3) {
        map.addTilesetImage("tiles2", "tiles2");
    }
    else {
        map.addTilesetImage("tiles" + levelNum, "tiles" + levelNum);
    }
    GroundLayer = map.createLayer("GroundLayer");
    GroundLayer.resizeWorld();
    //GroundLayer.fixedToCamera = false;
    //GroundLayer.anchor.setTo(0.1, 0.1);
    map.setCollisionBetween(0, 100, true, GroundLayer);
}

function mapEffects() {
    // Issue with anchors and such, needs looking into
    switch(levelNum) {
        case 3:
            //GroundLayer.angle += 1;
            break;
    }
}