var express = require('express');
var web = express();
var http = require('http').Server(web);
var path = require('path');
var io = require('socket.io')(http);
var users = require('./users.js')

web.use(express.static(path.resolve('../client/public')));

http.listen(3000, function(){
  console.log('Starting TBG Server on *:3000')
})

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
  // login attempt from client - if successful, populate into users object collection
  // and set vars such as sock id, etc.
  socket.on('doLogin', function(data, fn) {
    if (users.exists(data.un)) {
      fn({"status": "error", "msg": "User is already logged in."});
    } else {
      users.add(data, socket);
      console.log("User " + data.un + " connected.")
      io.emit('chat.system', "User " + data.un + " has connected.")
      fn({"status": "success"});
    }
  });

  socket.on('disconnect', function(){
    var user = users.find_by_socket(socket.id);
    // If server gets restarted, and browser still holds hope for a reconnect,
    // a refresh of the client page will trigger a disconnect to an unknown user server side.
    if(user){
      users.remove(socket.id);
      console.log('User ' + user.name + " disconnected.")
      io.emit('chat.system', "User " + user.name + " has disconnected.");
    }
  })

  socket.on('chat.public_message', function(message){
    var user = users.find_by_socket(socket.id)
    if(user){
      io.emit('chat.global', user.name, message)
    } else {
      // There was a problem - a socket sent in a message that wasn't associated with a
      // user in our system. 
      console.warn("WARNING: An unidentified socket has sent a message.");
    }
  })

  socket.on('world.get_box_details', function(boxID, fn){
    fn(box_details[boxID])
  })

  socket.on('world.get_boxes', function(fn){
    fn(['box_4', 'box_8'])
  })
})
