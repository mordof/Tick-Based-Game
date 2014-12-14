var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tbg')
var db = mongoose.connection;

var starSchema = new mongoose.Schema({
  color: String,
  count: Number,
  offset: { 
    x: Number, 
    y: Number 
  }
})

module.exports  = {
  Star: mongoose.model('Star', starSchema)
}