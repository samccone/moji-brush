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
      min: 40,
      max: 245,
      val: 84,
    },
  };

  let drawCanvas = document.querySelector('draw-canvas');

  document.body.addEventListener('menu-action', handlePageAction);
  document.body.addEventListener('brush-change', handleBrushChange);

  function handlePageAction(e) {
    switch (e.detail) {
      case 'dashboard-menu':
        onFooterMenuClick('dashboard-open', 0);
        break;
      case 'brush-pick':
        onFooterMenuClick('brush-picker-open', 2);
        break;
      case 'size':
        onFooterMenuClick('size-picker-open', 1);
        break;
      case 'reset':
        drawCanvas.clearCanvas();
        closeAllMenus();
        break;
      case 'overlay-close':
        closeAllMenus();
        break;
      default:
        console.warn(`unhanded detail, ${e.detail}`);
    }
  };

  function handleBrushChange(e) {
    window.app.activeBrush = e.detail;
    closeAllMenus();
  }

  function closeAllMenus() {
    ['brush-picker-open',
    'size-picker-open',
    'dashboard-open',
    'menu-open',].forEach(v => {
      document.body.classList.remove(v);
    });
  }

  function onFooterMenuClick(klass, index) {
    let paneAlreadyOpen = document.body.classList.contains(klass);
    let x = index * -100;
    if (document.body.classList.contains('menu-open')) {
      closeAllMenus();
    }

    if (!paneAlreadyOpen) {
      document.body.classList.add('menu-open');
      document.body.classList.add(klass);
      document.getElementById('pane-slider').style.transform = `translateX(${x}%)`;
    }
  }
})();
