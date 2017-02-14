// Last Updated: 20/01/2017

// Socket variable
var socket;
var localID;

// Based off code in: https://github.com/xicombd/phaser-multiplayer-game
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

    // Player has been hit
    socket.on('hit player', onPlayerHit);

    // Game details passed across
    socket.on('game details', onGameUpdate);

    // Process new chat box message
    socket.on('new message', onNewMessage);
}

// Socket connected (Clear Enemies)
function onSocketConnected () {
    console.log('Connected to socket server');

    for (var i = 0; i < enemies.length; i++) {
        enemies[i].remove();
    }
    enemies = [];

    // Send local player data to the game server
    if (player) {
        socket.emit('new player', {x: player.x, y: player.y});
    }
    else {
        socket.emit('new player', {x: 0, y: 0});
    }
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
    enemies.push(new Enemy(data.x, data.y, data.percentage));
    enemies[(enemies.length-1)].id = data.id;
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
    movePlayer.playerSprite.x = data.x;
    movePlayer.playerSprite.y = data.y;
    movePlayer.percentage = data.percentage;
}

// Remove player
function onRemovePlayer (data) {
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

// Get servers level details
function onGameUpdate(data) {
    console.log("id: " + data.id);
    localID = data.id;
    levelNum = data.level;
}

// Player has been hit
function onPlayerHit(data) {
    if(localID === data.id ) {
        player.percentage = data.percentage;
        player.registerHit(data.knockback, data.dir, data.up);
    }
    else {
        var hitPlayer = playerById(data.id);
        hitPlayer.percentage = data.percentage;
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

function onNewMessage(data){
    var msg = "<div class=\"message\"> <p>" + data.name + ": " + data.message + "</p></div>";
    messages.push(msg);
}