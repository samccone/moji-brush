(function() {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  var emojiMap = {
    'apple': '0x1F34E',
    'goat': '0x1F410',
    'orange': '0x1F34A',
    'koala': '0x1F428',
  };

  proto.createdCallback = function() {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', this.getAttribute('size') + 'px');
    canvas.setAttribute('height', this.getAttribute('size') + 'px');

    this.ctx = canvas.getContext('2d');
    this.ctx.font = "40px Arial"
    this.appendChild(canvas);
  };

  proto.getCodePoint = function() {
    return emojiMap[this.getAttribute('emoji')];
  },

  proto.attachedCallback = function() {
    this.ctx.fillText(
      String.fromCodePoint(this.getCodePoint()), 0, 40);
  };

  document.registerElement('emoji-print', {
    prototype: proto,
  });
})();
