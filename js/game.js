var Game = {};

Game.fps = 1;

Game.load = function(onSuccess) {
  Game.tileset = Tileset('img/tileset.png', 32);
  Game.tileset.load(function() {
    $.ajax({
      type: 'GET',
      url: '/js/player.js',
      success: function (jsContent) {
        Game.playerString = jsContent;

        Game.math = {
          twoPi: 2 * Math.PI
        }

        onSuccess();
      }
    });
  });
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
  this.context = this.viewport.getContext("2d");

  Game.bindScale(this.context);

  Game.loadLevel(level);
  Game.scale = 1;

  Game.run();
};

Game.draw = function() {
  if (Game.scale != 1) {
    this.context.scale(Game.scale, Game.scale);
    Game.scale = 1;
  }
  this.context.clearRect(0, 0, this.viewport.width, this.viewport.height);
  var twoPi = 2 * Math.PI;
  for (var r = 0; r < this.ground.length; r++) {
    for (var c = 0; c < this.ground[r].length; c++) {
      var tile = this.ground[r][c];
      if (tile) {
        this.context.fillStyle = tile;
        this.context.fillRect(
          this._bounds.left + (c * this.tileset.tileSize), this._bounds.top + (r * this.tileset.tileSize),
          this.tileset.tileSize, this.tileset.tileSize);

        tile = this.items[r][c];
        switch (tile) {
          case "T" : {
            Game.drawCircle(c, r, "#f1c40f");
            break;
          }
          case "R" : {
            Game.tileset.draw(this.context,
              0, 2,
              this._bounds.left + (c * this.tileset.tileSize), this._bounds.top + (r * this.tileset.tileSize));
          }
          default: continue;
        }
      }
    }
  }

  for (var i=0; i < this.entities.length; i++) {
    this.entities[i].draw(this.context, this._bounds.left, this._bounds["top"]);
  }
};

Game.update = function() {
  for (var i=0; i < this.entities.length; i++) {
    this.entities[i].update();
  }

  if (Game.itemAt(this._player.y(), this._player.x()) == "target") {
    this.targets --;
    if (this.targets == 0) {
      Game.stop();
      console.log("Level completed!!");
    }
  }
};

Game.bounds = function() {
  return this._boardBounds;
}

Game.loadLevel = function(level) {
  this.targets = 0;
  this.entities = [];

  var finalPlayerString = this.playerString.replace("{{CODE}}", editor.getValue());
  eval(finalPlayerString);

  this.colors = levels[level]["colors"]
  var x = parseInt(levels[level]["bounds"]["x"]),
      y = parseInt(levels[level]["bounds"]["y"]),
      rows = levels[level]["ground"];
  this.ground = new Array(y);
  for (var i = 0; i < y; i++) {
    row = rows[i];
    this.ground[i] = new Array(x);
    for (var j = 0; j < x; j++) {
      if (row[j] !== " ") {
        this.ground[i][j] = this.colors[row[j]];
      }
    }
  }
  rows = levels[level]["items"];
  this.items = new Array(y);
  for (var i = 0; i < y; i++) {
    row = rows[i];
    this.items[i] = new Array(x);
    for (var j = 0; j < x; j++) {
      this.items[i][j] = row[j];
      switch (this.items[i][j]) {
        case "T" : {
          this.targets ++;
          break;
        }
        case "P" : {
          this._player = Player(j, i);
          Game.entities.push(this._player);
          this.items[i][j] = "_";
          break;
        }
      }
    }
  }
  this._boardBounds = { "left": 0, "top":  0, "right": x - 1, "bottom": y - 1 };
}

Game.bindScale = function(context) {
  var scale = function(e) {
    Game.scale += e.wheelDelta / 1000;
  }

  var mousewheelevt = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x

  if (Game.viewport.attachEvent) //if IE (and Opera depending on user setting)
    Game.viewport.attachEvent("on"+mousewheelevt, scale)
  else if (viewport.addEventListener) //WC3 browsers
    Game.viewport.addEventListener(mousewheelevt, scale, false)
}

Game.isSpaceFree = function(x, y) {
  if (Game.itemAt(x, y) !== "none") {
    Game.stop();
    console.error("Out of the board");
  }
}

Game.insideBoard = function(x, y) {
  return x >= this._boardBounds.left && x <= this._boardBounds.right &&
    y >= this._boardBounds.top && y <= this._boardBounds.bottom;
}

Game.itemAt = function(x, y) {
  if (Game.insideBoard(x, y)) {
    switch (this.items[x][y]) {
      case "_" : return "none";
      case "T" : return "target";
      case "E" : return "enemy";
      case "*" : return "wall";
      default : return "out";
    }
  }
}

Game.drawCircle = function(c, r, color) {
  this.context.beginPath();
  this.context.arc(
    this._bounds.left + (c * this.tileset.tileSize) + this.tileset.halfTileSize, this._bounds.top + (r * this.tileset.tileSize) + this.tileset.halfTileSize,
    this.tileset.halfTileSize, 0, Game.math.twoPi);
  this.context.fillStyle = color;
  this.context.closePath();
  this.context.fill();
}

function Tileset(path, tileSize) {
  return {
    image: new Image(),
    tileSize: tileSize,
    halfTileSize: tileSize / 2,
    load: function(onLoad) {
      this.image.src = 'img/tileset.png';
      this.image.onload = onLoad;
    },
    draw: function(context, r, c, x, y) {
      context.drawImage(this.image,
        (c * this.tileSize), (r * this.tileSize),
        this.tileSize, this.tileSize,
        x + (c * this.tileSize), y + (r * this.tileSize),
        this.tileSize, this.tileSize
      );
    }
  }
}
