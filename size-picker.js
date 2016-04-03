(function() {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.template = function() {
    return `
       <div>
        <input class="brush-size-range" type="range" vertical class="brush-size">
        <div class="brush-size-preview"></div>
       </div>
    `
  };

  proto.render = function() {
    this.innerHTML = this.template();
  };

  proto.attachedCallback = function() {
    this.render();
  };

  document.registerElement('size-picker', {
    prototype: proto,
  });
})();
