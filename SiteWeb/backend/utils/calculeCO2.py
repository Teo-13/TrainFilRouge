import requests


TRANSPORTS_EMISSION_DISTANCE = [
    {"key": "avion", "label": "Avion", "id": 1},
    {"key": "tgv", "label": "TGV", "id": 2},
    {"key": "intercites", "label": "Intercites", "id": 3},
    {"key": "voiture_thermique", "label": "Voiture thermique", "id": 4},
    {"key": "voiture_electrique", "label": "Voiture electrique", "id": 5},
    {"key": "moto_thermique", "label": "Moto thermique", "id": 13},
]


def _transport_api_data(distance_km):
    url = f"https://impactco2.fr/api/v1/transport?km={distance_km}"
    response = requests.get(url, timeout=12)
    response.raise_for_status()
    return response.json().get("data", [])


def impactCO2transport(distance_km, transport):
    mapping = {
        "avion": 1,
        "train": 3,
        "voiture": 4,
        "voiture_electrique": 5,
        "tgv": 22,
        "moto": 13,
    }

    target_id = mapping.get(transport)
    name, emissions = "Inconnu", 0

    if target_id is None:
        return name, emissions

    try:
        for item in _transport_api_data(distance_km):
            if item.get("id") == target_id:
                name = item.get("name", name)
                emissions = item.get("value", 0)
                break
    except Exception as e:
        print(f"Erreur API ImpactCO2 : {e}")

    return name, emissions


def impactCO2transports(distance_km):
    api_results_by_id = {}

    try:
        for item in _transport_api_data(distance_km):
            api_results_by_id[item.get("id")] = item
    except Exception as e:
        print(f"Erreur API ImpactCO2 : {e}")

    return [
        {
            "key": transport["key"],
            "id": transport["id"],
            "label": transport["label"],
            "apiName": api_results_by_id.get(transport["id"], {}).get("name", transport["label"]),
            "emissions": api_results_by_id.get(transport["id"], {}).get("value"),
            "available": transport["id"] in api_results_by_id,
        }
        for transport in TRANSPORTS_EMISSION_DISTANCE
    ]
