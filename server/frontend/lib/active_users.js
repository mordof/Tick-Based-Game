var io = null;

function ActiveUsers() {
  this.users = {}
  this.socket_id_index = {}
}

ActiveUsers.prototype.find = function(name){
  return this.users[name]
}

ActiveUsers.prototype.add = function(name, socket){
  console.log("\n");
  console.log(socket.id);
  this.users[name] = {
    socket: socket,
    name: name,
    viewport: [ [ 0, 0 ], [ 10, 10 ] ]
  }

  this.socket_id_index[socket.id] = this.users[name]
}

ActiveUsers.prototype.remove = function(name){
  if(this.find(name)){
    delete this.socket_id_index[this.users[name]['socket'].id]
    delete this.users[name]

    return true
  }

  return false
}

ActiveUsers.prototype.remove_by_socket_id = function(socket_id){
  var user = this.socket_id_index[socket_id];

  if(user){
    return this.remove(user.name)
  }

  return false;
}

ActiveUsers.prototype.find_by_socket_id = function(socket_id){
  return this.socket_id_index[socket_id]
}

ActiveUsers.prototype.set_viewport = function(name, x1, y1, x2, y2){
  this.users[name].viewport = [ [ x1, y1 ], [ x2, y2 ]]
}

ActiveUsers.prototype.dispatch_user_message = function(from, message){
  io.emit('chat.global', from, message);

  for(var name in this.users){
    if(this.users[name].socket.id.substr(0, 4) != "tcp_"){ continue; }

    this.users[name].socket.write("chat.global|:" + JSON.stringify({ from: from, message: message }) + "\n")
  }
}

ActiveUsers.prototype.dispatch_system_message = function(message){
  io.emit('chat.system', message);

  for(var name in this.users){
    if(this.users[name].socket.id.substr(0, 4) != "tcp_"){ continue; }

    this.users[name].socket.write("chat.system|:" + JSON.stringify({ message: message }) + "\n")
  }
}

module.exports = function(io_obj){
  io = io_obj;
  return new ActiveUsers();
}
