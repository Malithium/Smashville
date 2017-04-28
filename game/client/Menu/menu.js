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

//Players
var player1;
var player2;
var player3;
var player4;

// Inputs
var code = "";
var action1;
var action2;
var action3;
var action4;
var action1Pressed = false;
var action2Pressed = false;
var action3Pressed = false;
var action4Pressed = false;

/**
 * Very early menu implementation, Im not sure how to have 1 method for multiple buttons it appears that adding an parameter to the
 * "actionOnClick" method forces it to be used without clicking, so this will have to do until I find a solution
 * @type {{create: menuState.create, update: menuState.update, levelSelect1: menuState.levelSelect1, levelSelect2: menuState.levelSelect2, playerSelect1: menuState.playerSelect1, playerSelect2: menuState.playerSelect2, showConUI: menuState.showConUI, startGame: menuState.startGame, closeConnect: menuState.closeConnect, back: menuState.back}}
 */
var menuState = {
    create: function() {
        // Store action to global inputs
        action1 = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        action2 = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        action3 = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        action4 = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

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
        if(lobbyID !== 0) {
            updateBoxes(lobbyID, playerName);
        }
        this.secretCode();
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

    playerSelect3: function() {
        playerNum = 3;
        sendPacket("character selected", {name: lobbyName, charID: 3, charName: playerName});
    },

    secretCode: function () {
        if(action1.isDown && !action1Pressed) {
            code += "1";
            action1Pressed = true;
            console.log(code);
        }
        else if (action1.isUp) {
            action1Pressed = false;
        }
        if(action2.isDown && !action2Pressed) {
            code += "3";
            action2Pressed = true;
            console.log(code);
        }
        else if (action2.isUp) {
            action2Pressed = false;
        }
        if(action3.isDown && !action3Pressed) {
            code += "2";
            action3Pressed = true;
            console.log(code);
        }
        else if (action3.isUp) {
            action3Pressed = false;
        }
        if(action4.isDown && !action4Pressed) {
            code += "4";
            action4Pressed = true;
            console.log(code);
        }
        else if (action4.isUp) {
            action4Pressed = false;
        }

        if(code.length > 4) {
            code = code.substring(1); // Remove first character
            console.log(code);
        }
        else if (code === "1234") {
            // Unlock secret character
            var character3 = game.add.button(190, 280, "player3", this.playerSelect3, this, 1, 2);
        }
    },

    /**
    * shows the connection UI to the user
    */
    showConUI: function() {
        var d = document.getElementById("ip-host");
        d.style.display = "block";
    },

    /**
    * Start"s up the game locally, check"s to see if any levels or characters have been selected first
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

    /**
    * This get called by a the button in the HTML, it takes the input values and pass"s them back to the JS
    * it then hide"s the overlay, so that it does not interfere with the canvas
    * TODO: there is no data validation at the moment for the IP address and host, will have to implement this
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

/**
 * Disconnect from session. Return to chat state.
 */
function disconnected() {
    localSession = null;
    enemies = [];
    game.state.start("chat");
}

/**
 * Pass across a player or enemy to create a Text box, representing them
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

/**
 * Remove session from front-end, and disconnect player if in said session
 * @param data - Pass across session name(ID)
 */
function onClosedSession(data) {
    // Retreive the sessions from the HTML
    sessionCol = document.getElementsByClassName("session");

    // Iterate over the sessions
    for(var i = 0; i < sessionCol.length; i++) {
        name = sessionCol[i].getElementsByClassName("session-name")[0].innerText;

        // If the name parsed down from the server matches a session in the HTML
        if (data == name) {
            // Remove the session from the HTML
            overlay = document.getElementById("session-area");
            overlay.removeChild(sessionCol[i]);

            // Iterate through sessions array and remove the session from it
            sessions.forEach(function (s) {
                if (s.id == data) {
                    var index = sessions.indexOf(s);
                    if(index > -1) {
                        sessions.splice(index, 1);
                        console.log(sessions);
                    }
                }
            });
        }
    }
    if (localSession.name === data.name) {
        disconnected();
    }
}

/**
 * This player has joined the session, move to lobby
 * @param data - Pass across session name, level and players lobbyID
 */
function onJoinedSession(data) {
    console.log("Joined session: " + data.name);
    localSession = new session(data.name, 0, "", 1);
    levelNum = data.level;
    lobbyID = data.lobbyID;
    game.state.start("menu");
}

/**
 * A new player has joined the Lobby
 * @param data - Contains new players x, y, name, ID and LobbyID
 */
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

/**
 * Another player has selected a character
 * @param data - Contains players ID and their new character ID
 */
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

/**
 * Move to play state. Let the games begin!
 * @param data - Pass across session name (ID)
 */
function onStartSession(data) {
    console.log(data.name + " is starting!");
    if (localSession.id === data.name ) {
        game.state.start("play");
    }
}

/**
 * Handles spectating. Changes to spectate state
 * @param data - Pass across session ID and level.
 */
function onSpectateSession(data) {
    localSession.id = data.name;
    levelNum = data.level;
    lobbyID = 0;
    game.state.start("spectate");
}