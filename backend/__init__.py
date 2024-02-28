import os
from flask import Flask
from flask_login import LoginManager


def initializeApp():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.urandom(24)

    from backend.views import views
    from backend.auth import auth
    from backend.db import DB

    app.register_blueprint(views, url_prefix="/")
    app.register_blueprint(auth, url_prefix="/")

    app.config["DB"] = DB(os.environ.get("MONGO_URI"))

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
            user['id'] = user['_id']
            return User.make_from_dict(user)
        return None

    return app
