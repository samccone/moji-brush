'use strict';

(function () {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.template = function (_) {
    return '<div class="overlay" action="overlay-close"></div>';
  };

  proto.attachedCallback = function () {
    var eventName = 'ontouchstart' in window ? 'touchstart' : 'click';
    this.innerHTML = this.template();

    this.addEventListener(eventName, this.onOverlayClick);
  };

  proto.onOverlayClick = function (e) {
    // prevent mousedown from firing
    e.preventDefault();
    var node = e.target;

    this.dispatchEvent(new CustomEvent('menu-action', {
      bubbles: true,
      detail: node.getAttribute('action') }));

    node = node.parentNode;
  };

  document.registerElement('background-overlay', {
    prototype: proto
  });
})();