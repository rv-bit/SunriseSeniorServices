from flask import jsonify, Blueprint, render_template, request
from flask_login import login_required, current_user

chat = Blueprint('chat', __name__)


@chat.route("/chat", methods=["GET", "POST"])
@login_required
def getChats():
    if request.method == 'GET':
        chats = {i: f"Chat {i}" for i in range(100)}

        return jsonify({"chats": chats}), 200

    return {}, 200
