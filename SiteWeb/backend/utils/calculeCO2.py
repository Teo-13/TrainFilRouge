# =============================================================
# Fonction calculer émission CO2 transport sur distance 
# =============================================================

import requests
from geopy.geocoders import Nominatim

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