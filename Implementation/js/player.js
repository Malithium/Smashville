// Last Updated: 20/01/2017

function Player(x, y) {
    // Init
    // NOTE(Kyle) : It appears 'Tiled' the map editor I am using, allows me to designate object positions, this may be a solution to X and Y positions
    this.playerSprite = game.add.sprite(x, y, 'player');
    this.playerSprite.width = 32;
    this.playerSprite.height = 32;

    // Physics
    game.physics.arcade.enable(this.playerSprite);

    // Input
    //  Movement
    this.moveLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.moveRight = game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.moveJump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.jumpPressed = false;
    //  Actions
    this.action1 = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.action1Pressed = false;
    this.action2 = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.action2Pressed = false;
    this.action3 = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.action3Pressed = false;
    this.action4 = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.action4Pressed = false;

    // Properties
    //  Body
    this.playerSprite.body.setSize(64, 64, 0, 0); // 64x64 is default sprite size
    //  Jump
    this.jumpOnce = false;
    this.resetJump = false;
    this.jumpHeight = 200;
    //  Miscellaneous
    this.speed = 100; // Set base speed here!
    this.percentage = 0;

    // Functions
    this.handleInput = function() {
        // Movement
        this.playerSprite.body.velocity.x = 0;

        if(this.moveLeft.isDown) {
            this.playerSprite.body.velocity.x = -this.speed;// Move Left
        }
        if (this.moveRight.isDown) {
            this.playerSprite.body.velocity.x = this.speed;// Move Right
        }
        if (this.moveJump.isDown && !this.jumpPressed) {
            if (this.jumpOnce && !this.resetJump) {
                console.log('Jumped Twice');
                this.resetJump = true;
                this.playerSprite.body.velocity.y = -this.jumpHeight
            }
            else if (!this.jumpOnce) {
                console.log('Jumped Once');
                this.jumpOnce = true;
                this.playerSprite.body.velocity.y = -this.jumpHeight; // Jump
            }
            this.jumpPressed = true;
        }
        else if (this.moveJump.isUp) {
            this.jumpPressed = false;
        }

        // Actions
        if(this.action1.isDown && !this.action1Pressed) {
            console.log('Attack Left');
            this.action1Pressed = true;
        }
        else if (this.action1.isUp) {
            this.action1Pressed = false;
        }

        if(this.action2.isDown && !this.action2Pressed) {
            console.log('Attack Right');
            this.action2Pressed = true;
        }
        else if (this.action2.isUp) {
            this.action2Pressed = false;
        }

        if(this.action3.isDown && !this.action3Pressed) {
            console.log('Uppercut');
            this.action3Pressed = true;
        }
        else if (this.action3.isUp) {
            this.action3Pressed = false;
        }

        if(this.action4.isDown && !this.action4Pressed) {
            console.log('Low Blow');
            this.action4Pressed = true;
        }
        else if (this.action4.isUp) {
            this.action4Pressed = false;
        }
    }

    this.playerUpdate = function() {
        // Stops from falling through the floor
        if (game.physics.arcade.collide(this.playerSprite, GroundLayer)) {
            this.jumpOnce = false;
            this.resetJump = false;
            this.playerSprite.body.velocity.y = 0;
        }
        this.handleInput();
    }
}