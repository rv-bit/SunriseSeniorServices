from backend import initializeApp
from flask_restful import Api

app = initializeApp()
api = Api(app)

if __name__ == "__main__":
    app.run()
