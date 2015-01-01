require 'yaml'

class Star
  include Mongoid::Document
  field :color, type: String
  field :count, type: Integer
  field :offset, type: Hash
  field :location, type: Array

  game_config = YAML.load_file '../config/game.yml'

  index({ location: '2d' }, { min: game_config['grid']['size']['min'], max: game_config['grid']['size']['max'] })
end