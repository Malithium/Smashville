// Last Updated: 16/01/2017

// Global functions which will calculate different logic of the game.
//  Server will also use the same logic.

/*
 Updates a players percentage value, based on
 damage dealt by damage value.
 */
var registerDamage = function(value, dmg) {
    return value + dmg;
};

/*
 Takes a players percentage and damage value to
 calculate how far back a player will be knocked.
 Will return velocity value for ARCADE physics.
 */
var calculateKnockback = function(val, dmg) {
    return (val * 4) + dmg;
};

/*
 Cycle through players array, checking if/which
 players were hit by the ability. Then run two methods
 above.
 */
var checkCollision = function (player, players) {
    for(var i = 0; i < players.length; i++) {
        // Replace 32 with Height and Width
        if (player.getX() < (players[i].getX() + 32) && (player.getX() + 32) > players[i].getX() &&
            player.getY() < (players[i].getY() + 32) && (32 + player.getY()) > players[i].getY() &&
            player.id != players[i].id) {
            return players[i];
        }
    }
    return false;
};

var Logic = {
    registerDamage: registerDamage,
    calculateKnockback: calculateKnockback,
    checkCollision: checkCollision
};

module.exports = Logic;