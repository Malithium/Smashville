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
var playerStock;

/**
 * Handles play state. Loads then Updates player object and Enemy array (Objects)
 * @type {{preload: playState.preload, create: playState.create, update: playState.update, render: playState.render}}
 */
var playState = {
    preload: function() {
        // ...
    }, //preload();

    create: function() {
        player = new Player(GAMEWIDTH/2, GAMEHEIGHT/2, 3);
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
        game.debug.text(player.getStock(), (30*lobbyID), 570, "#ff0000"); // Prints Lives
    } // render()
};

/**
 * Loads in from tilemap .jsons
 */
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
    map.setCollisionBetween(0, 100, true, GroundLayer);
}

/**
 * Actually creates the game (Loads all relevent objects)
 */
function createGame() {
    loadLevel();
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].stock = 3;
        enemies[i].percentage = 0;
        player.stock = 3;
        player.percentage = 0;
        enemies[i].startGame();
    }
    debugButton = game.input.keyboard.addKey(Phaser.Keyboard.TAB);
    music.queueSong("battleMusic"); // Change to "in-game" song
}

/**
 * Updates game reguarly and accordingly
 */
function updateGame() {
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
        if (player.lastX !== player.x || player.lastY !== player.y) {
            sendPacket("move player", {x: player.x, y: player.y});
        }
    }
}

/**
 * Misnamed as only renders text and potentially players hitbox
 */
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
        game.debug.text(enemies[i].getStock(), (30*enemies[i].lobbyID), 570, "#ff0000");
    }
}

/**
 * If in current session. Player has moved, update X & Y.
 * @param data - Contains session name (ID), playerID and new position.
 */
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

/**
 * If in current session. Player has been hit, update percentage, or run hit method (registerHit).
 * @param data - Contains session name (ID) and playerID.
 */
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

/**
 * If in current session. Player has left, remove from session.
 * @param data - Contains session name (ID) and playerID.
 */
function onRemovePlayer (data) {
    if (localSession.id === data.name ) {
        var removePlayer = playerById(data.id);

        // Player not found
        if (!removePlayer) {
            console.log("Player not found: ", data.id);
            return false;
        }
        removePlayer.remove();

        // Remove player from array
        enemies.splice(enemies.indexOf(removePlayer), 1);
    }
}

/**
 * If in current session. Session has ended, change music and return to menu state.
 * @param data - Contains session name (ID).
 */
function onSessionOver(data) {
    if (localSession.id === data.name ) {
        localSession.state = 1;
        music.queueSong("menuMusic"); // Change to "in-game" song
        game.state.start("menu");
    }
}

/**
 * Player has died.
 * @param data - Contains session name (ID) and playerID.
 */
function onPlayerDeath(data){
    if (localSession.id === data.name ) {
        console.log("Player died: " + data.id);
        var deadPlayer = playerById(data.id);
        if (!deadPlayer) {
            if (localID == data.id) {
                deadPlayer = player;
            }
        }
        if (deadPlayer) {
            deadPlayer.stock = deadPlayer.stock - 1;
        }
    }
}