var Display = (function(){
  var que = [];
  var Display = function(){};
  //override
  Display.prototype._path = function(){
    throw '_path';
  };
  Display.prototype.makePath = (function(){
    var cmd = [];
    return function(){
      var i, j;
      cmd.length = 0;
      this._path(cmd);
      i = 0, j = cmd.length;
      que.push('beginPath', null);
      while(i < j){
        que.push(cmd[i++], cmd[i++]);
      }
      que.push('closePath', null);
    };
  })();
  Display.prototype.stroke = function(r,g,b,a){
    this.makePath();
    que.push(
      'strokeStyle', 'rgba(' + [r,g,b,a].join(',') + ')',
      'stroke', null
    );
  };
  Display.prototype.fill = function(r,g,b,a){
    this.makePath();
    que.push(
      'fillStyle', 'rgba(' + [r,g,b,a].join(',') + ')',
      'fill', null
    );
  };
  Display.context = null;
  Display.render = function(){//[method, arguments, method, arguments,...]
    var canvas, context, prop, param, i, j;
    context = Display.context;
    if(context){
      canvas = context.canvas;
      context.clearRect(0, 0, canvas.width, canvas.height);
      i = 0, j = que.length;
      while(i < j){
        prop = que[i++];
        param = que[i++];
        if(typeof context[prop] == 'function') context[prop].apply(context, param);
        else context[prop] = param;
      }
    }
    que.length = 0;
  };
  var Box = function(x, y, w, h){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  };
  Box.prototype = new Display();
  Box.prototype._path = function(command){
    command.push(
      'moveTo', [this.x, this.y],
      'lineTo', [this.x + this.width, this.y],
      'lineTo', [this.x + this.width, this.y + this.height],
      'lineTo', [this.x, this.y + this.height],
      'lineTo', [this.x, this.y]
    );
    return command;
  };
  var Triangle = function(x, y, w, h){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  };
  Triangle.prototype = new Display();
  Triangle.prototype._path = function(command){
    command.push(
      'moveTo', [this.x, this.y + this.height],
      'lineTo', [this.x + this.width/2, this.y],
      'lineTo', [this.x + this.width, this.y + this.height],
      'lineTo', [this.x, this.y + this.height]
    );
    return command;
  };
  var Circle = function(x, y, r){
    this.x = x;
    this.y = y;
    this.radius = r;
  };
  Circle.prototype = new Display();
  Circle.prototype._path = function(command){
    command.push(
      'arc', [this.x, this.y, this.radius, 0, 2 * Math.PI]
    );
    return command;
  };
  Display.Box = Box;
  Display.Triangle = Triangle;
  Display.Circle = Circle;
  return Display;
})();
