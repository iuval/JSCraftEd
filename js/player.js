function Player(x, y) {
  _player = this;

  this.x = x;
  this.y = y;

  {{CODE}}

  function moveX(d) {
    this.x -= d;
    Game.insideBoard(this.x, this.y);
  }

  return {
    update: function() { update(); },
    draw: function(context, offset_x, offset_y) {
      context.fillRect(offset_x + _player.x * 32, offset_y + _player.y * 32, 32, 32);
    }
  }
};
