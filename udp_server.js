const PORT = 6024;
const SERVER_PORT = 41234;
// const BROADCAST_ADDR = "192.168.86.255";
const BROADCAST_ADDR = "172.16.185.255";
const udp = require('dgram');

// CREATING A UDP SERVER // 
const server = udp.createSocket('udp4');

// SERVER IS LISTENING
server.on('listening',function(){
  const address = server.address();
  const port = address.port;
  console.log('Server is listening at port' + port);
});

// BROADCASTING MESSAGE
function broadcast(msg) {
  const message = Buffer.from(msg);
  // Broadcast message to the broadcast address using the correct PORT 
  server.send(message, 0, message.length, PORT, BROADCAST_ADDR, function() {
      console.log("Sent '" + message + "'");
  });
}

// WHEN RECEIVING DATA FROM CLIENT 
server.on('message',function(msg,info){
  console.log('Data received from client : ' + msg.toString());
  console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
  const response = Buffer.from('From server : your msg is received');
  // Send message to sender using their listening PORT and their IP address
  server.send(response,info.port,'localhost',function(error){
    if(error){
      client.close();
    }else{
      console.log('Data sent !');
    }
  });
  const message = `Message from ${info.address.toString()}: ${msg.toString()}`
  // Broadcast the message just received to every other clients
  broadcast(message);
});

// BIND SERVER TO DESIGNATED PORT AND ENABLE BROADCAST
server.bind(SERVER_PORT, function() {
    server.setBroadcast(true);
});

// ERROR HANDLING
server.on('error',function(error){
  console.log('Error: ' + error);
  // we close the server
  server.close();
});
