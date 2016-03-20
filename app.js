(function() {
  'use strict';

  var canvas = document.createElement('canvas');

  canvas.setAttribute('width', (window.innerWidth * window.devicePixelRatio) + 'px');
  canvas.setAttribute('height', (window.innerHeight * window.devicePixelRatio) + 'px');

  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';

  var ctx = canvas.getContext('2d');

  ctx.font = "90px Arial"
  canvas.addEventListener('touchstart', onTouch);
  canvas.addEventListener('touchmove', onTouch);

  document.body.querySelector(
      '.brush-picker').addEventListener('click', togglePane);

  document.body.appendChild(canvas);

  function togglePane(e) {
    document.querySelector(
        '.brush-pane').classList.toggle('active');
  }

  function onTouch(e) {
    let i = 0;

    while (i < e.touches.length) {
      let touch = e.touches[i];

      ctx.fillText('\ud83d\udc28',
          touch.clientX * window.devicePixelRatio,
          touch.clientY * window.devicePixelRatio);
      ++i;
    }

    e.preventDefault();
  }
})();
