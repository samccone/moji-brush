(function() {
  'use strict';

  const DEVICE_PIXEL_RATIO = window.devicePixelRatio;

  let proto = Object.create(HTMLElement.prototype);
  const _IMAGE_CACHE = new Map();

  function getImage(path) {
    if (_IMAGE_CACHE.has(path)) {
      return Promise.resolve(_IMAGE_CACHE.get(path));
    }

    return new Promise((res, rej) => {
      const img = new Image();
      img.src = path;

      img.onload = function() {
        _IMAGE_CACHE.set(path, {img, width: img.width, height: img.height});

        res(_IMAGE_CACHE.get(path));
      }
    });
  }

  proto.loadWelcome = function() {
    // (this is a rough, but working, implementation)
    let dc = this;

    // Only play intro once.
    if (localStorage.getItem('moji-intro-played') === 'true') {
      return;
    }

    localStorage.setItem('moji-intro-played', true);

    fetch('welcome.json')
        .then(function(response) {
          return response.json();
        })
        .then(function(welcome) {
          // get dimensions so we can center it
          let maxX = 0;
          let maxY = 0;
          let minX = 10000;
          let minY = 10000;
          for (let i = 0; i < welcome.length; i++) {
            for (let j = 0; j < welcome[i].xy.length; j++) {
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
          let leftStartPoint = (window.innerWidth - maxX - minX) / 2;
          let topStartPoint = (window.innerHeight - maxY - minY - 60) / 2;
          // animate the welcome
          for (let i = 0; i < welcome.length; i++) {
            (function animateStroke(j) {
              setTimeout(function() {
                dc.paintAtPoint(
                    // add left and top start points to center the message
                    welcome[i].xy[j][0] + leftStartPoint,
                    welcome[i].xy[j][1] + topStartPoint, welcome[i].size,
                    // TODO: randomize the brush
                    {
                      platform: window.app.brush.platform,
                      color: 'white',
                      name: '1f410.png'
                    });
                if (j < welcome[i].xy.length - 1) {
                  j++;
                  animateStroke(j);
                }
              }, 16.67);
            })(0);
          }
        });
    // clear the welcome message
    setTimeout(function() {
      dc.clearCanvas();
    }, 5000);
  };

  proto.createdCallback = function() {
    const canvas = document.createElement('canvas');

    canvas.setAttribute(
        'width', (window.innerWidth * DEVICE_PIXEL_RATIO) + 'px');
    canvas.setAttribute(
        'height', (window.innerHeight * DEVICE_PIXEL_RATIO) + 'px');

    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';

    this.ctx = canvas.getContext('2d');

    canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
    canvas.addEventListener('touchmove', this.onTouch.bind(this));
    canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
    canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvas.addEventListener('mouseup', this.onMouseUp.bind(this));

    this.appendChild(canvas);
    this.loadWelcome();
  };

  // revised brush stroke history model:
  // [
  //   {"brush": {
  //     platform: 'google',
  //     color: 'blue-light',
  //     name: '1f4a7.png'
  //   },
  //     "size": 61.8625,
  //     "rotation": 0,
  //     "xy": [[49,48],[50,50],[51,51]]
  //   },
  //   {
  //
  //   },
  // ]
  proto.newBrush = function() {
    window.app.undos.push({
      'brush': {
        platform: window.app.brush.platform,
        color: window.app.brush.color,
        name: window.app.brush.name
      },
      'size': window.app.brushSize.val,
      'rotation': window.app.brushRotation,
      'xy': []
    });
  };

  proto.onMouseDown = function(e) {
    window.app.mouseDown = true;
    // paint stroke happening, so establish a new object to capture it
    this.newBrush();
    let touch = e;
    this.paintAtPoint(touch.clientX, touch.clientY);
    this.recordHistory(touch.clientX, touch.clientY);
  };

  proto.onMouseUp = function() {
    window.app.mouseDown = false;
  };

  proto.onMouseMove = function(e) {
    if (app.mouseDown === true) {
      this.paintAtPoint(e.clientX, e.clientY);
      this.recordHistory(e.clientX, e.clientY);
    }
  };

  proto.clearCanvas = function() {
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(
        0, 0, (window.innerWidth * DEVICE_PIXEL_RATIO),
        (window.innerHeight * DEVICE_PIXEL_RATIO));
    this.updateUndoRedoButtonState();
  };

  proto.paintAtPoint =
      function(
          x, y, size = window.app.brushSize.val,
          rotation = window.app.brushRotation, brush = {
            platform: window.app.brush.platform,
            color: window.app.brush.color,
            name: window.app.brush.name
          }) {

    let brushPath =
        window.app.baseImgPath + '/' + brush.platform + '/' + brush.color + '/';
    getImage(brushPath + brush.name).then(emojiImage => {
      /*
       * Get the image emoji height and width then convert them to the brush
       * size
       * percent
       * and then multiply that by the device pixel amount so that we get a 1:1
       * size.
       *
       * For instance... a 200px wide image painted at 50% size on a 2x screen
       * would be displayed on screen as (200 * .5 * 2) which would be 200px :).
       */
      const emojiPaintWidth = emojiImage.width *
          window.app.getBrushSizePercent(size) * DEVICE_PIXEL_RATIO;
      const emojiPaintHeight = emojiImage.height *
          window.app.getBrushSizePercent(size) * DEVICE_PIXEL_RATIO;

      // save the current coordinate system
      this.ctx.save();

      this.ctx.translate(x * DEVICE_PIXEL_RATIO, y * DEVICE_PIXEL_RATIO);
      this.ctx.rotate(rotation);
      this.ctx.drawImage(
          emojiImage.img, -emojiPaintWidth / 2, -emojiPaintHeight / 2,
          emojiPaintWidth, emojiPaintHeight);

      this.ctx.restore();
    });
  },

  proto.onTouchStart = function(e) {
    // prevent mousedown from firing
    e.preventDefault();
    const canvas = document.querySelector('canvas');
    canvas.removeEventListener('mousedown', this.onMouseDown.bind(this));
    let touch = e.touches[0];
    window.app.touchStart = true;
    // paint stroke happening, so establish a new object to capture it
    this.newBrush();
    this.paintAtPoint(touch.clientX, touch.clientY);
    this.recordHistory(touch.clientX, touch.clientY);
  };

  proto.onTouchEnd = function() {
    window.app.touchStart = false;
  };

  proto.onTouch = function(e) {
    if (app.touchStart === true) {
      for (let i = 0; i < e.touches.length; ++i) {
        let touch = e.touches[i];

        this.paintAtPoint(touch.clientX, touch.clientY);
        this.recordHistory(touch.clientX, touch.clientY);
      }
    }
    e.preventDefault();

  };

  proto.recordHistory = function(x, y) {
    // record the paint stroke into the newest array
    window.app.undos[window.app.undos.length - 1].xy.push([x, y]);
    // clear the redo history
    window.app.redos = [];
    this.updateUndoRedoButtonState();
  };

  proto.repaintHistory = function() {
    // iterate through all paint stroke history
    for (let i = 0; i < window.app.undos.length; i++) {
      // iterate within individual paint strokes
      for (let j = 0; j < window.app.undos[i].xy.length; j++) {
        // repaint beautiful dabs of emoji
        this.paintAtPoint(
            window.app.undos[i].xy[j][0], window.app.undos[i].xy[j][1],
            window.app.undos[i].size, window.app.undos[i].rotation,
            window.app.undos[i].brush);
      }
    }
  };

  proto.addFooter = function() {
    const bannerWidth = Math.min(600, window.innerWidth) * DEVICE_PIXEL_RATIO;
    const bannerHeight = 45 * DEVICE_PIXEL_RATIO;
    const bannerX =
        window.innerWidth / 2 * DEVICE_PIXEL_RATIO - bannerWidth / 2;
    const bannerY = window.innerHeight * DEVICE_PIXEL_RATIO - bannerHeight;

    this.ctx.fillStyle = '#111';
    this.ctx.fillRect(bannerX, bannerY, bannerWidth, bannerHeight);
    this.ctx.font = `${25 * DEVICE_PIXEL_RATIO}px Arial`;
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(
        '🎨  mojibrush.co', bannerX + bannerWidth / 2 - 105 * DEVICE_PIXEL_RATIO,
        bannerY + bannerHeight / 2 + 5 * DEVICE_PIXEL_RATIO);
  };

  proto.download = function() {
    // Add the footer credit.
    this.addFooter();

    const anchor = document.createElement('a');
    const dataURI = this.querySelector('canvas').toDataURL();

    // http://caniuse.com/#feat=download
    if (!('download' in anchor)) {
      return window.open(dataURI);
    }

    anchor.setAttribute('download', `moji-brush-${Date.now()}.png`);
    anchor.setAttribute('href', dataURI);
    anchor.click();
  };

  proto.redo = function() {
    if (window.app.redos.length) {
      // move the last undone paint stroke back to the undo array
      window.app.undos.push(window.app.redos.pop());
      this.clearCanvas();
      this.repaintHistory();
    }
    this.updateUndoRedoButtonState();
  };

  proto.undo = function() {
    if (window.app.undos.length) {
      // move the last paint stroke to the redo array
      window.app.redos.push(window.app.undos.pop());
      this.clearCanvas();
      this.repaintHistory();
    }
    this.updateUndoRedoButtonState();
  };

  proto.updateUndoRedoButtonState = function() {
    document.querySelector('.undo').classList.toggle(
        'disabled', !window.app.undos.length);

    document.querySelector('.redo').classList.toggle(
        'disabled', !window.app.redos.length);
  };

  document.registerElement('draw-canvas', {
    prototype: proto,
  });
})();
