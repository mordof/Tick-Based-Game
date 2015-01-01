var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tbg')
var db = mongoose.connection;

var starSchema = new mongoose.Schema({
  color: String,
  count: Number,
  offset: { 
    x: Number, 
    y: Number 
  },
  location: [Number]
})

starSchema.index({ location: '2d' }, { min: -400, max: 400 })

module.exports  = {
  Star: mongoose.model('Star', starSchema)
}