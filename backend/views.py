from flask import jsonify, Blueprint, render_template, request
from flask_login import current_user

views = Blueprint('views', __name__)


@views.route('/')
def index_redir():
    # Reached if the user hits example.com/ instead of example.com/index.html
    return render_template('index.html')


@views.route("/", methods=["GET"])
def home():
    if not current_user.is_authenticated:
        return jsonify({"user": "Anonymous"}), 200

    if request.method == "GET":
        return jsonify({"user": current_user.get_user_info()}), 200

    return {}, 200
