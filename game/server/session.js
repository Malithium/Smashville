// Last Updated: 20/01/2017

function Session(host) {
    this.host = host;
    this.players = [];
    this.name = host.name + ' Session';
    this.level;

    this.players.push(host);
}

module.exports = Session;