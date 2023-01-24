from math import cos
import json
from equations import getX

with open("params.json") as f:
	params = json.load(f)

"""It would be very simple to add wind resistance
		Using simple trigonometry functions we can calculate the
		force that wind would act out on a plane, whether it would
		be resisting the plane, or giving it a push.
"""

def wind_resistance(a, force):
	# Lets assume that we know the force that 
	# some given speed of wind enacts on the plane.
	# 0 is in the same direction as the plane is moving.
	# 180 is exactly the opposite direction of movement.
	# angle is in radians

	# Positive number = wind is helping the plane
	# Negative = wind is slowing the plane down

	# Force is in newtons
	return force * cos(a)


# a = f/m
# v = t * (f + wind) / m
# 1 = t * (f + wind) / (m * v)
# 1/t = (f + wind)/ (m*v)
# t = (m*v)/(f + wind)



def time_till_takeoff(load_mass, angle_of_wind=0, force=0):

	assert load_mass >= 0
	force_on_the_plane = (params["force"] + wind_resistance(angle_of_wind, force))
	full_mass = (params["base_mass"] + load_mass)
	time = full_mass * params["req_speed"] / force_on_the_plane
	try:
		assert time <= 60
	except AssertionError:


		# t = (m*v)/f
		# 60 = ( (m+x) * v ) / f
		# 60f = (m+x) * v
		# 60f/v = m+x
		# 60f/v-m = x
		# Extra load it takes to make the take off 60s
		max_mass = 60 * force_on_the_plane /  params["req_speed"] - params["base_mass"]
		x = load_mass- max_mass
		# Within .001kg percision
		raise ValueError(f"Plane unencumbered. Please remove {round(x, 3)}kg from the plane.")
	else:
		return round(time, 3)


def distance_till_takeoff(load_mass, angle_of_wind=0, force=0):
	assert load_mass >= 0

	full_mass = params["base_mass"] + load_mass
	a = params["force"] / full_mass
	t = time_till_takeoff(load_mass, angle_of_wind, force)
	return round(getX(a=a, t=t, x0=0, v0=0), 3)


if __name__ == "__main__":


	load = input("Please input load (default 0) > ")
	if not load:
		load = "0"
	assert load.isnumeric()
	load = int(load)
	assert load >= 0

	print("0, 0")
	angle = 0
	force = 0

	print(f"\nT-{time_till_takeoff(load, angle_of_wind=angle, force=force)}s", )
	print(f"{distance_till_takeoff(load, angle_of_wind=angle, force=force)}m runway required\n")


	print("30, 10,000N")
	angle = 30
	force = 10_000

	print(f"\nT-{time_till_takeoff(load, angle_of_wind=angle, force=force)}s", )
	print(f"{distance_till_takeoff(load, angle_of_wind=angle, force=force)}m runway required\n")

	print("210, 10,000N")
	angle = 210
	force = 10_000

	print(f"\nT-{time_till_takeoff(load, angle_of_wind=angle, force=force)}s", )
	print(f"{distance_till_takeoff(load, angle_of_wind=angle, force=force)}m runway required\n")