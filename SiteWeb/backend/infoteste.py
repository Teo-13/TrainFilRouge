import requests
from geopy.geocoders import Nominatim

# ===== fonction calcule coordonnées ville ====
def CoodonnesVille(Ville):
    geolocator = Nominatim(user_agent="mon_application_voyage")
    try:
        Loc = geolocator.geocode(Ville)
        if Loc:
            return (Loc.latitude, Loc.longitude)
        return None
    except Exception:
        return None

# ===== fonction calcul émision C02 transport =========
def impactCO2transport(distance_km, transport):
    # Dictionnaires des IDs correspondants à l'API ImpactCO2
    mapping = {
        'voiture': 4, # Voiture thermique
        'avion': 1,   # Avion long courrier
        'train': 2    # Train (Intercités/Moyen)
    }
    
    target_id = mapping.get(transport)
    url = f"https://impactco2.fr/api/v1/transport?km={distance_km}"
    
    name, emissions = "Inconnu", 0

    try:
        response = requests.get(url)
        data = response.json()
        results = data.get('data', [])

        for item in results:
            if item['id'] == target_id:
                name = item['name']
                emissions = item['value']
                break # On a trouvé, on arrête la boucle
            
    except Exception as e:
        print(f"Erreur API ImpactCO2 : {e}")

    return name, emissions

# ======= Calcule partie voiture =========
def donneeVoiture(villeD, villeA):
    print("--- Début du calcul ---")
    
    # Récupération des coordonnées
    coordA = CoodonnesVille(villeD)
    coordB = CoodonnesVille(villeA)

    if not coordA or not coordB:
        print("Erreur : Impossible de trouver l'une des villes.")
        return "Inconnu", 0, 0, 0

    # OSRM : Format {lon},{lat};{lon},{lat}
    url = f"http://router.project-osrm.org/route/v1/driving/{coordA[1]},{coordA[0]};{coordB[1]},{coordB[0]}?overview=false"

    distance_km = 0
    temps_minutes = 0
    distance_metres = 0

    try:
        res = requests.get(url)
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

    return name, emissions, temps_heures, distance_km

# --- Exécution ---
villeD = input("Départ ? ")
villeA = input("Arrivée ? ")

name, emissions, temps_heures, distance_km = donneeVoiture(villeD, villeA)

print("\n--- RÉSULTATS ---")
print(f"Transport : {name}")
print(f"Émissions : {emissions} kgCO2e")
print(f"Temps : {temps_heures} heures")
print(f"Distance : {distance_km:.2f} mètres")