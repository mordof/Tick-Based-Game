module GameLoop
  def self.run
    # Star.each do |star|
    #   star.count += (star.count / 4).to_i
    #   star.save!
    # end

    Ship.each do |ship|
      ship.location = [1 + rand(10), 1 + rand(10)]
      ship.save!
    end
  end
end