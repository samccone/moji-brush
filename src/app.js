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
      val: 82.5,
    },
    getBrushSizePercent: function() {
      return (this.brushSize.val / (this.brushSize.max - this.brushSize.min));
    },
  };

  let drawCanvas = document.querySelector('draw-canvas');
  let brushChangeTimeoutId;
  let brushPreview = document.getElementById('preview-content');

  document.body.addEventListener('menu-action', handlePageAction);
  document.body.addEventListener('brush-change', handleBrushChange);
  document.body.addEventListener('size-change', handleBrushSizeChange);


  // Init the preview content to
  brushPreview.style.fontSize = `${window.app.brushSize.max / window.devicePixelRatio}px`;
  brushPreview.style.transform = `scale(${window.app.getBrushSizePercent()})`;

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
    // Apply brush size.
    brushPreview.style.transform = `scale(${window.app.getBrushSizePercent()})`;

    // Preview the brush.
    brushPreview.innerText = String.fromCodePoint(window.app.activeBrush);

    // Reset the preview change timeout value.
    brushChangeTimeoutId = undefined;
  }

  function throttledPreviewUpdate() {
    // Throttle this to never fire more than once per frame :).
    if (brushChangeTimeoutId === undefined) {
      brushChangeTimeoutId = setTimeout(function() {
        requestAnimationFrame(showBrushPreview);
      }, 16.66);
    }
  }

  function handleBrushSizeChange() {
    // make preview visible
    if (!document.body.classList.contains('size-picker-select')) {
      document.body.classList.add('size-picker-select');
    }

    throttledPreviewUpdate();
  }

  function handleBrushChange(e) {
    window.app.activeBrush = e.detail;

    // make preview visible
    if (!document.body.classList.contains('size-picker-select')) {
      document.body.classList.add('size-picker-select');
    }

    throttledPreviewUpdate();
  }

  function closeAllMenus() {
    ['brush-picker-open',
    'size-picker-open',
    'dashboard-open',
    'menu-open',].forEach(v => {
      document.body.classList.remove(v);
    });
    document.body.classList.remove('size-picker-select');

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
