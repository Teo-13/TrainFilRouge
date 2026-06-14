from flask import Blueprint, jsonify, request
import requests
from flask_cors import cross_origin

from geopy.geocoders import Nominatim
from geopy.distance import geodesic



activiter_bp = Blueprint('activiter', __name__)

@activiter_bp.route('/', methods=['POST', 'OPTIONS'])
@cross_origin()  
def activiter():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.json or {}
    suite = data.get("suite").strip()
    ville = data.get("ville").strip()
    codePostal = data.get("codePostal").strip()
    departement = data.get("departement").strip()
    region = data.get("region").strip()

    print(data)
    