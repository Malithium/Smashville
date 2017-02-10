// Based off codee from: https://github.com/xicombd/phaser-multiplayer-game

var util = require('util');
var http = require('http');
var path = require('path');
var ecstatic = require('ecstatic');

// Game variables
var level = 2;
var players = []; // Array of connected players
var Player = require('./client');
var Logic = require('./logic');

// Create and start the http server
var socket;	// Socket controller
var io = require('socket.io');
var port = process.env.PORT || 44555;
var server = http.createServer(
    ecstatic({ root: path.resolve(__dirname, '../client') })
).listen(port, function (err) {
    if (err) {
        throw err
    }

    init()
});

function init () {
    // Attach Socket.IO to server
    socket = io.listen(server);

    // Log Port selected
    console.log("#Listening on port: " + port);

    // Start listening for events
    setEventHandlers();

    // Running tests
    console.log("#Running tests:");
    var Debug = require('./debug');
    Debug.runAllTests();
    console.log("#All tests run");
}

function setEventHandlers() {
    // Socket.IO
    socket.sockets.on('connection', onSocketConnection);
}

// New socket connection
function onSocketConnection (client) {
    util.log('New player has connected: ' + client.id);

    // Listen for client disconnected
    client.on('disconnect', onClientDisconnect);

    // Listen for new player message
    client.on('new player', onNewPlayer);

    // Listen for move player message
    client.on('move player', onMovePlayer);

    // Listen for hit player messages
    client.on('hit player', onPlayerHit);

    // Listen for new lobby message
    //client.on('new message', onNewMessage);
}

// Socket client has disconnected
function onClientDisconnect () {
    util.log('Player has disconnected: ' + this.id);

    var removePlayer = playerById(this.id);

    // Player not found
    if (!removePlayer) {
        util.log('Player not found: ' + this.id);
        return
    }

    // Remove player from players array
    players.splice(players.indexOf(removePlayer), 1);

    // Broadcast removed player to connected socket clients
    this.broadcast.emit('remove player', {id: this.id});
}

// New player has joined
function onNewPlayer (data) {
    // Create a new player
    var newPlayer = new Player(data.x, data.y);
    newPlayer.id = this.id;
    newPlayer.setPercentage(0);

    // Broadcast new player to connected socket clients
    this.broadcast.emit('new player', {id: newPlayer.id, x: newPlayer.getX(),
        y: newPlayer.getY(), percentage: newPlayer.getPercentage()});

    // Send existing players to the new player
    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit('new player', {id: existingPlayer.id, x: existingPlayer.getX(),
            y: existingPlayer.getY(), percentage: existingPlayer.getPercentage()});
    }

    this.emit('game details', {id: newPlayer.id, level: level});
    // Add new player to the players array
    players.push(newPlayer);
}

// Player has moved
function onMovePlayer (data) {
    // Find player in array
    var movePlayer = playerById(this.id);

    // Player not found
    if (!movePlayer) {
        util.log('Player not found: ' + this.id);
        return
    }

    // Update player position
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);

    // Broadcast updated position to connected socket clients
    this.broadcast.emit('move player', {id: movePlayer.id, x: movePlayer.getX(),
        y: movePlayer.getY(), percentage: movePlayer.getPercentage()});
}

function onPlayerHit(data) {
    var hitPlayer = Logic.checkCollision(playerById(data.id), players);
    console.log(data.id + " vs " + hitPlayer.id);
    if(hitPlayer) {
        hitPlayer.setPercentage(Logic.registerDamage(hitPlayer.getPercentage(), data.dmg));
        var knockback = Logic.calculateKnockback(hitPlayer.getPercentage(), data.dmg);
        var dir, up;

        switch (data.action) {
            case 1:
                dir = 1;
                up = 0;
                break;
            case 2:
                dir = 2;
                up = 0;
                break;
            case 3:
                dir = 0;
                up = 1;
                break;
            case 4:
                dir = 0;
                up = 2;
                break;
        }
        this.emit('hit player', {id: hitPlayer.id, percent: hitPlayer.getPercentage(),
            knockback: knockback, dir: dir, up: up});

        this.broadcast.emit('hit player', {id: hitPlayer.id, percent: hitPlayer.getPercentage(),
            knockback: knockback, dir: dir, up: up});
    }
}

// Find player by ID
function playerById (id) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].id === id) {
            return players[i];
        }
    }
    return false;
}