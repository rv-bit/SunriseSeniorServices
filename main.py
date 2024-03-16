import os

from flask import render_template

from backend import initializeApp
from flask_restful import Api

app = initializeApp()
api = Api(app)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


if __name__ == "__main__":
    app.run()
