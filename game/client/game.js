// Designed and Created by: Kyle Tuckey & Joshua Petherick
// Project started on: 13/01/2017
// Last Updated: 20/01/2017

var GAMEHEIGHT = 600;
var GAMEWIDTH = 900;

/**
 * The main variable which starts the game. Must be called in last.
 * @type {Phaser.Game}
 */
var game = new Phaser.Game(GAMEWIDTH, GAMEHEIGHT, Phaser.AUTO, "Smashville");
game.state.add("load", loadState);
game.state.add("user", userState);
game.state.add("menu", menuState);
game.state.add("chat", chatState);
game.state.add("play", playState);
game.state.add("spectate", specState);

game.state.start("load");
