// Based off codee from: https://github.com/xicombd/phaser-multiplayer-game

var util = require('util');
var http = require('http');
var path = require('path');
var ecstatic = require('ecstatic');

// Game variables
var level = 2;
var clients = []; // Array of connected players
var sessions = []; // Array of Sessions
var messages = []; // Array of Messages

// Pull external classes
var Logic = require('./logic');
var Client = require('./client');
var Message = require('./message');
var Session = require('./session');

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

    // SERVER CONNECTING METHODS
    // Listen for new player message
    client.on('new player', onNewPlayer);

    // Listen for client disconnected
    client.on('disconnect', onClientDisconnect);

    // MESSAGES AND SESSION METHODS
    // Listen for new lobby message
    client.on('new message', onNewMessage);

    // New session created
    client.on('new session', onNewSession);

    // Session updated
    client.on('update session', onUpdateSession);

    // Join new session
    client.on('join session', onJoinSession);

    // LOBBY METHODS
    // Start session
    client.on('start session', onStartSession);

    // Leave session
    client.on('left session', onLeaveSession);

    // IN-GAME METHODS
    // Listen for move player message
    client.on('move player', onMovePlayer);

    // Listen for hit player messages
    client.on('hit player', onPlayerHit);
}

// New player has joined
function onNewPlayer (data) {
    // Create a new player
    var newPlayer = new Client(data.name);
    newPlayer.id = this.id;
    newPlayer.setPercentage(0);

    // Send existing clients to the new player
    for (var i = 0; i < sessions.length; i++) {
        existingSession = sessions[i];
        this.emit('new session', {name: existingSession.name, playerCount: existingSession.players.length});
    }

    // Send details
    this.emit('connect details', {id: newPlayer.id});

    // Add new player to the clients array
    clients.push(newPlayer);
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

    for (var i = 0; i < sessions.length; i++) {
        leaveSession = sessions[i];
        // Remove player from current session
        if (leaveSession.getPlayerById(removePlayer.id)) {
            leaveSession.players.splice(leaveSession.players.indexOf(removePlayer), 1);
            if(leaveSession.host.id === removePlayer.id) {
                this.broadcast.emit('session closed', leaveSession.name);
                sessions.splice(sessions.indexOf(leaveSession), 1);
            }
        }
    }

    // Remove player from clients array
    clients.splice(clients.indexOf(removePlayer), 1);

    // Broadcast removed player to connected socket clients
    this.broadcast.emit('remove player', {id: this.id});
}

function onNewMessage(data) {
    // Create and register new message
    util.log('Message posted by: ' + data.name);
    var newMessage = new Message(data.name, data.message);
    messages.push(newMessage);
    // Send messages out to users
    this.broadcast.emit('new message', {name: data.name, message: data.message});
    this.emit('new message', {name: data.name, message: data.message});
}

function onNewSession(data) {
    var player = playerById(this.id);
    var newSession = new Session(player);
    if (sessions.length > 1) {
        var x = 0;
        while (sessionByName(newSession.getName())) {
            x++;
            newSession.name = player.name + x + ' Session';
        }
    }
    util.log('New session created: ' + newSession.getName());
    this.broadcast.emit('new session', {name: newSession.getName(), playerCount: 1});
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
        this.broadcast.emit('update session', {name: joinSession.name, playerCount: joinSession.players.length});
    }
}

function onLeaveSession(data) {
    var leftPlayer = playerById(this.id);
    var leftSession = sessionByName(data.name);
    leftSession.players.splice(leftSession.players.indexOf(leftPlayer), 1);
    if (leftSession.host.id === this.id) {
        // this.broadcast.emit('session closed', leaveSession.name);
    }
    else {
        this.broadcast.emit('update session', {name: leftSession.name, playerCount: leftSession.players.length});
        //this.broadcast.emit('player left lobby', {name: leftSession.name, id: leftPlayer.id});
    }
}

function onStartSession(data) {
    var startingSession = sessionByName(data.name);
    if(startingSession) {
        var start = true;
        // Check level has been selected
        if(startingSession.level != 0) {
            // Check each player has CharacterID
            for (var i = 0; i < startingSession.players.length; i++) {
                if (startingSession.players[i].characterID === 0) {
                    start = false;
                    // Send error message
                }
            }
        }
        else {
            // Send error message
        }
        // All checks cleared
        if (start) {
            // Assign positions then update players that session has started
        }
    }
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

    var moveSession = false;
    for (var i = 0; i < sessions.length; i++) {
        if (sessions[i].getPlayerById(this.id)) {
            moveSession = sessions[i];
        }
    }

    // Session not found
    if (!moveSession) {
        util.log('Session not found with player: ' + this.id);
        return
    }

    // Update player position
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);

    // Broadcast updated position to connected socket clients
    this.broadcast.emit('move player', {name: moveSession.name, id: movePlayer.id, x: movePlayer.getX(),
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
