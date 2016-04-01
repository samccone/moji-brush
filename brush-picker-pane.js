(function() {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.colorChoices = [
    '#F44336',
    '#4CAF50',
    '#2196F3',
    '#FFEB3B',
    '#9C27B0',
    '#FF9800',
    '#795548',
    '#9E9E9E',
    '#212121',
    '#F5F5F5',
  ];

  proto.template = _ => {
    return `
      <div class="brush-picker">
        <ul class="tabs">
          <li class="active">Colors</li>
          <li>All</li>
        </ul>
        <div class="pane-content">
          <div class="colors"></div>
          <div class="all"></div>
        </div>
      </div>
    `;
  };

  proto.attachedCallback = function() {
    this.innerHTML = this.template();
    this.renderColorGrid();
  };

  proto.renderColorGrid = function() {
    let canvas = document.createElement('canvas');
    let paneContent = this.querySelector('.pane-content');
    // 45px is the size of the footerbar
    let innerHeight = Math.floor(paneContent.getBoundingClientRect().height - 45);

    canvas.setAttribute('width', window.innerWidth + 'px');
    canvas.setAttribute('height', innerHeight + 'px');

    let ctx = canvas.getContext('2d');

    paneContent.innerHTML = '';
    paneContent.appendChild(canvas);
    let colorWidth = window.innerWidth / this.colorChoices.length;

    this.colorChoices.forEach((v, i, arr) => {
      ctx.fillStyle = v;
      let y = i >= arr.length / 2 ? innerHeight / 2 : 0;
      let x = (2 * colorWidth) * (i % (arr.length / 2));

      ctx.fillRect(x, y, colorWidth * 2, innerHeight / 2);
    });
  };

  document.registerElement('brush-picker-pane', {
    prototype: proto,
  });
})();
