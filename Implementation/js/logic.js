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
    return Obj.percentage + (dmg*2);
}

