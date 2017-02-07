/**
 * Last Updated on: 20/01/2017.
 */

/*
Very early menu implementation, Im not sure how to have 1 method for multiple button's it appears that
adding an parameter to the 'actionOnClick' method forces it to be used without clicking, so this will
have to do until I find a solution
 */
var menuState = {
    create: function() {
        nameLabel = game.add.text(80,80,'SmashVille!', {font:'50px Arial', fill:'#ffffff'});
        startLabel = game.add.text(80, game.world.height-80,'Please Choose A Level', {font: '25px Arial', fill: '#ffffff'});

        var button = game.add.button(GAMEWIDTH/4, GAMEHEIGHT/2, 'level1_btn', this.actionOnClick1, this, 1, 2);
        var button2 = game.add.button(GAMEWIDTH/2, GAMEHEIGHT/2, 'level2_btn', this.actionOnClick2, this, 1, 2);
    },

    actionOnClick1: function()
    {
        levelNum = 1;
            game.state.start('play');
    },

    actionOnClick2: function()
    {
        levelNum = 2;
        game.state.start('play');
    }
};