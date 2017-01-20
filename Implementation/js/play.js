// Last Updated: 16/01/2017

// Core-game variables
var debug = true;

// Sprite Variables
var player;

// Phaser draw groups
var background;
var foreground;

// Level values
var levelNum;
var map;
var GroundLayer;

var playState = {
    preload: function() {
    // Load in Assets
        if (debug) {
            testRegisterDamage();
            testCalculateKnockback();
        }
    }, //preload();

    create: function() {

        // Set game state and load Object

        //very early map loader implementation, will have to look into moving this to a different class
        map = game.add.tilemap('map' + levelNum);
        map.addTilesetImage('tiles' + levelNum, 'tiles' + levelNum);
        GroundLayer = map.createLayer('GroundLayer');
        GroundLayer.resizeWorld();
    }, // create()

    update: function() {
        // Update Object states

    }, // update()

    render: function() {
        // Render text to screen

    } // render()

}

