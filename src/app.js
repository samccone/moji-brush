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
      max: 205,
      val: 84,
    },
  };

  let drawCanvas = document.querySelector('draw-canvas');

  document.body.addEventListener('menu-action', handlePageAction);
  document.body.addEventListener('brush-change', handleBrushChange);
  document.body.addEventListener('size-change', showBrushPreview);

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

  function showBrushPreview() {
    // make preview temporarily visible
    document.body.classList.add('size-picker-select');
    // update size of preview to reflect selection
    let preview = document.getElementById('preview');
    // apply brush size
    let size = window.app.brushSize.val / window.devicePixelRatio;
    preview.style.font = `${size}px Arial`;
    // preview the brush
    preview.innerText = String.fromCodePoint(window.app.activeBrush);
    // remove preview visibility after 1500ms
    setTimeout(function(){
      document.body.classList.remove('size-picker-select');
    }, 1500);
  }

  function handleBrushChange(e) {
    window.app.activeBrush = e.detail;
    showBrushPreview();
    // closeAllMenus();
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
