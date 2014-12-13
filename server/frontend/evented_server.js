var express = require('express');
var web = express();
var http = require('http').Server(web);
var path = require('path');
var io = require('socket.io')(http);
var users = require('./lib/users.js');
var db = require('./lib/models.js');

// Load all Models from db into the global scope so Star, Box, etc are available
for(model in db){
  if(db.hasOwnProperty(model)){
    global[model] = db[model];
  }
}

web.use(express.static(path.resolve('../../client/public')));

http.listen(3030, function(){
  console.log('Starting TBG Server on *:3030')
})

function populate_grid(callback){
  var grid = [
    [null, null, null, null, null, null],
    [null, 1, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, 1, null, null, 2, null],
    [null, null, null, null, null, null]
  ]

  Star.find(function(err, data){
    for(var y = 0; y < grid.length; y++){
      for(var x = 0; x < grid[y].length; x++){
        if(grid[y][x]){
          grid[y][x] = data[grid[x][y] - 1]
        }
      }
    }

    callback(grid);
  })
}

function onLogin(data, fn) {
  var socket = this;
  if (users.exists(data.username)) {
    fn({"status": "error", "msg": "User is already logged in."});
  } else {
    users.add(data, socket.id);
    console.log("User " + data.username + " connected.")
    io.emit('chat.system', "User " + data.username + " has connected.")
    fn({"status": "success"});
  }
}

function onDisconnect(){
  var socket = this;
  var user = users.find_by_socket(socket.id);
  // If server gets restarted, and browser still holds hope for a reconnect,
  // a refresh of the client page will trigger a disconnect to an unknown user server side.
  if(user){
    users.remove(socket.id);
    console.log('User ' + user.name + " disconnected.")
    io.emit('chat.system', "User " + user.name + " has disconnected.");
  }
}

function timeoutTest(fn){
  setTimeout(function(){
    fn("rawrasdf");
  }, 3000)
}

function chatMessage(message){
  var socket = this;
  var user = users.find_by_socket(socket.id)
  if(user){
    io.emit('chat.global', user.name, message)
  } else {
    // There was a problem - a socket sent in a message that wasn't associated with a
    // user in our system. 
    console.warn("WARNING: An unidentified socket has sent a message.");
  }
}

io.on('connection', function(socket){
  socket.on('login', onLogin);
  socket.on('disconnect', onDisconnect);
  socket.on('viewport.get_grid', populate_grid);
  socket.on('test', timeoutTest);
  socket.on('chat.public_message', chatMessage);
})
