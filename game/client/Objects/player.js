// Last Updated: 20/01/2017

/**
 * Handles everything Player related (e.g. Input, Physics, etc).
 * @param x
 * @param y
 * @param stock
 * @constructor
 */
function Player(x, y, stock) {
    // Init
    this.playerSprite = game.add.sprite(x, y, "player" + playerNum);
    this.playerSprite.width = 32;
    this.playerSprite.height = 32;
    this.x = x;
    this.y = y;
    this.stock = stock;

    // Physics
    game.physics.arcade.enable(this.playerSprite);

    // Input
    //  Movement
    this.moveLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.moveRight = game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.moveJump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.jumpPressed = false;

    // Properties
    //  Body
    this.playerSprite.body.setSize(64, 64, 0, 0); // 64x64 is default sprite size
    //  Jump
    this.jumpOnce = false;
    this.resetJump = false;
    this.jumpHeight = 200;
    //  Miscellaneous
    this.hit = false;
    this.speed = 100; // Set base speed here!
    this.percentage = 0;

    this.resetPosition = function(){
        this.playerSprite.x = GAMEWIDTH/2;
        this.playerSprite.y = GAMEHEIGHT/2;
        this.playerSprite.body.velocity.x = 0;
        this.playerSprite.body.velocity.y = 0;
        this.percentage = 0;
    };

    // Functions
    this.handleInput = function() {
        // Movement
        if(this.moveLeft.isDown) {
            if (!this.hit) {
                this.playerSprite.body.velocity.x = -this.speed;// Move Left
            }
            else {
                this.playerSprite.body.velocity.x = this.playerSprite.body.velocity.x - (this.speed / 20);
            }
        }
        if (this.moveRight.isDown) {
            if (!this.hit) {
                this.playerSprite.body.velocity.x = this.speed;// Move Left
            }
            else {
                this.playerSprite.body.velocity.x = this.playerSprite.body.velocity.x + (this.speed / 20);
            }
        }
        if (this.moveJump.isDown && !this.jumpPressed) {
            if (this.jumpOnce && !this.resetJump) {
                console.log("Jumped Twice");
                this.resetJump = true;
                this.playerSprite.body.velocity.y = -this.jumpHeight
            }
            else if (!this.jumpOnce) {
                console.log("Jumped Once");
                this.jumpOnce = true;
                this.playerSprite.body.velocity.y = -this.jumpHeight; // Jump
            }
            this.jumpPressed = true;
        }
        else if (this.moveJump.isUp) {
            this.jumpPressed = false;
        }

        // Actions
        if(action1.isDown && !action1Pressed) {
            console.log("Attack Left");
            sendPacket("hit player", { action: 1, dmg: 6, id: localID });
            action1Pressed = true;
        }
        else if (action1.isUp) {
            action1Pressed = false;
        }

        if(action2.isDown && !action2Pressed) {
            console.log("Attack Right");
            sendPacket("hit player", { action: 2, dmg: 6, id: localID });
            action2Pressed = true;
        }
        else if (action2.isUp) {
            action2Pressed = false;
        }

        if(action3.isDown && !action3Pressed) {
            console.log("Uppercut");
            sendPacket("hit player", { action: 3, dmg: 8, id: localID });
            action3Pressed = true;
        }
        else if (action3.isUp) {
            action3Pressed = false;
        }

        if(action4.isDown && !action4Pressed) {
            console.log("Low Blow");
            sendPacket("hit player", { action: 4, dmg: 3, id: localID });
            action4Pressed = true;
        }
        else if (action4.isUp) {
            action4Pressed = false;
        }
    };

    this.playerUpdate = function() {
        // Stops from falling through the floor
        if (!this.hit) {
            this.playerSprite.body.velocity.x = 0;
        }

        if (game.physics.arcade.collide(this.playerSprite, GroundLayer)) {
            this.jumpOnce = false;
            this.resetJump = false;
        }

        if(((this.playerSprite.body.velocity.x <= 10 && this.dir === 2) ||
            (this.playerSprite.body.velocity.x >= -10 && this.dir === 1) ||
            this.dir === 0 ) && this.hit) {
            this.playerSprite.body.gravity.x = 0;
            this.hit = false;
        }

        this.handleInput();

        this.lastX = Math.round(this.x);
        this.lastY = Math.round(this.y);
        this.x = Math.round(this.playerSprite.x);
        this.y = Math.round(this.playerSprite.y);
    };

    this.registerHit = function(knockback, dir, up) {
        this.hit = true;
        this.dir = dir;
        switch(dir)
        {
            case 1:
                this.playerSprite.body.gravity.x = 50;
                this.playerSprite.body.velocity.x = -knockback;
                break;

            case 2:
                this.playerSprite.body.gravity.x = -50;
                this.playerSprite.body.velocity.x = knockback;
                break;
        }
        switch(up)
        {
            case 1:
                this.playerSprite.y = this.playerSprite.y - 10;
                this.playerSprite.body.velocity.y = -knockback;
                break;

            case 2:
                this.playerSprite.body.velocity.y = knockback;
                break;
        }
    };

    this.checkRingOut = function(){
        if((this.x > GAMEWIDTH+40 || this.x < 0-40) || (this.y > GAMEHEIGHT+40 || this.y < 0-40)) {
            this.stock = player.stock - 1;
            sendPacket("update stock", {id: playerName, stock: this.stock});

            if(this.stock > 0) {
                this.resetPosition();
            }
            else {
                console.log(stock)
                this.death()
            }
        }
    };

    this.death = function(){
        player.x = 0;
        player.y = 0;
        this.playerSprite.kill();
    }
}