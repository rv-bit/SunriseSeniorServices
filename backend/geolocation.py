from dotenv import load_dotenv
import os
from flask import jsonify, Blueprint, render_template, request
from flask_login import current_user
import requests

geoLocation = Blueprint('geoLocation', __name__)


load_dotenv()


@geoLocation.route("/searchPostCodeGeo", methods=["GET"])
def getGeoLocationPossibleCities():
    # if not current_user.is_authenticated:
    #     return jsonify({"user": "Anonymous"}), 200

    if request.method == 'GET':
        postCode = request.args.get('postCode')

        if not postCode:
            return jsonify({"Error": "No post code provided"}), 403

        postCode = postCode.upper()

        informationOfPostCode = requests.get(
            'https://maps.googleapis.com/maps/api/geocode/json?address=' + postCode + '&components=country:GB&key=' + os.environ.get("VITE_GOOGLE_MAPS_API_KEY")).json()

        print(informationOfPostCode)

        if not informationOfPostCode['status'] == 'OK':
            return jsonify({"Error": "No results found"}), 403

        allData = []
        filteredResults = []

        if 'postcode_localities' not in informationOfPostCode['results'][0]:
            post_code = [component for component in informationOfPostCode['results'][0]['address_components']
                         if 'postal_code' in component['types']]

            if not post_code:
                return jsonify({"Error": "No results found"}), 403

            postal_town = [component for component in informationOfPostCode['results'][0]['address_components']
                           if 'postal_town' in component['types']]

            if not postal_town:
                return jsonify({"Error": "No results found"}), 403

            filteredResults.append({
                "post_code": post_code[0]['long_name'],
                "postal_town": postal_town[0]['long_name'],
                "formatted_address": informationOfPostCode['results'][0]['formatted_address'],
            })

            return jsonify({"data": filteredResults}), 200

        # Filter results to include only those with the correct postcode
        for data in informationOfPostCode['results'][0]['postcode_localities']:
            information = requests.get(
                'https://maps.googleapis.com/maps/api/geocode/json?address=' + data + '&key=' + os.environ.get("VITE_GOOGLE_MAPS_API_KEY")).json()

            if not information['status'] == 'OK':
                continue

            allData.append(information)

        for data in allData:
            filteredCityResults = [result for result in data['results']
                                   if any(component for component in result['address_components']
                                          if 'postal_code' in component['types'] and postCode in component['long_name'])]
            if filteredCityResults:
                post_code = [component for component in filteredCityResults[0]['address_components']
                             if 'postal_code' in component['types']]

                if not post_code:
                    continue

                postal_town = [component for component in filteredCityResults[0]['address_components']
                               if 'postal_town' in component['types']]

                if not postal_town:
                    continue

                filteredResults.append({
                    "post_code": post_code[0]['long_name'],
                    "postal_town": postal_town[0]['long_name'],
                    "formatted_address": filteredCityResults[0]['formatted_address'],
                })

        return jsonify({"data": filteredResults}), 200

    return render_template('index.html'), 200
