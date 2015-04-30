function Player(x, y) {
  var _wrapper = PlayerWrapper(x, y);

  this.x = 0;
  this.y = 0;
  this.direction = 0;

  function updateVariables() {
    this.x = _wrapper.x;
    this.y = _wrapper.y;
    this.direction = _wrapper.direction;
  }

  function lookAt(_direction) {
    _wrapper.lookAt(_direction);
  }

  function move() {
    _wrapper.move();
  }

  function feel(_direction) {
    return _wrapper.feel(_direction);
  }

  {{CODE}}

  ;return {
    update: function() {
      updateVariables();
      update();
    },
    draw: function(context, offset_x, offset_y) {
      _wrapper.draw(context, offset_x, offset_y);
    },
    x: function() {
      _wrapper.x;
    },
    y: function() {
      _wrapper.y;
    }
  }
};
