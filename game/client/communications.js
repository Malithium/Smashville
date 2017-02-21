// Last Updated: 20/01/2017

// Server-to-Client variables
var local = true;
var socket;
var localID;

// Based off code in: https://github.com/xicombd/phaser-multiplayer-game
function setEventHandlers () {
    local = false;

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
    //socket.on('update session', onUpdateSession);

    // Session has been closed
    socket.on('session closed', onClosedSession);

    // LOBBY METHODS
    // Player left session
    //socket.on('player left lobby', onLeftLobby);

    // IN-GAME METHODS
    // New player message received - This may need changing...
    socket.on('new player', onNewPlayer);

    // Player move message received
    socket.on('move player', onMovePlayer);

    // Player has been hit
    socket.on('hit player', onPlayerHit);

    // Player removed message received
    socket.on('remove player', onRemovePlayer);
}

function sendPacket(type, data) {
    if(!local) {
        socket.emit(type, data);
    }
}

// Socket connected (Clear Enemies)
function onSocketConnected () {
    console.log('Connected to socket server');

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
}

// Get connection details
function onConnection(data) {
    console.log("id: " + data.id);
    localID = data.id;
}

function onNewMessage(data){
    var msg = "<div class=\"message\"> <p>" + data.name + ": " + data.message + "</p></div>";
    messages.push(msg);
}

function onNewSession(data){
    var sessionbody = "<div class=\"session\"> <div class=\"session-name\">" + data.name + "</div> " + "<div class=\"session-count\">" + data.playerCount + "/4</div></div>";
    var sess = new session(data.name, data.playerCount, sessionbody);
    sessions.push(sess);
}

// New player added to Lobby
function onNewPlayer (data) {
    //if (session.id = data.name ) { } // Need to store local session somewhere!
    console.log('New player connected:', data.id);

    // Avoid possible duplicate players
    var duplicate = playerById(data.id);
    if (duplicate) {
        console.log('Duplicate player!');
        return false;
    }

    // Add new player to the remote players array
    enemies.push(new Enemy(data.x, data.y, data.percentage));
    enemies[(enemies.length-1)].id = data.id;
}

// Move player
function onMovePlayer (data) {
    //if (session.id = data.name ) { } // Need to store local session somewhere!
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

// Player has been hit
function onPlayerHit(data) {
    //if (session.id = data.name ) { } // Need to store local session somewhere!
    if(localID === data.id ) {
        player.percentage = data.percentage;
        player.registerHit(data.knockback, data.dir, data.up);
    }
    else {
        var hitPlayer = playerById(data.id);
        hitPlayer.percentage = data.percentage;
    }
}

// Remove player
function onRemovePlayer (data) {
    //if (session.id = data.name ) { } // Need to store local session somewhere!
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

// Find player by ID
function playerById (id) {
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].id === id) {
            return enemies[i];
        }
    }
    return false;
}

//remove session from front-end and array
function onClosedSession(data){

    //retreive the sessions from the HTML
    sessionCol = document.getElementsByClassName('session');

    //iterate over the sessions
    for(var i = 0; i < sessionCol.length; i++){

        name = sessionCol[i].getElementsByClassName("session-name")[0].innerText;

        //if the name parsed down from the server matches a session in the HTML
        if (data == name) {

            //remove the session from the HTML
            overlay = document.getElementById("session-area");
            overlay.removeChild(sessionCol[i]);

            //iterate through sessions array and remove the session from it
            sessions.forEach(function (s) {
                if (s.id == data) {
                    var index = sessions.indexOf(s);
                    if(index > -1)
                    {
                        sessions.splice(index, 1);
                        console.log(sessions);
                    }
                }
            });
        }
    }
}