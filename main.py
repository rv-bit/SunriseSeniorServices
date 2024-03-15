import os

from backend import initializeApp
from flask_restful import Api

app = initializeApp()
api = Api(app)

if os.environ.get("NODE_ENV") == "production":
    @app.errorhandler(404)
    def not_found(e):
        return app.send_static_file('index.html')


if __name__ == "__main__":
    app.run()
