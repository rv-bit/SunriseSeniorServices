import datetime
import uuid


def USER_TABLE():
    return {
        "_id": {"default_value": uuid.uuid4().hex, "type": str, "required": True},
        "username": {"default_value": "username", "type": str, "required": True},
        "password": {"default_value": "password", "type": str, "required": True},
        "email": {"default_value": "email", "type": str, "required": True},
        "first_name": {"default_value": "first_name", "type": str, "required": True},
        "last_name": {"default_value": "last_name", "type": str, "required": True},
        "phone": {"default_value": "phone", "type": str, "max_length": 10, "required": True},

        # helper, requester
        "account_type": {"default_value": "helper", "type": str},
        "account_preferences": {"default_value": {}, "type": dict},

        "created_at": {"default_value": datetime.datetime.utcnow().strftime('%Y-%m-%d-%H-%M-%S'), "type": str},
    }


def CHAT_TABLE():
    return {
        "_id": {"default_value": uuid.uuid4().hex, "type": str, "required": True},
        "name": {"default_value": "", "type": str, "required": True},
        "members": {"default_value": [], "type": list, "required": True},

        "created_at": {"default_value": datetime.datetime.utcnow().strftime('%Y-%m-%d-%H-%M-%S'), "type": str},
    }


def MESSAGE_TABLE():
    return {
        "_id": {"default_value": uuid.uuid4().hex, "type": str, "required": True},
        "chat_id": {"default_value": "", "type": str, "required": True},
        "message": {"default_value": "", "type": str, "required": True},

        "created_at": {"default_value": datetime.datetime.utcnow().strftime('%Y-%m-%d-%H-%M-%S'), "type": str},
    }


def JOB_TABLE():
    return {
        "_id": {"default_value": uuid.uuid4().hex, "type": str, "required": True},
        "user_id": {"default_value": "", "type": str, "required": True},
        "title": {"default_value": "", "type": str, "required": True},
        "description": {"default_value": "", "type": str, "required": True},
        "category": {"default_value": "", "type": str},

        "created_at": {"default_value": datetime.datetime.utcnow().strftime('%Y-%m-%d-%H-%M-%S'), "type": str},
    }
