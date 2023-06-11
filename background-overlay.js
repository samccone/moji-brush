class BackgroundOverlay extends HTMLElement {
  constructor() {
    super()
  }

  template() { return `<div class="overlay" action="overlay-close"></div>`; };

  connectedCallback() {
    let eventName = 'ontouchstart' in window ? 'touchstart' : 'click';
    this.innerHTML = this.template();

    this.addEventListener(eventName, this.onOverlayClick);
  };

  onOverlayClick(e) {
    // prevent mousedown from firing
    e.preventDefault();
    var node = e.target;

    this.dispatchEvent(new CustomEvent(
      'menu-action', { bubbles: true, detail: node.getAttribute('action') }));

    node = node.parentNode;
  };
}


customElements.define('background-overlay', BackgroundOverlay);
