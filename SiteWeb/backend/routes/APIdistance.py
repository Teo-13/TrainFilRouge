from flask import Blueprint, jsonify, request, requests
from flask_cors import cross_origin

from geopy.geocoders import Nominatim
from geopy.distance import geodesic

 # ajouter les options de selection dans la fonction et calculer le co2

# === fonction de calcul de la distance à voile d'oiseau entre deux villes ===
def DistanceVilleOiseau(villeD, villeA) :
    geolocator = Nominatim(user_agent="mon_application_voyage")

    loc1 = geolocator.geocode(villeD)
    loc2 = geolocator.geocode(villeA)
    
    if loc1 and loc2 :
        coord1 = (loc1.latitude, loc1.longitude)
        coord2 = (loc2.latitude, loc2.longitude)
        
		#
        distance = geodesic(coord1,coord2).kilometers
        return round(distance, 2), loc1, loc2
    else:
           return None

# === fonction de calcul de la distance sur route entre deux villes ===
def DistanceVilleRoute(villeD, villeA) :
    geolocator = Nominatim(user_agent="mon_application_voyage")

    loc1 = geolocator.geocode(villeD)
    lon1 = loc1.longitude
    lat1 = loc1.latitude
    
    loc2 = geolocator.geocode(villeA)
    lon2 = loc2.longitude
    lat2 = loc2.latitude

    url = f"http://router.project-osrm.org/route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=false"


    try : 
        res = requests.get(url)
        data = res.json()

        if data['code'] == 'ok' :
            distance_metres = data['routes'][0]['distance']
            distance_km = distance_metres / 1000

            return round(distance_km, 2)

    except Exception as e:
        print(f"Erreur lors de la récupération de la distance sur route : {e}")
        return None


distance_bp = Blueprint('distance', __name__)

@distance_bp.route('/', methods=['POST', 'OPTIONS'])
@cross_origin()  
def distance():
    if request.method == 'OPTIONS':
        return '', 200
    # ===== récupération des données du formualire ====
    data = request.json or {}
    villeDepart = data.get("villeDepart", "")
    villeArrivee = data.get("villeArrivee", "")
    

    print(f'Ville de départ : {villeDepart} et ville d\'arrivée : {villeArrivee}')

    if not villeDepart or not villeArrivee:
         return jsonify({"error": "Veuillez fournir les deux villes."}), 400

    # ===== calcule de la distance à vole d'oiseau ====
    distance_oiseau, addressDepart, addressArrivee = DistanceVilleOiseau(villeDepart, villeArrivee)

    if (distance_oiseau is None):
            return jsonify({"error": "Impossible de calculer la distance. Vérifiez les noms des villes."}), 400
    
    # ===== calcule de la distance sur route ====
    distance_route = DistanceVilleRoute(villeDepart, villeArrivee)
    
    if (distance_route is None) :
         return jsonify({"error": "Impossible de calculer la distance. Vérifiez les noms des villes."}), 400

    print(f'la distance à vole d\'oiseau entre les deux ville est de {distance_oiseau} km. \n {addressDepart} -> {addressArrivee}')

    return jsonify({
        "status": "success",
        "distance": distance_oiseau,
        "addressDepart": addressDepart,
        "addressArrivee": addressArrivee,
        "distance_route": distance_route,
    })