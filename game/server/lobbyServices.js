var Session = require("./session");
var SearchServices = require("./searchServices");

function onStartSession(data) {
    var startingSession = SearchServices.sessionByName(data.name);
    if(startingSession) {
        var start = true;
        // Check level has been selected
        if(startingSession.getLevel() > 0) {
            // Check each player has CharacterID
            for (var i = 0; i < startingSession.players.length; i++) {
                if (startingSession.players[i].characterID === 0) {
                    console.log("No character selected");
                    start = false;
                    // Send error message
                }
            }
        }
        else {
            // Send error message
            console.log("No level selected")
        }
        // All checks cleared
        if (start) {
            for (var j = 0; j < startingSession.players.length; j++) {
                startingSession.players[j].stock = 3;
                startingSession.players[j].percentage = 0;
            }
            console.log("Starting session: " + startingSession.name);
            startingSession.sessionState = startingSession.sessionStates.STARTING;
            this.emit("start session", {name: startingSession.name});
            this.broadcast.emit("start session", {name: startingSession.name});
            // Assign positions then update players that session has started
        }
    }
}

function onUpdateSession(data) {
    var updateSession = SearchServices.sessionByName(data.name);
    if(data.level) {
        updateSession.level = data.level;
        this.broadcast.emit("update session", {name: updateSession.name, level: updateSession.level});
    }
}

function onCharSelection(data) {
    var charPlayer = SearchServices.playerById(this.id);
    if (!charPlayer) {
        console.log("Player not found: " + this.id);
        return false;
    }

    var charSession = SearchServices.sessionByName(data.name);
    if (!charSession) {
        console.log("Session not found: " + data.name);
        return false;
    }
    for(var i = 0; i < charSession.players.length; i++) {
        if(charSession.players[i].getName() === data.charName) {
            charSession.players[i].characterID = data.charID;
        }
    }
    this.broadcast.emit("character selected", {name: charSession.name, id: charPlayer.id, charID: data.charID});
}

function onLeaveSession(data) {
    var leftPlayer = SearchServices.playerById(this.id);
    var leftSession = SearchServices.sessionByName(data.name);
    leftSession.players.splice(leftSession.players.indexOf(leftPlayer), 1);
    if (leftSession.host.id === this.id) {
        this.broadcast.emit("session closed", leaveSession.name);
        SearchServices.removeSession(leftSession);
    }
    else {
        this.broadcast.emit("update session", {name: leftSession.name, playerCount: leftSession.players.length});
        this.broadcast.emit("remove player", {name: leftSession.name, id: leftPlayer.id});
    }
}

var LobbyServices = {
    onStartSession: onStartSession,
    onUpdateSession: onUpdateSession,
    onCharSelection: onCharSelection,
    onLeaveSession: onLeaveSession
};

module.exports = LobbyServices;