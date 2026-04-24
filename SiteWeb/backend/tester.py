import requests

def compare_transport(distance_km):
    # On interroge l'API pour une distance donnée
    url = f"https://impactco2.fr/api/v1/transport?km={distance_km}"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        # On filtre les transports qui nous intéressent
        results = data['data']
        relevant_ids = [1, 2, 4, 5] # 1: Avion, 2: train, 4: Voiture (Thermique), 5: TGV
        
        print(f"--- Comparaison pour {distance_km} km ---")
        for item in results:
            if item['id'] in relevant_ids:
                name = item['name']
                emissions = item['value'] # en kgCO2e
                print(f"{name} : {emissions:.2f} kgCO2e")
                
    except Exception as e:
        print(f"Erreur lors de la récupération : {e}")


distance = float(input("Quelles est la distance en km ?"))

compare_transport(distance)

