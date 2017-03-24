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
    };

    this.getState = function() {
        switch(this.sessionState) {
            case this.sessionStates.LOBBY:
                return 1;
                break;
            case this.sessionStates.STARTING:
                return 2;
                break;
        }
        return 1; // Default return LOBBY
    }

    this.addPlayer = function(player) {
        this.players.push(player);
        this.nxtLobbyID++;
    };

    this.getPlayerById = function(id) {
        // var result = this.players.forEach(function(player) {
        //    if (player.id === id) {
        //        return player;
        //    }
        //});
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].id == id) {
                return this.players[i];
            }
        }
        return false;
    };

    this.checkGameOver = function(){
        var theLiving = 0;
        for(i in this.players){
            if(this.players[i].getStock() > 0)
                theLiving++;
        }

        if(theLiving > 1)
            return false;

        return true;
    }

}



module.exports = Session;