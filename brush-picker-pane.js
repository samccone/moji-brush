"use strict";

(function () {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.choices = {
    "#F5F5F5": "white",
    "#ffff02": "yellow",
    "#ff6600": "orange",
    "#dd0000": "red",
    "#ff0199": "pink",
    "#330099": "indigo",
    "#0002cc": "blue",
    "#0099ff": "blue-light",
    "#00aa00": "green-light",
    "#006600": "green-dark",
    "#663300": "brown-dark",
    "#996633": "brown-light",
    "#bbbbbb": "grey-light",
    "#888888": "grey-medium",
    "#444444": "grey-dark",
    "#000000": "black"
  };

  proto.template = function (_) {
    return "\n      <div class='brush-picker'>\n        <div class='pane-content'>\n        </div>\n      </div>\n    ";
  };

  proto.setEvents = function () {
    this.addEventListener('click', this.onClick.bind(this));
  };

  proto.onClick = function (e) {
    var node = e.target;

    while (node.tagName !== 'BRUSH-PICKER-PANE') {
      if (node.classList.contains('color-picker')) {
        this.onColorClick(e);
        break;
      }

      node = node.parentNode;
    }
  };

  proto.onColorClick = function (e) {
    // have to change from layerX to clientX or pageX or offsetX in the panel slide layout
    // MDN suggests caution w/ layerX:
    // https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/layerX
    this.getColorByXY(e.offsetX, e.offsetY);
  }, proto.getColorByXY = function (x, y) {
    var colorPicker = this.querySelector('.color-picker');
    var columns = 8;
    var rows = 2;
    var pixelR = window.devicePixelRatio;

    var gridX = Math.floor(x / (colorPicker.width / pixelR) / (1 / columns));
    var gridY = Math.floor(y / (colorPicker.height / pixelR) / (1 / rows));

    this.dispatchEvent(new CustomEvent('brush-change', {
      bubbles: true,
      detail: {
        brush: {
          platform: window.app.brush.platform,
          color: this.choices[Object.keys(this.choices)[gridX + gridY * columns]],
          name: emojiMap[window.app.brush.platform][this.choices[Object.keys(this.choices)[gridX + gridY * columns]]][0]
        }
      }
    }));
  }, proto.attachedCallback = function () {
    this.innerHTML = this.template();
    this.renderColorGrid();
    this.setEvents();
  };

  proto.renderColorGrid = function () {
    var canvas = document.createElement('canvas');
    canvas.classList.add('color-picker');
    var paneContent = this.querySelector('.pane-content');
    var innerHeight = Math.floor(paneContent.getBoundingClientRect().height);
    var innerWidth = Math.floor(paneContent.getBoundingClientRect().width);
    var pixelR = window.devicePixelRatio;
    // TODO: update innerWidth on window resize (also need to update draw-canvas)
    canvas.setAttribute('width', innerWidth * pixelR + 'px');
    canvas.setAttribute('height', innerHeight * pixelR + 'px');
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';

    var ctx = canvas.getContext('2d');

    paneContent.innerHTML = '';
    paneContent.appendChild(canvas);
    var colorWidth = innerWidth * pixelR / Object.keys(this.choices).length;

    Object.keys(this.choices).forEach(function (v, i, arr) {
      ctx.fillStyle = v;
      var y = i >= arr.length / 2 ? innerHeight * pixelR / 2 : 0;
      var x = 2 * colorWidth * (i % (arr.length / 2));

      ctx.fillRect(x, y, colorWidth * 2, Math.ceil(innerHeight * pixelR / 2));
    });
  };

  document.registerElement('brush-picker-pane', {
    prototype: proto
  });
})();