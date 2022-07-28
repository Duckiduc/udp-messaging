const PORT = 6024
const SERVER_PORT = 41234
const udp = require('dgram')
const readlineSync = require('readline-sync')
const client = udp.createSocket('udp4')

// GET MESSAGE FROM INPUT
function getMessage() {
  const message = readlineSync.question('Enter your message: ')
  return message
}

// GET RECEIVER'S INFORMATIONS
function getReceiver() {
  console.log('1. Default IP (99.9% won\'t work with your configuration || use VMWare with Ubuntu)')
  console.log('2. Custom IP address (start a VM or another computer and run the client program) ')
  const choice = readlineSync.question('Enter your choice from the list above: ')
  switch (choice) {
    case "1":
    return ('172.16.185.129')
    
    case "2":
    const IP = readlineSync.question('Enter receiver\'s IP: ')
    return IP
    
    default:
    return ('172.16.185.129')
  }
}

// SEND MESSAGE TO BROADCAST
function broadcast() {
  const message = getMessage()
  const data = Buffer.from(message)
  // Send message to broadcast server using its listening PORT and its IP address
  // In this case we use '192.168.86.250' as the address because we run it on a VM so we need to target the server externaly
  client.send(data, SERVER_PORT, '192.168.86.250', function(error) {
    if(error) {
      console.log(error)
      client.close()
    } else {
      console.log('Data is sent !')
    }
  }) 
}

// SEND MESSAGE IN PEER TO PEER
function peerToPeer() {
  const IP = getReceiver()
  const message = getMessage()
  const data = Buffer.from(message)
  // Send message to addressee using their listening PORT and their IP address
  client.send(data, PORT, IP, function(error) {
    if(error) {
      console.log(error)
      client.close()
    } else {
      console.log('Data is sent !')
    }
  })
}

function loop() {
  console.log("1. Broadcast to all")
  console.log("2. Send private message")
  console.log("3. Exit")
  const choice = readlineSync.question('Enter the number of your corresponding choice: ')
  console.log(typeof(choice))
  switch (choice) {
    case "1":
    broadcast()
    break
    
    case "2":
    peerToPeer()
    break
    
    case "3":
    process.exit()
    
    default:
    loop()
    break
  }
  setTimeout(loop, 1000)
}

// Constant listening of the client
client.on('listening', function () {
  const address = client.address()
  console.log('UDP Client listening on ' + address.address + ":" + address.port)
  // Enable broadcast for client
  client.setBroadcast(true)
  loop()
})

// Event listener on receiving a message
client.on('message', function (message, rinfo) {
  // Print message when received
  console.log('Message from: ' + rinfo.address + ':' + rinfo.port +' - ' + message)
})

client.bind(PORT)
