// Last Updated: 20/01/2017

/**
 * Basic Enemy object. Doesn't load as sprite until sessions started.
 * @param x
 * @param y
 * @param name
 * @constructor
 */
function Enemy(x, y, name, charID) {
    // Init
    this.characterID = charID;
    this.percentage = 0;
    this.name = name;
    this.lobbyID = 0;
    this.x = x;
    this.y = y;
    this.stock = 3;

    this.startGame = function() {
        // Sprite
        this.playerSprite = game.add.sprite(x, y, "player" + this.characterID);
        this.playerSprite.width = 32;
        this.playerSprite.height = 32;
        this.stock = 3;
    };

    this.update = function(){
        if((this.x > GAMEWIDTH+40 || this.x < 0-40) || (this.y > GAMEHEIGHT+40 || this.y < 0-40)) {
            this.stock = this.stock - 1;
        }
    };

    this.getStock = function() {
        if (this.stock < 1) {
            return 0;
        }
        return this.stock;
    };

    this.remove = function() {
        if (this.playerSprite) {
            this.playerSprite.kill();
        }
    };
}