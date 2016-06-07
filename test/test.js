const fs = require('fs')
const path = require('path')
const test = require('tape')
const io = require('socket.io-client')
const browserify = require('browserify')
const livereload = require('../lib')
const entry = path.join(__dirname, 'src', 'main.js')
const output = path.join(__dirname, 'src', 'bundle.js')

const b = browserify({
  entries: [entry]
})

function bundle () {
  b.bundle()
    .pipe(fs.createWriteStream(output))
}

b.plugin(livereload)

test('socketio events, bundle events, file creation', (t) => {
  b.on('bundle', (stream) => {
    stream.on('error', err => t.fail(err.message))
    stream.on('end', () => {
      t.equal(b._mdeps.entries.length, 2)
    })
  })

  try {
    fs.accessSync(path.join(__dirname, '..', 'lib', 'client.js'))
    t.pass('file was created')
  } catch (e) {
    t.fail('no file was created')
  }

  const socket = io('http://localhost:3001')

  socket.on('bundle', () => {
    t.pass('bundle event was called')
    t.end()
    process.exit(0)
  })

  bundle()
})

