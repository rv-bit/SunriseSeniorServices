from backend import initializeApp
from flask_cors import CORS  # comment this on deployment

app = initializeApp()
CORS(app)  # comment this on deployment

if __name__ == "__main__":
    app.run(port=5000, debug=True)
