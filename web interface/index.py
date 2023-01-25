import os

from flask import Flask, session, render_template, request
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
      # print(request, request.method, request.form)
      if request.method == "POST":
        params = {"load": 0, "base_mass":35000, "force":100000, "req_speed":140}


        try:

          # defaults
          for n,v in request.form.items():
            # print(n,v)
            if v != "":
              params[n] = int(v)
          # print(params)
          # line was too long
          load, base_mass = params["load"], params["base_mass"]
          force, req_speed =params["force"], params["req_speed"]


          time, warning = time_till_takeoff(load, base_mass, force, req_speed)
          if warning:
            session['warning'] = warning
          session['time'] = time
          session['distance'] = distance_till_takeoff(load, base_mass, force, req_speed)

        except (AssertionError, ValueError):
          session['distance'] = "N/A"
          session['time'] = "N/A"
          session['warning'] = "Invalid Input"
          return render_template('index.html')

      
        session['time'] = round(session['time'], 2)
        session['distance'] = round(session['distance'], 2)

      else:
        session['time'] = ""
        session['distance'] = ""
        session['warning'] = ""
      return render_template('index.html')

    return app

app = create_app()
app.run()