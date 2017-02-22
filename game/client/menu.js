/**
 * Last Updated on: 20/01/2017.
 */

var ip = "127.0.0.1";
var port = 44555;
var netMode = false;
/*
    Very early menu implementation, Im not sure how to have 1 method for multiple button's it appears that
    adding an parameter to the 'actionOnClick' method forces it to be used without clicking, so this will
    have to do until I find a solution
*/
var menuState = {
    create: function() {
        nameLabel = game.add.text(10,10,'Hello, ' + playerName + ' Welcome to SmashVille!', {font:'30px Arial', fill:'#ffffff'});
        levelLabel = game.add.text(10, 60,'choose a level', {font: '25px Arial', fill: '#ffffff'});
        characterLabel = game.add.text(10, 240,'choose a character', {font: '25px Arial', fill: '#ffffff'});

        var level1 = game.add.button(10, 100, 'level1_btn', this.levelSelect1, this, 1, 2);
        var level2 = game.add.button(230, 100, 'level2_btn', this.levelSelect2, this, 1, 2);

        var character1 = game.add.button(10, 280, 'player1', this.playerSelect1, this, 1, 2);
        var character2 = game.add.button(100, 280, 'player2', this.playerSelect2, this, 1, 2);

        if(netMode == false)
        {
            var connect = game.add.button(GAMEWIDTH-200, 10, 'connect_btn', this.showConUI, this, 1, 2);
        }
        else
        {

        }

        var start = game.add.button(GAMEWIDTH-200, GAMEHEIGHT-100, 'start_btn', this.startGame, this, 1, 2);
    },

    levelSelect1: function()
    {
        levelNum = 1;
    },

    levelSelect2: function()
    {
        levelNum = 2;
    },

    playerSelect1: function()
    {
        playerNum = 1;
    },

    playerSelect2: function()
    {
        playerNum = 2;
    },

    /*
    shows the connection UI to the user
     */
    showConUI: function()
    {
        var d = document.getElementById('ip-host');
        d.style.display = 'block';
    },

    /*
    start's up the game locally, check's to see if any levels or characters have been selected first
     */
    startGame: function()
    {
        var error = false;
        if(!levelNum > 0) {
            levelErrorLabel = game.add.text(10, GAMEHEIGHT - 60, 'Please choose a level', {
                font: '25px Arial',
                fill: '#ff0000'
            });
            error = true;
        }
        if(!playerNum > 0)
        {
            CharacterErrorLabel = game.add.text(10, GAMEHEIGHT - 120, 'Please choose a character', {
                font: '25px Arial',
                fill: '#ff0000'
            });
            error = true;
        }

        if(error == false)
            game.state.start('play');
    },

    /*
    This get called by a the button in the HTML, it takes the input values and pass's them back to the JS
    it then hide's the overlay, so that it does not interfere with the canvas
    TODO: there is no data validation at the moment for the IP address and host, will have to implement this
     */
    closeConnect: function()
    {
        var d = document.getElementById('ip-host');
        d.style.display = 'none';

        ip = document.getElementsByName('ip')[0].value;
        if (ip === 'local') {
            ip = '127.0.0.1';
        }
        port = document.getElementsByName('port')[0].value;

        game.state.start('chat');
    }
};