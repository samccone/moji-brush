(function() {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(_ => {
      console.log('service worker is all cool 🐳');
    }).catch(e => {
      console.error('service worker is not so cool 🔥', e);
      throw e;
    });


    if (navigator.serviceWorker.controller) {
      // Correctly prompt the user to reload during SW phase change.
      navigator.serviceWorker.controller.onstatechange = e => {
        if (e.target.state === 'redundant') {
          document.querySelector('#reload-prompt').style.visibility = 'visible';
        }
      }
    }
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
      min: 5,
      max: 200,
    },
    getBrushSizePercent: function(val=window.app.brushSize.val) {
      return (val / (this.brushSize.max - this.brushSize.min));
    },
    undos: [],
    redos: [],
  };

  // Init the starting brush val to be 50%.
  window.app.brushSize.val = (window.app.brushSize.max - window.app.brushSize.min) / 2

  let drawCanvas = document.querySelector('draw-canvas');
  let brushChangeTimeoutId;
  let brushPreview = document.getElementById('preview-content');

  document.body.addEventListener('menu-action', handlePageAction);
  document.body.addEventListener('brush-change', handleBrushChange);
  document.body.addEventListener('size-change', handleBrushSizeChange);

  function handlePageAction(e) {
    switch (e.detail) {
      case 'apple-emoji':
        changePlatform('apple');
        break;
      case 'google-emoji':
        changePlatform('google');
        break;
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
        if (!window.confirm('All progress will be lost, are you sure?')) {
          return;
        }

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

  function changePlatform(platform) {
    window.app.brush.platform = platform;
    document.getElementById('apple').classList.toggle('active', platform =='apple');
    document.getElementById('google').classList.toggle('active', platform =='google');
    window.app.brush.name = emojiMap[platform][window.app.brush.color][0];
  }

  function showBrushPreview() {
    // Apply brush size.
    brushPreview.style.transform = `scale(${window.app.getBrushSizePercent()})`;

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
