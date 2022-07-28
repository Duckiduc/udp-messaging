// Change the PORT if already in use
const PORT = 6024
const udp = require('dgram')
const client = udp.createSocket('udp4')

// Constant listening of the client
client.on('listening', function () {
  const address = client.address()
  console.log('UDP Client listening on ' + address.address + ":" + address.port)
  // Enable broadcast for client
  client.setBroadcast(true)
})

// Event listener on receiving a message
client.on('message', function (message, rinfo) {
  // Print message when received
  console.log('Message from: ' + rinfo.address + ':' + rinfo.port +' - ' + message)
})

client.bind(PORT)
