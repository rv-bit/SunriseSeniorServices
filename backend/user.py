import uuid


class User():
    def __init__(self, userData):
        self.id = userData['_id']
        self.userData = userData

    @classmethod
    def make_from_dict(cls, d):
        return cls(d)

    def get_user_info(self):
        return self.userData

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
        return self.id or None


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
