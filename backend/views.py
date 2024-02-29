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
            print(current_user.dict())
            return jsonify({"user": current_user.dict()}), 200

        return jsonify({"user": "Anonymous"}), 200

    return {}, 200


@views.route("/chat", methods=["GET", "POST"])
@login_required
def chat():
    if request.method == 'GET':
        chats = {i: f"Chat {i}" for i in range(100)}

        return jsonify({"chats": chats}), 200

    return {}, 200
