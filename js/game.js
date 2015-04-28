var Game = {};

Game.fps = 40;

Game.load = function(onSuccess) {
  $.ajax({
    type: 'GET',
    url: '/js/player.js',
    success: function (jsContent) {
      Game.playerString = jsContent;
      onSuccess();
    }
  });
};

Game.initialize = function(level) {
  Game.stop();

  var viewport = document.getElementById("viewport");
  this._bounds = { "x": 0, "y": 0, "width": viewport.width, "height": viewport.height };
  this.context = viewport.getContext("2d");

  var finalPlayerString = this.playerString.replace("{{CODE}}", editor.getValue());
  eval(finalPlayerString);

  this.entities = [];
  Game.entities.push(Player());

  Game.run();
};

Game.draw = function() {
  this.context.clearRect(0, 0, this._bounds.width, this._bounds.height);

  for (var i=0; i < this.entities.length; i++) {
    this.entities[i].draw(this.context);
  }
};

Game.update = function() {
  for (var i=0; i < this.entities.length; i++) {
    this.entities[i].update();
  }
};

Game.bounds = function() {
  return this._bounds;
}
