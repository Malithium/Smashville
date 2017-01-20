// Last Updated: 20/01/2017

function Player(x, y) {
    // Init
    // Might need to be changed, depending on level loading system
    // NOTE(Kyle) : It appears 'Tiled' the map editor I am using, allows me to designate object positions, this may be a solution to X and Y positions
    this.playerSprite = game.add.sprite(x, y, 'player');
    this.playerSprite.width = 64;
    this.playerSprite.height = 64

    // Physics
    game.physics.arcade.enable(this.playerSprite);
    //this.playerSprite.body.collideWorldBounds = true; // Thou shall never leave this world!
    //this.playerSprite.body.mass = 0; // Remove mass so doesn't push other objects down...

    // Input
    //  Movement
    this.moveLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.moveRight = game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.moveJump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    //  Actions
    this.action1 = game.input.keyboard.addKey(Phaser.Keyboard.left);
    this.action2 = game.input.keyboard.addKey(Phaser.Keyboard.right);
    this.action3 = game.input.keyboard.addKey(Phaser.Keyboard.up);
    this.action4 = game.input.keyboard.addKey(Phaser.Keyboard.down);

    // Properties
    this.percentage = 0;
    this.resetJump = false;
    this.speed = 100; // Set base speed here!
    this.playerSprite.anchor.set(0);
    this.playerSprite.body.setSize(this.playerSprite.width, this.playerSprite.height, 0, 0);

    // Functions
    this.handleInput = function() {
        this.playerSprite.body.velocity.x = 0;
        if(this.moveLeft.isDown) {
            this.playerSprite.body.velocity.x = -this.speed;// Move Left
        }
        if (this.moveRight.isDown) {
            this.playerSprite.body.velocity.x = this.speed;// Move Right
        }
        if (this.moveJump.isDown && this.resetJump) {
            this.playerSprite.body.velocity.y = -this.speed; // Jump
            // Code to say can't jump after double jumping...
        }

        if(this.action1.isDown) {
            // Attack Left
        }
        else if(this.action2.isDown) {
            // Attack Right
        }
        else if(this.action3.isDown) {
            // Uppercut
        }
        else if(this.action4.isDown) {
            // Low Blow
        }
    }

    this.playerUpdate = function() {
        this.handleInput();
        // Stops from falling through the floor
        //  CURRENTLY NOT COLLIDING WITH FLOOR
        if (game.physics.arcade.collide(this.playerSprite, GroundLayer) || this.playerSprite.y > (GAMEHEIGHT-64)) {
            this.resetJump = true;
            this.playerSprite.body.velocity.y = 0;
        }
        else {
            this.playerSprite.body.velocity.y = this.speed;
        }
    }
}