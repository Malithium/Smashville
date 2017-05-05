// Based off codee from: https://github.com/xicombd/phaser-multiplayer-game

var util = require("util");
var http = require("http");
var path = require("path");
var ecstatic = require("ecstatic");

// Pull external classes
var Client = require("./objects/client");
var SearchServices = require("./services/searchServices");
var SessionServices = require("./services/sessionServices");
var LobbyServices = require("./services/lobbyServices");
var GameServices = require("./services/gameServices");
// Server variables
var socket;	// Socket controller
var io = require("socket.io");
var port = process.env.PORT || 44555;

/**
 * Run initialise (And tests)
 */
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

/**
 * Setup event threads and empty arrays
 */
function setEventHandlers() {
    // Socket.IO
    socket.sockets.on("connection", onSocketConnection);
    SearchServices.emptyArray();
}

/**
 * Actual method to create event threads. Client is new player connected.
 * @param client
 */
function onSocketConnection (client) {
    util.log("New player has connected: " + client.id);

    // SERVER CONNECTING METHODS
    // Listen for new player message
    client.on("new player", onNewPlayer);

    // Listen for client disconnected
    client.on("disconnected", onClientDisconnect);

    // MESSAGES AND SESSION METHODS
    // Listen for new lobby message
    client.on("new message", SessionServices.onNewMessage);

    // New session created
    client.on("new session", SessionServices.onNewSession);

    // Join new session
    client.on("join session", SessionServices.onJoinSession);

    // LOBBY METHODS
    // Start session
    client.on("start session", LobbyServices.onStartSession);

    // Session updated
    client.on("update session", LobbyServices.onUpdateSession);

    // Player has selected character
    client.on("character selected", LobbyServices.onCharSelection);

    // Leave session
    client.on("left session", LobbyServices.onLeaveSession);

    // IN-GAME METHODS
    // Listen for move player message
    client.on("move player", GameServices.onMovePlayer);

    // Listen for hit player messages
    client.on("hit player", GameServices.onPlayerHit);
}

/**
 * New player has joined
 * @param data - Contains Player Name
 */
function onNewPlayer (data) {
    // Create a new player
    var newPlayer = new Client(data.name);
    newPlayer.id = this.id;
    newPlayer.setPercentage(0);

    var tempSessions = SearchServices.getSessions();
    // Send existing clients to the new player
    for (var i = 0; i < tempSessions.length; i++) {
        this.emit("new session", {name: tempSessions[i].name, playerCount: tempSessions[i].players.length, state: tempSessions[i].getState()});
    }

    // Send details
    this.emit("connect details", {id: newPlayer.id});

    // Add new player to the clients array
    SearchServices.addClient(newPlayer);
}

/**
 * Client has disconnected. Return false if player not found
 * @returns {boolean}
 */
function onClientDisconnect () {
    util.log("Player has disconnected: " + this.id);

    var removePlayer = SearchServices.playerById(this.id);

    // Player not found
    if (!removePlayer) {
        util.log("Player not found: " + this.id);
        return false;
    }

    // Closed session if host disconnects
    var leaveSession = SearchServices.sessionByID(removePlayer.id);
    if (leaveSession) {
        leaveSession.players.splice(leaveSession.players.indexOf(removePlayer), 1);
        if(leaveSession.host.id === removePlayer.id) {
            this.broadcast.emit("session closed", {name: leaveSession.name});
            SearchServices.removeSession(leaveSession);
        } else {
            // Broadcast removed player to connected socket clients
            this.broadcast.emit("remove player", {name: leaveSession.name, id: this.id});
        }
    }
    SearchServices.removeClient(removePlayer);
}

// Create and start the http server
var server = http.createServer(
    ecstatic({ root: path.resolve(__dirname, "../client") })
).listen(port, function (err) {
    if (err) {
        util.log(err);
        throw err;
    }
    init();
});