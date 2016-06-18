(function() {
  'use strict';

  var prototype = Object.create(HTMLElement.prototype);

  prototype.template = () => {
    return `<div id="preview">
              <img id="preview-content"></img>
            </div>`
  };

  prototype.render = function() {
    this.innerHTML = this.template();
  };

  prototype.attachedCallback = function() {
    this.render();
  };

  prototype._updateBrushSize = function(percent) {
    this.querySelector(
        '#preview-content').style.transform = `scale(${percent})`;
  };

  prototype._updateBrushImage = function(imgPath) {
    this.querySelector('#preview-content').src = imgPath;
  };

  prototype.updatePreviewState = function(size, imgPath) {
    this._size = size;
    this._imgPath = imgPath;
    this.throttledRender();
  };

  prototype.throttledRender = function() {
    if (this._throttleId !== undefined) {
      return;
    }

    this._throttleId = setTimeout(_ => {
      this._updateBrushImage(this._imgPath);
      this._updateBrushSize(this._size);
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

  document.registerElement('brush-preview', {
    prototype,
  });
})();
