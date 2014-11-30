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
  // login attempt from client - if successful, populate into users object collection
  // and set vars such as sock id, etc.
  socket.on('doLogin', function(data, fn) {
    if (users[data.un]) {
      fn({"status": "error", "msg": "User is already logged in."});
    } else {
      users[data.un] = {};
      users[data.un].socket = socket.id;
      users[data.un].name = data.un;
      console.log("User " + data.un + " connected.")
      io.emit('chat.system', "User " + data.un + " has connected.")
      fn({"status": "success"});
    }
  });

  socket.on('disconnect', function(){
    var user = get_user_by_socket(socket);
    delete users[user.name];
    console.log('User ' + user.name + " disconnected.")
  })

  socket.on('chat.public_message', function(message){
    var user = get_user_by_socket(socket)
    io.emit('chat.global', user.name, message)
  })

  socket.on('world.get_box_details', function(boxID, fn){
    fn(box_details[boxID])
  })

  socket.on('world.get_boxes', function(fn){
    fn(['box_4', 'box_8'])
  })
})

// Don't call this on large objects. If you need to search through large objects,
// they need to be indexed to be searched through properly.
Object.prototype.find = function(fn){
  for(var obj in this){
    if(this.hasOwnProperty(obj)){
      if(fn(this[obj])){
        return this[obj];
      }
    }
  }

  return false;
}

function get_user_by_socket(socket){
  return users.find(function(user){ return user.socket == socket.id })
}
