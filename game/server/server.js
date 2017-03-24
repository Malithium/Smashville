// Based off codee from: https://github.com/xicombd/phaser-multiplayer-game

var util = require("util");
var http = require("http");
var path = require("path");
var ecstatic = require("ecstatic");

// Game variables
var level = 2;
var clients = []; // Array of connected players
var sessions = []; // Array of Sessions
var messages = []; // Array of Messages
var GAMEWIDTH = 900;
var GAMEHEIGHT = 600;

// Pull external classes
var Logic = require("./logic");
var Client = require("./client");
var Message = require("./message");
var Session = require("./session");

// Create and start the http server
var socket;	// Socket controller
var io = require("socket.io");
var port = process.env.PORT || 44555;
var server = http.createServer(
    ecstatic({ root: path.resolve(__dirname, "../client") })
).listen(port, function (err) {
    if (err) {
        util.log(err);
        throw err
    }

    init()
});

function init () {
    // Attach Socket.IO to server
    socket = io.listen(server);

    // Log Port selected
    util.log("#Listening on: " + port);

    // Start listening for events
    setEventHandlers();

    // Running tests
    util.log("#Running tests");
    var Debug = require("./debug");
    Debug.runAllTests();
    util.log("#All tests run");
}

function setEventHandlers() {
    // Socket.IO
    socket.sockets.on("connection", onSocketConnection);
    // Reset Sessions and Messages
    clients = [];
    sessions = [];
}

// New socket connection
function onSocketConnection (client) {
    util.log("New player has connected: " + client.id);

    // SERVER CONNECTING METHODS
    // Listen for new player message
    client.on("new player", onNewPlayer);

    // Listen for client disconnected
    client.on("disconnected", onClientDisconnect);

    // MESSAGES AND SESSION METHODS
    // Listen for new lobby message
    client.on("new message", onNewMessage);

    // New session created
    client.on("new session", onNewSession);

    // Session updated
    client.on("update session", onUpdateSession);

    // Join new session
    client.on("join session", onJoinSession);

    // LOBBY METHODS
    // Start session
    client.on("start session", onStartSession);

    // Player has selected character
    client.on("character selected", onCharSelection);

    // Leave session
    client.on("left session", onLeaveSession);

    // IN-GAME METHODS
    // Listen for move player message
    client.on("move player", onMovePlayer);

    // Listen for hit player messages
    client.on("hit player", onPlayerHit);
}

// New player has joined
function onNewPlayer (data) {
    // Create a new player
    var newPlayer = new Client(data.name);
    newPlayer.id = this.id;
    newPlayer.setPercentage(0);

    // Send existing clients to the new player
    for (var i = 0; i < sessions.length; i++) {
        var existingSession = sessions[i];
        this.emit("new session", {name: existingSession.name, playerCount: existingSession.players.length, state: existingSession.getState()});
    }

    // Send details
    this.emit("connect details", {id: newPlayer.id});

    // Add new player to the clients array
    clients.push(newPlayer);
}

// Socket client has disconnected
function onClientDisconnect () {
    util.log("Player has disconnected: " + this.id);

    var leaveSession;
    var removePlayer = playerById(this.id);

    // Player not found
    if (!removePlayer) {
        util.log("Player not found: " + this.id);
        return false;
    }

    // Closed session if host disconnects
    for (var i = 0; i < sessions.length; i++) {
        leaveSession = sessions[i];
        // Remove player from current session
        if (leaveSession.getPlayerById(removePlayer.id)) {
            leaveSession.players.splice(leaveSession.players.indexOf(removePlayer), 1);
            if(leaveSession.host.id === removePlayer.id) {
                this.broadcast.emit("session closed", {name: leaveSession.name});
                sessions.splice(sessions.indexOf(leaveSession), 1);
            }
            else {
                // Broadcast removed player to connected socket clients
                this.broadcast.emit("remove player", {name: leaveSession.name, id: this.id});
            }
        }
    }

    // Remove player from clients array
    clients.splice(clients.indexOf(removePlayer), 1);
}

function onNewMessage(data) {
    // Create and register new message
    util.log("Message posted by: " + data.name);
    var newMessage = new Message(data.name, data.message);
    messages.push(newMessage);
    // Remove messages if exceeds certain limit
    if (messages.length > 255) {
        // Remove first message, as no longer needed
        messages[0].remove();
    }
    // Send new message out to users
    this.broadcast.emit("new message", {name: data.name, message: data.message});
    this.emit("new message", {name: data.name, message: data.message});
}

function onNewSession(data) {
    var newPlayer = playerById(this.id);
    newPlayer.setLobbyID(1);
    var newSession = new Session(newPlayer);
    // Creates Unique Session Name/ID
    if (sessions.length > 1) {
        var x = 0;
        while (sessionByName(newSession.getName())) {
            x++;
            newSession.name = newPlayer.name + x + " Session";
        }
    }
    util.log("New session created: " + newSession.getName());
    this.emit("joined session", {name: newSession.name, level: 0, lobbyID: 1});
    this.broadcast.emit("new session", {name: newSession.getName(), playerCount: 1, state: newSession.getState()});
    sessions.push(newSession);
}

function onUpdateSession(data) {
    var updateSession = sessionByName(data.name);
    if(data.level) {
        updateSession.level = data.level;
        this.broadcast.emit("update session", {name: updateSession.name, level: updateSession.level});
    }
}

function onJoinSession(data) {
    var joinSession = sessionByName(data.name);
    if (joinSession) {
        if (joinSession.getState() === 2) {
            // Spectate mode as game in progress
            this.emit("spectate session", {name: joinSession.name, level: joinSession.level});
            for (var i = 0; i < joinSession.players.length; i++) {
                // Send new players other connected players details
                this.emit("new player", {
                    name: joinSession.name, id: joinSession.players[i].id,
                    x: joinSession.players[i].x, y: joinSession.players[i].y,
                    enemyName: joinSession.players[i].getName(), lobbyID: joinSession.players[i].lobbyID});
            }
        }
        else {
            // Send new player connection details
            this.emit("joined session", {name: joinSession.name, level: joinSession.level,
                lobbyID: joinSession.nxtLobbyID});
            for (var i = 0; i < joinSession.players.length; i++) {
                // Send new players other connected players details
                this.emit("new player", {
                    name: joinSession.name, id: joinSession.players[i].id,
                    x: joinSession.players[i].x, y: joinSession.players[i].y,
                    enemyName: joinSession.players[i].getName(), lobbyID: joinSession.players[i].lobbyID});
            }
            // Get new player to add to Array
            var joinPlayer = playerById(this.id);
            joinPlayer.setLobbyID(joinSession.nxtLobbyID);
            joinSession.addPlayer(joinPlayer);
            util.log("Joined session: " + joinSession.name);

            // Tell other players new player has connected
            this.broadcast.emit("new player", {
                name: joinSession.name, id: joinPlayer.id,
                x: joinPlayer.x, y: joinPlayer.y,
                enemyName: joinPlayer.getName(), lobbyID: joinPlayer.lobbyID});
            // Update player count list
            this.broadcast.emit("update session list", {name: joinSession.name, playerCount: joinSession.players.length});
        }
    }
}

function onCharSelection(data) {
    var charPlayer = playerById(this.id);
    if (!charPlayer) {
        util.log("Player not found: " + this.id);
        return false;
    }

    var charSession = sessionByName(data.name);
    if (!charSession) {
        util.log("Session not found: " + data.name);
        return false;
    }
    for(var i = 0; i < charSession.players.length; i++) {
        if(charSession.players[i].getName() === data.charName) {
            charSession.players[i].characterID = data.charID;
        }
    }
    //util.log(charSession.players);

    this.broadcast.emit("character selected", {name: charSession.name, id: charPlayer.id, charID: data.charID});
}

function onLeaveSession(data) {
    var leftPlayer = playerById(this.id);
    var leftSession = sessionByName(data.name);
    leftSession.players.splice(leftSession.players.indexOf(leftPlayer), 1);
    if (leftSession.host.id === this.id) {
        this.broadcast.emit("session closed", leaveSession.name);
        sessions.splice(sessions.indexOf(leftSession), 1);
    }
    else {
        this.broadcast.emit("update session", {name: leftSession.name, playerCount: leftSession.players.length});
        this.broadcast.emit("remove player", {name: leftSession.name, id: leftPlayer.id});
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
                    util.log("No character selected");
                    start = false;
                    // Send error message
                }
            }
        }
        else {
            // Send error message
            util.log("No level selected")
        }
        // All checks cleared
        if (start) {
            util.log("Starting session: " + startingSession.name);
            startingSession.sessionState = startingSession.sessionStates.STARTING;
            this.emit("start session", {name: startingSession.name});
            this.broadcast.emit("start session", {name: startingSession.name});
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
        util.log("Player not found: " + this.id);
        return false;
    }

    var moveSession = false;
    for (var i = 0; i < sessions.length; i++) {
        //console.log(sessions[i].getPlayerById(this.id));
        if (sessions[i].getPlayerById(this.id)) {
            moveSession = sessions[i];
        }
    }

    // Session not found
    if (!moveSession) {
        util.log("Session not found with player: " + this.id);
        return false;
    }

    // TODO: Insert Latency Compensation (Check diff then react accordingly)
    // Update player position
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);

    if(movePlayer.getX() > GAMEWIDTH+40 || movePlayer.getX() < -40 || movePlayer.getY() > GAMEHEIGHT+40 || movePlayer.getY() < -40) {
        updateStock(movePlayer, this);
    }

    // Broadcast updated position to connected socket clients
    this.broadcast.emit("move player", {name: moveSession.name, id: movePlayer.id, x: movePlayer.getX(),
        y: movePlayer.getY(), percentage: movePlayer.getPercentage()});
}

function onPlayerHit(data) {
    var hitSession = false;
    for (var i = 0; i < sessions.length; i++) {
        if (sessions[i].getPlayerById(this.id)) {
            hitSession = sessions[i];
            break;
        }
    }
    var hitPlayer = Logic.checkCollision(playerById(this.id), hitSession.players);
    if(hitPlayer) {
        //util.log(this.id + " vs " + hitPlayer.id);
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
        this.emit("hit player", {name: hitSession.name, id: hitPlayer.id,
            percent: hitPlayer.getPercentage(),
            knockback: knockback, dir: dir, up: up});

        this.broadcast.emit("hit player", {name: hitSession.name, id: hitPlayer.id,
            percent: hitPlayer.getPercentage(),
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

function updateStock (player, socket) {
    var deadSession = false;
    for (var i = 0; i < sessions.length; i++) {
        if (sessions[i].getPlayerById(player.id)) {
            deadSession = sessions[i];
            break;
        }
    }
    if(deadSession) {
        if (player.stock > 0) {
            player.resetPosition();
            socket.emit("move player", {id: player.id, name: deadSession.name, x: player.getX(), y: player.getY()});
        }
        else {
            if(deadSession.checkGameOver()) {
                // TODO: Include winner id in data
                socket.emit("sessions over", {name: deadSession.name});
                socket.broadcast.emit("sessions over", {name: deadSession.name});
            }
            else
            {
                socket.emit("player death", {id: player.id, name: deadSession.name});
                socket.broadcast.emit("player death", {id: player.id, name: deadSession.name});
            }
        }
        player.stock = player.stock - 1;
    }
    else {
        util.log("Error session not found");
    }
}