import os
from flask_socketio import SocketIO

from dotenv import load_dotenv

load_dotenv()

if os.environ.get("NODE_ENV") == "production":
    origins = [
        os.environ.get("VITE_SOCKET_URL"),
    ]
else:
    origins = "*"

print("Origins:", origins)

socketio = SocketIO(cors_allowed_origins=origins)
