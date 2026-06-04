from flask import Blueprint, jsonify, request
from flask_cors import cross_origin

from utils.calculeCO2 import impactCO2transports


emsissionDistance_bp = Blueprint("emsissionDistance", __name__)


@emsissionDistance_bp.route("/", methods=["POST", "OPTIONS"])
@cross_origin()
def emission_distance():
    if request.method == "OPTIONS":
        return "", 200

    data = request.json or {}
    distance_raw = data.get("distance", 0)

    try:
        distance = float(distance_raw)
    except (TypeError, ValueError):
        return jsonify({"error": "La distance doit etre un nombre."}), 400

    if distance < 0:
        return jsonify({"error": "La distance doit etre positive."}), 400

    return jsonify({
        "status": "success",
        "distance": distance,
        "transports": impactCO2transports(distance),
    })
