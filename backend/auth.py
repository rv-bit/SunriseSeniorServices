import datetime
import os
import uuid
import requests

from flask import current_app, Blueprint, jsonify, request
from flask_login import login_user, logout_user, current_user

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

        userFound = current_app.config['DB'].Find('users', {"email": email})

        if not userFound:
            return jsonify({"Error": "This user was not found, please try again later."}), 403

        if password != "automatic" and userFound:
            if not check_password_hash(userFound['password'], password):
                return jsonify({"Error": "Password was incorrect, please try again"}), 403

        if 'password' in userFound:
            del userFound['password']

        user = User(userFound)
        login_user(user, duration=timedelta(days=1))
        return jsonify({"user": current_user.get_user_info()}), 200

    return {}, 403


@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        if request.json.get('checkAccount'):
            email = request.json.get('email')
            user = current_app.config['DB'].Find('users', {"email": email})
            if user:
                return jsonify({"accountExistsAlready": True}), 200

            return jsonify({"accountExistsAlready": False}), 200

        formData = request.json.get('formData')

        if not formData:
            return jsonify({"Error": "No form data provided"}), 403

        try:
            _id = uuid.uuid4().hex

            variables = {
                "_id": _id,
                "email": formData.get('email'),
                "password": generate_password_hash(formData.get('password'), method='pbkdf2', salt_length=16),
                "first_name": formData.get('first_name'),
                "last_name": formData.get('last_name'),

                "account_type": formData.get('options').get('account_type') or "",
                "account_preferences": formData.get('options').get('preferences') or "",

                "phone": formData.get('phone') or "",
                "dob": formData.get('dob') or "",
            }

            user_data = prepare_document('users', variables)

            created_user = current_app.config['DB'].Insert('users', user_data)
            if not created_user:
                return jsonify({"Error": "Error creating user please try again later"}), 403

            if 'password' in user_data:
                del user_data['password']

            userObject = User(user_data)
            login_user(userObject, remember=True)
            return jsonify({"user": current_user.get_user_info()}), 200
        except Exception as e:
            print("Error:", e)
            return jsonify({"Error": "There has been an error, please try again later"}), 403

    return {}, 200


@auth.route('/google/checkAccount', methods=['GET', 'POST'])
def googleCheckAccount():
    if request.method == 'POST':
        auth_code = request.json.get('code')

        if not auth_code:
            return jsonify({"Error": "No auth code provided"}), 403

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
            return jsonify({"Error": "Error getting user info"}), 403

        user = current_app.config['DB'].Find(
            'users', {"email": user_info['email']})

        if user:
            return jsonify({"accountExistsAlready": True, "user": {"email": user['email'], "password": "automatic"}}), 200

        return jsonify(user_info), 200

    return {}, 403


@auth.route('/logout')
def logout():
    if not current_user.is_authenticated:
        return jsonify({"Error": "User is not logged in"}), 403

    if request.method == 'GET':
        logout_user()
        return jsonify({"user": "Anonymous"}), 200

    return {}, 403
