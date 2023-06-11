
const DEVICE_PIXEL_RATIO = window.devicePixelRatio;

const _IMAGE_CACHE = new Map();

function getImage(path) {
  if (_IMAGE_CACHE.has(path)) {
    return Promise.resolve(_IMAGE_CACHE.get(path));
  }

  return new Promise((res, rej) => {
    const img = new Image();
    img.src = path;

    img.onload = function () {
      _IMAGE_CACHE.set(path, { img, width: img.width, height: img.height });

      res(_IMAGE_CACHE.get(path));
    }
  });
}

class DrawCanvas extends HTMLElement {
  loadWelcome() {
    // (this is a rough, but working, implementation)
    let dc = this;

    // Only play intro once.
    if (localStorage.getItem('moji-intro-played') === 'true') {
      return;
    }

    localStorage.setItem('moji-intro-played', true);

    fetch('welcome.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (welcome) {
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
            setTimeout(function () {
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
    setTimeout(function () {
      dc.clearCanvas();
    }, 5000);
  };

  connectedCallback() {
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
  newBrush() {
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

  onMouseDown(e) {
    window.app.mouseDown = true;
    // paint stroke happening, so establish a new object to capture it
    this.newBrush();
    let touch = e;
    this.paintAtPoint(touch.clientX, touch.clientY);
    this.recordHistory(touch.clientX, touch.clientY);
  };

  onMouseUp() {
    window.app.mouseDown = false;
  };

  onMouseMove(e) {
    if (app.mouseDown === true) {
      this.paintAtPoint(e.clientX, e.clientY);
      this.recordHistory(e.clientX, e.clientY);
    }
  };

  clearCanvas() {
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(
      0, 0, (window.innerWidth * DEVICE_PIXEL_RATIO),
      (window.innerHeight * DEVICE_PIXEL_RATIO));
    this.updateUndoRedoButtonState();
  };

  paintAtPoint(
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
  }

  onTouchStart(e) {
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

  onTouchEnd() {
    window.app.touchStart = false;
  };

  onTouch(e) {
    if (app.touchStart === true) {
      for (let i = 0; i < e.touches.length; ++i) {
        let touch = e.touches[i];

        this.paintAtPoint(touch.clientX, touch.clientY);
        this.recordHistory(touch.clientX, touch.clientY);
      }
    }
    e.preventDefault();

  };

  recordHistory(x, y) {
    // record the paint stroke into the newest array
    window.app.undos[window.app.undos.length - 1].xy.push([x, y]);
    // clear the redo history
    window.app.redos = [];
    this.updateUndoRedoButtonState();
  };

  repaintHistory() {
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

  download() {
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

  redo() {
    if (window.app.redos.length) {
      // move the last undone paint stroke back to the undo array
      window.app.undos.push(window.app.redos.pop());
      this.clearCanvas();
      this.repaintHistory();
    }
    this.updateUndoRedoButtonState();
  };

  undo() {
    if (window.app.undos.length) {
      // move the last paint stroke to the redo array
      window.app.redos.push(window.app.undos.pop());
      this.clearCanvas();
      this.repaintHistory();
    }
    this.updateUndoRedoButtonState();
  };

  updateUndoRedoButtonState() {
    document.querySelector('.undo').classList.toggle(
      'disabled', !window.app.undos.length);

    document.querySelector('.redo').classList.toggle(
      'disabled', !window.app.redos.length);
  }
}

customElements.define('draw-canvas', DrawCanvas);
