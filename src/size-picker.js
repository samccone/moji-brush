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

  proto.onTap = function(e) {
    let minLeft = 0;
    let maxRight = this.querySelector('.horizontal-range').getBoundingClientRect().width;
    // have to change from layerX to clientX or pageX or offsetX in the panel slide layout
    // MDN suggests caution w/ layerX:
    // https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/layerX
    let x = e.touches ? e.touches[0].pageX : e.offsetX;
    // below puts the .thumb element where it is supposed to be
    let leftLoc = x;
    if (x < 0) {leftLoc = minLeft;}
    if (x > maxRight) {leftLoc = maxRight;}
    this.querySelector('.thumb').style.left = leftLoc - 15 + 'px';
    this.updateValue(x / this.innerWidth);
  };

  proto.updateValue = function(percent) {
    // commented line below causes the .thumb to not be in exactly the right place, moved to onTap
    // this.querySelector('.thumb').style.left = percent * 100 + '%';
    // add the min value at the end to get the proper size
    window.app.brushSize.val = (((window.app.brushSize.max - window.app.brushSize.min) * percent) + window.app.brushSize.min);
    this.dispatchEvent(new CustomEvent('size-change', {
      bubbles: true,
      detail: window.app.brushSize.val
    }));
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
