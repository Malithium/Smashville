// Last Updated: 20/01/2017

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
        if(this.action1.isDown && !this.action1Pressed) {
            console.log("Attack Left");
            sendPacket("hit player", { action: 1, dmg: 6, id: localID });
            this.action1Pressed = true;
        }
        else if (this.action1.isUp) {
            this.action1Pressed = false;
        }

        if(this.action2.isDown && !this.action2Pressed) {
            console.log("Attack Right");
            sendPacket("hit player", { action: 2, dmg: 6, id: localID });
            this.action2Pressed = true;
        }
        else if (this.action2.isUp) {
            this.action2Pressed = false;
        }

        if(this.action3.isDown && !this.action3Pressed) {
            console.log("Uppercut");
            sendPacket("hit player", { action: 3, dmg: 8, id: localID });
            this.action3Pressed = true;
        }
        else if (this.action3.isUp) {
            this.action3Pressed = false;
        }

        if(this.action4.isDown && !this.action4Pressed) {
            console.log("Low Blow");
            sendPacket("hit player", { action: 4, dmg: 3, id: localID });
            this.action4Pressed = true;
        }
        else if (this.action4.isUp) {
            this.action4Pressed = false;
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