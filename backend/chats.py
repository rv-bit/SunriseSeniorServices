from flask import current_app, jsonify, Blueprint, render_template, request
from flask_login import current_user

from backend.utils.prepare_document import prepare_document
from backend.services import socketio

chat = Blueprint('chat', __name__)


@socketio.on('connect')
def connect():
    print("Connected")


@chat.route("/createChat", methods=["POST"])
def createChat():
    if not current_user.is_authenticated:
        return jsonify({"Error": "Unauthorized"}), 403

    if request.method == 'POST':
        data = request.json.get('data')

        if not data:
            return jsonify({"Error": "No data provided"}), 403

        if data['members'] is None:
            return jsonify({"Error": "No members provided"}), 403

        chat = current_app.config['DB'].Find("chats", {"_id": data['id']})

        if chat:
            return jsonify({"chatExists": True}), 200

        try:
            variables = {
                "_id": data['id'],
                "members": data['members'],
                "name": data['name']
            }

            document = prepare_document('chats', variables)

            current_app.config['DB'].Insert("chats", document)

            return jsonify({"Success": "Chat created successfully"}), 200
        except Exception as e:
            print("Error:", e)
            return jsonify({"Error": "There has been an error, please try again later"}), 403

    return render_template('index.html'), 200


@chat.route("/gatherChats", methods=["GET"])
def gatherChats():
    if not current_user.is_authenticated:
        return jsonify({"Error": "Unauthorized"}), 403

    if request.method == 'GET':
        cursor = current_app.config['DB'].FindAll(
            "chats", {"members": current_user.get_id()})

        # This goes through the cursor and creates a list of documents, which is then returned as a JSON object
        # where the member's ID is inside the members list
        chats = [doc for doc in cursor]
        return jsonify({"chats": chats}), 200

    return render_template('index.html'), 200
