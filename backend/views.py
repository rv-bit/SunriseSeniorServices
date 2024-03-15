import os

from flask import jsonify, Blueprint, render_template, request
from flask_login import current_user

views = Blueprint('views', __name__)

if os.environ.get("NODE_ENV") == "production":
    print("NODE_ENV is production")

    @views.route('/', defaults={'path': ''})
    @views.route('/<path:path>')
    def catch_all(path):
        return render_template("index.html")


@views.route("/", methods=["GET"])
def home():
    if not current_user.is_authenticated:
        return jsonify({"user": "Anonymous"}), 200

    if request.method == "GET":
        return jsonify({"user": current_user.get_user_info()}), 200

    return {}, 200
