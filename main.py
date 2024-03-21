import os

from flask import render_template
from backend import initializeApp, socketio

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
    # app.run(debug=True, port=5000)
    socketio.run(app, debug=True, port=5000)
