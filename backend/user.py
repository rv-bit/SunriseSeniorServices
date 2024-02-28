import uuid


class User():
    def __init__(self, username, email, id):
        self.username = username
        self.email = email
        self.id = uuid.uuid4().hex if not id else id

    @classmethod
    def make_from_dict(cls, d):
        return cls(d['username'], d['email'], d['id'])

    def dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id


# Anonymous user class
class Anonymous():
    @property
    def is_authenticated(self):
        return False

    @property
    def is_active(self):
        return False

    @property
    def is_anonymous(self):
        return True

    def get_id(self):
        return None
