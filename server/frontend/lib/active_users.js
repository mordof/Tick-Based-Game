function ActiveUsers() {
  this.users = {}
  this.socket_id_index = {}
}

ActiveUsers.prototype.find = function(name){
  return this.users[name]
}

ActiveUsers.prototype.add = function(name, socket){
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

module.exports = new ActiveUsers()
