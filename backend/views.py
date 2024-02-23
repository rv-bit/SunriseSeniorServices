from flask import redirect, render_template, Blueprint, request, send_from_directory, url_for, current_app

views = Blueprint('views', __name__)


@views.route('/', defaults={'path': ''})
@views.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")


@views.route("/chat", methods=["GET"])
def chat():
    chats = {i: f"Chat {i}" for i in range(100)}

    return chats
