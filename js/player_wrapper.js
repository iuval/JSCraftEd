function PlayerWrapper(x, y) {
  return {
    direction: "rigth",
    x: x,
    y: y,
    position: function() {
      return { "x": this.x, "y": this.y };
    },
    lookAt: function(direction) {
      this.direction = direction;
    },
    move: function() {
      switch (this.direction) {
        case "up" : { this.y += 1; break; }
        case "down" : { this.y -= 1; break; }
        case "right" : { this.x += 1; break; }
        case "left" : { this.x -= 1; break; }
      }
      Game.insideBoard(this.x, this.y);
    },
    feel: function(direction) {
      if (direction === undefined) direction = this.direction;
      switch (direction) {
        case "up" : return Game.itemAt(this.x, this.y + 1);
        case "down" : return Game.itemAt(this.x, this.y - 1);
        case "right" : return Game.itemAt(this.x + 1, this.y);
        case "left" : return Game.itemAt(this.x - 1, this.y);
      }
    },
    draw: function(context, offset_x, offset_y) {
      Game.drawCircle(this.x, this.y, "#3498db");
    }
  }
};
