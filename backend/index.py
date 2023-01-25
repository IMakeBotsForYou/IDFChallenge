import os
from flask import Flask, request, render_template
from calculator import time_till_takeoff, distance_till_takeoff


def create_app():
    # create and configure the app
    app = Flask(__name__)

    app.config.from_mapping(
        SECRET_KEY='dev'
    )

    # a simple page that says hello
    @app.route('/', methods=['GET', 'POST'])
    def home():
      if request.method == "POST":

        return_value = {
          'time': "N/A",
          'distance': "N/A",
          'warning': "None"
        }
        params = {"load": 0, "base_mass":35000, "force":100000, "req_speed":140}
        try:
          # Default values = params
          # Switch default values with user input
          # where needed
          for n,v in request.form.items():
            if v != "":
              params[n] = int(v)

          load, base_mass = params["load"], params["base_mass"]
          force, req_speed =params["force"], params["req_speed"]

          time, warning = time_till_takeoff(load, base_mass, force, req_speed)
          if warning:
            return_value['warning'] = warning
          return_value['time'] = round(time, 2)
          return_value['distance'] = round(distance_till_takeoff(load, base_mass, force, req_speed), 2)
        except (AssertionError, ValueError):
          return {
            'distance':"N/A",
            'time': "N/A",
            'warning': "Invalid Input"
          }
        return return_value
      else:
        return {}
    return app

app = create_app()
app.run()