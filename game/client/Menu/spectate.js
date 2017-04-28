// Last Updated: 20/01/2017
var exitButton;

/**
 * Similar to play state but without input or player object.
 * @type {{preload: specState.preload, create: specState.create, update: specState.update, render: specState.render}}
 */
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
