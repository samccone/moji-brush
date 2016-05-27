(function() {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.createdCallback = function() {
    var canvas = document.createElement('canvas');

    canvas.setAttribute('width', (window.innerWidth * window.devicePixelRatio) + 'px');
    canvas.setAttribute('height', (window.innerHeight * window.devicePixelRatio) + 'px');

    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';

    this.ctx = canvas.getContext('2d');

    canvas.addEventListener('touchstart', this.onTouch.bind(this));
    canvas.addEventListener('touchmove', this.onTouch.bind(this));
    canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvas.addEventListener('mouseup', this.onMouseUp.bind(this));

    this.appendChild(canvas);
  };

  proto.onMouseDown = function() {
    window.app.mouseDown = true;
    window.app.undos.push([]);
  }

  proto.onMouseUp = function() {
    window.app.mouseDown = false;
  }

  proto.onMouseMove = function(e) {
    if (app.mouseDown === true) {
      this.paintAtPoint(e.clientX, e.clientY);
      this.recordHistory(e.clientX, e.clientY);
    }
  }

  proto.clearCanvas = function() {
    this.ctx.clearRect(0, 0, (window.innerWidth * window.devicePixelRatio),
        (window.innerHeight * window.devicePixelRatio));
  }
  //
  // proto.paintAtPoint = function(x, y) {
  //   var brushOffset = -window.app.brushSize.val / 2;
  //
  //   this.ctx.font = `${window.app.brushSize.val}px`
  //   this.ctx.fillText(String.fromCodePoint(window.app.activeBrush),
  //       x * window.devicePixelRatio + brushOffset,
  //       y * window.devicePixelRatio - brushOffset);
  // }

  proto.paintAtPoint = function(x, y, s, b) {
    let size = s || window.app.brushSize.val;
    let brush = b || window.app.activeBrush;
    console.log(size, brush);
    let brushOffset = -size / 2;
    this.ctx.font = `${size}px`;

    this.ctx.fillText(String.fromCodePoint(brush),
        x * window.devicePixelRatio + brushOffset,
        y * window.devicePixelRatio - brushOffset);
  },

  proto.onTouch = function(e) {
    window.app.undos.push([]);
    for(let i = 0; i < e.touches.length; ++i) {
      let touch = e.touches[i];

      this.paintAtPoint(touch.clientX, touch.clientY);
      this.recordHistory(touch.clientX, touch.clientY);
    }
    e.preventDefault();
  },

  proto.recordHistory = function(x, y) {
    window.app.undos[window.app.undos.length - 1].push({brush: window.app.activeBrush, size: window.app.brushSize.val, x: x, y: y});
  },

  proto.repaintHistory = function(history) {
    for (let i=0; i<history.length; i++) {

    }
  },

  proto.redo = function() {

  },

  proto.undo = function() {

  },

  document.registerElement('draw-canvas', {
    prototype: proto,
  });
})();
