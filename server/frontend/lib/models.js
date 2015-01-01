var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tbg')
var db = mongoose.connection;
var yaml = require('yamljs');
var path = require('path');

var game_config = yaml.load(path.resolve('../config/game.yml'));

var starSchema = new mongoose.Schema({
  color: String,
  count: Number,
  offset: { 
    x: Number, 
    y: Number 
  },
  location: [Number]
})

starSchema.virtual('type').get(function(){ return 'star'; })
starSchema.index({ location: '2d' }, { min: game_config['grid']['size']['min'], max: game_config['grid']['size']['max'] })

var shipSchema = new mongoose.Schema({
  name: String,
  location: [Number]
})

shipSchema.virtual('type').get(function(){ return 'ship'; })
shipSchema.index({ location: '2d' }, { min: game_config['grid']['size']['min'], max: game_config['grid']['size']['max'] })

module.exports  = {
  Star: mongoose.model('Star', starSchema),
  Ship: mongoose.model('Ship', shipSchema)
}