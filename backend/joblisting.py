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

            if int(jobListingData['work_hours']) < 1:
                return jsonify({"Error": "Work hours must be greater than 0"}), 403

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
                "hours": int(jobListingData['work_hours']),
            }

            document = prepare_document('jobListings', variables)

            current_app.config['DB'].Insert("jobListings", document)

            return jsonify({"Success": "Job listing created successfully"}), 200
        except Exception as e:
            print("Error:", e)
            return jsonify({"Error": "There has been an error, please try again later"}), 403

    return {}, 200


@jobListing.route("/getJobListingById", methods=["GET"])
def getJobListingById():
    if request.method == 'GET':
        job_id = request.args.get('currentJobIdFromSearch')

        if not job_id:
            return jsonify({"Error": "No job id provided"}), 403

        job = current_app.config['DB'].Find(
            "jobListings", {"_id": job_id})

        if not job:
            return jsonify({"Error": "No job found"}), 403

        job['location'] = job.get(
            'location', None) or "Remote"
        job['hours'] = job.get('hours', None) or 0

        newJob = {
            "id": job['_id'],
            "user_id": job['user_id'],
            "title": job['title'],
            "description": job['description'],
            "category": job['category'],
            "additional_information": job['additional_information'],

            "tags": {
                "payment_type": job['payment_type'],
                "payment_amount": str(job['payment_amount']),
                "start_date": job['start_date'],
                "days": job['days'],
                "category": job['category'],
                "hours": job['hours'],
            },

            "posted_at": job['created_at'],
            "location": job['location'],
        }

        return jsonify(newJob), 200

    return {}, 200


@jobListing.route("/getJobListings", methods=["GET"])
def getJobListings():
    if request.method == 'GET':
        jobListings = list(current_app.config['DB'].FindAll("jobListings", {}))

        if not jobListings:
            return jsonify({"Error": "No job listings found"}), 403

        newJobListings = []

        for job in jobListings:
            job['location'] = job.get(
                'location', None) or "Remote"
            job['hours'] = job.get('hours', None) or 0

            newJob = {
                "id": job['_id'],
                "user_id": job['user_id'],
                "title": job['title'],
                "description": job['description'],
                "category": job['category'],
                "additional_information": job['additional_information'],

                "tags": {
                    "payment_type": job['payment_type'],
                    "payment_amount": str(job['payment_amount']),
                    "start_date": job['start_date'],
                    "days": job['days'],
                    "category": job['category'],
                    "hours": job['hours'],
                },

                "posted_at": job['created_at'],
                "location": job['location'],
            },

            newJobListings.append(newJob)

        return jsonify(newJobListings), 200


@jobListing.route("/getUserByIdForJobListing", methods=["GET"])
def getUserByIdForJobListing():
    if request.method == 'GET':
        user_id = request.args.get('user_id')

        if not user_id:
            return jsonify({"Error": "No user id provided"}), 403

        user = current_app.config['DB'].Find(
            "users", {"_id": user_id})

        if not user:
            return jsonify({"Error": "No user found"}), 403

        newUserData = {
            "id": user['_id'],
            "name": user['first_name'] + " " + user['last_name'],
        }

        return jsonify(newUserData), 200

    return {}, 200
