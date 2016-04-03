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
  }

  proto.onMouseUp = function() {
    window.app.mouseDown = false;
  }

  proto.onMouseMove = function(e) {
    if (app.mouseDown === true) {
      this.paintAtPoint(e.clientX, e.clientY);
    }
  }

  proto.clearCanvas = function() {
    this.ctx.clearRect(0, 0, (window.innerWidth * window.devicePixelRatio),
        (window.innerHeight * window.devicePixelRatio));
  }

  proto.paintAtPoint = function(x, y) {
    var brushOffset = -window.app.brushSize.val / 2;

    this.ctx.font = `${window.app.brushSize.val}px Arial`
    this.ctx.fillText(String.fromCodePoint(window.app.activeBrush),
        x * window.devicePixelRatio + brushOffset,
        y * window.devicePixelRatio - brushOffset);
  }

  proto.onTouch = function(e) {
    for(let i = 0; i < e.touches.length; ++i) {
      let touch = e.touches[i];

      this.paintAtPoint(touch.clientX, touch.clientY);
    }

    e.preventDefault();
  }


  document.registerElement('draw-canvas', {
    prototype: proto,
  });
})();

