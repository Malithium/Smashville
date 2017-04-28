// Last Updated: 16/01/2017
var Player = require("./objects/client");
var Logic = require("./logic");

/**
* Tests if results match expected output
*/
function testRegisterDamage() {
    var player = new Player(0, 0);
    player.setPercentage(Logic.registerDamage(99, 12));

    var expected = 111;
    var results = player.getPercentage();
    if (expected !== results) {
        util.log("  RegisterDamage test was unsuccessful. Results are: " + results );
    }
}

/**
 * Tests if results match expected output
 */
function testCalculateKnockback() {
    var player = new Player(0, 0);
    player.setPercentage(99);

    var expected = 400;
    var results = Logic.calculateKnockback(player.getPercentage(), 4);
    if (expected !== results) {
        util.log("  CalculateKnockback test was unsuccessful. Results are: " + results);
    }
}

/**
 * Functions which will test different functions in the game.
 */
var runAllTests = function() {
    testRegisterDamage();
    testCalculateKnockback();
};

var Debug = {
    runAllTests: runAllTests
};

module.exports = Debug;
