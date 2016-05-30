'use strict';

(function () {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.template = function (_) {
    return '\n       <ul>\n        <li action="reset">\n          <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g id="delete"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></g></svg>\n          <span>Reset</span>\n        </li>\n        <li class="disabled" action="save">\n          <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">\n          <g id="save"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></g>\n          </svg>\n          <span>Save</span>\n        </li>\n      </ul>\n      ';
  };

  proto.attachedCallback = function () {
    var eventName = 'ontouchstart' in window ? 'touchstart' : 'click';
    this.innerHTML = this.template();

    this.addEventListener(eventName, this.onMenuClick);
  };

  proto.onMenuClick = function (e) {
    var node = e.target;

    while (node !== undefined && node.tagName !== 'PAGE-MENU') {
      if (node.tagName === 'LI') {
        this.dispatchEvent(new CustomEvent('menu-action', {
          bubbles: true,
          detail: node.getAttribute('action') }));
        break;
      }

      node = node.parentNode;
    }
  };

  document.registerElement('page-menu', {
    prototype: proto
  });
})();