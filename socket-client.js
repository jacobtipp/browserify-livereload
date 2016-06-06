const io = require('socket.io-client')
const socket = io('http://HOST:PORT')

socket.on('bundle', () => {
  window.location.reload()
})
