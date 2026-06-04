# =============================================================
# Fonction calcule donner voiture
# =============================================================

import requests
from geopy.geocoders import Nominatim

from utils.calculeCO2 import impactCO2transport
from utils.CoordonneVille import CoodonnesVille


# ======= Calcule partie voiture =========
def donneeVoiture(villeD, villeA):
    print("--- Début du calcul ---")
    
    # Récupération des coordonnées
    coordA = CoodonnesVille(villeD)
    coordB = CoodonnesVille(villeA)

    if not coordA or not coordB:
        print("Erreur : Impossible de trouver l'une des villes.")
        return "Inconnu", 0, 0, 0, 0, 0

    # OSRM : Format {lon},{lat};{lon},{lat}
    url = f"http://router.project-osrm.org/route/v1/driving/{coordA[1]},{coordA[0]};{coordB[1]},{coordB[0]}?overview=false"

    distance_km = 0
    temps_minutes = 0
    temps_heures = 0
    distance_metres = 0

    try:
        res = requests.get(url, timeout=12)
        data = res.json()

        if data['code'] == 'Ok':
            distance_metres = data['routes'][0]['distance']
            distance_km = distance_metres / 1000 # Conversion KM
            
            temps_secondes = data['routes'][0]['duration']
            temps_minutes = round(temps_secondes / 60)
            temps_heures = round(temps_minutes / 60)
            print(f"Distance : {distance_km:.2f} km | Temps : {temps_heures} min")
        else:
            print("OSRM n'a pas pu calculer l'itinéraire.")

    except Exception as e:
        print(f"Erreur OSRM : {e}")

    # Calcul CO2 seulement si on a une distance
    name, emissions = "Inconnu", 0
    if distance_km > 0:
        name, emissions = impactCO2transport(distance_km, "voiture")

    # Calcule du prix estimer 
    
    

    # --- Prix carburant ---
    # Consomation = moyenne 6,5L / 100km et 2€ le litre
    conso_moyenne = 6.5  # litres aux 100km
    prix_essence = 2  # euros par litre
    cout_carburant = (distance_km * conso_moyenne * prix_essence) / 100

    # --- 2. Péages (Estimation pour longs trajets > 100km) ---
    # Péage = environ 0,07€ à 0,10€ par km d'autoroute en France donc 0,9€ le km
    if distance_km > 100:
        ratio_autoroute = 0.8  # 80% du trajet
        cout_km_peage = 0.09   # 9 centimes du km
        cout_peages = distance_km * ratio_autoroute * cout_km_peage
    else:
        cout_peages = 0

    cout_peages = cout_peages * 0.75
    total = cout_carburant + cout_peages





    return name, emissions, temps_heures, temps_minutes, round(distance_km, 2), round(total, 2)
