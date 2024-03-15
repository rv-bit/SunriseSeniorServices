import os

from flask import jsonify, Blueprint, render_template, request
from flask_login import login_required, current_user

views = Blueprint('views', __name__)

if os.environ.get("NODE_ENV") == "production":
    @views.route('/', defaults={'path': ''})
    @views.route('/<path:path>')
    def catch_all(path):
        return render_template("index.html")


@views.route("/", methods=["GET"])
def home():
    if request.method == "GET":
        if current_user.is_authenticated:
            return jsonify({"user": current_user.get_user_info()}), 200

        return jsonify({"user": "Anonymous"}), 200

    return {}, 200
