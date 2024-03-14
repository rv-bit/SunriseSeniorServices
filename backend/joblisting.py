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
                "category": jobListingData['options'].get('category')[0],

                # optional
                "additional_information": jobListingData['additional_information'],
                "payment_type": jobListingData['options'].get('payment_type')[0],
                "payment_amount": int(jobListingData['payment']),
                "start_date": jobListingData['start_date'],
                "days": jobListingData['days'],
            }

            document = prepare_document('jobListings', variables)

            current_app.config['DB'].Insert("jobListings", document)

            return jsonify({"Success": "Job listing created successfully"}), 200
        except Exception as e:
            print("Error:", e)
            return jsonify({"Error": "There has been an error, please try again later"}), 403

    return {}, 200


@jobListing.route("/getJobListings", methods=["GET"])
@login_required
def getJobListings():
    if not current_user.is_authenticated:
        return jsonify({"Error": "You are not logged in"}), 403

    jobListings = list(current_app.config['DB'].FindAll("jobListings", {}))

    if not jobListings:
        return jsonify({"Error": "No job listings found"}), 403

    newJobListings = []

    for job in jobListings:
        job['location'] = job.get(
            'location', None) or "Remote"

        newJob = {
            "id": job['_id'],
            "title": job['title'],
            "description": job['description'],
            "category": job['category'],
            "additional_information": job['additional_information'],

            "tags": {
                "payment_amount": str(job['payment_amount']) + " " + job['payment_type'],
                "start_date": job['start_date'],
                "days": job['days'],
                "category": job['category']
            },

            "posted_at": job['created_at'],
            "location": job['location'],
        },

        newJobListings.append(newJob)

    return jsonify(newJobListings), 200
