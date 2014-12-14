class Star
  include Mongoid::Document
  field :color, type: String
  field :count, type: Integer
  field :offset, type: Hash
end