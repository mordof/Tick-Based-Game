var express = require('express');
var web = express();
var http = require('http').Server(web);
var path = require('path');
var io = require('socket.io')(http);

web.use(express.static(path.resolve('../client/public')));

http.listen(3000, function(){
  console.log('Starting TBG Server on *:3000')
})

var users = {};

var box_details = {
  box_4: {
    x: 22,
    y: 200,
    props: {
      item_value: 42
    }
  },
  box_8: {
    x: 220,
    y: 50,
    props: {
      item_value: 42
    }
  }
}

io.on('connection', function(socket){
  console.log('Connection Established');

  // login attempt from client - if successful, populate into users object collection
  // and set vars such as sock id, etc.
  socket.on('doLogin', function(data, fn) {
    if (users[data.un]) {
      fn({"status": "error", "msg": "User is already logged in."});
    } else {
      users[data.un] = {};
      users[data.un].socket = socket.id;
      console.log(users);
      fn({"status": "success"});
    }
  });

  console.log('Collecting Client Information')

  socket.on('chat.public_message', function(user, message){
    console.log('message ' + message + ' was sent in by ' + user)
    io.emit('chat.global', user, message)
  })

  socket.on('world.get_box_details', function(boxID, fn){
    fn(box_details[boxID])
  })

  socket.on('world.get_boxes', function(fn){
    fn(['box_4', 'box_8'])
  })
})

