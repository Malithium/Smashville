// Last Updated: 20/01/2017

var specState = {
    preload: function() {
    // Load in Assets
        // Used for FPS counter
        game.time.advancedTiming = true;
    }, //preload();

    create: function() {
        loadLevel();
        for (var i = 0; i < enemies.length; i++) {
            enemies[i].startGame();
        }
        debugButton = game.input.keyboard.addKey(Phaser.Keyboard.TAB);
        exitButton = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    }, // create()

    update: function() {
        // Update Object states
        mapEffects();
        for (var i = 0; i < enemies.length; i++) {
            enemies[i].playerUpdate();
        }

        if(debugButton.isDown && !debugPressed) {
            if (debug) {debug = false; }
            else {debug = true; }
            debugPressed = true;
        }
        else if (debugButton.isUp) {debugPressed = false;}
        if(exitButton.isDown) {
            // Exit spectate mode
            game.state.start("chat");
        }

    }, // update()

    render: function() {
        // Render text to screen
        game.debug.reset();
        if (debug) {
            game.debug.text(game.time.fps || "--", 2, 14, "#00ff00"); // Prints FPS
            game.debug.cameraInfo(game.camera, 32, 32);
        }
        for (var i = 0; i < enemies.length; i++) {
            game.debug.text(enemies[i].percentage, (30*enemies[i].lobbyID), 540, "#00ff00"); // Prints FPS
        }
    } // render()

};
