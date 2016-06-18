'use strict';

(function () {
  'use strict';

  var prototype = Object.create(HTMLElement.prototype);

  prototype.template = function () {
    return '<div id="preview">\n              <img id="preview-content"></img>\n            </div>';
  };

  prototype.render = function () {
    this.innerHTML = this.template();
  };

  prototype.attachedCallback = function () {
    this.render();
  };

  prototype._updateBrushSize = function (percent) {
    this.querySelector('#preview-content').style.transform = 'scale(' + percent + ')';
  };

  prototype._updateBrushImage = function (imgPath) {
    this.querySelector('#preview-content').src = imgPath;
  };

  prototype.updatePreviewState = function (size, imgPath) {
    this._size = size;
    this._imgPath = imgPath;
    this.throttledRender();
  };

  prototype.throttledRender = function () {
    var _this = this;

    if (this._throttleId !== undefined) {
      return;
    }

    this._throttleId = setTimeout(function (_) {
      _this._updateBrushImage(_this._imgPath);
      _this._updateBrushSize(_this._size);
      _this._throttleId = undefined;
    }, 16.66);
  };

  prototype.show = function () {
    this.classList.add('visible');
    this.style.visibility = 'visible';
  };

  prototype.hide = function () {
    this.classList.remove('visible');
    this.style.visibility = 'hidden';
  };

  document.registerElement('brush-preview', {
    prototype: prototype
  });
})();