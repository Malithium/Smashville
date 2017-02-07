// Last Updated: 16/01/2017
var Player = require('./client');
var Logic = require('./logic');

// Functions which will test different functions in the game.
function runAllTests() {
    //testRegisterDamage();
    //testCalculateKnockback();
}

function testRegisterDamage() {
    var player = new Player(0, 0);
    player.percentage = 99;
    registerDamage({Obj: player, dmg: 12});

    var expected = 111;
    var results = player.percentage;
    if (expected === results) {
        console.log('RegisterDamage test was successful');
    }
    else {
        console.log('RegisterDamage test was unsuccessful. Results are: ' + results );
    }
    player.playerSprite.kill();
}

function testCalculateKnockback() {
    var player = new Player(0, 0);
    player.percentage = 99;

    var expected = 400;
    var results = calculateKnockback(player, 4);
    if (expected === results) {
        console.log('CalculateKnockback test was successful');
    }
    else {
        console.log('CalculateKnockback test was unsuccessful. Results are: ' + results);
    }
    player.playerSprite.kill();
}

module.exports = runAllTests();
