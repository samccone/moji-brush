(function() {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.template = _ => {
     return `<ul class="menu-items">
        <li class="open-menu" action="large-menu">
          <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g id="dashboard"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></g></svg>
        </li>
        <li class="size" action="size">
          <svg viewBox="0 0 24 24">
          <path d="M6.07,14.33a3.5,3.5,0,0,0-3.5,3.5A2.37,2.37,0,0,1,.23,20.17,6,6,0,0,0,4.9,22.5a4.67,4.67,0,0,0,4.67-4.67A3.5,3.5,0,0,0,6.07,14.33Zm16-10.93L20.5,1.84a1.16,1.16,0,0,0-1.64,0L8.4,12.29l3.21,3.21L22.06,5A1.16,1.16,0,0,0,22.06,3.4Z" />
          <path d="M16.3,18.89a1.56,1.56,0,0,0-1.56,1.56,1.05,1.05,0,0,1-1,1,2.69,2.69,0,0,0,2.08,1,2.08,2.08,0,0,0,2.08-2.08A1.56,1.56,0,0,0,16.3,18.89ZM23.43,14l-0.7-.7a0.52,0.52,0,0,0-.73,0L17.34,18l1.43,1.43,4.66-4.66A0.52,0.52,0,0,0,23.43,14Z" />
          </svg>
        </li>
        <li class="brush" action="brush-pick">
          <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g id="palette"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></g>
          </svg>
        </li>
        <li class="undo disabled" action="undo">
          <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"></path></g></svg>
        </li>
        <li class="redo disabled" action="redo">
          <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"></path></g></svg>
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

    while(node !== undefined && node.tagName !== 'FOOTER-MENU') {
      if (node.tagName === 'LI') {
        this.dispatchEvent(new CustomEvent('menu-action', {
          bubbles: true,
          detail: node.getAttribute('action')}));
        break;
      }

      node = node.parentNode;
    }
  };

  document.registerElement('footer-menu', {
    prototype: proto,
  });
})();
