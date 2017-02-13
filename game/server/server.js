// Based off codee from: https://github.com/xicombd/phaser-multiplayer-game

var util = require('util');
var http = require('http');
var path = require('path');
var ecstatic = require('ecstatic');

// Game variables
var level = 2;
var clients = []; // Array of connected players
var sessions = []; // Array of Sessions
var messages = [];

var Message = require('./message');
var Session = require('./session');
var Client = require('./client');
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

    // Listen for new client message
    client.on('new player', onNewClient);

    // Listen for new lobby message
    //client.on('new message', onNewMessage);

    // New session created
    //client.on('new session', onNewSession);

    // Session updated
    //client.on('update session', onUpdateSession);

    // Join new session
    //client.on('join session', onJoinSession);

    // Leave session
    //client.on('left session', onLeaveSession);

    // Listen for move player message
    client.on('move player', onMovePlayer);

    // Listen for hit player messages
    client.on('hit player', onPlayerHit);
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

    // Remove player from clients array
    clients.splice(clients.indexOf(removePlayer), 1);

    // Broadcast removed player to connected socket clients
    this.broadcast.emit('remove player', {id: this.id});
}

// New player has joined
function onNewClient (data) {
    // Create a new player
    // data.name - Need to change sent data from front-end
    var newPlayer = new Client('test');
    newPlayer.id = this.id;
    newPlayer.setPercentage(0);

    // Broadcast new player to connected socket clients
    this.broadcast.emit('new player', {id: newPlayer.id, x: newPlayer.getX(),
        y: newPlayer.getY(), percentage: newPlayer.getPercentage()});

    // Send existing clients to the new player
    var i, existingPlayer;
    for (i = 0; i < clients.length; i++) {
        existingPlayer = clients[i];
        this.emit('new player', {id: existingPlayer.id, x: existingPlayer.getX(),
            y: existingPlayer.getY(), percentage: existingPlayer.getPercentage()});
    }

    this.emit('game details', {id: newPlayer.id, level: level});
    // Add new player to the clients array
    clients.push(newPlayer);
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
    var hitPlayer = Logic.checkCollision(playerById(data.id), clients);
    if(hitPlayer) {
        console.log(data.id + " vs " + hitPlayer.id);
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

function onNewSession(data) {
    var x = 0;
    var player = playerById(this.id);
    var newSession = Session(player);

    while (sessionByName(newSession.name)) {
        x++;
        newSession.name = player.name + x + ' Session';
    }
    this.broadcast.emit('new session', {name: newSession.name, playerCount: 1});
    sessions.push(newSession);
}

function onUpdateSession(data) {
    var updateSession = sessionByName(data.name);
    if(data.level) {
        updateSession.level = data.level;
    }
}

function onJoinSession(data) {
    var joinSession = sessionByName(data.name);
    if (joinSession) {
        joinSession.players.push(playerById(this.id));
        this.emit('joined session', {level: joinSession.level});
        this.broadcast.emit('Update session', {name: joinSession.name, playerCount: joinSession.players.length});
    }
}

function onLeaveSession(data) {
    var leftPlayer = playerById(this.id);
    var leftSession = sessionByName(data.name);
    leftSession.players.splice(leftSession.players.indexOf(leftPlayer), 1);
    if (leftSession.host.id === this.id && leftSession.players.length > 0) {
        leftSession.host = leftSession.players[0];
    }
    else if (leftSession.players.length === 0) {
        this.broadcast.emit('Remove session', {name: leftSession.name});
        sessions.splice(sessions.indexOf(leftSession), 1);
    }
    else {
        this.broadcast.emit('Update session', {name: leftSession.name, playerCount: leftSession.players.length});
    }
}

// Find player by ID
function playerById (id) {
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].id === id) {
            return clients[i];
        }
    }
    return false;
}

// Find session by Name
function sessionByName (name) {
    for (var i = 0; i < sessions.length; i++) {
        if (sessions[i].name === name) {
            return sessions[i];
        }
    }
    return false;
}