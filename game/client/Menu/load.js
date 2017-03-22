// Last Updated: 20/01/2017

var loadState = {
  preload: function() {
      // Stops game from pausing when clicking off
      game.stage.disableVisibilityChange = true;
      // Used for FPS counter
      game.time.advancedTiming = true;
      
      game.load.tilemap("map1", "assets/levels/level1.json", null, Phaser.Tilemap.TILED_JSON);
      game.load.tilemap("map2", "assets/levels/level2.json", null, Phaser.Tilemap.TILED_JSON);
      game.load.tilemap("map3", "assets/levels/level3.json", null, Phaser.Tilemap.TILED_JSON);
      game.load.spritesheet("level1_btn", "assets/images/Level1_button.png", 200, 133, 2);
      game.load.spritesheet("level2_btn", "assets/images/Level2_button.png", 200, 133, 2);
      game.load.spritesheet("connect_btn", "assets/images/connect_button.png", 180, 63, 2);
      game.load.spritesheet("start_btn", "assets/images/start_button.png", 180, 63, 2);
      game.load.image("player1", "assets/images/playerTest.png");
      game.load.image("player2", "assets/images/playerTest2.png");
      game.load.image("tiles1", "assets/images/tiles1.png");
      game.load.image("tiles2", "assets/images/tiles2.png");
      game.load.image("back", "assets/images/back_button.png");

      var overlayX = (GAMEWIDTH/2 - 300/2);
      var overlayY = (GAMEHEIGHT/2 - 300/2);
      var d = document.getElementById("ip-host");
      d.style.left = overlayX+"px";
      d.style.top = overlayY+"px";
      d.style.display = "none";

      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.physics.arcade.gravity.y = 350;
  },

  create: function() {
      game.state.start("user");
  }

};