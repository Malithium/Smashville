// Last Updated: 16/01/2017

// Global functions which will calculate different logic of the game.
//  Server will also use the same logic.

/*
 Updates a players percentage value, based on
 damage dealt by damage value.
*/
function registerDamage(Obj, dmg) {
    Obj.percentage += dmg;
}

/*
 Takes a players percentage and damage value to
 calculate how far back a player will be knocked.
 Will return velocity value for ARCADE physics.
 */
function calculateKnockback(Obj, dmg) {
    return (Obj.percentage*2) + dmg;
}

/*
 Cycle through players array, checking if/which
 players were hit by the ability. Then run two methods
 above.
 */
function checkCollision(player, dir, dmg) {
    for(p in players) {
        if (game.physics.arcade.overlap(player.playerSprite, players[p].playerSprite)) {
            registerDamage(players[p], dmg);
            if (dir === 1) {
                players[p].registerHit(-(calculateKnockback(players[p], dmg)), dir);
            }
            else if (dir === 2) {
                players[p].registerHit(calculateKnockback(players[p], dmg), dir);
            }
            else if (dir === 3) {
                players[p].registerHit(-(calculateKnockback(players[p], dmg)), dir, true);
            }
        }
    }
}
