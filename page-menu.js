(function() {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.template = _ => {
     return `
       <ul>
        <li action="reset">
          <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g id="delete"><path fill="#e6e6e6" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></g></svg>
          <span>Reset</span>
        </li>
      </ul>`;
  };

  proto.attachedCallback = function() {
    let eventName = 'ontouchstart' in window ? 'touchstart': 'click';
    this.innerHTML = this.template();

    this.addEventListener(eventName, this.onMenuClick);
  };

  proto.onMenuClick = function(e) {
    var node = e.target;

    while(node !== undefined && node.tagName !== 'PAGE-MENU') {
      if (node.tagName === 'LI') {
        this.dispatchEvent(new CustomEvent('menu-action', {
          bubbles: true,
          detail: node.getAttribute('action')}));
        break;
      }

      node = node.parentNode;
    }
  };

  document.registerElement('page-menu', {
    prototype: proto,
  });
})();
