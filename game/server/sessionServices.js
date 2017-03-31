var Message = require("./message");
var Session = require("./session");
var SearchServices = require("./searchServices");

var messages = []; // Array of Messages

function onNewMessage(data) {
    // Create and register new message
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
    var newPlayer = SearchServices.playerById(this.id);
    newPlayer.setLobbyID(1);
    var newSession = new Session(newPlayer);
    // Creates Unique Session Name/ID
    if (sessions.length > 1) {
        var x = 0;
        while (SearchServices.sessionByName(newSession.getName())) {
            x++;
            newSession.name = newPlayer.name + x + " Session";
        }
    }
    console.log("New session created: " + newSession.getName());
    this.emit("joined session", {name: newSession.name, level: 0, lobbyID: 1});
    this.broadcast.emit("new session", {name: newSession.getName(), playerCount: 1, state: newSession.getState()});
    SearchServices.addSession(newSession);
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
        } else {
            // Send new player connection details
            this.emit("joined session", {name: joinSession.name, level: joinSession.level,
                lobbyID: joinSession.nxtLobbyID});
            for (var j = 0; j < joinSession.players.length; j++) {
                // Send new players other connected players details
                this.emit("new player", {
                    name: joinSession.name, id: joinSession.players[j].id,
                    x: joinSession.players[j].x, y: joinSession.players[j].y,
                    enemyName: joinSession.players[j].getName(), lobbyID: joinSession.players[j].lobbyID});
            }
            // Get new player to add to Array
            var joinPlayer = playerById(this.id);
            joinPlayer.setLobbyID(joinSession.nxtLobbyID);
            joinSession.addPlayer(joinPlayer);
            console.log("Joined session: " + joinSession.name);

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

var SessionServices = {
    onNewMessage: onNewMessage,
    onNewSession: onNewSession,
    onJoinSession: onJoinSession
};

module.exports = SessionServices;