(function() {
  'use strict';

  var app = {
    activeBrush: '0x1F428',
  };

  var canvas = document.createElement('canvas');

  canvas.setAttribute('width', (window.innerWidth * window.devicePixelRatio) + 'px');
  canvas.setAttribute('height', (window.innerHeight * window.devicePixelRatio) + 'px');

  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';

  var ctx = canvas.getContext('2d');

  ctx.font = "90px Arial"
  canvas.addEventListener('touchstart', onTouch);
  canvas.addEventListener('touchmove', onTouch);

  document.body.querySelector('.brush-picker').addEventListener('click', togglePane);

  document.body.appendChild(canvas);

  document.body.querySelector('.brushes').addEventListener('click', selectBrush);

  function togglePane(e) {
    document.querySelector(
      '.brush-pane').classList.toggle('active');
  }

  function onTouch(e) {
    for(let i = 0; i < e.touches.length; ++i) {
      let touch = e.touches[i];

      ctx.fillText(String.fromCodePoint(app.activeBrush),
                   touch.clientX * window.devicePixelRatio,
                   touch.clientY * window.devicePixelRatio);
    }

    e.preventDefault();
  }

  function selectBrush(e) {
    var node = e.target;

    while (node !== e.currentTarget) {
      if (node.tagName === 'EMOJI-PRINT') {
        app.activeBrush = node.getCodePoint();
        togglePane();
        break;
      }

      node = node.parentNode;
    }
  }
})();
