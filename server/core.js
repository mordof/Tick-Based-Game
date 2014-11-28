var express = require('express');
var web = express();
var http = require('http').Server(web);
var io = require('socket.io')(http);
var path = require('path');

var client_pub_path = path.resolve('../client/public');

web.get('/comm/*', function(req, res){
  console.log("communications from client to server")
})

web.use(express.static(client_pub_path));

io.on('connection', function(socket){
  console.log('user connection established');
  io.emit('confirmation')
})

http.listen(3000, function(){
  console.log('listening on *:3000')
})
