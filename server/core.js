var express = require('express');
var web = express();
var http = require('http').Server(web);
var path = require('path');
var io = require('socket.io')(http);

web.use(express.static(path.resolve('../client/public')));

http.listen(3000, function(){
  console.log('Starting TBG Server on *:3000')
})

io.on('connection', function(socket){
  console.log('Connection Established');
  socket.emit('confirmation')
  console.log('Collecting Client Information')

  socket.on('chat.public_message', function(user, message){
    console.log('message ' + message + ' was sent in by ' + user)
    io.emit('chat.global', user, message)
  })
})