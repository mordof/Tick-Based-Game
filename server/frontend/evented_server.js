var express = require('express');
var web = express();
var http = require('http').Server(web);
var path = require('path');
var io = require('socket.io')(http);
var db = require('./lib/models.js');
var tcp_net = require('net');

global["ActiveUsers"] = require('./lib/active_users.js')(io);

// Load all Models from db into the global scope so Star is available
for(model in db){
  if(db.hasOwnProperty(model)){
    global[model] = db[model];
  }
}

web.use(express.static(path.resolve('../../client/www')));

http.listen(3030, function(){
  console.log('Starting TBG Server on *:3030')
})

function populate_grid(callback){
  var socket = this
  var user = ActiveUsers.find_by_socket_id(socket.id)

  var stars = {}
  var ships = {}
  var stars_populated = false
  var ships_populated = false

  Star.find({ location: { $geoWithin: { $box: user.viewport } } }, function(err, data){
    data.forEach(function(item){
      if(!stars.hasOwnProperty(item.location[0])){
        stars[item.location[0]] = {};
      }
      
      stars[item.location[0]][item.location[1]] = item;
    })

    stars_populated = true;
  })

  Ship.find({ location: { $geoWithin: { $box: user.viewport } } }, function(err, data){
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
  if (ActiveUsers.find(data.username)) {
    fn({"status": "error", "msg": "User is already logged in."});
  } else {
    ActiveUsers.add(data.username, socket);
    console.log("User " + data.username + " connected.")
    ActiveUsers.dispatch_system_message("User " + data.username + " has connected.");
    fn({"status": "success"});
  }
}

function onDisconnect(){
  var socket = this;
  var user = ActiveUsers.find_by_socket_id(socket.id);
  // If server gets restarted, and browser still holds hope for a reconnect,
  // a refresh of the client page will trigger a disconnect to an unknown user server side.
  if(user){
    console.log('User ' + user.name + " disconnected.")
    ActiveUsers.remove_by_socket_id(socket.id);
    ActiveUsers.dispatch_system_message("User " + user.name + " has disconnected.")
  }
}

function chatMessage(message){
  var socket = this;
  var user = ActiveUsers.find_by_socket_id(socket.id)
  if(user){
    ActiveUsers.dispatch_user_message(user.name, message);
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
  socket.on('chat.public_message', chatMessage);
})

tcp_net.createServer(function(socket){
  socket.id = "tcp_" + (+(new Date)) + socket.remoteAddress + socket.remotePort;

  var raw_buffer = "";

  socket.on('data', function(buffer){
    raw_buffer += buffer.toString('utf-8');

    var last_section_is_command = raw_buffer.substr(-2) == ":|";

    var split_buffer = raw_buffer.split(":|");
    var last_section = split_buffer.pop();

    for(var i = 0; i < split_buffer.length; i++){
      process_command(split_buffer[i]);
    }

    if(last_section_is_command){
      process_command(last_section);
      raw_buffer = "";
    } else {
      raw_buffer = last_section;
    }
  })

  function process_command(buffer){
    var details = buffer.split('|:');
    var command = details[0];
    var data = details[1] ? JSON.parse(details[1]) : "";

    switch(command){
      case "login":
        onLogin.call(socket, data, function(resp){
          socket.write("login|:" + JSON.stringify(resp) + "\n");
        });
        break;
      case "viewport.get_grid":
        populate_grid.call(socket, function(resp){
          socket.write("viewport.get_grid|:" + JSON.stringify(resp) + "\n");
        });
        break;
      case "chat.public_message":
        chatMessage.call(socket, data + "\n");
        break;
    }
  }

  socket.on('end', onDisconnect);
}).listen(3060);

console.log("TCP Server running on port 3060");

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log(err.stack);
  console.log("Carrying on...\n");
});
