import json
from equations import getX
def cache(function):
  memory = {}
  def wrapper(*args):
    if args in memory:
      return memory[args]
    else:
      result = function(*args)
      memory[args] = result
      return result
  return wrapper

### time_till_takeoff
# speed required for lift off = 140m/s
# max time for lift off is 60s

# F = 10^5 N
# m = 3.5*10^4 + X

# IF x = 0

# a = f/m
# v = t * f / m
# 1 = t * f / (m * v)
# 1/t = f / (m*v)

# t = (m*v)/f
# t = (m * 140) / 100,000

@cache
def time_till_takeoff(m, base_mass=35000, force=100000, req_speed=140):

	assert m >= 0


	full_mass = (base_mass + m)
	time = full_mass * req_speed / force
	try:
		assert time <= 60
	except AssertionError:


		# t = (m*v)/f
		# 60 = ( (m+x) * v ) / f
		# 60f = (m+x) * v
		# 60f/v = m+x
		# 60f/v-m = x

		
		# Extra load it takes to make the take off 60s
		max_mass = 60 * force / req_speed - base_mass
		x = m - max_mass
		# Within .01kg percision
		return time, f"Plane unencumbered. Please remove {round(x, 2)}kg from the plane."
		# raise ValueError(f"Plane unencumbered. Please remove {round(x, 2)}kg from the plane.")
	else:
		return time, None


# check
# 140 = a * t
# a = f/m
# a = 10^5 / 3.5 * 10^4
# a = 10 / 3.5 * m/s^2

# 140 = 10t/3.5
# 14 = t/3.5

#   =======
# || t = 49 ||
#   =======



#### distance_till_takeoff
# xt = x0 + v0 * t + 0.5 * (a * t * t)


# x0 = 0
# v0 = 0
# t = time_till_takeoff(m)
# a = f/(m0+m)


@cache
def distance_till_takeoff(m, base_mass=35000, force=100000, req_speed=140):
	assert m >= 0

	full_mass = base_mass + m
	a = force / full_mass
	t, _ = time_till_takeoff(m, base_mass, force, req_speed)
	return getX(a=a, t=t, x0=0, v0=0)



if __name__ == "__main__":

	load = input("Please input load (default 0) > ")
	if not load:
		load = "0"
	assert load.isnumeric()
	load = int(load)
	assert load >= 0


	print(f"\nT-{time_till_takeoff(load)}s")
	print(f"{distance_till_takeoff(load)}m runway required\n")
