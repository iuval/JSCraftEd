Game.load(function() {
  $("#page_loader").fadeOut();

  var loop = (function() {
    var loops = 0, skipTicks = 1000 / Game.fps,
        maxFrameSkip = 10,
        nextGameTick = (new Date).getTime();

    return function() {
      loops = 0;

      while ((new Date).getTime() > nextGameTick) {
        Game.update();
        nextGameTick += skipTicks;
        loops++;
      }

      Game.draw();
    };
  })();

  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() {
        cb();
        Game.requestId = requestAnimationFrame(_cb);
      }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() {
        cb();
        Game.requestId = mozRequestAnimationFrame(_cb);
      }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 30);
    }
  }

  window.onEachFrame = onEachFrame;

  Game.run = function() {
    window.onEachFrame(loop);
  };

  Game.stop = function() {
    if (Game.requestId) {
      window.cancelAnimationFrame(Game.requestId);
      Game.requestId = undefined;
    }
  };
});
