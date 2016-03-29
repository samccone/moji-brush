(function() {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.attachedCallback = function() {
    let ul = document.createElement('ul');
    let size = 50;
    let emojiKeys = Object.keys(emojiMap);
    let width = Math.floor(window.innerWidth / size);
    let rows = 8;
    let emojisPerChunk = (width * rows);
    let emojiRows = Math.floor(emojiKeys.length / emojisPerChunk);


    for(var i = 0; i < emojiRows; ++i) {
      let canvas = document.createElement('canvas');
      let li = document.createElement('li');

      canvas.setAttribute('width', window.innerWidth + 'px');
      canvas.setAttribute('height', `${size * rows}px`);
      let ctx = canvas.getContext('2d');
      ctx.font = `${size}px Arial`

      for (var y = 0; y < rows; ++y) {
        for(var x = 0; x < width; ++x) {
          try {
            ctx.fillText(
              String.fromCodePoint(emojiMap[emojiKeys[
                (i * emojisPerChunk) + (y * width) + x
              ]]), x * size, size * (y + 1));
          } catch (e) {
          }
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
