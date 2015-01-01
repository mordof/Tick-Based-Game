class Ship
  include Mongoid::Document
  field :name, type: String
  field :location, type: Array

  index({ location: '2d' }, { min: -400, max: 400 })
end