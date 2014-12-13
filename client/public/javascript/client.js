var socket = io();


// do login right away
// --------------------
promptLogin();

function promptLogin() {
  var userName = ""; 
  while (userName == "" || userName == false) {
    userName = prompt("Enter your name");   // prompt for username persistently
  }

  // once we have username, send to server to attempt login;
  socket.emit('doLogin', {"un": userName}, function(respObj) {
    if (respObj.status == "error") {
      alert(respObj.msg);
      promptLogin();  // if things failed, let the user try again
    }
  });
}

function get_grid(){
  socket.emit('viewport.get_grid', function(grid){
    var viewport = document.getElementById("viewport");
    viewport.innerHTML = "";

    var grid_item_width = 600 / grid.length;
    var grid_item_height = 600 / grid[0].length;

    for(var x = 0; x < grid.length; x++){
      for(var y = 0; y < grid[x].length; y++){
        var grid_item = document.createElement('div');
        grid_item.style.position = "absolute";
        grid_item.style.left = (grid_item_width * x) + "px";
        grid_item.style.top = (grid_item_height * y) + "px";
        grid_item.style.width = grid_item_width + "px";
        grid_item.style.height = grid_item_height + "px";
        grid_item.style.outline = "1px solid #ccc";

        if(grid[y][x]){
          //switch(grid[y][x].type){
          //  case "star":
              var star = document.createElement('div');
              star.style.position = "relative";
              star.style.top = grid[y][x].offset.y + "px";
              star.style.left = grid[y][x].offset.x + "px";
              star.style.border = "2px solid " + grid[y][x].color;
              star.style.width = "10px";
              star.style.height = "10px";

              grid_item.appendChild(star);
         //     break;
        //  }
        }

        viewport.appendChild(grid_item);
      }
    }
  })
}
  
socket.on('chat.system', function(msg){
  write_chat_message(msg);
})

socket.on('chat.global', function(user, msg){
  write_chat_message(user + ": " + msg)
})

function send_message(msg){
  socket.emit('chat.public_message', msg);
}

document.getElementById("m").onkeyup = function(e){
  if(e.keyCode == 13){
    if(this.value.substr(0,1) == "/"){
      run_func(this.value.substr(1))
      this.value = "";
    } else {
      send_message(this.value)
      this.value = "";
    }
  }
}

document.getElementById("input_form").onsubmit = function(e){
  e.preventDefault();
  return false;
}

function run_func(func_name){
  switch(func_name){
    case "get_boxes":
      write_chat_message(" - rendering boxes")
      get_boxes();
      break;
    case "get_grid":
      write_chat_message(" - rendering grid items")
      get_grid();
      break;
    case "test":
      write_chat_message(" - running test call")
      do_test();
      break;
  }
}

function do_test(){
  socket.emit('test', function(response){
    console.log(response);
  })
}

var box_data = {};

function write_chat_message(message){
  var li = document.createElement('li');
  var p = document.createElement('p');
  p.appendChild(document.createTextNode(message));
  li.appendChild(p)

  document.getElementById("messages").appendChild(li);

  li.scrollIntoView();
}

function get_boxes(){
  socket.emit('world.get_boxes', function(boxes){
    boxes.forEach(function(ele){
      socket.emit('world.get_box_details', ele, function(data){
        box_data[ele] = data;
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