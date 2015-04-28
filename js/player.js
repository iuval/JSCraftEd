function Player(bounds) {
  _player = this;

  this.x = 50;
  this.y = 50;

  {{CODE}}

  return {
    update: function() { update(); },
    draw: function(context) {
      context.fillRect(_player.x - 15, _player.y - 15, 30, 30);
    }
  }
};
