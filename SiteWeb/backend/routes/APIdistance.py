from flask import Blueprint, jsonify, request
import requests
from flask_cors import cross_origin

from geopy.geocoders import Nominatim
from geopy.distance import geodesic

from utils.voiture import donneeVoiture
from utils.train import donneeTrain
from utils.avion import donneeAvion


distance_bp = Blueprint('distance', __name__)


CRITERES_SCORE = [
    ("temps_minutes", "scoreTemps"),
    ("prix", "scorePrix"),
    ("emissions", "scoreEmission"),
]


def _score_metric(transports, key):
    """
    Calcule un score de 0 a 100 pour un critere.

    Ce n'est pas un modele de machine learning: on compare seulement les
    valeurs des transports entre elles. La valeur la plus basse est la
    meilleure, donc elle recoit 100. La plus haute recoit 0.
    Formule: 100 - ((valeur - minimum) / (maximum - minimum)) * 100.
    """
    valeurs = [
        transport[key]
        for transport in transports.values()
        if isinstance(transport.get(key), (int, float)) and transport[key] > 0
    ]

    if not valeurs:
        return {nom: 0 for nom in transports}

    minimum = min(valeurs)
    maximum = max(valeurs)

    if minimum == maximum:
        return {
            nom: 100 if transport.get(key, 0) > 0 else 0
            for nom, transport in transports.items()
        }

    scores = {}
    for nom, transport in transports.items():
        valeur = transport.get(key, 0)
        if not isinstance(valeur, (int, float)) or valeur <= 0:
            scores[nom] = 0
        else:
            scores[nom] = round(100 - ((valeur - minimum) / (maximum - minimum)) * 100)

    return scores


def criteres_preferes(temps, prix, emission_co2):
    """
    Transforme les checkbox du formulaire en criteres utilises pour le
    classement final. Si aucune preference n'est cochee, on utilise les
    trois criteres: temps, prix et emissions.
    """
    criteres_selectionnes = []

    if temps == "oui":
        criteres_selectionnes.append(("temps_minutes", "scoreTemps"))
    if prix == "oui":
        criteres_selectionnes.append(("prix", "scorePrix"))
    if emission_co2 == "oui":
        criteres_selectionnes.append(("emissions", "scoreEmission"))

    return criteres_selectionnes or CRITERES_SCORE


def calculer_scores_par_type(transports):
    """
    Premier scoring: calcule les scores separes temps/prix/emissions.

    Ces scores servent aux barres affichees dans chaque carte transport.
    Ils sont toujours calcules, meme si l'utilisateur ne coche qu'une seule
    preference.
    """
    scores_par_critere = {
        score_key: _score_metric(transports, metric_key)
        for metric_key, score_key in CRITERES_SCORE
    }

    return {
        nom: {
            "scoreTemps": scores_par_critere["scoreTemps"].get(nom, 0),
            "scorePrix": scores_par_critere["scorePrix"].get(nom, 0),
            "scoreEmission": scores_par_critere["scoreEmission"].get(nom, 0),
        }
        for nom in transports
    }


def calculer_score_preference(scores_par_type, criteres_selectionnes):
    """
    Deuxieme scoring: calcule le score global selon les preferences.

    Le score global est une moyenne simple des scores des criteres coches.
    Exemple: si "rapide" et "eco" sont coches, on moyenne scoreTemps et
    scoreEmission. Ce score sert au classement final.
    """
    scores = {}

    for nom, details in scores_par_type.items():
        scores[nom] = {
            **details,
            "score": round(
                sum(details[score_key] for _, score_key in criteres_selectionnes) / len(criteres_selectionnes)
            ),
        }

    return scores


def classer_transports(scores):
    """
    Classe les transports du meilleur au moins bon selon le score global.
    """
    labels = {
        "train": "Train",
        "voiture": "Voiture",
        "avion": "Avion",
    }

    classement = [
        {
            "transport": nom,
            "label": labels.get(nom, nom),
            "score": details["score"],
            "scoreTemps": details["scoreTemps"],
            "scorePrix": details["scorePrix"],
            "scoreEmission": details["scoreEmission"],
        }
        for nom, details in scores.items()
    ]

    return sorted(classement, key=lambda transport: transport["score"], reverse=True)


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
    voitureName, voitureEmissions, voitureTemps_heures, voitureTemps_minutes, voitureDistance_km, voiturePrix = donneeVoiture(villeDepart,villeArrivee)
    
    # ===== Calcule avion =======
    avionData = donneeAvion(villeDepart, villeArrivee)

    # ===== Calcule train =======
    trainData = donneeTrain(villeDepart, villeArrivee)

    transports = {
        "voiture": {
            "temps_minutes": voitureTemps_minutes,
            "prix": voiturePrix,
            "emissions": voitureEmissions,
        },
        "train": {
            "temps_minutes": trainData["trainTemps_minutes"],
            "prix": trainData["trainPrix"],
            "emissions": trainData["trainEmissions"],
        },
        "avion": {
            "temps_minutes": avionData["avionTemps_minutes"],
            "prix": avionData["avionPrix"],
            "emissions": avionData["avionEmissions"],
        },
    }
    # 1) Scores par type: temps, prix, emissions. Utilises par les barres.
    scores_par_type = calculer_scores_par_type(transports)

    # 2) Score global puis classement selon les preferences cochees.
    criteres_selectionnes = criteres_preferes(temps, prix, emission_co2)
    scores = calculer_score_preference(scores_par_type, criteres_selectionnes)
    classement = classer_transports(scores)
    

    # =====================
    print("\n--- RÉSULTATS ---")
    print(f"Transport : {voitureName}")
    print(f"Émissions : {voitureEmissions} kgCO2e")
    print(f"Temps : {voitureTemps_heures} heures")
    print(f"Distance : {voitureDistance_km:.2f} mètres")
    print(f"Prix voiture : {voiturePrix:.2f} €")



    return jsonify({
        "status": "success",
        "classementTransports": classement,
        # ====== donner voiture ========
        "voitureName": voitureName,
        "voitureEmissions": voitureEmissions,
        "voitureTemps_heures": voitureTemps_heures,
        "voitureTemps_minutes": voitureTemps_minutes,
        "voitureDistance_km": voitureDistance_km,
        "voiturePrix": voiturePrix,
        "voitureScore": scores["voiture"]["score"],
        "voitureScoreTemps": scores["voiture"]["scoreTemps"],
        "voitureScorePrix": scores["voiture"]["scorePrix"],
        "voitureScoreEmission": scores["voiture"]["scoreEmission"],
        # ======= donner avion =========
        "avionName": avionData["avionName"],
        "avionEmissions": avionData["avionEmissions"],
        "avionTemps": avionData["avionTemps"],
        "avionTemps_minutes": avionData["avionTemps_minutes"],
        "avionDistance_km": avionData["avionDistance_km"],
        "avionPrix": avionData["avionPrix"],
        "avionAeroportDepart": avionData["avionAeroportDepart"],
        "avionAeroportArrivee": avionData["avionAeroportArrivee"],
        "avionSource": avionData["avionSource"],
        "avionScore": scores["avion"]["score"],
        "avionScoreTemps": scores["avion"]["scoreTemps"],
        "avionScorePrix": scores["avion"]["scorePrix"],
        "avionScoreEmission": scores["avion"]["scoreEmission"],
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
        "trainScore": scores["train"]["score"],
        "trainScoreTemps": scores["train"]["scoreTemps"],
        "trainScorePrix": scores["train"]["scorePrix"],
        "trainScoreEmission": scores["train"]["scoreEmission"],
    })
