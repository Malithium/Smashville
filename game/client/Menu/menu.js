/**
 * Last Updated on: 20/01/2017.
 */

var ip = "127.0.0.1";
var port = 44555;
var netMode = false;
var isHost = false;
var lobbyName;
var lobbyID = 0;
var enemyNum = 0;
var serverAuthority = false;

//Players
var player1;
var player2;
var player3;
var player4;

/*
    Very early menu implementation, Im not sure how to have 1 method for multiple buttons it appears that
    adding an parameter to the "actionOnClick" method forces it to be used without clicking, so this will
    have to do until I find a solution
*/
var menuState = {
    create: function() {
        characterLabel = game.add.text(10, 240,"choose a character", {font: "25px Arial", fill: "#ffffff"});
        backButton = game.add.button(10, GAMEHEIGHT-40, "back", this.back, this, 1, 2);
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
            graphics.drawRect(140, 320, 100, 100);
            graphics.drawRect(280, 320, 100, 100);
            graphics.drawRect(420, 320, 100, 100);
        }
        if((netMode && isHost) || !netMode ) {
            var start = game.add.button(GAMEWIDTH - 200, GAMEHEIGHT - 100, "start_btn", this.startGame, this, 1, 2);
        }
    },

    update: function() {
        if(enemies.length > enemyNum) {
            enemyNum = enemies.length;
            for (var i = 0; i < enemies.length; i++) {
                updateBoxes(enemies[i].lobbyID, enemies[i].name);
            }
        }
        if(lobbyID != 0) {
            updateBoxes(lobbyID, playerName);
        }
        music.musicUpdate();
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

        if(!error) {
            sendPacket("start session", {name: lobbyName});
            if(local) {
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

        console.log(ip + ":" + port);
        socket = io.connect("http://"+ ip + ":" + port);
        if (localID === -1) {
            setEventHandlers();
        }
    },

    back: function() {
        if(netMode) {
            if(isHost) {
                isHost = false;
                lobbyName = "";
            }
            disconnected();
        }
        else{
            playerNum = 0;
            levelNum = 0;
            playerName = "";
            var u = document.getElementById("user-overlay").style.display = "block";
            var d = document.getElementById("ip-host").style.display = "none";
            game.state.start("user")
        }

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

/*
    Pass across a player or enemy to create a Text box, representing them
 */
function updateBoxes(lbID, name) {
    switch(lbID) {
        case 1:
            if (!player1) {
                player1 = game.add.text(35, 525, name, {font: "16px Arial", fill: "#ffffff"});
            }
            break;
        case 2:
            if (!player2) {
                player2 = game.add.text(175, 525, name, {font: "16px Arial", fill: "#ffffff"});
            }
            break;
        case 3:
            if (!player3) {
                player3 = game.add.text(315, 525, name, {font: "16px Arial", fill: "#ffffff"});
            }
            break;
        case 4:
            if (!player4) {
                player4 = game.add.text(455, 525, name, {font: "16px Arial", fill: "#ffffff"});
            }
            break;
        default:
            console.log('Error occured!');
            break;
    }
}

/**
 * Sessions level has been updated
 * @param data - Packet data from server
 * @param data.name - Session name
 * @param data.level - Sessions new levelID
 */
function onUpdateSessionLevel(data) {
    if(data.name == lobbyName)
        levelNum = data.level;
}

// This player has joined the lobby
function onJoinedSession(data) {
    console.log("Joined session: " + data.name);
    localSession = new session(data.name, 0, "", 1);
    levelNum = data.level;
    lobbyID = data.lobbyID;
    game.state.start("menu");
}

// A new player has joined the Lobby
function onNewPlayer (data) {
    if (localSession.id === data.name ) {
        console.log("New player connected (" + data.lobbyID + "):", data.id);

        // Avoid possible duplicate players
        var duplicate = playerById(data.id);
        if (duplicate) {
            console.log("Duplicate player!");
            return false;
        }

        // Add new player to the remote players array
        var enemy = new Enemy(data.x, data.y, data.enemyName);
        enemy.lobbyID = data.lobbyID;
        enemy.id = data.id;
        enemies.push(enemy);
    }
}

// Another player has selected a character
function onCharacterSelected(data) {
    if (localSession.id === data.name ) {
        var charPlayer = playerById(data.id);
        if (!charPlayer) {
            console.log("Player not found: ", data.id);
            return false;
        }
        charPlayer.characterID = data.charID;
        // Update Rectangle
    }
}

// Let the games begin!!!
function onStartSession(data) {
    console.log(data.name + " is starting!");
    if (localSession.id === data.name ) {
        game.state.start("play");
    }
}

// Remove player
function onRemovePlayer (data) {
    if (localSession.id === data.name ) {
        var removePlayer = playerById(data.id);

        // Player not found
        if (!removePlayer) {
            console.log("Player not found: ", data.id);
            return false;
        }
        removePlayer.remove();

        // Remove player from array
        enemies.splice(enemies.indexOf(removePlayer), 1);
    }
}
