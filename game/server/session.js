// Last Updated: 20/01/2017

function Session(host) {
    this.level = 0;
    this.host = host;
    this.players = [];
    this.nxtLobbyID = 2;
    this.sessionStates = {
        LOBBY: 1,
        STARTING: 2
    };
    this.sessionState = this.sessionStates.LOBBY;
    this.name = host.name + " Session";

    this.players.push(host);
    this.players[0].lobbyID = 1;

    this.getName = function() {
        return this.name;
    }

    this.addPlayer = function(player) {
        this.players.push(player);
        this.players[(this.players.length - 1)].lobbyId = this.nxtLobbyID;
        this.nxtLobbyID++;
    }

    this.getPlayerById = function(id) {
        var result = this.players.forEach(function(player) {
            if (player.id === id) {
                return player;
            }
        });
        util.log(result);
        if(result) {
            return result;
        }
        return false;
    }
}

module.exports = Session;