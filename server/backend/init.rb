require './environment'
require './app/game_loop'

# number of seconds to delay loop execution. 
# loop will fire immediately if more than this delay has passed
delay = 3 

last = Time.now
while true
  GameLoop.run
  now = Time.now
  _next = [last + delay, now].max
  sleep _next - now
  last = _next
end
