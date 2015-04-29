var Game = {};

Game.fps = 1;

Game.load = function(onSuccess) {
  this.tiles = {
    tilesetImage: new Image(),
    tileSize: 32,       // The size of a tile (32×32)
    imageNumTiles: 16   // The number of tiles per row in the tileset image
  }
  this.tiles.tilesetImage.src = 'img/tileset.png';
  this.tiles.tilesetImage.onload = function() {
    $.ajax({
      type: 'GET',
      url: '/js/player.js',
      success: function (jsContent) {
        Game.playerString = jsContent;
        onSuccess();
      }
    });
  };
};

Game.initialize = function(level) {
  Game.stop();

  this.viewport = document.getElementById("viewport");
  horiz_borders = (viewport.width - 216) / 2;
  verti_borders = (viewport.height - 216) / 2;
  this._bounds = {
    "left": horiz_borders,
    "top":  verti_borders,
    "right": this.viewport.width - horiz_borders,
    "bottom": this.viewport.height - verti_borders
  };
  this._boardBounds = {
    "left": 0,
    "top":  0,
    "right": 5,
    "bottom": 5
  };
  this.context = this.viewport.getContext("2d");

  Game.bindScale(this.context);

  Game.loadLevel(level);
  Game.scale = 1;

  Game.run();
};

Game.draw = function() {
  this.context.clearRect(0, 0, this.viewport.width, this.viewport.height);

  for (var r = 0; r < this.ground.length; r++) {
    for (var c = 0; c < this.ground[r].length; c++) {
      var tile = this.ground[r][c];
      var tileRow = (tile / this.tiles.imageNumTiles) | 0; // Bitwise OR operation
      var tileCol = (tile % this.tiles.imageNumTiles) | 0;
      this.context.drawImage(this.tiles.tilesetImage,
        (tileCol * this.tiles.tileSize), (tileRow * this.tiles.tileSize),
        this.tiles.tileSize, this.tiles.tileSize,
        this._bounds.left + (c * this.tiles.tileSize), this._bounds.top + (r * this.tiles.tileSize),
        this.tiles.tileSize, this.tiles.tileSize);

      tile = this.items[r][c];
      this.context.drawImage(this.tiles.tilesetImage,
        (tileCol * this.tiles.tileSize),
        (tileRow * this.tiles.tileSize),
        this.tiles.tileSize,
        this.tiles.tileSize,
        this._bounds.left + (c * this.tiles.tileSize), this._bounds.top + (r * this.tiles.tileSize),
        this.tiles.tileSize, this.tiles.tileSize);
    }
  }

  for (var i=0; i < this.entities.length; i++) {
    this.entities[i].draw(this.context, this._bounds["left"], this._bounds["top"]);
  }
};

Game.update = function() {
  for (var i=0; i < this.entities.length; i++) {
    this.entities[i].update();
  }
};

Game.bounds = function() {
  return this._boardBounds;
}

Game.loadLevel = function(level) {
  this.entities = [];
  this.ground = levels[level]["ground"];
  this.items = levels[level]["items"];

  var playerPos = levels[level]["player"]

  var finalPlayerString = this.playerString.replace("{{CODE}}", editor.getValue());
  eval(finalPlayerString);

  Game.entities.push(Player(playerPos["x"], playerPos["y"]));
}

Game.bindScale = function(context) {
  var scale = function(e) {
    Game.scale = 1 + e.wheelDelta / 1000;
    context.scale(Game.scale, Game.scale);
  }

  var mousewheelevt = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x

  if (Game.viewport.attachEvent) //if IE (and Opera depending on user setting)
    Game.viewport.attachEvent("on"+mousewheelevt, scale)
  else if (viewport.addEventListener) //WC3 browsers
    Game.viewport.addEventListener(mousewheelevt, scale, false)
}

Game.insideBoard = function(x, y) {
  if (x > this._boardBounds["right"] || x < this._boardBounds["left"]) {
    Game.stop();
    console.error("Player is out of the board");
  }
}
