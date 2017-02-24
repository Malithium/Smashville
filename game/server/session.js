// Last Updated: 20/01/2017

function Session(host) {
    this.level = 0;
    this.host = host;
    this.players = [];
    this.sessionStates = {
        LOBBY: 1,
        STARTING: 2
    };
    this.sessionState = this.sessionStates.LOBBY;
    this.name = host.name + " Session";

    this.players.push(host);

    this.getName = function() {
        return this.name;
    }

    this.getPlayerById = function(id) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].id === id) {
                return this.players[i];
            }
        }
        return false;
    }
}

module.exports = Session;