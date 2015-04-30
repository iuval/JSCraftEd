Game.load(function() {
  $("#page_loader").fadeOut();

  var loop = function() {
    Game.update();
    Game.draw();
  };

  Game.run = function() {
    $("#page_loader").fadeOut();

    Game.playing = true;
    console.clearAll();
    Game.loopInterval = setInterval(function() {
      if (Game.playing) {
        loop();
      }
    }, 1000);
  };

  Game.stop = function() {
    Game.playing = false;
    if (Game.loopInterval) {
      clearInterval(Game.loopInterval);
      Game.loopInterval = undefined;
    }
  };
});
