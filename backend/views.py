from flask import jsonify, Blueprint, request
from flask_login import login_required, current_user

views = Blueprint('views', __name__)


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
    chats = {i: f"Chat {i}" for i in range(100)}

    return chats
