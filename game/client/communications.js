// Last Updated: 20/01/2017

// Server-to-Client variables
var local = true;
var socket;
var localID;
var localSession;

// Based off code in: https://github.com/xicombd/phaser-multiplayer-game
function setEventHandlers () {
    // SERVER CONNECTION METHODS
    // Socket connection successful
    socket.on('connect', onSocketConnected);

    // Socket disconnection
    socket.on('disconnect', onSocketDisconnect);

    // Game details passed across
    socket.on('connect details', onConnection);

    // MESSAGES AND SESSION METHODS
    // Process new chat box message
    socket.on('new message', onNewMessage);

    // Process new session
    socket.on('new session', onNewSession);

    // Session has been updated
    socket.on('update session', onUpdateSession);

    // Session has been closed
    socket.on('session closed', onClosedSession);

    // LOBBY METHODS
    // Player has joined session
    socket.on('joined session', onJoinedSession);

    // New player has joined session
    socket.on('new player', onNewPlayer);

    // Player selected Character
    // socket.on('character selected', onCharacterSelected);

    // Player has left the lobby or game
    socket.on('remove player', onRemovePlayer);

    // IN-GAME METHODS
    // Player move message received
    socket.on('move player', onMovePlayer);

    // Player has been hit
    socket.on('hit player', onPlayerHit);
}

function sendPacket(type, data) {
    if(!local) {
        socket.emit(type, data);
    }
}

// Socket connected (Clear Enemies)
function onSocketConnected () {
    console.log('Connected to socket server');
    local = false;

    for (var i = 0; i < enemies.length; i++) {
        enemies[i].remove();
    }
    enemies = [];
    sessions = [];

    // Send local player data to the game server
    sendPacket('new player', {name: playerName});
}

// Socket disconnected
function onSocketDisconnect () {
    console.log('Disconnected from socket server');
    localSession = null;
    local = true;
}

// Get connection details
function onConnection(data) {
    console.log("id: " + data.id);
    localID = data.id;
}

// New message recieved
function onNewMessage(data) {
    var msg = "<div class=\"message\"> <p>" + data.name + ": " + data.message + "</p></div>";
    messages.push(msg);
}

// New session recieved
function onNewSession(data) {
    var sessionbody = "<div class=\"session\"> <div class=\"session-name\">" + data.name + "</div> " + "<div class=\"session-count\">" + data.playerCount + "/4</div></div>";
    var sess = new session(data.name, data.playerCount, sessionbody);
    sessions.push(sess);
}

// Session has been updated
function onUpdateSession(data) {
    sessionCol = document.getElementsByClassName('session');
    for(var p = 0; sessionCol.length; p++) {
        console.log("Session Objsdsa");
        console.log(sessionCol[p]);
        name = sessionCol[p].getElementsByClassName("session-name")[0].innerText;

        //if the name parsed down from the server matches a session in the HTML
        if (data == name) {
            sessionCol[p].getElementsByClassName("session-count")[0].innerText = data.playerCount;
        }
    }
    for(var i = 0; i < sessions.length; i++) {
        if(sessions[i].name === data.name) {
            sessions[i].count = data.playerCount
        }
    }
}

// Remove session from front-end and array
function onClosedSession(data) {
    // Retreive the sessions from the HTML
    sessionCol = document.getElementsByClassName('session');

    // Iterate over the sessions
    for(var i = 0; i < sessionCol.length; i++) {
        name = sessionCol[i].getElementsByClassName("session-name")[0].innerText;

        // If the name parsed down from the server matches a session in the HTML
        if (data == name) {
            // Remove the session from the HTML
            overlay = document.getElementById("session-area");
            overlay.removeChild(sessionCol[i]);

            // Iterate through sessions array and remove the session from it
            sessions.forEach(function (s) {
                if (s.id == data) {
                    var index = sessions.indexOf(s);
                    if(index > -1) {
                        sessions.splice(index, 1);
                        console.log(sessions);
                    }
                }
            });
        }
    }
    if (localSession.name === data.name) {
        disconnected();
    }
}

// This player has joined the lobby
function onJoinedSession(data) {
    localSession = new session(data.id, 0, "");
    levelNum = data.level;
}

// A new player has joined the Lobby
function onNewPlayer (data) {
    if (session.id === data.name ) {
        console.log('New player connected:', data.id);

        // Avoid possible duplicate players
        var duplicate = playerById(data.id);
        if (duplicate) {
            console.log('Duplicate player!');
            return false;
        }

        // Add new player to the remote players array
        enemies.push(new Enemy(data.x, data.y, data.enemyName));
        enemies[(enemies.length - 1)].id = data.id;
    }
}

// Another player has selected a character
function onCharacterSelected(data) {
    if (session.id === data.name ) {

    }
}

// Move player
function onMovePlayer (data) {
    if (localSession.id === data.name ) {
        var movePlayer = playerById(data.id);

        // Player not found
        if (!movePlayer) {
            console.log('Player not found: ', data.id);
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
            player.percentage = data.percentage;
            player.registerHit(data.knockback, data.dir, data.up);
        }
        else {
            var hitPlayer = playerById(data.id);
            // Player not found
            if (!hitPlayer) {
                console.log('Player not found: ', data.id);
                return false;
            }
            hitPlayer.percentage = data.percentage;
        }
    }
}

// Remove player
function onRemovePlayer (data) {
    if (localSession.id === data.name ) {
        var removePlayer = playerById(data.id);

        // Player not found
        if (!removePlayer) {
            console.log('Player not found: ', data.id);
            return false;
        }
        removePlayer.remove();

        // Remove player from array
        enemies.splice(enemies.indexOf(removePlayer), 1);
    }
}

// Find player by ID
function playerById (id) {
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].id === id) {
            return enemies[i];
        }
    }
    return false;
}
