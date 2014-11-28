var socket = io();

socket.on('confirmation', function(){
  console.log('got confirmation message');
})

socket.on('chat.global', function(user, msg){
  var li = document.createElement('li');
  var p = document.createElement('p');
  p.appendChild(document.createTextNode(user + ": " + msg));
  li.appendChild(p)

  document.getElementById("messages").appendChild(li);
})

function send_message(msg){
  var user = document.getElementById("username").value;
  socket.emit('chat.public_message', user, msg);
}

document.getElementById("m").onkeyup = function(e){
  if(e.keyCode == 13){
    send_message(this.value)
    this.value = "";
  }
}

document.getElementById("input_form").onsubmit = function(e){
  e.preventDefault();
  return false;
}