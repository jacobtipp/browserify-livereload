const one = require('./levelone/one')
const square = document.createElement('div')

console.log(one.hello('hello there'))

square.style.width = '200px'
square.style.height = '200px'
square.style.background = 'red'

document.body.appendChild(square)

