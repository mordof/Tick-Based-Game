var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tbg')
var db = mongoose.connection;

var starSchema = new mongoose.Schema({
  color: String,
  offset: { 
    x: Number, 
    y: Number 
  }
})

var boxSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  properties: { 
    item_value: Number 
  }
})

module.exports  = {
  Star: mongoose.model('Star', starSchema),
  Box: mongoose.model('Box', boxSchema)
}