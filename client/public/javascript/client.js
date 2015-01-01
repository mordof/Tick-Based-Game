var socket = io();

var waiting_for_username = true;

loginMessage();

function apply_css(ele, css_obj){
  for(key in css_obj){
    if(css_obj.hasOwnProperty(key)){
      ele.style[key] = css_obj[key];
    }
  }
}

function loginMessage() {
  write_chat_message("Please type your username and hit Enter.");
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

        apply_css(grid_item, {
          position: "absolute",
          left: (grid_item_width * x) + "px",
          top: (grid_item_height * y) + "px",
          width: grid_item_width + "px",
          height: grid_item_height + "px"
        })

        if(grid[y][x]){
          var star = document.createElement('div');

          apply_css(star, {
            position: "relative",
            top: grid[y][x].offset.y + "px",
            left: grid[y][x].offset.x + "px",
            border: "2px solid " + grid[y][x].color,
            width: "25px",
            height: "25px",
            backgroundColor: "#fff",
            borderRadius: "25px",
            textAlign: "center",
            lineHeight: "20px",
            fontSize: "10px"
          })

          star.appendChild(document.createTextNode(grid[y][x].count));

          grid_item.appendChild(star);
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
    if(waiting_for_username){
      var username = this.value;
      this.value = "";
      // once we have username, send to server to attempt login;
      socket.emit('login', {"username": username}, function(respObj) {
        if (respObj.status == "error") {
          write_chat_message(respObj.msg);
          loginMessage();
        } else {
          waiting_for_username = false;
          watch_grid();
        }
      });
    } else {
      if(this.value.substr(0,1) == "/"){
        run_func(this.value.substr(1))
        this.value = "";
      } else {
        send_message(this.value)
        this.value = "";
      }
    }
  }
}

document.getElementById("input_form").onsubmit = function(e){
  e.preventDefault();
  return false;
}

var grid_watch_handle = null;

function watch_grid(){
  //start it up the first time right away.
  get_grid();

  grid_watch_handle = setInterval(get_grid, 2000);
}

function run_func(func_name){
  switch(func_name){
    case "stop_grid_updates":
      write_chat_message(" - no longer watching for grid updates")
      clearInterval(grid_watch_handle);
      break;
  }
}

function write_chat_message(message){
  var li = document.createElement('li');
  var p = document.createElement('p');
  p.appendChild(document.createTextNode(message));
  li.appendChild(p)

  document.getElementById("messages").appendChild(li);

  li.scrollIntoView();
}