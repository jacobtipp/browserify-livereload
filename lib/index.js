const fs = require('fs')
const http = require('http')
const path = require('path')
const prepend = require('prepend-file')
const concat = require('concat-stream')
const replace = require('replacestream')

module.exports = function (b, options) {
  if (!b.argv && !options.outfile) {
    throw new Error('outfile option must be specified if using the API directly')
  }

  const outfile = options.outfile || b.argv.outfile
  const PORT = options.port || '3001'
  const HOST = options.host || 'localhost'
  const server = http.createServer()
  const io = require('socket.io')(server)

  b.on('bundle', (stream) => {
    stream.on('end', reload)

    function reload () {
      fs.createReadStream(path.join(__dirname, 'socket-client.js'))
        .pipe(replace(/PORT/g, PORT))
        .pipe(replace(/HOST/g, HOST))
        .pipe(concat(read))

      function read (data) {
        prepend(outfile, data, function (err) {
          if (err) {
            throw err
          }

          io.emit('bundle')
        })
      }
    }
  })

  server.listen(PORT, HOST)
}
