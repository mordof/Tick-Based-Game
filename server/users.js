var users = {};
var socket_index = {}

function does_user_exist(name){
  return !!users[name];
}

function register_user(data, socket){
  users[data.un] = {};
  users[data.un].socket = socket.id;
  users[data.un].name = data.un;

  socket_index[socket.id] = data.un;
}

function remove_user(socket_id){
  var username = socket_index[socket_id];
  if(username && users[username]){
    delete users[username];
    delete socket_index[socket_id];

    return true;
  }

  return false;
}

function find_user_by_socket(socket_id){
  var username = socket_index[socket_id];
  if(username && users[username]){
    return users[username];
  }
  
  return null;
}

function find_user_by_name(name){
  if(users[name]){
    return users[name];
  }

  return null;
}

module.exports = {
  exists:  does_user_exist,
  add: register_user,
  remove: remove_user,
  find_by_socket: find_user_by_socket,
  find_by_name: find_user_by_name
}
