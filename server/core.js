var web = require('express')();
var http = require('http').Server(web);
var io = require('socket.io')(http);

var client_pub = '/home/mordof/Tick-Based-Game/client/public'

web.get('/', function(req, res){
  res.sendFile(client_pub+"/index.html")
})

io.on('connection', function(socket){
  console.log('user connection established');
  io.emit('confirmation')
})

http.listen(3000, function(){
  console.log('listening on *:3000')
})
