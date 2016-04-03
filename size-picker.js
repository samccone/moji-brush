(function() {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.template = function() {
    return `
       <div>
        <div class="vertical-range">
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
    let y = e.touches ? e.touches[0].pageY : e.layerY

    this.updateValue(y / this.innerHeight);
  };

  proto.updateValue = function(percent) {
    this.querySelector('.thumb').style.top = percent * 100 + '%';
    window.app.brushSize.val = (window.app.brushSize.max - window.app.brushSize.min) * (1 - percent);
  };

  proto.attachedCallback = function() {
    this.render();
    let verticalRange = this.querySelector('.vertical-range');

    let eventName =  'ontouchstart' in window ? 'touchstart': 'click';

    verticalRange.addEventListener(eventName, this.onTap.bind(this));
    verticalRange.addEventListener('touchmove', this.onTap.bind(this));

    this.innerHeight = this.getBoundingClientRect().height;
  };

  document.registerElement('size-picker', {
    prototype: proto,
  });
})();
