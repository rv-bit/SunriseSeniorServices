import os

from flask import jsonify, Blueprint, render_template, request
from flask_login import current_user

views = Blueprint('views', __name__)


@views.route("/home", methods=["GET"])
def home():
    if not current_user.is_authenticated:
        return jsonify({"user": "Anonymous"}), 200

    if request.method == "GET":
        return jsonify({"user": current_user.get_user_info()}), 200

    return render_template('index.html'), 200
