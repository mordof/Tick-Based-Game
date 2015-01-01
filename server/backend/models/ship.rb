require 'yaml'

class Ship
  include Mongoid::Document
  field :name, type: String
  field :location, type: Array

  game_config = YAML.load_file '../config/game.yml'

  index({ location: '2d' }, { min: game_config['grid']['size']['min'], max: game_config['grid']['size']['max'] })
end