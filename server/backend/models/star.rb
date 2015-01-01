class Star
  include Mongoid::Document
  field :color, type: String
  field :count, type: Integer
  field :offset, type: Hash
  field :location, type: Array

  index({ location: '2d' }, { min: -400, max: 400 })
end