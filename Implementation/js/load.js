// Last Updated: 20/01/2017

var loadState = {
  preload: function() {
      game.load.tilemap('map1', 'Implementation/assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('tiles1', 'Implementation/assets/tiles1.png');
      game.load.tilemap('map2', 'Implementation/assets/levels/level2.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('tiles2', 'Implementation/assets/tiles2.png');
      game.load.spritesheet('level1_btn', 'Implementation/assets/Level1_button.png', 200, 133, 2);
      game.load.spritesheet('level2_btn', 'Implementation/assets/Level2_button.png', 200, 133, 2);
      game.load.image('player', 'Implementation/assets/playerTest.png');
  },

  create: function() {
      game.state.start('menu');
  }

};