module GameLoop
  def self.run
    Star.each do |star|
      ships = Ship.geo_near(star.location).max_distance(3)
      star.count -= ships.count
      star.save!
    end
  end
end