function Player(x, y) {
  _player = this;

  this.direction = "right";
  this.x = x;
  this.y = y;

  {{CODE}}

  function lookAt(direction) {
    this.direction = direction;
  }

  function move(d) {
    switch (direction) {
      case "up" : { this.y += d; break; }
      case "down" : { this.y -= d; break; }
      case "right" : { this.x -= d; break; }
      case "left" : { this.x += d; break; }
    }
    Game.insideBoard(this.x, this.y);
  }

  function feel(direction) {
    switch (direction) {
      case "up" : return Game.itemAt(this.x, this.y + 1);
      case "down" : return Game.itemAt(this.x, this.y - 1);
      case "right" : return Game.itemAt(this.x + 1, this.y);
      case "left" : return Game.itemAt(this.x - 1, this.y);
    }
  }

  return {
    update: function() { update(); },
    draw: function(context, offset_x, offset_y) {
      context.fillRect(offset_x + _player.x * 32, offset_y + _player.y * 32, 32, 32);
    }
  }
};
