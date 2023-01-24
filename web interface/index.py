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


import os

from flask import Flask

def create_app():
    # create and configure the app
    app = Flask(__name__)

    app.config.from_mapping(
        SECRET_KEY='dev'
    )

    # a simple page that says hello
    @app.route('/')
    def home():
      return app.send_static_file('index.html')
        

    return app

app = create_app()
app.run()