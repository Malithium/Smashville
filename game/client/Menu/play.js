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
        // ...
    }, //preload();

    create: function() {
        player = new Player(GAMEWIDTH/2, GAMEHEIGHT/2, 3);
        player.stock = 3;
        player.percentage = 0;
        createGame();
    }, // create()

    update: function() {
        // Update Object states
        player.playerUpdate();
        updateGame();
    }, // update()

    render: function() {
        renderGame();
        game.debug.text(player.percentage, (30*lobbyID), 540, "#00ff00"); // Prints FPS
    } // render()
};

function loadLevel() {
    //very early map loader implementation, will have to look into moving this to a different class
    map = game.add.tilemap("map" + levelNum);
    if(levelNum === 3) {
        map.addTilesetImage("tiles2", "tiles2");
    } else {
        map.addTilesetImage("tiles" + levelNum, "tiles" + levelNum);
    }
    GroundLayer = map.createLayer("GroundLayer");
    GroundLayer.resizeWorld();
    //GroundLayer.fixedToCamera = false;
    //GroundLayer.anchor.setTo(0.1, 0.1);
    map.setCollisionBetween(0, 100, true, GroundLayer);
}

function createGame() {
    loadLevel();
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].stock = 3;
        enemies[i].percentage = 0;
        enemies[i].startGame();
    }
    debugButton = game.input.keyboard.addKey(Phaser.Keyboard.TAB);
    music.queueSong('battleMusic'); // Change to "in-game" song
}

function mapEffects() {
    // Issue with anchors and such, needs looking into
    switch(levelNum) {
        case 3:
            //GroundLayer.angle += 1;
            break;
    }
}

function updateGame() {
    mapEffects();
    music.musicUpdate();
    if(debugButton.isDown && !debugPressed) {
        if (debug) {debug = false; }
        else {debug = true; }
        debugPressed = true;
    }
    else if (debugButton.isUp) {debugPressed = false;}
    if (player) {
        if (!netMode) {
            player.checkRingOut();
        }
        if (player.lastX != player.x || player.lastY != player.y) {
            sendPacket("move player", {x: player.x, y: player.y});
        }
    }
}

function renderGame() {
    // Render text to screen
    game.debug.reset();
    if (debug) {
        if (player) {
            game.debug.body(player.playerSprite);
        }
        game.debug.text(game.time.fps || "--", 2, 14, "#00ff00"); // Prints FPS
        game.debug.cameraInfo(game.camera, 32, 32);
    }
    for (var i = 0; i < enemies.length; i++) {
        game.debug.text(enemies[i].percentage, (30*enemies[i].lobbyID), 540, "#00ff00"); // Prints FPS
    }
}

// Move player
function onMovePlayer (data) {
    if (localSession.id === data.name ) {
        var movePlayer = playerById(data.id);
        if (data.id === localID) {
            movePlayer = player;
            movePlayer.resetPosition();
        }
        // Player not found
        if (!movePlayer) {
            console.log("Player not found: ", data.id);
            return false;
        }

        // Update player position
        movePlayer.playerSprite.x = data.x;
        movePlayer.playerSprite.y = data.y;
        movePlayer.percentage = data.percentage;
    }
}

// Player has been hit
function onPlayerHit(data) {
    if (localSession.id === data.name ) {
        if (localID === data.id) {
            player.percentage = data.percent;
            player.registerHit(data.knockback, data.dir, data.up);
        }
        else {
            var hitPlayer = playerById(data.id);
            // Player not found
            if (!hitPlayer) {
                console.log("Player not found: ", data.id);
                return false;
            }
            hitPlayer.percentage = data.percent;
        }
    }
}

function onPlayerDeath(data){
    if (localSession.id === data.name ) {
        console.log(data.id + " is dead");
    }
}

// Session is over, return to Lobby state
function onSessionOver(data) {
    if (localSession.id === data.name ) {
        localSession.state = 1;
        music.queueSong('menuMusic'); // Change to "in-game" song
        game.state.start("menu");
    }
}
