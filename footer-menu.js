(function() {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.template = _ => {
     return `<ul class="menu-items">
        <li class="undo" action="undo">
          <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" class="style-scope iron-icon"><g class="style-scope iron-icon"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" class="style-scope iron-icon"></path></g></svg>
        </li>
        <li class="redo" action="redo">
          <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" class="style-scope iron-icon"><g class="style-scope iron-icon"><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z" class="style-scope iron-icon"></path></g></svg>
        </li>
        <li class="brush" action="brush-pick">
          <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g class="style-scope iron-icon"><path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z" class="style-scope iron-icon"></path></g></svg>
        </li>
        <li class="size" action="size">
          <svg version="1.1"
          xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
          x="0px" y="0px" width="45.4px" height="31.5px" viewBox="0 0 45.4 31.5" style="enable-background:new 0 0 45.4 31.5;"
          xml:space="preserve">
          <style type="text/css">
          .st0{fill:#FFFFFF;}
          </style>
          <defs>
          </defs>
          <g>
          <path d="M7.2,17.1c-4,0-7.2,3.2-7.2,7.2s3.2,7.2,7.2,7.2c4,0,7.2-3.2,7.2-7.2S11.2,17.1,7.2,17.1z"/>
          <circle class="st0" cx="9.7" cy="22.5" r="1.1"/>
          <circle class="st0" cx="4.7" cy="22.5" r="1.1"/>
          <path class="st0" d="M7.2,28.3c1.7,0,3.1-1.1,3.7-2.5H3.5C4.1,27.2,5.5,28.3,7.2,28.3z"/>
          </g>
          <g>
          <path d="M29.6,0c-8.7,0-15.7,7.1-15.7,15.8s7,15.8,15.7,15.8c8.7,0,15.8-7.1,15.8-15.8S38.3,0,29.6,0z"/>
          <circle class="st0" cx="35.1" cy="11.8" r="2.4"/>
          <circle class="st0" cx="24.1" cy="11.8" r="2.4"/>
          <path class="st0" d="M29.6,24.4c3.7,0,6.8-2.3,8.1-5.5H21.5C22.8,22.1,25.9,24.4,29.6,24.4z"/>
          </g>
          </svg>
        </li>
        <li class="open-menu" action="menu">
          <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" class="style-scope iron-icon"><g class="style-scope iron-icon"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" class="style-scope iron-icon"></path></g></svg>
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

