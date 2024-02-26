from datetime import timedelta
import uuid

from flask import current_app, Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from email.utils import parseaddr
from flask_login import login_user, logout_user, login_required, current_user

from backend.user import User

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
        else:
            _id = uuid.uuid4().hex
            created_user = current_app.config['DB'].Insert(
                'users', {"_id": _id, "email": email, "password": generate_password_hash(password, method='pbkdf2', salt_length=16), "username": username})

            if not created_user:
                return jsonify({"Error": "Error creating user please try again later"}), 403

            print("Created user:", created_user)
            user = User(username,
                        email, _id)
            login_user(user, remember=True)
            return jsonify({"user": current_user.dict()}), 200

    return {}, 200


@auth.route('/logout')
@login_required
def logout():
    if current_user.is_authenticated:
        logout_user()
        return {}, 200

    return {}, 403
