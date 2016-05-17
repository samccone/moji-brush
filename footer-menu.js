(function() {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.template = _ => {
     return `<ul class="menu-items">
        <li class="open-menu" action="large-menu">
          <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g id="dashboard"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></g></svg>
        </li>
        <li class="size" action="size">
          <svg id="plusminus" xmlns="http://www.w3.org/2000/svg" width="21" height="19.2" viewBox="0 0 21 17">
            <title>plusminus2</title>
            <polygon id="plus" points="9 3.27 5.73 3.27 5.73 0 3.27 0 3.27 3.27 0 3.27 0 5.73 3.27 5.73 3.27 9 5.73 9 5.73 5.73 9 5.73 9 3.27" style="fill: #e6e6e6"/>
            <line id="slash" x1="2.5" y1="18.5" x2="18.63" y2="2" style="fill: none;stroke: #e6e6e6;stroke-miterlimit: 10;stroke-width: 2px"/>
            <rect id="minus" x="12" y="15" width="9" height="2.7" style="fill: #e6e6e6"/>
          </svg>

        </li>
        <li class="brush" action="brush-pick">
          <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g id="brush"><path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z"/></g>
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
