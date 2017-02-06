// Last Updated: 20/01/2017
//var socket = io();

var loadState = {
  preload: function() {
      game.load.tilemap('map1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('tiles1', 'assets/tiles1.png');
      game.load.tilemap('map2', 'assets/levels/level2.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('tiles2', 'assets/tiles2.png');
      game.load.spritesheet('level1_btn', 'assets/Level1_button.png', 200, 133, 2);
      game.load.spritesheet('level2_btn', 'assets/Level2_button.png', 200, 133, 2);
      game.load.image('player', 'assets/playerTest.png');
  },

  create: function() {
      game.state.start('menu');
  }

};