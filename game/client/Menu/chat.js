/**
 * Created by Kyle Tuckey on 14/02/2017.
 */

var messages = [];
var sessions = [];
var numOfMessages = 0;
var numOfSessions = 0;

var chatState = {
    preload: function(){
    // Something(?)
    },

    create: function () {
        netMode = true;
        nameLabel = game.add.text(10, 10, "Chat", {font: "30px Arial", fill: "#ffffff"});
        d = document.getElementById("chat-overlay");
        d.style.left = GAMEWIDTH / 8 + "px";
        d.style.top = GAMEHEIGHT / 8 + "px";
        d.style.display = "block";

        a = document.getElementById("chat-button");
        a.style.cursor = "pointer";

        backButton = game.add.button(10, GAMEHEIGHT-40, "back", back, this, 1, 2);
        a.onclick = function () {

            txt = document.getElementById("chat-text").value;
            if (txt != "") {
                sendPacket("new message", {name: playerName, message: txt.toString()});
                document.getElementById("chat-text").value = "";
            }
        };

        a.onmouseover = function () {
            this.style.backgroundColor = "white";
            this.style.color = "black";
        };

        a.onmouseout = function () {
            this.style.backgroundColor = "transparent";
            this.style.color = "white";
        };

        s = document.getElementById("session-overlay");
        s.style.left = GAMEWIDTH - (300 + (GAMEWIDTH / 8)) + "px";
        s.style.top = GAMEHEIGHT/ 8 + "px";
        s.style.display = "block";
    },

    update: function () {
         if (numOfMessages != messages.length) {
             m = document.getElementById("chat-area");
             m.innerHTML = "";
             messages.forEach(function(msg) {
                 m.innerHTML += msg;
             });
             numOfMessages = messages.length;
         }

        if(numOfSessions != sessions.length) {
            innerSessions = document.getElementById("session-area");
            sessions.forEach(function (sess) {
                innerSessions.innerHTML += sess.body;
            });

            sessionCol = document.getElementsByClassName("session");

            for(var i = 0; i < sessionCol.length; i++) {
                console.log(sessionCol[i]);
                sessionCol[i].onmouseover = function () {
                    this.style.backgroundColor = "white";
                    this.style.color = "black";
                };

                sessionCol[i].onmouseout = function () {
                    this.style.backgroundColor = "transparent";
                    this.style.color = "white";
                };

                sessionCol[i].onclick = function () {
                    d = document.getElementById("chat-overlay").style.display = "none";
                    s = document.getElementById("session-overlay").style.display = "none";
                    var sessionName = this.getElementsByClassName("session-name")[0].innerText;
                    sendPacket("join session", {name: sessionName});
                    lobbyName = sessionName;
                };
            }
            numOfSessions = sessions.length;
        }
    },

    hostSession: function() {
        d = document.getElementById("chat-overlay").style.display = "none";
        s = document.getElementById("session-overlay").style.display = "none";
        isHost = true;
        lobbyName = playerName + " Session";
        sendPacket("new session", {id: localID, name: playerName});
        game.state.start("menu");
    }
};

function back() {
    sendPacket("disconnected", {}); // Tell server
    onSocketDisconnect({}); // Tell itself
    socket = null;
    var elements = document.getElementsByClassName("session");
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
    netMode = false;
    d = document.getElementById("chat-overlay").style.display = "none";
    s = document.getElementById("session-overlay").style.display = "none";
    ip = "";
    host = "";
    localID = -1;
    game.state.start("menu");
}