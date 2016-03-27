(function() {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.attachedCallback = function() {
    let ul = document.createElement('ul');
    let emojiKeys = Object.keys(emojiMap);
    let width = Math.floor(window.innerWidth / 50);
    let emojiRows = Math.floor(emojiKeys.length / width);

    for(var i = 0; i < emojiRows; ++i) {
      let canvas = document.createElement('canvas');
      let li = document.createElement('li');

      canvas.setAttribute('width', window.innerWidth + 'px');
      canvas.setAttribute('height', '50px');
      let ctx = canvas.getContext('2d');
      ctx.font = '50px Arial'

      for(var j = 0; j < width; ++j) {
        try {
          ctx.fillText(
            String.fromCodePoint(emojiMap[emojiKeys[
              (i * width) + j
            ]]), j * 50, (50));
        } catch (e) {
        }
      }

      li.appendChild(canvas);
      ul.appendChild(li);
    }

    this.appendChild(ul);
  };

  document.registerElement('brush-picker', {
    prototype: proto,
  });
})();
