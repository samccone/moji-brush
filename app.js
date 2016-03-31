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

  document.body.addEventListener('menu-action', handlePageAction);

  function handlePageAction(e) {
    switch (e.detail) {
      case 'menu':
        toggleMenu();
        break;
      case 'reset':
        drawCanvas.clearCanvas();
        toggleMenu();
        break;
      default:
        console.warn(`unhanded detail, ${e.detail}`);
    }
  };

  function toggleMenu() {
    document.body.classList.toggle('menu-open');
  }

  function updateBrushSize(e) {
    let val = parseInt(e.currentTarget.value, 10);

    app.brushSize.val = (app.brushSize.max - app.brushSize.min) * val/100;
    ctx.font = `${app.brushSize.val}px Arial`
  }
})();
