module GameLoop
  def self.run
    red_star = Star.where( color: 'red' ).first
    red_star.count += (red_star.count / 4).to_i
    red_star.save!

    blue_star = Star.where( color: 'blue' ).first
    blue_star.count += (blue_star.count / 4).to_i
    blue_star.save!
  end
end