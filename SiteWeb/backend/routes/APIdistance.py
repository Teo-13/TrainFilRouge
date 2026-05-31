from flask import Blueprint, jsonify, request
import requests
from flask_cors import cross_origin

from geopy.geocoders import Nominatim
from geopy.distance import geodesic

from utils.voiture import donneeVoiture
from utils.train import donneeTrain


distance_bp = Blueprint('distance', __name__)

@distance_bp.route('/', methods=['POST', 'OPTIONS'])
@cross_origin()  
def distance():
    if request.method == 'OPTIONS':
        return '', 200
    # ===== récupération des données du formualire ====
    data = request.json or {}
    villeDepart = data.get("villeDepart", "").strip() 
    villeArrivee = data.get("villeArrivee", "").strip() 
    temps = data.get("temps", "non")
    prix = data.get("prix", "non")
    emission_co2 = data.get("EmissionCo2", "non")
    

    print(f'Ville de départ : {villeDepart} et ville d\'arrivée : {villeArrivee}')
    print(f'Options - Rapide: {temps}, Moins cher: {prix}, Eco: {emission_co2}')

    # === Vérification des valeurs =====
    if not villeDepart or not villeArrivee:
         print("Veuillez fournir les deux villes.")
         return jsonify({"error": "Veuillez fournir les deux villes."}), 400
    
    # ===== Calcule Voiture =======
    voitureName, voitureEmissions, voitureTemps_heures, voitureDistance_km, voiturePrix = donneeVoiture(villeDepart,villeArrivee)
    
    # ===== Calcule avion =======
    

    # ===== Calcule train =======
    trainData = donneeTrain(villeDepart, villeArrivee)
    

    # =====================
    print("\n--- RÉSULTATS ---")
    print(f"Transport : {voitureName}")
    print(f"Émissions : {voitureEmissions} kgCO2e")
    print(f"Temps : {voitureTemps_heures} heures")
    print(f"Distance : {voitureDistance_km:.2f} mètres")
    print(f"Prix voiture : {voiturePrix:.2f} €")



    return jsonify({
        "status": "success",
        # ====== donner voiture ========
        "voitureName": voitureName,
        "voitureEmissions": voitureEmissions,
        "voitureTemps_heures": voitureTemps_heures,
        "voitureDistance_km": voitureDistance_km,
        "voiturePrix": voiturePrix,
        # ======= donner train =========
        "trainName": trainData["trainName"],
        "trainEmissions": trainData["trainEmissions"],
        "trainTemps_minutes": trainData["trainTemps_minutes"],
        "trainTemps": trainData["trainTemps"],
        "trainDistance_km": trainData["trainDistance_km"],
        "trainPrix": trainData["trainPrix"],
        "trainPrixSource": trainData["trainPrixSource"],
        "trainGareDepart": trainData["trainGareDepart"],
        "trainGareArrivee": trainData["trainGareArrivee"],
        "trainDepart": trainData["trainDepart"],
        "trainArrivee": trainData["trainArrivee"],
        "trainLignes": trainData["trainLignes"],
        "trainSource": trainData["trainSource"],
    })
