import os

from flask import Flask
from flask_login import LoginManager

from backend.services import socketio


def initializeApp():
    static_folder = 'static'
    template_folder = 'templates'

    if os.environ.get("NODE_ENV") == "production":
        static_folder = '../frontend/dist'
        template_folder = '../frontend/dist'

    app = Flask(__name__, static_folder=static_folder,
                template_folder=template_folder, static_url_path="")

    app.config["SECRET_KEY"] = os.urandom(24)

    from backend.db import DB

    app.config["DB"] = DB()

    from backend.views import views
    from backend.auth import auth
    from backend.chats import chat

    from backend.joblisting import jobListing
    from backend.geolocation import geoLocation

    app.register_blueprint(auth, url_prefix="/")
    app.register_blueprint(chat, url_prefix="/")
    app.register_blueprint(jobListing, url_prefix="/")
    app.register_blueprint(views, url_prefix="/")
    app.register_blueprint(geoLocation, url_prefix="/")

    from backend.user import User, Anonymous

    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.anonymous_user = Anonymous
    login_manager.login_view = "auth.login"
    login_manager.session_protection = "strong"

    @login_manager.user_loader
    def load_user(user_id):
        user = app.config["DB"].Find("users", {"_id": user_id})
        if user:
            return User.make_from_dict(user)
        return None

    socketio.init_app(app)

    return app
