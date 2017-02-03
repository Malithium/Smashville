var util = require("util");
var io = require("socket.io");
	
var socket;
var players;

function init() {
    players = [];
	socket = io.listen(8000);
	socket.configure(
		function() {
			socket.set("transports", ["websocket"]);
			socket.set("log level", 2);
		});
};

init();