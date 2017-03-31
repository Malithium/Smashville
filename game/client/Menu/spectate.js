// Last Updated: 20/01/2017
var exitButton;

var specState = {
    preload: function() {
        // ...
    }, //preload();

    create: function() {
        createGame();
        exitButton = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    }, // create()

    update: function() {
        // Update Object states
        updateGame();
        if(exitButton.isDown) {
            // Exit spectate mode
            game.state.start("chat");
        }
    }, // update()

    render: function() {
        // Render text to screen
        renderGame();
    } // render()
};

// Handle spectating
function onSpectateSession(data) {
    localSession.id = data.name;
    levelNum = data.level;
    lobbyID = 0;
    game.state.start("spectate");
}