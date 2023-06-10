#### View Live

https://www.mojibrush.co


#### Dev (Chrome)

* `cd src/`
* `python3 -m http.server`
* `open localhost:8000`

> When deving make sure to command+shift+r to reload to bypass service worker.


#### Testing in Safari/Firefox/Edge/IE

* `npm run build` to build an ES5, CSS3, Web Component-polyfilled version
* `cd dist/`
* `python3 -m http.server`
* `open localhost:8000`

#### Deploying

* `npm run deploy`
