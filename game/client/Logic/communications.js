// Last Updated: 20/01/2017

// FUTURE IDEAS:
//  Rotating Map
//  Map Flips Upside down (Horizontal Flip)

// Server-to-Client variables
var local = true;
var socket;
var localID = -1;
var localSession;

/**
 * Sets up the different event types (Independent threads handled by Socket.io)
 * Based off code in: https://github.com/xicombd/phaser-multiplayer-game
 */
function setEventHandlers () {
    // SERVER CONNECTION METHODS
    // Socket connection successful
    socket.on("connect", onSocketConnected);

    // Socket disconnection
    socket.on("disconnect", onSocketDisconnect);

    // Game details passed across
    socket.on("connect details", onConnection);

    // MESSAGES AND SESSION METHODS
    // Process new chat box message
    socket.on("new message", onNewMessage);

    // Process new session
    socket.on("new session", onNewSession);

    // Session list has been updated
    socket.on("update session list", onUpdateSessionList);

    // Session level has been updated
    socket.on("update session", onUpdateSessionLevel);

    // Session has been closed
    socket.on("session closed", onClosedSession);

    // LOBBY METHODS
    // Player has joined session
    socket.on("joined session", onJoinedSession);

    // New player has joined session
    socket.on("new player", onNewPlayer);

    // Player selected Character
    socket.on("character selected", onCharacterSelected);

    // Session has started
    socket.on("start session", onStartSession);

    // Player has left the lobby or game
    socket.on("remove player", onRemovePlayer);

    // Player has started spectating session
    socket.on("spectate session", onSpectateSession);

    // IN-GAME METHODS
    // Player move message received
    socket.on("move player", onMovePlayer);

    // Player has been hit
    socket.on("hit player", onPlayerHit);

    // Session has finished
    socket.on("sessions over", onSessionOver);

    // Player has died, stop rendering them
    socket.on("player death", onPlayerDeath);
    localID = 0;
}

/**
 * Method designed to send packets, but also catch them if running locally
 * @param type - Type of server message being sent
 * @param data - The data being sent alongside packet Type
 */
function sendPacket(type, data) {
    if(!local) {
        socket.emit(type, data);
    }
}

/**
 * Socket connected to the server. Clear Enemies and sessions.
 */
function onSocketConnected () {
    console.log("Connected to socket server");
    localSession = new session("0", 0, "", 1);
    local = false;

    for (var i = 0; i < enemies.length; i++) {
        enemies[i].remove();
    }
    enemies = [];
    sessions = [];

    // Send local player data to the game server
    sendPacket("new player", {name: playerName});
}

/**
 * Socket has disconnected from the server
 */
function onSocketDisconnect () {
    console.log("Disconnected from socket server");
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].remove();
    }
    localSession = null;
    sessions = [];
    enemies = [];
    local = true;
    game.state.start("menu"); // Reset to local screen as have disconnected
}

/**
 * Get connection details from server
 * @param data - Passes across players serverID
 */
function onConnection(data) {
    console.log("id: " + data.id);
    localID = data.id;
    game.state.start("chat"); // Connected so proceed
}

/**
 * Find player by ID.
 * @param id - Contains playerID.
 */
function playerById (id) {
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].id === id) {
            return enemies[i];
        }
    }
    return false;
}