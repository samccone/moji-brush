(function() {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.attachedCallback = function() {
    let pickerContainer = document.createElement('div');
    let emojiKeys = Object.keys(emojiMap);

    for (let key in emojiMap) {
      let span = document.createElement('span');
      span.innerText = String.fromCodePoint(emojiMap[key]);

      pickerContainer.appendChild(span);
    }

    this.appendChild(pickerContainer);
  };

  document.registerElement('brush-picker', {
    prototype: proto,
  });
})();
