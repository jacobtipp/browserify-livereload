const io = require('socket.io-client')
const socket = io('http://HOST:PORT')

socket.on('bundle', () => {
  try {
    window.location.reload()
  } catch (e) {
    console.error(e)
  }
})
