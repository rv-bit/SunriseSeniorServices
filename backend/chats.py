from flask import current_app, jsonify, Blueprint, render_template, request
from flask_login import current_user, login_required
from pymongo import DESCENDING

from backend.utils.prepare_document import prepare_document
from backend.services import socketio

from flask_socketio import join_room, leave_room, emit

chat = Blueprint('chat', __name__)


@socketio.on('connectChat')
def connectChat(data):
    join_room(data['chat_id'])


@socketio.on('disconnectChat')
def disconnectChat(data):
    leave_room(data['chat_id'])


@socketio.on('sendMessage')
def sendMessage(data):
    try:
        variables = {
            "chat_id": data['chat_id'],
            "message": data['message'],
            "sender_id": data['sender_id']
        }

        document = prepare_document('messages', variables)

        current_app.config['DB'].Insert("messages", document)

        senderInformation = current_app.config['DB'].Find(
            "users", {"_id": data['sender_id']})

        data["sender"] = {
            "first_name": senderInformation["first_name"],
            "last_name": senderInformation["last_name"]
        }

        data["created_at"] = document["created_at"]
        emit('receiveMessage', data, room=data['chat_id'], broadcast=True)
    except Exception as e:
        print("Error:", e)


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
        # This goes through the cursor and creates a list of documents, which is then returned as a JSON object
        # where the member's ID is inside the members list

        chats = current_app.config['DB'].FindAll(
            "chats", {"members": current_user.get_id()})

        # Add the last message and date to each chat
        for chat in chats:
            lastMessage = current_app.config['DB'].FindAll(
                "messages",
                {"chat_id": chat['_id']},
                sort=[("created_at", DESCENDING)],
                limit=1
            )

            if lastMessage:
                chat['last_message'] = lastMessage[0]['message']
                chat['last_message_date'] = lastMessage[0]['created_at']

        # Convert the dictionary to a list of chats
        chats = [doc for doc in chats]
        return jsonify({"chats": chats}), 200

    return render_template('index.html'), 200


@chat.route("/gatherMessagesByChat", methods=["POST"])
def gatherMessagesByChat():
    if not current_user.is_authenticated:
        return jsonify({"Error": "Unauthorized"}), 403

    if request.method == 'POST':
        data = request.json.get('chatId')

        if not data:
            return jsonify({"Error": "No data provided"}), 403

        cursor = current_app.config['DB'].FindAll(
            "messages", {"chat_id": data})

        messages = [doc for doc in cursor]

        senderInformation = current_app.config['DB'].Find(
            "users", {"_id": messages[0]['sender_id']})

        for message in messages:
            message['sender'] = {
                "first_name": senderInformation['first_name'],
                "last_name": senderInformation['last_name']
            }

        return jsonify({"messages": messages}), 200

    return render_template('index.html'), 200
