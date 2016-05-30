'use strict';

(function () {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.loadWelcome = function () {
    // (this is a rough, but working, implementation)
    var dc = this;
    var request = new Request('./welcome.json');

    // TODO: install polyfill if we use fetch
    fetch(request).then(function (response) {
      return response.json();
    }).then(function (welcome) {
      // get dimensions so we can center it
      var maxX = 0;
      var maxY = 0;
      var minX = 10000;
      var minY = 10000;
      for (var i = 0; i < welcome.length; i++) {
        for (var j = 0; j < welcome[i].xy.length; j++) {
          if (welcome[i].xy[j][0] > maxX) {
            maxX = welcome[i].xy[j][0];
          }
          if (welcome[i].xy[j][0] < minX) {
            minX = welcome[i].xy[j][0];
          }
          if (welcome[i].xy[j][1] > maxY) {
            maxY = welcome[i].xy[j][1];
          }
          if (welcome[i].xy[j][1] < minY) {
            minY = welcome[i].xy[j][1];
          }
        }
      }
      var leftStartPoint = (window.innerWidth - maxX - minX) / 2;
      var topStartPoint = (window.innerHeight - maxY - minY - 60) / 2;
      // animate the welcome

      var _loop = function _loop(_i) {
        (function animateStroke(j) {
          setTimeout(function () {
            dc.paintAtPoint(
            // add left and top start points to center the message
            welcome[_i].xy[j][0] + leftStartPoint, welcome[_i].xy[j][1] + topStartPoint, welcome[_i].size,
            // TODO: randomize the brush
            welcome[_i].brush);
            if (j < welcome[_i].xy.length - 1) {
              j++;
              animateStroke(j);
            }
          }, 16.67);
        })(0);
      };

      for (var _i = 0; _i < welcome.length; _i++) {
        _loop(_i);
      }
    });
    // clear the welcome message
    setTimeout(function () {
      dc.clearCanvas();
    }, 5000);
  };

  proto.createdCallback = function () {
    var canvas = document.createElement('canvas');

    canvas.setAttribute('width', window.innerWidth * window.devicePixelRatio + 'px');
    canvas.setAttribute('height', window.innerHeight * window.devicePixelRatio + 'px');

    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';

    this.ctx = canvas.getContext('2d');

    canvas.addEventListener('touchstart', this.onTouch.bind(this));
    canvas.addEventListener('touchmove', this.onTouch.bind(this));
    canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvas.addEventListener('mouseup', this.onMouseUp.bind(this));

    this.appendChild(canvas);
    this.loadWelcome();
  };

  proto.newBrush = function () {
    window.app.undos.push({
      "brush": window.app.activeBrush,
      "size": window.app.brushSize.val,
      "xy": []
    });
  };

  proto.onMouseDown = function () {
    window.app.mouseDown = true;
    // paint stroke happening, so establish a new object to capture it
    this.newBrush();
  };

  proto.onMouseUp = function () {
    window.app.mouseDown = false;
  };

  proto.onMouseMove = function (e) {
    if (app.mouseDown === true) {
      this.paintAtPoint(e.clientX, e.clientY);
      this.recordHistory(e.clientX, e.clientY);
    }
  };

  proto.clearCanvas = function () {
    this.ctx.clearRect(0, 0, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
    this.updateUndoRedoButtonState();
  };

  proto.paintAtPoint = function (x, y, s, b) {
    // if there is no b | s, this is a new paint stroke and gets active size and brush values instead of history values
    var size = s || window.app.brushSize.val;
    var brush = b || window.app.activeBrush;
    var brushOffset = -size / 2;
    // 'Arial' is necessary to establish correct emoji size
    this.ctx.font = size + 'px Arial';
    // this is the emoji paint stroke
    this.ctx.fillText(String.fromCodePoint(brush), x * window.devicePixelRatio + brushOffset, y * window.devicePixelRatio - brushOffset);
  }, proto.onTouch = function (e) {
    // paint stroke happening, so establish a new object to capture it
    this.newBrush();
    for (var i = 0; i < e.touches.length; ++i) {
      var touch = e.touches[i];

      this.paintAtPoint(touch.clientX, touch.clientY);
      this.recordHistory(touch.clientX, touch.clientY);
    }
    e.preventDefault();
  };

  proto.recordHistory = function (x, y) {
    // record the paint stroke into the newest array
    window.app.undos[window.app.undos.length - 1].xy.push([x, y]);
    // clear the redo history
    window.app.redos = [];
    this.updateUndoRedoButtonState();
  };

  proto.repaintHistory = function () {
    // iterate through all paint stroke history
    for (var i = 0; i < window.app.undos.length; i++) {
      // iterate within individual paint strokes
      for (var j = 0; j < window.app.undos[i].xy.length; j++) {
        // repaint beautiful dabs of emoji
        this.paintAtPoint(window.app.undos[i].xy[j][0], window.app.undos[i].xy[j][1], window.app.undos[i].size, window.app.undos[i].brush);
      }
    }
  };

  proto.redo = function () {
    if (window.app.redos.length) {
      // move the last undone paint stroke back to the undo array
      window.app.undos.push(window.app.redos.pop());
      this.clearCanvas();
      this.repaintHistory();
    }
    this.updateUndoRedoButtonState();
    // return;
  };

  proto.undo = function () {
    if (window.app.undos.length) {
      // move the last paint stroke to the redo array
      window.app.redos.push(window.app.undos.pop());
      this.clearCanvas();
      this.repaintHistory();
    }
    this.updateUndoRedoButtonState();
    // return;
  };

  proto.updateUndoRedoButtonState = function () {
    if (window.app.undos.length) {
      document.querySelector('.undo').classList.remove('disabled');
    } else {
      document.querySelector('.undo').classList.add('disabled');
    }
    if (window.app.redos.length) {
      document.querySelector('.redo').classList.remove('disabled');
    } else {
      document.querySelector('.redo').classList.add('disabled');
    }
  };

  document.registerElement('draw-canvas', {
    prototype: proto
  });
})();

// revised brush stroke history model:
// [
//   {"brush": "0x1F428",
//     "size": 61.8625,
//     "xy": [[49,48],[50,50],[51,51]]
//   },
//   {
//
//   },
// ]