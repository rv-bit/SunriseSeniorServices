from backend.user import User, Anonymous
import os

from flask import render_template
from flask_login import LoginManager

from backend import initializeApp

from backend.db import DB
from backend.services import socketio

app = initializeApp()

if os.environ.get("NODE_ENV") == "production":
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def catch_all(path):
        return render_template("index.html")

    @app.errorhandler(404)
    def not_found(e):
        return app.send_static_file('index.html')

if __name__ == "__main__":
    if os.environ.get("NODE_ENV") == "production":
        socketio.run(app)
    else:
        socketio.run(app, debug=True)
