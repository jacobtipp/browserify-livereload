# browserify-livereload

This is a small livereload [browserify](http://browserify.org/) plugin. It is aimed for those who don't want to waste time with gulp plugins or pre-packaged developmnent servers.

<a href="https://nodei.co/npm/browserify-livereload/"><img src="https://nodei.co/npm/browserify-livereload.png?downloads=true&downloadRank=true&stars=true"></a>

Quick example
-------------

```shell
git clone https://github.com/traducer/browserify-livereload.git
cd browserify-livereload/example
npm i && npmi run dev
```

open your browser to http://localhost:8080 and start messing with the src files


Installation
------------
```shell
$ npm install --save-dev browserify-livereload watchify
```
because this plugin doesn't watch for files, use [watchify](https://github.com/substack/watchify) to handle rebundling, the plugin will do the rest.

Usage
-----

##### Command Line
```shell
$ watchify -p [ browserify-livereload --host 127.0.0.1 --port 1337 ] index.js -o bundle.js
```

##### API
```js
const browserify = require('browserify')
const livereload = require('browserify-livereload')

const b = browserify({
    entries: 'index.js'
      cache: {},
        packageCache: {},
          debug: true
})

b.plugin(livereload, {
    host: 'localhost',
      port: 1337
})
```

How it Works
-----------
When browserify installs the plugin, a socket.io server is created. By default, it is created on `http://localhost:3001`. However, the host and port options are configurable. The plugin then injects the [host/port](https://github.com/traducer/browserify-livereload/blob/master/lib/index.js#L15-L18) into a [client.js](https://github.com/traducer/browserify-livereload/blob/master/lib/socket-client.js) script. This script then gets added to your browserify entries path and gets included in your bundle. This means wherever you use your bundle, the browser will be connecting to your socket.io server created by the plugin. This makes the plugin server agnostic. You can use any server to serve your static files, this does not come with a built-in static server and you do not need to include any separate scripts into your `index.html` file, it will be included with the bundle.js.

Because of this, it is strictly for development purposes. Be sure to rebundle your application without this plugin when you're ready for production. 

Whenever browserify fires a bundle event the script will listen for the end event of the bundle's stream and fire a socket.io event to the client, triggering `window.location.reload()`.

Because this only listens for bundle events, it does not come included with a file watcher. Use  [watchify](https://github.com/substack/watchify) with this plugin to get the full livereload effect.
