const TOUCH_ANGLE_MULTIPLIER = 1.7;

class BrushPreview extends HTMLElement {

  constructor() {
    super();
    this.prevTouches = [];
  }

  template() {
    return `<div id="preview">
              <img id="preview-content"></img>
            </div>`
  };

  render() {
    this.innerHTML = this.template();
  };

  connectedCallback() {
    this.render();
    this._currentRotation = 0;
    const preview = this.querySelector('#preview');
    preview.addEventListener('touchstart', this.onTouchStart.bind(this));
    preview.addEventListener('touchmove', this.onTouch.bind(this));
    preview.addEventListener('touchend', this.onTouchEnd.bind(this));
  };

  _updateBrushGeometry(percent, rad) {
    this.querySelector('#preview-content').style.transform =
      `scale(${percent}) rotate(${rad}rad)`;
  };

  updateValue(percent, rad) {
    let newSize =
      (window.app.brushSize.max - window.app.brushSize.min) * percent +
      window.app.brushSize.min;

    this.dispatchEvent(new CustomEvent('brush-change', {
      bubbles: true,
      detail: {
        fromMultiTouch: true,
        brushSize: newSize,
        brushRotation: rad,
      }
    }));
  };

  _updateBrushImage(imgPath) {
    this.querySelector('#preview-content').src = imgPath;
  };

  updatePreviewState(
    size, rad = 0, imgPath = this._imgPath) {
    this._size = size;
    this._rad = rad;
    this._imgPath = imgPath;
    this.throttledRender();
  };

  throttledRender() {
    if (this._throttleId !== undefined) {
      return;
    }

    this._throttleId = setTimeout(_ => {
      this._updateBrushImage(this._imgPath);
      this._updateBrushGeometry(this._size, this._rad);
      this._throttleId = undefined;

    }, 16.66);

  };

  show() {
    this.classList.add('visible');
    this.style.visibility = 'visible';
  };

  hide() {
    this.classList.remove('visible');
    this.style.visibility = 'hidden'
  };

  onTouchStart(e) {
    if (e.touches.length === 2) {
      this.gesture = true;
      let dX = e.touches[1].clientX - e.touches[0].clientX;
      let dY = e.touches[1].clientY - e.touches[0].clientY;
      this.gestureStartDistance = Math.sqrt(dX * dX + dY * dY);
      this.gestureStartAngle = Math.atan2(dY, dX) * TOUCH_ANGLE_MULTIPLIER;
    }
  };

  onTouch(e) {
    e.preventDefault();
    // if it's a two-element (finger) event
    if (this.gesture && e.touches.length === 2) {
      let dX = e.touches[1].clientX - e.touches[0].clientX;
      let dY = e.touches[1].clientY - e.touches[0].clientY;
      let gestureAngle = Math.atan2(dY, dX) * TOUCH_ANGLE_MULTIPLIER;
      let angleChange = gestureAngle - this.gestureStartAngle;
      this._rad = this._currentRotation + angleChange;

      this.updatePreviewState(this._size, this._rad);
      this.updateValue(this._size, this._rad);
    }
  };

  onTouchEnd(e) {
    this.gesture = false;
    this._currentRotation = this._rad;
  };
}

customElements.define('brush-preview', BrushPreview);
