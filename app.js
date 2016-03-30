(function() {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(_ => {
      console.log('service worker is is all cool 🐳');
    }).catch(e => {
      console.error('service worker is not so cool 🔥', e);
      throw e;
    })
  }

  var app = {
    activeBrush: '0x1F428',
    brushSize: {
      min: 1,
      max: 168,
      val: 84,
    },
  };

  var canvas = document.createElement('canvas');

  canvas.setAttribute('width', (window.innerWidth * window.devicePixelRatio) + 'px');
  canvas.setAttribute('height', (window.innerHeight * window.devicePixelRatio) + 'px');

  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';

  var ctx = canvas.getContext('2d');

  ctx.font = `${app.brushSize.val}px Arial`
  canvas.addEventListener('touchstart', onTouch);
  canvas.addEventListener('touchmove', onTouch);
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);

  document.body.querySelector('menu-bar').addEventListener('menu-action', e => {
    switch (e.detail) {
      case 'reset':
        ctx.clearRect(0, 0, (window.innerWidth * window.devicePixelRatio),
          (window.innerHeight * window.devicePixelRatio));
      break;
      default:
        console.warn(`unhanded detail, ${e.detail}`);
    }
    document.body.classList.remove('menu-open');
  });

  document.body.querySelector('.brush-size').addEventListener('change', updateBrushSize);
  document.body.querySelector('.brush-picker').addEventListener('click', toggleMenu);

  document.body.appendChild(canvas);


  function clearCanvas(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.getAttribute('width'), canvas.getAttribute('width'));
  }

  function toggleMenu(e) {
    document.body.classList.toggle('menu-open');
  }

  function onMouseDown() {
    app.mouseDown = true;
  }

  function onMouseUp() {
    app.mouseDown = false;
  }

  function onMouseMove(e) {
    if (app.mouseDown === true) {
      paintAtPoint(e.clientX, e.clientY);
    }
  }

  function paintAtPoint(x, y) {
    var brushOffset = -app.brushSize.val / 2;

    ctx.fillText(String.fromCodePoint(app.activeBrush),
        x * window.devicePixelRatio + brushOffset,
        y * window.devicePixelRatio - brushOffset);
  }

  function onTouch(e) {
    for(let i = 0; i < e.touches.length; ++i) {
      let touch = e.touches[i];

      paintAtPoint(touch.clientX, touch.clientY);
    }

    e.preventDefault();
  }

  function selectBrush(e) {
    var node = e.target;

    while (node !== e.currentTarget) {
      if (node.tagName === 'EMOJI-PRINT') {
        app.activeBrush = node.getCodePoint();
        break;
      }

      node = node.parentNode;
    }
  }

  function updateBrushSize(e) {
    let val = parseInt(e.currentTarget.value, 10);

    app.brushSize.val = (app.brushSize.max - app.brushSize.min) * val/100;
    ctx.font = `${app.brushSize.val}px Arial`
  }
})();
