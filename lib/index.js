const http = require('http')
const path = require('path')
const fs = require('fs')
const replace = require('replacestream')
const clientScript = path.join(__dirname, 'client.js')

const ws = fs.createWriteStream(clientScript)

module.exports = function (b, options) {
  const PORT = options.port || '3001'
  const HOST = options.host || 'localhost'
  const server = http.createServer()
  const io = require('socket.io')(server)

  fs.createReadStream(path.join(__dirname, 'socket-client.js'))
    .pipe(replace(/PORT/, PORT))
    .pipe(replace(/HOST/, HOST))
    .pipe(ws)

  b.add(clientScript)
  b.on('bundle', (stream) => {
    stream.on('error', handleError)
    stream.on('end', reload)

    function handleError (err) {
      console.error(err)
    }

    function reload () {
      io.emit('bundle')
    }
  })

  server.listen(PORT, HOST)
}
