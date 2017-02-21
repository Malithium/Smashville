/**
 * Created by Kyle Tuckey on 14/02/2017.
 */

var messages = [];
var sessions = [];
var numOfMessages = 0;
var numOfSessions = 0;

var chatState = {
    preload: function(){
        socket = io.connect(ip + ":" + port);
        setEventHandlers();
    },

    create: function () {
        numOfMessages = messages.length;
        numOfSessions = sessions.length;
        nameLabel = game.add.text(10, 10, 'Chat', {font: '30px Arial', fill: '#ffffff'});
        d = document.getElementById('chat-overlay');
        d.style.left = GAMEWIDTH / 8 + 'px';
        d.style.top = GAMEHEIGHT / 8 + 'px';
        d.style.display = 'block';

        a = document.getElementById('chat-button');
        a.style.cursor = 'pointer';

        a.onclick = function () {

            txt = document.getElementById('chat-text').value;
            if (txt != "") {
                sendPacket('new message', {name: playerName, message: txt.toString()});
                document.getElementById('chat-text').value = "";
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

        s = document.getElementById('session-overlay');
        s.style.left = GAMEWIDTH - (300 + (GAMEWIDTH / 8)) + 'px';
        s.style.top = GAMEHEIGHT/ 8 + 'px';
        s.style.display = 'block';
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

        if(numOfSessions > sessions.length){
            numOfSessions = sessions.length;
        }
        else if(numOfSessions != sessions.length)
        {
            numOfSessions = sessions.length;
            innerSessions = document.getElementById('session-area');
            sessions.forEach(function (sess) {
                innerSessions.innerHTML += sess.body;
            });

            sessionCol = document.getElementsByClassName('session');

            for(var i = 0; i < sessionCol.length; i++)
            {
                console.log(sessionCol[i]);
                sessionCol[i].onmouseover = function (){
                    this.style.backgroundColor = 'white';
                    this.style.color = 'black';
                };

                sessionCol[i].onmouseout = function (){
                    this.style.backgroundColor = 'transparent';
                    this.style.color = 'white';
                };

                sessionCol[i].onclick = function (){
                    var innerName = this.getElementsByClassName('session-name')[0].innerText;
                    console.log(innerName);
                    //sendPacket('join session', {name: innerName.toString()});
                };
            }
        }
    },

    hostSession: function(){
        sendPacket('new session', {id: localID, name: playerName});
        levelNum = 1;
        playerNum = 1;
        d = document.getElementById('chat-overlay').style.display = 'none';
        s = document.getElementById('session-overlay').style.display = 'none';
        game.state.start('play');
    }
}
