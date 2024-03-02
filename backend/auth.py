import datetime
import os
import uuid
import requests

from flask import current_app, Blueprint, jsonify, request
from flask_login import login_user, logout_user, login_required, current_user

from backend.user import User

from werkzeug.security import generate_password_hash, check_password_hash
from email.utils import parseaddr
from datetime import timedelta

from backend.utils.prepare_document import prepare_document

auth = Blueprint('auth', __name__)


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.json.get('email')
        password = request.json.get('password')

        users = current_app.config['DB'].Get('users')
        userFound = users.find_one({"email": email})

        if not userFound:
            return jsonify({"Error": "This user was not found, please try again later."}), 400

        if not check_password_hash(userFound['password'], password):
            return jsonify({"Error": "Password was incorrect, please try again"}), 400
        else:
            user = User(userFound['username'],
                        userFound['email'], userFound['_id'])
            login_user(user, duration=timedelta(days=1))
            return jsonify({"user": current_user.dict()}), 200

    return {}, 403


@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.json.get('email')
        password = request.json.get('password')
        password2 = request.json.get('password2')
        username = request.json.get('username')

        if password != password2 or not password:
            return jsonify({"Error": "Passwords dont match"}), 400
        elif current_app.config['DB'].Find('users', {"email": email}):
            return jsonify({"Error": "User Already Exists"}), 400
        elif parseaddr(email) == ('', '') or '@' not in email or '.' not in email:
            return jsonify({"Error": "Invalid email"}), 400
        elif not username:
            return jsonify({"Error": "Invalid username"}), 400

        try:
            _id = uuid.uuid4().hex

            variables = {
                "_id": _id,
                "email": email,
                "password": generate_password_hash(password, method='pbkdf2', salt_length=16),
                "username": username,
            }

            user_data = prepare_document('users', variables)

            print("User data:", user_data)

            created_user = current_app.config['DB'].Insert('users', user_data)
            if not created_user:
                return jsonify({"Error": "Error creating user please try again later"}), 403

            userObject = User(username, email, _id)
            login_user(userObject, remember=True)
            return jsonify({"user": current_user.dict()}), 200
        except Exception as e:
            print("Error:", e)
            return jsonify({"Error": "There has been an error, please try again later"}), 400

    return {}, 200


@auth.route('/google/checkAccount', methods=['GET', 'POST'])
def googleCheckAccount():
    if request.method == 'POST':
        auth_code = request.json.get('code')

        if not auth_code:
            return jsonify({"Error": "No auth code provided"}), 400

        data = {
            'code': auth_code,
            'client_id': os.environ.get("VITE_GOOGLE_CLIENT_ID"),
            'client_secret': os.environ.get("VITE_GOOGLE_CLIENT_SECRET"),
            'redirect_uri': 'postmessage',
            'grant_type': 'authorization_code'
        }

        response = requests.post(
            'https://oauth2.googleapis.com/token', data=data).json()
        headers = {
            'Authorization': f'Bearer {response["access_token"]}'
        }
        user_info = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo', headers=headers).json()

        if not user_info:
            return jsonify({"Error": "Error getting user info"}), 400

        user = current_app.config['DB'].Find(
            'users', {"email": user_info['email']})

        if user:
            user = User(user['username'], user['email'], user['_id'])
            login_user(user, duration=timedelta(days=1))
            print("User:", user.dict())
            return jsonify({"accountExistsAlready": True, "user": current_user.dict()}), 200

        print("User:", user_info)

        return jsonify(user_info), 200

    return {}, 200


@auth.route('/logout')
@login_required
def logout():
    if current_user.is_authenticated:
        logout_user()
        return {}, 200

    return {}, 403
