module GameLoop
  def self.run
    Star.each do |star|
      star.count += (star.count / 4).to_i
      star.save!
    end
  end
end