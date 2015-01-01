var express = require('express');
var web = express();
var http = require('http').Server(web);
var path = require('path');
var io = require('socket.io')(http);
var users = require('./lib/users.js');
var db = require('./lib/models.js');

// Load all Models from db into the global scope so Star is available
for(model in db){
  if(db.hasOwnProperty(model)){
    global[model] = db[model];
  }
}

web.use(express.static(path.resolve('../../client/public')));

http.listen(3030, function(){
  console.log('Starting TBG Server on *:3030')
})

Array.prototype.matches = function(arr){
  function is_equal_to(a, b) {
    return a === b && (a !== 0 || 1 / a === 1 / b) // false for +0 vs -0
        || a !== a && b !== b; // true for NaN vs NaN
  }

  var self = this;

  if(self.length == arr.length && self.every(function(item, index){ return is_equal_to(item, arr[index]); })){
    return true;
  } else {
    return false;
  }
}

function populate_grid(callback){
  var stars = {}
  var ships = {}
  var stars_populated = false;
  var ships_populated = false;

  Star.find(function(err, data){
    data.forEach(function(item){
      if(!stars.hasOwnProperty(item.location[0])){
        stars[item.location[0]] = {};
      }
      
      stars[item.location[0]][item.location[1]] = item;
    })

    stars_populated = true;
  })

  Ship.find(function(err, data){
    data.forEach(function(item){
      if(!ships.hasOwnProperty(item.location[0])){
        ships[item.location[0]] = {};
      }
      
      ships[item.location[0]][item.location[1]] = item;
    })

    ships_populated = true;
  })

  var interval = setInterval(function(){
    if(ships_populated && stars_populated){
      clearInterval(interval);
      send_grid(callback, stars, ships);
    }
  }, 20)
}

function send_grid(callback, stars, ships){
  var grid_size = 10;
  var grid = [];

  for(var y = 0; y < grid_size; y++){
    grid[y] = [];
    for(var x = 0; x < grid_size; x++){
      if(stars.hasOwnProperty(x + 1) && stars[x + 1].hasOwnProperty(y + 1)){
        grid[y][x] = {
          obj: stars[x + 1][y + 1],
          type: stars[x + 1][y + 1].type
        }
      } else {
        grid[y][x] = null;
      }

      if(ships.hasOwnProperty(x + 1) && ships[x + 1].hasOwnProperty(y + 1)){
        grid[y][x] = {
          obj: ships[x + 1][y + 1],
          type: ships[x + 1][y + 1].type
        }
      }
    }
  }

  callback(grid);
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
