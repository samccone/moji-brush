(function() {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.onMenuClick = function(e) {
    if (e.target.tagName === 'LI') {
      this.dispatchEvent(new CustomEvent('menu-action', {
        detail: e.target.getAttribute('action')}));
    }
  },

  proto.attachedCallback = function() {
    this.innerHTML = `
      <ul>
        <li action="brush">brush</li>
        <li action="size">size</li>
        <li action="save">save</li>
        <li action="reset">reset</li>
      </ul>`;


    this.addEventListener('click', this.onMenuClick);
  };

  document.registerElement('menu-bar', {
    prototype: proto,
  });
})();

