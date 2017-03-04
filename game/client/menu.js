/**
 * Last Updated on: 20/01/2017.
 */

var ip = "127.0.0.1";
var port = 44555;
var netMode = false;
var isHost = false;
var lobbyName;
var lobbyID;
var serverAuthority = false;

//Players
var player1;
var player2;
var player3;
var player4;

var player1Name = "";
var player2Name = "";
var player3Name = "";
var player4Name = "";
/*
    Very early menu implementation, Im not sure how to have 1 method for multiple buttons it appears that
    adding an parameter to the "actionOnClick" method forces it to be used without clicking, so this will
    have to do until I find a solution
*/
var menuState = {
    create: function() {
        enemyNum = enemies.length;
        var hostName = "";
        if(isHost) {
            hostName = playerName;
        }
        characterLabel = game.add.text(10, 240,"choose a character", {font: "25px Arial", fill: "#ffffff"});
        console.log(lobbyID);
        if((!netMode) || (netMode && isHost)) {
            levelLabel = game.add.text(10, 60,"choose a level", {font: "25px Arial", fill: "#ffffff"});
            var level1 = game.add.button(10, 100, "level1_btn", this.levelSelect1, this, 1, 2);
            var level2 = game.add.button(230, 100, "level2_btn", this.levelSelect2, this, 1, 2);
        }

        var character1 = game.add.button(10, 280, "player1", this.playerSelect1, this, 1, 2);
        var character2 = game.add.button(100, 280, "player2", this.playerSelect2, this, 1, 2);

        if(!netMode) {
            var connect = game.add.button(GAMEWIDTH-200, 10, "connect_btn", this.showConUI, this, 1, 2);
            nameLabel = game.add.text(10,10,"Hello, " + playerName + " Welcome to SmashVille!", {font:"30px Arial", fill:"#ffffff"});
        }
        else {
            nameLabel = game.add.text(10,10, lobbyName, {font:"30px Arial", fill:"#ffffff"});
            var graphics = game.add.graphics(10, 100);

            graphics.lineStyle(3, 0xffffff, 1);
            graphics.drawRect(0, 320, 100, 100);

            if(lobbyID === 1)
                player1Name = playerName;
            else if(lobbyID === 2)
                player2Name = playerName;
            else if(lobbyID === 3)
                player3Name = playerName;
            else if(lobbyID === 4)
                player4Name = playerName;
            console.log(enemies);
            for(var i = 0; i < enemies.length; i++){
                console.log("What is happening nigga?");
                if(player1Name != playerName && i === 0) {
                    player1Name = enemies[i].name;
                    console.log("What is happening nigga 1");
                }
                else if(player2Name != playerName && i === 1) {
                    player2Name = enemies[i].name;
                    console.log("What is happening nigga 2");
                }
                else if(player3Name != playerName && i === 2) {
                    player3Name = enemies[i].name;
                    console.log("What is happening nigga 3");
                }
                else if(player4Name != playerName && i === 3) {
                    player4Name = enemies[i].name;
                    console.log("What is happening nigga 4");
                }
            }

            player1 = game.add.text(35, 525, player1Name, {font:"16px Arial", fill:"#ffffff"});
            graphics.drawRect(140, 320, 100, 100);
            player2 = game.add.text(175, 525, player2Name, {font:"16px Arial", fill:"#ffffff"});
            graphics.drawRect(280, 320, 100, 100);
            player3 = game.add.text(315, 525, player3Name, {font:"16px Arial", fill:"#ffffff"});
            graphics.drawRect(420, 320, 100, 100);
            player4 = game.add.text(455, 525,  player4Name, {font:"16px Arial", fill:"#ffffff"});
        }
        if((netMode && isHost) || !netMode )
            var start = game.add.button(GAMEWIDTH-200, GAMEHEIGHT-100, "start_btn", this.startGame, this, 1, 2);
    },

    update: function() {
        if(netMode) {
            for(var i = 0; i < enemies.length; i++){
                if(player1Name != playerName && i === 0) {
                    player1.setText(enemies[i].name);
                }
                else if(player2Name != playerName && i === 1) {
                    player2.setText(enemies[i].name);
                }
                else if(player3Name != playerName && i === 2) {
                    player3.setText(enemies[i].name);
                }
                else if(player4Name != playerName && i === 3) {
                    player4.setText(enemies[i].name);
                }
            }
        }
        if(enemies.length > enemyNum)
        {
            console.log(enemies);
            enemyNum = enemies.length;

        }
    },

    levelSelect1: function() {
        levelNum = 1;
        if(isHost)
            sendPacket("update session", {name: lobbyName,level: 1})
    },

    levelSelect2: function() {
        levelNum = 2;
        if(isHost)
            sendPacket("update session", {name: lobbyName,level: 2})
    },

    playerSelect1: function() {
        playerNum = 1;
        sendPacket("character selected", {name: lobbyName, charID: 1, charName: playerName});
    },

    playerSelect2: function() {
        playerNum = 2;
        sendPacket("character selected", {name: lobbyName, charID: 2, charName: playerName});
    },

    /*
    shows the connection UI to the user
     */
    showConUI: function() {
        var d = document.getElementById("ip-host");
        d.style.display = "block";
    },

    /*
    start"s up the game locally, check"s to see if any levels or characters have been selected first
     */
    startGame: function()
    {
        var error = false;
        if(!levelNum > 0) {
            levelErrorLabel = game.add.text(10, GAMEHEIGHT - 60, "Please choose a level", {
                font: "25px Arial",
                fill: "#ff0000"
            });
            error = true;
        }
        if(!playerNum > 0) {
            CharacterErrorLabel = game.add.text(10, GAMEHEIGHT - 120, "Please choose a character", {
                font: "25px Arial",
                fill: "#ff0000"
            });
            error = true;
        }

        if(!error)
        {
            sendPacket("start session", {name: lobbyName});
            if(serverAuthority || local) {
                game.state.start("play");
            }
        }

    },

    /*
    This get called by a the button in the HTML, it takes the input values and pass"s them back to the JS
    it then hide"s the overlay, so that it does not interfere with the canvas
    TODO: there is no data validation at the moment for the IP address and host, will have to implement this
     */
    closeConnect: function() {
        var d = document.getElementById("ip-host");
        d.style.display = "none";

        ip = document.getElementsByName("ip")[0].value;
        if (ip === "local") {
            ip = "127.0.0.1";
        }
        port = document.getElementsByName("port")[0].value;

        game.state.start("chat");
    }
};

function disconnected() {
    localSession = null;
    enemies = [];
    game.state.start("chat");
}

function clientSessionBybody(body){
    var htmlContent = document.createElement('span');
    span.innerHTML = body;
    return span.textContent || span.innerHTML;
}
