(function() {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.template = function() {
    return `
       <div class="range-holder">
        <div class="horizontal-range">
          <div class="thumb"></div>
        </div>
      </div>
    `;
  };

  proto.render = function() {
    this.innerHTML = this.template();
  };

  proto._setThumbPosition = function(x) {
    // Recenter the slider knob.
    this.querySelector('.thumb').style.transform = `translateX(${x - 15}px)`;
  }

  proto.setThumbFromPreview = function(size) {
    // update the slider knob when emoji is scaled with pinch/unpinch
    let percent = (size - window.app.brushSize.min) / (window.app.brushSize.max - window.app.brushSize.min);
    percent = (percent + 0.1) * percent - 0.1;
    let x = (percent * this.rangeWidth);
    let sliderX = Math.min(Math.max(x, 0), this.rangeWidth);
    this._setThumbPosition(sliderX);
  }

  proto.onTap = function(e) {
    // have to change from layerX to clientX or pageX or offsetX in the panel slide layout
    // MDN suggests caution w/ layerX:
    // https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/layerX
    let touchX = e.touches ? e.touches[0].pageX : e.offsetX;

    // Prevent the slider from going off the left or right of the screen.
    let sliderX = Math.min(Math.max(touchX, 0), this.rangeWidth);

    this._setThumbPosition(sliderX);

    // Finally set the value by passing a value between 0 and 1.
    this.updateValue(touchX / this.innerWidth);
  };

  proto.updateValue = function(percent) {
    // Clamp btw 1 and 0.1
    percent = Math.min(1, Math.max(0.1, percent));

    let newSize = (window.app.brushSize.max - window.app.brushSize.min) * percent + window.app.brushSize.min;

    this.dispatchEvent(new CustomEvent('brush-change', {
      bubbles: true,
      detail: {
        brushSize: newSize,
      }
    }));
  };

  proto.attachedCallback = function() {
    this.render();

    // Cache the range width so we do not need to requery the val.
    this.rangeWidth = this.querySelector(
        '.horizontal-range').getBoundingClientRect().width;

    this.innerWidth = this.getBoundingClientRect().width;

    // When attached set the correct position of the thumb.
    this._setThumbPosition(window.app.getBrushSizePercent() * this.rangeWidth);

    // Sniff if this is a touch device.
    let eventName =  'ontouchstart' in window ? 'touchstart': 'click';

    this.addEventListener(eventName, this.onTap.bind(this));
    this.addEventListener('touchmove', this.onTap.bind(this));
  };

  document.registerElement('size-picker', {
    prototype: proto,
  });
})();
