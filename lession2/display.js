var Display = (function(){
  var que = [];
  var Display = function(){};
  //override
  Display.prototype._path = function(){
    throw '_path';
  };
  Display.prototype.makePath = (function(){
    var cmd = [];
    return function(context){
      var i, j;
      cmd.length = 0;
      this._path(cmd);
      i = 0, j = cmd.length;
      que.push(context, 'beginPath', null);
      while(i < j){
        que.push(context, cmd[i++], cmd[i++]);
      }
      que.push(context, 'closePath', null);
    };
  })();
  Display.prototype.stroke = function(context, r,g,b,a){
    this.makePath(context);
    que.push(
      context, 'strokeStyle', 'rgba(' + [r,g,b,a].join(',') + ')',
      context, 'stroke', null
    );
  };
  Display.prototype.fill = function(context, r,g,b,a){
    this.makePath(context);
    que.push(
      context, 'fillStyle', 'rgba(' + [r,g,b,a].join(',') + ')',
      context, 'fill', null
    );
  };
  Display.render = function(){
    //[context1, method, arguments, context2, method, arguments,...]
    var clearList = [], canvas, context, prop, param, i, j;
    //clear each canvas
    for(i = 0, j = que.length; i < j; i += 3){
      if(clearList.indexOf(que[i]) == -1){
        clearList.push(que[i]);
        canvas = que[i].canvas;
        que[i].clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    //render object
    i = 0, j = que.length;
    while(i < j){
      context = que[i++];
      prop = que[i++];
      param = que[i++];
      if(typeof context[prop] == 'function') context[prop].apply(context, param);
      else context[prop] = param;
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
