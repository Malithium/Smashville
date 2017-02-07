// Based off codee from: https://github.com/xicombd/phaser-multiplayer-game

var util = require('util');
var http = require('http');
var path = require('path');
var ecstatic = require('ecstatic');

var socket;	// Socket controller
var Player = require('./client');
var players = []; // Array of connected players

// Create and start the http server
var io = require('socket.io');
var port = process.env.PORT || 8080;
var server = http.createServer(
    ecstatic({ root: path.resolve(__dirname, '../game') })
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
    console.log("Listening on port:" + port);

    // Start listening for events
    setEventHandlers();
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

    // Broadcast new player to connected socket clients
    this.broadcast.emit('new player', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

    // Send existing players to the new player
    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit('new player', {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
    }

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

    // Handle different actions
    switch(data.action)
    {
        case 1:
            // Move Left
            break;
        case 2:
            // Move Right
            break;
        case 3:
            // Jump
            break;
        case 4:
            // Punch Left
            break;
        case 5:
            // Punch Right
            break;
        case 6:
            // Uppercut
            break;
        case 7:
            // Low Blow
            break;
    }

    // Update player position
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);

    // Broadcast updated position to connected socket clients
    this.broadcast.emit('move player', {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
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