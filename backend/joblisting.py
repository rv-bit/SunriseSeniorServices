import uuid

from flask import current_app, jsonify, Blueprint, render_template, request
from flask_login import login_required, current_user

from backend.utils.prepare_document import prepare_document

jobListing = Blueprint('jobListing', __name__)


@jobListing.route("/createJobListing", methods=["GET", "POST"])
@login_required
def createJobListing():
    if not current_user.is_authenticated:
        return jsonify({"Error": "You are not logged in"}), 403

    if request.method == 'POST':
        jobListingData = request.json.get('formData')

        if not jobListingData:
            return jsonify({"Error": "No job listing provided"}), 403

        try:
            _id = uuid.uuid4().hex

            variables = {
                "_id": _id,
                "user_id": current_user.get_id(),

                "title": jobListingData['title'],
                "description": jobListingData['description'],
                "category": jobListingData['category'],

                "tags": jobListingData['tags'],
                "days": jobListingData['days'],
            }

            document = prepare_document('jobListings', variables)

            current_app.config['DB'].Insert("jobListings", document)

            return jsonify({"Success": "Job listing created successfully"}), 200
        except Exception as e:
            print("Error:", e)
            return jsonify({"Error": "There has been an error, please try again later"}), 403

    # if request.method == 'GET':
    #     chats = {i: f"Chat {i}" for i in range(100)}

    #     return jsonify({"chats": chats}), 200

    return {}, 200
