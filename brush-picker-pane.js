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

  proto.emojiColorChoices = [
    '0x1F34E',
    '0x1F438',
    '0x1F4A6',
    '0x1F424',
    '0x1F346',
    '0x1F307',
    '0x1F4A9',
    '0x1F480',
    '0x1F31A',
    '0x1F3D0',
  ];

  proto.template = _ => {
    return `
      <div class="brush-picker">
        <ul class="tabs">
          <li class="tab active">Colors</li>
          <li class='tab">All</li>
        </ul>
        <div class="pane-content">
          <div class="colors"></div>
          <div class="all"></div>
        </div>
      </div>
    `;
  };

  proto.setEvents = function() {
    this.addEventListener('click', this.onClick.bind(this));
  };

  proto.onClick = function(e) {
    let node = e.target;

    while (node.tagName !== 'BRUSH-PICKER-PANE') {
      if (node.classList.contains('color-picker')) {
        this.onColorClick(e);
        break;
      }

      node = node.parentNode;
    }
  };

  proto.onColorClick = function(e) {
    this.getColorByXY(e.layerX, e.layerY);
  },


  proto.getColorByXY = function(x, y) {
    let colorPicker = this.querySelector('.color-picker');
    let columns = 5;
    let rows = 2;
    let pixelR = window.devicePixelRatio;

    let gridX = Math.floor(x / (colorPicker.width * pixelR) / (1 / columns));
    let gridY = Math.floor(y / (colorPicker.height * pixelR) / (1 / rows));

    this.dispatchEvent(new CustomEvent('brush-change', {
      bubbles: true,
      detail: this.emojiColorChoices[gridX + (gridY * columns)]}));
  },

  proto.attachedCallback = function() {
    this.innerHTML = this.template();
    this.renderColorGrid();
    this.setEvents();
  };

  proto.renderColorGrid = function() {
    let canvas = document.createElement('canvas');
    canvas.classList.add('color-picker');
    let paneContent = this.querySelector('.pane-content');
    // 45px is the size of the footerbar
    let innerHeight = Math.floor(paneContent.getBoundingClientRect().height - 45);
    let pixelR = window.devicePixelRatio;

    canvas.setAttribute('width', (window.innerWidth * pixelR) + 'px');
    canvas.setAttribute('height', (innerHeight * pixelR) + 'px');
    canvas.style.width =  window.innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';

    let ctx = canvas.getContext('2d');

    paneContent.innerHTML = '';
    paneContent.appendChild(canvas);
    let colorWidth = (window.innerWidth * pixelR) / this.colorChoices.length;

    this.colorChoices.forEach((v, i, arr) => {
      ctx.fillStyle = v;
      let y = i >= arr.length / 2 ? (innerHeight * pixelR) / 2 : 0;
      let x = (2 * colorWidth) * (i % (arr.length / 2));

      ctx.fillRect(x, y, colorWidth * 2, Math.ceil((innerHeight * pixelR) / 2));
    });
  };

  document.registerElement('brush-picker-pane', {
    prototype: proto,
  });
})();
