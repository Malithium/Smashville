/**
 * Created by Kyle Tuckey on 14/02/2017.
 */

var messages = [];
var sessions = [];
var numOfMessages = 0;
var chatState = {
    preload: function(){
        socket = io.connect(ip + ":" + port);
    },

    create: function () {
        numOfMessages = messages.length;
        nameLabel = game.add.text(10, 10, 'Chat', {font: '30px Arial', fill: '#ffffff'});
        d = document.getElementById('chat-overlay');
        d.style.left = GAMEWIDTH / 8 + 'px';
        d.style.top = GAMEHEIGHT / 8 + 'px';
        d.style.display = 'block';

        a = document.getElementById('chat-button');
        a.style.cursor = 'pointer';

        a.onclick = function () {

            txt = document.getElementById('chat-text').value;
            setEventHandlers();
            if (txt != "") {
                console.log("boom");
                socket.emit('new message', {name: playerName, message: txt.toString()});
            }
        };

        a.onmouseover = function () {
            this.style.backgroundColor = 'white';
            this.style.color = 'black';
        };

        a.onmouseout = function () {
            this.style.backgroundColor = 'transparent';
            this.style.color = 'white';
        };
    },

    update: function () {
         if (numOfMessages != messages.length) {
             numOfMessages = messages.length;
             m = document.getElementById('chat-area');
             m.innerHTML = "";
             messages.forEach(function(msg) {
                 m.innerHTML += msg;
             });
         }
        }
    }
