# =============================================================
# Fonctions pour recuperer des donnees train
# =============================================================

import os
from datetime import datetime

import requests
from geopy.distance import geodesic

from utils.calculeCO2 import impactCO2transport
from utils.CoordonneVille import CoodonnesVille


NAVITIA_URL = "https://api.navitia.io/v1"
SNCF_GARES_URL = (
    "https://data.sncf.com/api/explore/v2.1/catalog/datasets/"
    "liste-des-gares/records"
)

GARES_PRINCIPALES = {
    "paris": "Paris Gare de Lyon",
    "lyon": "Lyon Part Dieu",
    "marseille": "Marseille Saint-Charles",
    "toulouse": "Toulouse Matabiau",
    "bordeaux": "Bordeaux Saint-Jean",
    "lille": "Lille Flandres",
    "nantes": "Nantes",
    "strasbourg": "Strasbourg",
    "rennes": "Rennes",
    "montpellier": "Montpellier Saint-Roch",
    "nice": "Nice Ville",
    "grenoble": "Grenoble",
    "dijon": "Dijon Ville",
    "angers": "Angers Saint-Laud",
    "reims": "Reims",
}


def _format_datetime(navitia_datetime):
    if not navitia_datetime:
        return ""

    try:
        date = datetime.strptime(navitia_datetime, "%Y%m%dT%H%M%S")
        return date.strftime("%d/%m/%Y %H:%M")
    except ValueError:
        try:
            date = datetime.strptime(navitia_datetime, "%Y%m%dT%H%M")
            return date.strftime("%d/%m/%Y %H:%M")
        except ValueError:
            return navitia_datetime


def _format_duration(seconds):
    minutes = round(seconds / 60)
    heures = minutes // 60
    reste_minutes = minutes % 60

    if heures == 0:
        return f"{reste_minutes} min"

    return f"{heures}h{reste_minutes:02d}"


def _extract_coordinates(record):
    fields = record.get("record", {}).get("fields", record)

    for key in ("position_geographique", "geo_point_2d", "coordonnees_geographiques"):
        value = fields.get(key)
        if isinstance(value, dict) and "lat" in value and "lon" in value:
            return value["lat"], value["lon"]
        if isinstance(value, list) and len(value) >= 2:
            return value[0], value[1]

    return None


def chercher_gare_sncf(ville):
    ville_key = ville.strip().lower()
    if ville_key in GARES_PRINCIPALES:
        return {
            "nom": GARES_PRINCIPALES[ville_key],
            "coord": None,
        }

    params = {
        "limit": 1,
        "where": f'voyageurs="O" AND search(commune, "{ville}")',
    }

    try:
        response = requests.get(SNCF_GARES_URL, params=params, timeout=8)
        response.raise_for_status()
        data = response.json()
        records = data.get("results", [])

        if not records:
            return None

        record = records[0]
        nom_gare = record.get("nom") or record.get("libelle") or record.get("commune")
        coord = _extract_coordinates(record)

        return {
            "nom": nom_gare or f"Gare de {ville}",
            "coord": coord,
        }
    except Exception as e:
        print(f"Erreur API SNCF gares : {e}")
        return None


def _prix_estime_train(distance_km):
    prix_base = 8
    prix_km = 0.16
    return round(prix_base + (distance_km * prix_km), 2)


def _co2_train(distance_km):
    name, emissions = impactCO2transport(distance_km, "train")
    return name, emissions


def _train_estime(villeD, villeA, coordA, coordB, gare_depart=None, gare_arrivee=None):
    distance_km = geodesic(coordA, coordB).km * 1.18
    vitesse_moyenne_kmh = 135
    temps_minutes = round((distance_km / vitesse_moyenne_kmh) * 60)
    name, emissions = _co2_train(distance_km)

    return {
        "trainName": name,
        "trainEmissions": emissions,
        "trainTemps_minutes": temps_minutes,
        "trainTemps": _format_duration(temps_minutes * 60),
        "trainDistance_km": round(distance_km, 2),
        "trainPrix": _prix_estime_train(distance_km),
        "trainPrixSource": "estimation",
        "trainGareDepart": gare_depart or f"Gare de {villeD}",
        "trainGareArrivee": gare_arrivee or f"Gare de {villeA}",
        "trainDepart": "",
        "trainArrivee": "",
        "trainLignes": "",
        "trainSource": "estimation",
    }


def _trajet_navitia(coordA, coordB):
    token = os.getenv("NAVITIA_TOKEN") or os.getenv("SNCF_API_TOKEN")
    if not token:
        return None

    params = {
        "from": f"{coordA[1]};{coordA[0]}",
        "to": f"{coordB[1]};{coordB[0]}",
        "count": 1,
        "data_freshness": "realtime",
    }
    headers = {"Authorization": token}

    try:
        response = requests.get(
            f"{NAVITIA_URL}/journeys",
            params=params,
            headers=headers,
            timeout=12,
        )
        response.raise_for_status()
        data = response.json()
        journeys = data.get("journeys", [])

        if not journeys:
            return None

        return journeys[0]
    except Exception as e:
        print(f"Erreur API Navitia : {e}")
        return None


def _resultat_navitia(journey, villeD, villeA, coordA, coordB, gare_depart, gare_arrivee):
    distance_km = max(journey.get("distances", {}).get("total", 0) / 1000, geodesic(coordA, coordB).km)
    duration_seconds = journey.get("duration", 0)
    temps_minutes = round(duration_seconds / 60)
    name, emissions = _co2_train(distance_km)

    lignes = []
    gares = []
    for section in journey.get("sections", []):
        display = section.get("display_informations") or {}
        mode = display.get("commercial_mode") or display.get("physical_mode")
        code = display.get("code") or display.get("name")
        direction = display.get("direction")

        if mode or code:
            ligne = " ".join(part for part in (mode, code) if part)
            if direction:
                ligne = f"{ligne} vers {direction}"
            lignes.append(ligne)

        if section.get("type") == "public_transport":
            from_name = section.get("from", {}).get("name")
            to_name = section.get("to", {}).get("name")
            if from_name:
                gares.append(from_name)
            if to_name:
                gares.append(to_name)

    if gares:
        gare_depart = gares[0]
        gare_arrivee = gares[-1]

    return {
        "trainName": name,
        "trainEmissions": emissions,
        "trainTemps_minutes": temps_minutes,
        "trainTemps": _format_duration(duration_seconds),
        "trainDistance_km": round(distance_km, 2),
        "trainPrix": _prix_estime_train(distance_km),
        "trainPrixSource": "estimation (pas de tarif SNCF public)",
        "trainGareDepart": gare_depart or f"Gare de {villeD}",
        "trainGareArrivee": gare_arrivee or f"Gare de {villeA}",
        "trainDepart": _format_datetime(journey.get("departure_date_time")),
        "trainArrivee": _format_datetime(journey.get("arrival_date_time")),
        "trainLignes": " | ".join(lignes),
        "trainSource": "Navitia / API SNCF",
    }


def donneeTrain(villeD, villeA):
    print("--- Debut du calcul train ---")

    coordA = CoodonnesVille(villeD)
    coordB = CoodonnesVille(villeA)

    if not coordA or not coordB:
        print("Erreur : Impossible de trouver l'une des villes pour le train.")
        return _train_estime(villeD, villeA, (0, 0), (0, 0))

    gareD = chercher_gare_sncf(villeD)
    gareA = chercher_gare_sncf(villeA)
    gare_depart = gareD["nom"] if gareD else f"Gare de {villeD}"
    gare_arrivee = gareA["nom"] if gareA else f"Gare de {villeA}"

    journey = _trajet_navitia(coordA, coordB)
    if journey:
        return _resultat_navitia(
            journey,
            villeD,
            villeA,
            coordA,
            coordB,
            gare_depart,
            gare_arrivee,
        )

    return _train_estime(villeD, villeA, coordA, coordB, gare_depart, gare_arrivee)
