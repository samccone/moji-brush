(function() {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.template = function() {
    return `
       <div>
        <div class="horizontal-range">
          <div class="thumb"></div>
        </div>
        <div class="brush-size-preview"></div>
       </div>
    `
  };

  proto.render = function() {
    this.innerHTML = this.template();
  };

  proto.onTap = function(e) {
    let x = e.touches ? e.touches[0].pageX : e.layerX
    this.updateValue(x / this.innerWidth);
  };

  proto.updateValue = function(percent) {
    this.querySelector('.thumb').style.left = percent * 100 + '%';
    window.app.brushSize.val = (window.app.brushSize.max - window.app.brushSize.min) * (percent);
  };

  proto.attachedCallback = function() {
    this.render();
    let horizontalRange = this.querySelector('.horizontal-range');

    let eventName =  'ontouchstart' in window ? 'touchstart': 'click';

    horizontalRange.addEventListener(eventName, this.onTap.bind(this));
    horizontalRange.addEventListener('touchmove', this.onTap.bind(this));

    this.innerWidth = this.getBoundingClientRect().width;
  };

  document.registerElement('size-picker', {
    prototype: proto,
  });
})();
