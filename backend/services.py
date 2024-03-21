import os
from flask_socketio import SocketIO

if os.environ.get("NODE_ENV") == "production":
    origins = [
        "http://actual-app-url.herokuapp.com"
    ]
else:
    origins = "*"

print("Origins:", origins)

socketio = SocketIO(cors_allowed_origins=origins)
