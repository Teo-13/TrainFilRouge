# =============================================================
# Fonctions pour recuperer des donnees avion
# =============================================================

import csv
import unicodedata
from functools import lru_cache
from io import StringIO

import requests
from geopy.distance import geodesic

from utils.calculeCO2 import impactCO2transport
from utils.CoordonneVille import CoodonnesVille


AIRPORTS_DATASET_URL = "https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/airports.csv"

AIRPORTS_FALLBACK = [
    {"name": "Paris Charles de Gaulle", "iata": "CDG", "coord": (49.0128, 2.55), "municipality": "Paris", "type": "large_airport"},
    {"name": "Paris Orly", "iata": "ORY", "coord": (48.7233, 2.3794), "municipality": "Paris", "type": "large_airport"},
    {"name": "Lyon Saint-Exupery", "iata": "LYS", "coord": (45.7256, 5.0811), "municipality": "Lyon", "type": "medium_airport"},
    {"name": "Marseille Provence", "iata": "MRS", "coord": (43.4393, 5.2214), "municipality": "Marseille", "type": "medium_airport"},
    {"name": "Toulouse Blagnac", "iata": "TLS", "coord": (43.6291, 1.3638), "municipality": "Toulouse", "type": "medium_airport"},
    {"name": "Bordeaux Merignac", "iata": "BOD", "coord": (44.8283, -0.7156), "municipality": "Bordeaux", "type": "medium_airport"},
    {"name": "Nice Cote d'Azur", "iata": "NCE", "coord": (43.6584, 7.2159), "municipality": "Nice", "type": "medium_airport"},
    {"name": "Nantes Atlantique", "iata": "NTE", "coord": (47.1532, -1.6107), "municipality": "Nantes", "type": "medium_airport"},
    {"name": "Lille Lesquin", "iata": "LIL", "coord": (50.5633, 3.0869), "municipality": "Lille", "type": "medium_airport"},
    {"name": "Strasbourg Entzheim", "iata": "SXB", "coord": (48.5383, 7.6282), "municipality": "Strasbourg", "type": "medium_airport"},
]

AEROPORTS_PREFERES = {
    "paris": {"CDG", "ORY"},
    "lyon": {"LYS"},
    "marseille": {"MRS"},
    "toulouse": {"TLS"},
    "bordeaux": {"BOD"},
    "nice": {"NCE"},
    "nantes": {"NTE"},
    "lille": {"LIL"},
    "strasbourg": {"SXB"},
    "montpellier": {"MPL"},
    "rennes": {"RNS"},
    "ajaccio": {"AJA"},
    "bastia": {"BIA"},
}


def _normaliser_ville(ville):
    texte = unicodedata.normalize("NFD", ville.strip().lower())
    return "".join(char for char in texte if unicodedata.category(char) != "Mn")


def _format_duration(minutes):
    heures = minutes // 60
    reste_minutes = minutes % 60

    if heures == 0:
        return f"{reste_minutes} min"

    return f"{heures}h{reste_minutes:02d}"


@lru_cache(maxsize=1)
def _charger_aeroports():
    try:
        response = requests.get(AIRPORTS_DATASET_URL, timeout=15)
        response.raise_for_status()
        reader = csv.DictReader(StringIO(response.text))
        aeroports = []

        for row in reader:
            if row.get("type") not in ("large_airport", "medium_airport"):
                continue
            if row.get("scheduled_service") != "yes":
                continue
            if not row.get("iata_code"):
                continue

            try:
                lat = float(row["latitude_deg"])
                lon = float(row["longitude_deg"])
            except (TypeError, ValueError):
                continue

            aeroports.append(
                {
                    "name": row.get("name") or row.get("ident") or "Aeroport",
                    "iata": row.get("iata_code"),
                    "coord": (lat, lon),
                    "municipality": row.get("municipality") or "",
                    "type": row.get("type"),
                }
            )

        return aeroports or AIRPORTS_FALLBACK
    except Exception as e:
        print(f"Erreur dataset OurAirports : {e}")
        return AIRPORTS_FALLBACK


def _aeroport_le_plus_proche(coord, ville=""):
    aeroports = _charger_aeroports()
    aeroports_avec_distance = [
        (aeroport, geodesic(coord, aeroport["coord"]).km)
        for aeroport in aeroports
    ]
    iata_preferes = AEROPORTS_PREFERES.get(_normaliser_ville(ville), set())
    aeroports_preferes = [
        (aeroport, distance)
        for aeroport, distance in aeroports_avec_distance
        if aeroport["iata"] in iata_preferes and distance <= 120
    ]

    grands_aeroports_proches = [
        (aeroport, distance)
        for aeroport, distance in aeroports_avec_distance
        if aeroport["type"] == "large_airport" and distance <= 120
    ]

    candidats = aeroports_preferes or grands_aeroports_proches or aeroports_avec_distance

    if not candidats:
        return None, 0

    return min(candidats, key=lambda item: item[1])


def _prix_estime_avion(distance_km):
    if distance_km < 800:
        prix = 60 + (distance_km * 0.16)
    elif distance_km < 3000:
        prix = 90 + (distance_km * 0.10)
    else:
        prix = 180 + (distance_km * 0.06)

    return round(max(prix, 49), 2)


def _avion_vide():
    return {
        "avionName": "Inconnu",
        "avionEmissions": 0,
        "avionTemps": "",
        "avionTemps_minutes": 0,
        "avionDistance_km": 0,
        "avionPrix": 0,
        "avionAeroportDepart": "",
        "avionAeroportArrivee": "",
        "avionSource": "OurAirports + ImpactCO2",
    }


def donneeAvion(villeD, villeA):
    print("--- Debut du calcul avion ---")

    coordA = CoodonnesVille(villeD)
    coordB = CoodonnesVille(villeA)

    if not coordA or not coordB:
        print("Erreur : Impossible de trouver l'une des villes pour l'avion.")
        return _avion_vide()

    aeroport_depart, distance_depart_aeroport = _aeroport_le_plus_proche(coordA, villeD)
    aeroport_arrivee, distance_arrivee_aeroport = _aeroport_le_plus_proche(coordB, villeA)

    if not aeroport_depart or not aeroport_arrivee:
        return _avion_vide()

    distance_vol_km = geodesic(aeroport_depart["coord"], aeroport_arrivee["coord"]).km * 1.08

    if aeroport_depart["iata"] == aeroport_arrivee["iata"] or distance_vol_km < 80:
        return {
            **_avion_vide(),
            "avionName": "Avion non pertinent",
            "avionAeroportDepart": f'{aeroport_depart["name"]} ({aeroport_depart["iata"]})',
            "avionAeroportArrivee": f'{aeroport_arrivee["name"]} ({aeroport_arrivee["iata"]})',
        }

    name, emissions = impactCO2transport(distance_vol_km, "avion")

    temps_vol_minutes = round((distance_vol_km / 800) * 60 + 45)
    temps_transfert_minutes = round(((distance_depart_aeroport + distance_arrivee_aeroport) / 40) * 60)
    temps_total_minutes = temps_vol_minutes + temps_transfert_minutes + 120

    return {
        "avionName": name,
        "avionEmissions": emissions,
        "avionTemps": _format_duration(temps_total_minutes),
        "avionTemps_minutes": temps_total_minutes,
        "avionDistance_km": round(distance_vol_km, 2),
        "avionPrix": _prix_estime_avion(distance_vol_km),
        "avionAeroportDepart": f'{aeroport_depart["name"]} ({aeroport_depart["iata"]})',
        "avionAeroportArrivee": f'{aeroport_arrivee["name"]} ({aeroport_arrivee["iata"]})',
        "avionSource": "OurAirports + ImpactCO2",
    }
