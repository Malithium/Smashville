// Last Updated: 20/01/2017

function Enemy(x, y, name) {
    // Init
    this.characterID = 1;
    this.playerSprite = game.add.sprite(x, y, 'player' + this.characterID);
    this.playerSprite.width = 32;
    this.playerSprite.height = 32;
    this.percentage = 0;
    this.name = name;
    this.x = x;
    this.y = y;

    // Physics
    game.physics.arcade.enable(this.playerSprite);

    // Properties
    //  Body
    this.playerSprite.body.setSize(64, 64, 0, 0); // 64x64 is default sprite size

    this.playerUpdate = function() {
        // Stops from falling through the floor
        if (!this.hit) {
            this.playerSprite.body.velocity.x = 0;
        }

        if (game.physics.arcade.collide(this.playerSprite, GroundLayer)) {
            this.jumpOnce = false;
            this.resetJump = false;
        }

        if(this.playerSprite.body.velocity.x <= 10 &&
            this.playerSprite.body.velocity.x >= -10 && this.hit) {
            this.playerSprite.body.gravity.x = 0;
            this.hit = false;
        }

        this.x = this.playerSprite.x;
        this.y = this.playerSprite.y;
    };

    this.registerHit = function(knockback, dir, up) {
        this.hit = true;
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

    this.remove = function() {
        this.playerSprite.kill();
    }
}