// Designed and Created by: Kyle Tuckey & Joshua Petherick
// Project started on: 13/01/2017
// Last Updated: 16/01/2017

// Core-game variables
var GAMEHEIGHT = 600;
var GAMEWIDTH = 900;
var debug = true;

// Sprite Variables
var player;

// Phaser draw groups
var background;
var foreground;

var game = new Phaser.Game(GAMEWIDTH, GAMEHEIGHT, Phaser.AUTO, 'Smashville', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
// Load in Assets
    if (debug) {
        testRegisterDamage();
        testCalculateKnockback();
    }

} //preload();

function create() {
// Set game state and load Objects

} // create()

function update() {
// Update Object states

} // update()

function render() {
// Render text to screen

} // render()
