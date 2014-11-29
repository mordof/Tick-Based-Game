var socket = io();


// do login right away
// --------------------------------------------
  var userName = ""; 
  while (userName == "" || userName == false) {
    userName = prompt("Enter your name");   // prompt for username persistently
  }

  // once we have username, send to server to attempt login;
  socket.emit('doLogin', {"un": userName}, function(respObj) {
    if (respObj.status == "error") {
      alert(respObj.msg);
    }
  });


socket.on('chat.global', function(user, msg){
  var li = document.createElement('li');
  var p = document.createElement('p');
  p.appendChild(document.createTextNode(user + ": " + msg));
  li.appendChild(p)

  document.getElementById("messages").appendChild(li);

  li.scrollIntoView();
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

var box_data = {};

function get_boxes(){
  socket.emit('world.get_boxes', function(boxes){
    boxes.forEach(function(ele){
      socket.emit('world.get_box_details', ele, function(data){
        box_data[ele] = data;
        console.log(data);
        create_box(data)
      })
    })
  })
}

function create_box(data){
  var div = document.createElement('div');
  div.style.position = "absolute";
  div.style.top = data.y + "px";
  div.style.left = data.x + "px";
  div.style.width = "50px";
  div.style.height = "50px";
  div.style.border = "1px solid black";
  div.style.backgroundColor = "yellow";

  document.body.appendChild(div);
}