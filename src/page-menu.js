(function() {
  'use strict';

  var proto = Object.create(HTMLElement.prototype);

  proto.template = _ => {
     return `
      <ul>
      <div>
        <ul class="toggle-box">
          <li class="toggle" action="google-emoji" id="google">
            <svg viewBox="0 0 24 24" fill="#e6e6e6"><path d="M12,13.9V10.18h9.36a8.71,8.71,0,0,1,.25,2.05c0,5.71-3.83,9.77-9.6,9.77A10,10,0,1,1,12,2a9.57,9.57,0,0,1,6.69,2.61L15.85,7.37A5.48,5.48,0,0,0,12,5.88a6.12,6.12,0,0,0,0,12.24,5.18,5.18,0,0,0,5.5-4.22H12Z"/></svg>
          </li>
          <li class="toggle" action="apple-emoji" id="apple">
            <svg viewBox="0 0 28 28" fill="#e6e6e6"><path d="M21.58,18.63a12.91,12.91,0,0,1-1.28,2.29,11.66,11.66,0,0,1-1.64,2,3.19,3.19,0,0,1-2.11.93,5.3,5.3,0,0,1-2-.47,5.6,5.6,0,0,0-2.1-.46,5.79,5.79,0,0,0-2.16.46,5.81,5.81,0,0,1-1.87.49,3,3,0,0,1-2.16-1,12.24,12.24,0,0,1-1.72-2.06,14.23,14.23,0,0,1-1.82-3.61A13.23,13.23,0,0,1,2,12.94,7.86,7.86,0,0,1,3,8.82,6.06,6.06,0,0,1,5.19,6.64a5.82,5.82,0,0,1,2.92-.82,6.88,6.88,0,0,1,2.26.53,7.27,7.27,0,0,0,1.79.53,10.73,10.73,0,0,0,2-.62,6.57,6.57,0,0,1,2.7-.48,5.74,5.74,0,0,1,4.5,2.37,5,5,0,0,0-2.65,4.54,5,5,0,0,0,1.65,3.78A5.41,5.41,0,0,0,22,17.53q-0.2.57-.42,1.1h0ZM17,0.6a5.06,5.06,0,0,1-1.3,3.32A4.42,4.42,0,0,1,12,5.74a3.7,3.7,0,0,1,0-.45,5.2,5.2,0,0,1,1.38-3.36A5.3,5.3,0,0,1,15.05.67,5,5,0,0,1,17,.13,4.31,4.31,0,0,1,17,.6h0Z" transform="translate(2 1)" /></svg>
          </li>
        </ul>
        <div class="menu-item-title">Emoji Style</div>
      </div>
        <li action="save">
          <div class="button">
            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" fill="#e6e6e6"><g id="save"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></g></svg>
          </div>
          <div class="menu-item-title">Save</div>
        </li>
        <li action="reset">
          <div class="button">
            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" fill="#e6e6e6"><g id="delete"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></g></svg>
          </div>
          <div class="menu-item-title">Reset</div>
        </li>

      </ul>
      `;
  };

  proto.attachedCallback = function() {
    let eventName = 'ontouchstart' in window ? 'touchstart': 'click';
    this.innerHTML = this.template();

    if (window.app.brush.platform == 'apple') {
      document.getElementById('apple').classList.add('active');
    } else {
      document.getElementById('google').classList.add('active');
    }

    this.addEventListener(eventName, this.onMenuClick);
  };

  proto.onMenuClick = function(e) {
    var node = e.target;

    while(node !== undefined && node.tagName !== 'PAGE-MENU') {
      if (node.tagName === 'LI') {
        this.dispatchEvent(new CustomEvent('menu-action', {
          bubbles: true,
          detail: node.getAttribute('action')}));
        break;
      }

      node = node.parentNode;
    }
  };

  document.registerElement('page-menu', {
    prototype: proto,
  });
})();
