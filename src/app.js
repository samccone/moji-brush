(function() {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(_ => {
      console.log('service worker is all cool 🐳');
    }).catch(e => {
      console.error('service worker is not so cool 🔥', e);
      throw e;
    })
  }

  function platformDetect() {
    let agent = navigator.userAgent.toLowerCase();
    let isAndroid = agent.indexOf("android") > -1;
    if (isAndroid) {
      return 'google';
    }
    return 'apple';
  }

  window.app = {
    baseImgPath: './images/emoji',
    brush: {
      platform: platformDetect(),
      color: 'green-dark',
      name: emojiMap[platformDetect()]['green-dark'][0]
    },
    brushSize: {
      min: 40,
      max: 205,
      val: 82.5,
    },
    getBrushSizePercent: function() {
      return (this.brushSize.val / (this.brushSize.max - this.brushSize.min));
    },
    undos: [],
    redos: [],
  };

  let drawCanvas = document.querySelector('draw-canvas');
  let brushChangeTimeoutId;
  let brushPreview = document.getElementById('preview-content');

  // let cacheDefaultEmoji = function() {
  //   for (let color in emojiMap[window.app.platformChoice]) {
  //     window.app[color] = window.app.platformChoice[color][0];
  //     console.log(window.app[color], window.app.platformChoice.color);
  //   }
  // }();

  document.body.addEventListener('menu-action', handlePageAction);
  document.body.addEventListener('brush-change', handleBrushChange);
  document.body.addEventListener('size-change', handleBrushSizeChange);

  // Init the preview content to
  // brushPreview.style.fontSize = `${window.app.brushSize.max / window.devicePixelRatio}px`;
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
      case 'save':
        drawCanvas.download();
        closeAllMenus();
        break;
      case 'reset':
        window.app.undos = [];
        window.app.redos = [];
        drawCanvas.clearCanvas();
        closeAllMenus();
        break;
      case 'overlay-close':
        closeAllMenus();
        break;
      case 'undo':
        drawCanvas.undo();
        break;
      case 'redo':
        drawCanvas.redo();
        break;
      default:
        console.warn(`unhanded detail, ${e.detail}`);
    }
  };

  function showBrushPreview() {
    // Apply brush size.
    brushPreview.style.transform = `scale(${window.app.getBrushSizePercent()})`;

    // Preview the brush.
    // brushPreview.innerText = String.fromCodePoint(window.app.activeBrush);
    let brushPath = window.app.baseImgPath + '/' +
                    window.app.brush.platform + '/' +
                    window.app.brush.color + '/';

    let size = window.app.brushSize.val;
    document.body.querySelector('#preview-content').setAttribute(
      'src',
      brushPath + window.app.brush.name);

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
    window.app.brush = e.detail.brush;
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
    //clear the welcome message on first click


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
