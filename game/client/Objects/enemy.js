// Last Updated: 20/01/2017

function Enemy(x, y, name) {
    // Init
    this.characterID = 1;
    this.percentage = 0;
    this.name = name;
    this.lobbyID = 0;
    this.x = x;
    this.y = y;

    this.startGame = function() {
        // Sprite
        this.playerSprite = game.add.sprite(x, y, "player" + this.characterID);
        this.playerSprite.width = 32;
        this.playerSprite.height = 32;
    };

    this.remove = function() {
        if (this.playerSprite) {
            this.playerSprite.kill();
        }
    };
}