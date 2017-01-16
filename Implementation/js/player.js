// Last Updated: 16/01/2017

function Player(x, y) {
    // Init
    // Might need to be changed, depending on level loading system
    this.playerSprite = game.add.sprite(x, y, 'player');
    this.playerSprite.width = 45;
    this.playerSprite.height = 30;

    // Physics
    game.physics.enable(this.playerSprite, Phaser.Physics.ARCADE);
    this.playerSprite.body.collideWorldBounds = true; // Thou shall never leave this world!
    this.playerSprite.body.mass = 0; // Remove mass so doesn't push other objects down...
    this.speed = 100; // Set base speed here!

    // Input
    this.moveLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.moveRight = game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.moveJump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // Functions
    this.handleInput = function() {
        if(this.moveLeft.isDown) {
            this.playerSprite.body.velocity.x = -this.speed;// Move Left
        }
        if (this.moveRight.isDown) {
            this.playerSprite.body.velocity.x = this.speed;// Move Right
        }
        if (this.moveJump.isDown) {
            this.playerSprite.body.velocity.y = -this.speed; // Jump
        }
    }
}