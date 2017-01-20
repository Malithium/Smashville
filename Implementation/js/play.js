// Last Updated: 20/01/2017

// Core-game variables
var debug = false;
var debugButton;
var debugPressed;

// Sprite Variables
var player;

// Level values
var map;
var levelNum;
var GroundLayer;

var playState = {
    preload: function() {
    // Load in Assets
        // Used for FPS counter
        game.time.advancedTiming = true;
    }, //preload();

    create: function() {
        // Set game state and load Object

        //very early map loader implementation, will have to look into moving this to a different class
        map = game.add.tilemap('map' + levelNum);
        map.addTilesetImage('tiles' + levelNum, 'tiles' + levelNum);
        GroundLayer = map.createLayer('GroundLayer');
        GroundLayer.resizeWorld();
        map.setCollisionBetween(0, 100, true, GroundLayer);

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 350;
        player = new Player(GAMEWIDTH/2, GAMEHEIGHT/2);

        debugButton = game.input.keyboard.addKey(Phaser.Keyboard.TAB);

    }, // create()

    update: function() {
        // Update Object states
        player.playerUpdate();
        if(debugButton.isDown && !debugPressed) {
            if (debug) {debug = false; }
            else {
                debug = true;
                runAllTests();
            }
            debugPressed = true;
        }
        else if (debugButton.isUp) {debugPressed = false;}
    }, // update()

    render: function() {
        // Render text to screen
        if (debug) {
            game.debug.text(game.time.fps || '--', 2, 14, '#00ff00'); // Prints FPS
            game.debug.body(player.playerSprite);
        }
    } // render()

}

