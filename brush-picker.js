(function() {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.createdCallback = function() {
    let ul = document.createElement('ul');

    for(let i =0; i < 10; ++i) {
      for(let emoji in emojiMap) {
        let li = document.createElement('li');
        li.innerHTML = `<emoji-print size="50" emoji="${emoji}"></emoji-print>`
        ul.appendChild(li);
      }
    }

    this.appendChild(ul);
  };

  document.registerElement('brush-picker', {
    prototype: proto,
  });
})();
