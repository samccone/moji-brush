(function() {
  'use strict';

  var prototype = Object.create(HTMLElement.prototype);

  prototype.template = () => {
    return `<div id="preview">
              <img id="preview-content"></img>
            </div>`
  };

  prototype.render = function() { this.innerHTML = this.template(); };

  prototype.attachedCallback = function() {
    this.render();
    const preview = this.querySelector('#preview');
    preview.addEventListener('touchstart', this.onTouchStart.bind(this));
    preview.addEventListener('touchmove', this.onTouch.bind(this));
    preview.addEventListener('touchend', this.onTouchEnd.bind(this));
  };

  prototype._updateBrushGeometry = function(percent, rad) {
    this.querySelector('#preview-content').style.transform =
        `scale(${percent}) rotate(${rad}rad)`;
  };

  prototype.updateValue = function(percent, rad) {
    let newSize =
        (window.app.brushSize.max - window.app.brushSize.min) * percent +
        window.app.brushSize.min;

    this.dispatchEvent(new CustomEvent('brush-change', {
      bubbles : true,
      detail : {
        fromMultiTouch : true,
        brushSize : newSize,
        brushRotation : rad,
      }
    }));
  };

  prototype._updateBrushImage = function(imgPath) {
    this.querySelector('#preview-content').src = imgPath;
  };

  prototype.updatePreviewState = function(size, rad = 0,
                                          imgPath = this._imgPath) {
    this._size = size;
    this._rad = rad;
    this._imgPath = imgPath;
    this.throttledRender();
  };

  prototype.throttledRender = function() {
    if (this._throttleId !== undefined) {
      return;
    }

    this._throttleId = setTimeout(_ => {
      this._updateBrushImage(this._imgPath);
      this._updateBrushGeometry(this._size, this._rad);
      this._throttleId = undefined;

    }, 16.66);

  };

  prototype.show = function() {
    this.classList.add('visible');
    this.style.visibility = 'visible';
  };

  prototype.hide = function() {
    this.classList.remove('visible');
    this.style.visibility = 'hidden'
  };

  prototype.prevTouches = [];

  prototype.onTouchStart = function(e) {
    if (e.touches.length === 2) {
      this.gesture = true;
      let dX = e.touches[1].clientX - e.touches[0].clientX;
      let dY = e.touches[1].clientY - e.touches[0].clientY;
      this.gestureStartDistance = Math.sqrt(dX * dX + dY * dY);
      this.gestureStartAngle = Math.atan2(dY, dX);
    }
  };

  prototype.onTouch = function(e) {
    e.preventDefault();
    // if it's a two-element (finger) event
    if (this.gesture && e.touches.length === 2) {

      let dX = e.touches[1].clientX - e.touches[0].clientX;
      let dY = e.touches[1].clientY - e.touches[0].clientY;
      let gestureDistance = Math.sqrt(dX * dX + dY * dY);
      let gestureAngle = Math.atan2(dY, dX);
      // set scaleChange intial value to the current scale
      let scaleChange =
          this._size * gestureDistance / this.gestureStartDistance;
      let angleChange = gestureAngle - this.gestureStartAngle;
      this._rad += angleChange;
      // prevent this._rad from stacking to a huge number for the rotation
      // obsessed user
      if (this._rad >= 2 * Math.PI || this._rad <= -2 * Math.PI) {
        this._rad = 0;
      }

      let size = Math.min(1, Math.max(0.1, scaleChange));

      this.updatePreviewState(size, this._rad);
      this.updateValue(size, this._rad);
    }
  };

  prototype.onTouchEnd = function(e) { this.gesture = false; }

                         document.registerElement('brush-preview', {
                           prototype,
                         });
})();
