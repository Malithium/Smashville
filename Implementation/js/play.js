// Last Updated: 20/01/2017

// Core-game variables
var debug = false;
var debugButton;
var debugPressed;
var socket;

// Sprite Variables
var player;
var players = [];
var enemies = [];

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
        socket = io.connect('http://localhost:8080'); // Need to change local Host and Port number depending on connection

        //very early map loader implementation, will have to look into moving this to a different class
        map = game.add.tilemap('map' + levelNum);
        map.addTilesetImage('tiles' + levelNum, 'tiles' + levelNum);
        GroundLayer = map.createLayer('GroundLayer');
        GroundLayer.resizeWorld();
        map.setCollisionBetween(0, 100, true, GroundLayer);

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 350;
        players.push(new Player(GAMEWIDTH/2, GAMEHEIGHT/2, false));
        players.push(new Player(GAMEWIDTH/4, GAMEHEIGHT/2, true));

        debugButton = game.input.keyboard.addKey(Phaser.Keyboard.TAB);
        setEventHandlers();
    }, // create()

    update: function() {
        player = players[0];
        for(p in players) {
            // Update Object states
            players[p].playerUpdate();
        }
        if(debugButton.isDown && !debugPressed) {
            if (debug) {debug = false; }
            else {
                debug = true;
                runAllTests();
            }
            debugPressed = true;
        }
        else if (debugButton.isUp) {debugPressed = false;}
        socket.emit('move player', { x: player.x, y: player.y });
    }, // update()

    render: function() {
        // Render text to screen
        game.debug.reset();
        if (debug) {
            game.debug.text(game.time.fps || '--', 2, 14, '#00ff00'); // Prints FPS
            for(p in players) {
                // Update Object states
                game.debug.body(players[p].playerSprite);
            }
        }
        for(p in players) {
            game.debug.text(players[p].percentage, 30*p, 540, '#00ff00'); // Prints FPS
        }
    } // render()

};

// Based off code in: https://github.com/xicombd/phaser-multiplayer-game
// =======================
// SERVER COMMUNICATION
// =======================

function setEventHandlers () {
    // Socket connection successful
    socket.on('connect', onSocketConnected);

    // Socket disconnection
    socket.on('disconnect', onSocketDisconnect);

    // New player message received
    socket.on('new player', onNewPlayer);

    // Player move message received
    socket.on('move player', onMovePlayer);

    // Player removed message received
    socket.on('remove player', onRemovePlayer);
}

// Socket connected (Clear Enemies)
function onSocketConnected () {
    console.log('Connected to socket server');

    // Reset enemies on reconnect
    enemies.forEach(function (enemy) {
        enemy.player.kill();
    });
    enemies = [];

    // Send local player data to the game server
    socket.emit('new player', { x: player.x, y: player.y });
}

// Socket disconnected
function onSocketDisconnect () {
    console.log('Disconnected from socket server');
}

// New player
function onNewPlayer (data) {
    console.log('New player connected:', data.id);

    // Avoid possible duplicate players
    var duplicate = playerById(data.id);
    if (duplicate) {
        console.log('Duplicate player!');
        return false;
    }

    // Add new player to the remote players array
    enemies.push(new RemotePlayer(data.id, game, player, data.x, data.y));
}

// Move player
function onMovePlayer (data) {
    var movePlayer = playerById(data.id);

    // Player not found
    if (!movePlayer) {
        console.log('Player not found: ', data.id);
        return false;
    }

    // Update player position
    movePlayer.player.x = data.x;
    movePlayer.player.y = data.y;
}

// Remove player
function onRemovePlayer (data) {
    var removePlayer = playerById(data.id);

    // Player not found
    if (!removePlayer) {
        console.log('Player not found: ', data.id);
        return false;
    }

    removePlayer.player.kill();

    // Remove player from array
    enemies.splice(enemies.indexOf(removePlayer), 1);
}

// Find player by ID
function playerById (id) {
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].player.name === id) {
            return enemies[i];
        }
    }
    return false;
}