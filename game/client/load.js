// Last Updated: 20/01/2017

var loadState = {
  preload: function() {
      // Stops game from pausing when clicking off
      game.stage.disableVisibilityChange = true;

      game.load.tilemap('map1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('tiles1', 'assets/tiles1.png');
      game.load.tilemap('map2', 'assets/levels/level2.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('tiles2', 'assets/tiles2.png');
      game.load.spritesheet('level1_btn', 'assets/Level1_button.png', 200, 133, 2);
      game.load.spritesheet('level2_btn', 'assets/Level2_button.png', 200, 133, 2);
      game.load.spritesheet('connect_btn', 'assets/connect_button.png', 180, 63, 2);
      game.load.spritesheet('start_btn', 'assets/start_button.png', 180, 63, 2);
      game.load.image('player1', 'assets/playerTest.png');
      game.load.image('player2', 'assets/playerTest2.png');


      var overlayX = (GAMEWIDTH/2 - 300/2);
      var overlayY = (GAMEHEIGHT/2 - 300/2);
      var d = document.getElementById('ip-host');
      d.style.left = overlayX+'px';
      d.style.top = overlayY+'px';
      d.style.display = 'none';

  },

  create: function() {
      game.state.start('user');
  }

};