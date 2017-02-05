var util = require("util");
var io = require("socket.io");

var socket;
var players;
var Player = require("./client").Player;

function init() {
    players = [];
	socket = io.listen(8000);
	console.log('Init');

    setEventHandlers();
}

function setEventHandlers () {
    socket.sockets.on("connection", onSocketConnection);
}

function onSocketConnection(client) {
    util.log("New player has connected: " + client.id);
    client.on("disconnect", onClientDisconnect);
    client.on("new player", onNewPlayer);
    client.on("move player", onMovePlayer);
}

function onClientDisconnect() {
    util.log("Player has disconnected: " + this.id);
}

function onNewPlayer(data) {
    var newPlayer = new Player(data.x, data.y);
    newPlayer.id = this.id;
    this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
    }

    players.push(newPlayer);
}

function onMovePlayer(data) {

}

init();


// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
//
// var socket;
//
// function init() {
//     socket = io.listen(3000);
// }
//
// app.get('/', function(req, res){
//     res.sendfile('test.html');
// });
//
// //Whenever someone connects this gets executed
// io.on('connection', function(socket){
//     console.log('A user connected');
//
//     //Whenever someone disconnects this piece of code executed
//     socket.on('disconnect', function () {
//         console.log('A user disconnected');
//     });
//
// });
//
// http.listen(3000, function(){
//     console.log('listening on *:3000');
// });
//
// init();