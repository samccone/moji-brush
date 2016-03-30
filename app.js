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

  window.app = {
    activeBrush: '0x1F428',
    brushSize: {
      min: 1,
      max: 168,
      val: 84,
    },
  };

  let drawCanvas = document.querySelector('draw-canvas');

  document.body.querySelector('menu-bar').addEventListener('menu-action', e => {
    switch (e.detail) {
      case 'reset':
        drawCanvas.clearCanvas();
        break;
      default:
        console.warn(`unhanded detail, ${e.detail}`);
    }
    document.body.classList.remove('menu-open');
  });

  document.body.querySelector('.brush-picker').addEventListener('click', toggleMenu);

  function toggleMenu(e) {
    document.body.classList.toggle('menu-open');
  }

  function updateBrushSize(e) {
    let val = parseInt(e.currentTarget.value, 10);

    app.brushSize.val = (app.brushSize.max - app.brushSize.min) * val/100;
    ctx.font = `${app.brushSize.val}px Arial`
  }
})();
