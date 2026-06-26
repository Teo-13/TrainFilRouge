from flask import Blueprint, jsonify, request
from flask_cors import cross_origin

from utils.voiture import donneeVoiture
from utils.train import donneeTrain
from utils.avion import donneeAvion


distance_bp = Blueprint('distance', __name__)


CRITERES_OPTIMISATION = [
    ("temps_minutes", "temps", "Temps"),
    ("prix", "prix", "Prix"),
    ("emissions", "emission", "CO2"),
]

def criteres_preferes(temps, prix, emission_co2):
    """
    Retourne les criteres actifs pour l'optimisation lineaire.

    Si aucune case n'est cochee, on optimise sur les trois criteres.
    """
    criteres_selectionnes = []

    if temps == "oui":
        criteres_selectionnes.append("temps")
    if prix == "oui":
        criteres_selectionnes.append("prix")
    if emission_co2 == "oui":
        criteres_selectionnes.append("emission")

    return criteres_selectionnes or ["temps", "prix", "emission"]


def construire_ponderations(criteres_selectionnes):
    """
    Attribue un poids uniforme aux criteres actifs.
    Exemple: 2 criteres actifs -> 0.5 chacun.
    """
    poids_actif = 1 / len(criteres_selectionnes)
    return {
        code: (poids_actif if code in criteres_selectionnes else 0)
        for _, code, _ in CRITERES_OPTIMISATION
    }


def normaliser_transports(transports):
    """
    Normalise chaque critere par son maximum pour pouvoir les combiner
    lineairement sans melanger directement les unites.

    La minimisation reste lineaire: somme(poids * critere_normalise).
    """
    valeurs_normalisees = {nom: {} for nom in transports}

    for metric_key, code, _ in CRITERES_OPTIMISATION:
        valeurs = [
            transport.get(metric_key, 0)
            for transport in transports.values()
            if isinstance(transport.get(metric_key), (int, float)) and transport.get(metric_key, 0) >= 0
        ]
        maximum = max(valeurs) if valeurs else 0

        for nom, transport in transports.items():
            valeur = transport.get(metric_key, 0)
            if maximum <= 0 or not isinstance(valeur, (int, float)) or valeur < 0:
                valeurs_normalisees[nom][code] = 0
            else:
                valeurs_normalisees[nom][code] = valeur / maximum

    return valeurs_normalisees


def optimiser_transports_lineaire(transports, ponderations):
    """
    Minimise une fonction objectif lineaire:
    objectif = w_temps * temps_norm + w_prix * prix_norm + w_co2 * co2_norm
    """
    valeurs_normalisees = normaliser_transports(transports)
    meilleur_transport = None
    meilleure_valeur = None

    for nom, transport in transports.items():
        contributions = {
            code: round(ponderations[code] * valeurs_normalisees[nom].get(code, 0), 4)
            for _, code, _ in CRITERES_OPTIMISATION
        }
        objectif_lineaire = round(sum(contributions.values()), 4)

        if meilleure_valeur is None or objectif_lineaire < meilleure_valeur:
            meilleur_transport = nom
            meilleure_valeur = objectif_lineaire

    return meilleur_transport


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
    criteres_selectionnes = criteres_preferes(temps, prix, emission_co2)
    ponderations = construire_ponderations(criteres_selectionnes)
    transport_optimal = optimiser_transports_lineaire(transports, ponderations)
    

    # =====================
    print("\n--- RÉSULTATS ---")
    print(f"Transport : {voitureName}")
    print(f"Émissions : {voitureEmissions} kgCO2e")
    print(f"Temps : {voitureTemps_heures} heures")
    print(f"Distance : {voitureDistance_km:.2f} mètres")
    print(f"Prix voiture : {voiturePrix:.2f} €")



    return jsonify({
        "status": "success",
        "transportOptimal": transport_optimal,
        # ====== donner voiture ========
        "voitureName": voitureName,
        "voitureEmissions": voitureEmissions,
        "voitureTemps_heures": voitureTemps_heures,
        "voitureTemps_minutes": voitureTemps_minutes,
        "voitureDistance_km": voitureDistance_km,
        "voiturePrix": voiturePrix,
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
