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
    return (Obj.percentage*4) + dmg;
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
            switch(dir)
            {
                case 1:
                    players[p].registerHit(-(calculateKnockback(players[p], dmg)), 1, 0);
                    break;

                case 2:
                    players[p].registerHit(calculateKnockback(players[p], dmg), 2, 0);
                    break;

                case 3:
                    players[p].registerHit(-(calculateKnockback(players[p], dmg)), 0, 1);
                    break;

                case 4:
                    players[p].registerHit(calculateKnockback(players[p], dmg), 0, 2);
                    break;
            }
        }
    }
}
