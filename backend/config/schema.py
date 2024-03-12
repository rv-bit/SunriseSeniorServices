import datetime
import uuid


def USER_TABLE():
    return {
        "_id": {"default_value": uuid.uuid4().hex, "type": str, "required": True},
        "password": {"default_value": "", "type": str, "required": True},
        "email": {"default_value": "", "type": str, "required": True},
        "first_name": {"default_value": "", "type": str, "required": True},
        "last_name": {"default_value": "", "type": str, "required": True},
        "phone": {"default_value": "", "type": str, "max_length": 10, "required": True},
        "dob": {"default_value": "", "type": str, "required": True},

        # helper, requester
        "account_type": {"default_value": "helper", "type": list},
        "account_preferences": {"default_value": [], "type": list},

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
        "category": {"default_value": "", "type": str, "required": True},

        "tags": {"default_value": [], "type": list, "required": True},
        "days": {"default_value": [], "type": list, "required": True},

        "created_at": {"default_value": datetime.datetime.utcnow().strftime('%Y-%m-%d-%H-%M-%S'), "type": str},
    }
