(function() {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.choices = {
    // Red
    '#F44336': 'red-apple',
    // Green
    '#4CAF50': 'frog-face',
    // Blue
    '#2196F3': 'splashing-sweat-symbol',
    // Yellow
    '#FFEB3B': 'baby-chick',
    // Purple
    '#9C27B0': 'grapes',
    // Orange
    '#FF9800': 'sunset-over-buildings',
    // Brown
    '#795548': 'pile-of-poo',
    // Grey
    '#9E9E9E': 'skull',
    // Black
    '#212121': 'new-moon-with-face',
    // White
    '#F5F5F5': 'volleyball'
  };

  proto.template = _ => {
    return `
      <div class="brush-picker">
        <ul class="tabs">
          <li class="tab active">Colors</li>
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

    let gridX = Math.floor(x / (colorPicker.width / pixelR) / (1 / columns));
    let gridY = Math.floor(y / (colorPicker.height / pixelR) / (1 / rows));

    this.dispatchEvent(new CustomEvent('brush-change', {
      bubbles: true,
      detail: emojiMap[
        this.choices[
          Object.keys(this.choices)[gridX + (gridY * columns)]]]
    }));
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
    let innerHeight = Math.floor(paneContent.getBoundingClientRect().height);
    let innerWidth = Math.floor(paneContent.getBoundingClientRect().width);
    let pixelR = window.devicePixelRatio;
    // TODO: update innerWidth on window resize (also need to update draw-canvas)
    canvas.setAttribute('width', (innerWidth * pixelR) + 'px');
    canvas.setAttribute('height', (innerHeight * pixelR) + 'px');
    canvas.style.width =  innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';

    let ctx = canvas.getContext('2d');

    paneContent.innerHTML = '';
    paneContent.appendChild(canvas);
    let colorWidth = (innerWidth * pixelR) / Object.keys(this.choices).length;

    Object.keys(this.choices).forEach((v, i, arr) => {
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
