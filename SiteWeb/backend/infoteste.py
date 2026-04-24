from flask import Blueprint, jsonify, request
import requests
from flask_cors import cross_origin

from geopy.geocoders import Nominatim
from geopy.distance import geodesic

# ===== fonction calcule coordonnées ville ====
def CoodonnesVille(Ville):
    geolocator = Nominatim(user_agent="mon_application_voyage")

    Loc = geolocator.geocode(Ville)

    if Loc :
        coord = (Loc.latitude, Loc.longitude)
        return coord
    else :
        return None
    
def impactCO2transport(distance_km, transport) :
    if transport == 'voiture' :
        relevant_ids = [4] # 4 voiture thermique
    elif transport == 'avion' or 'train' :
        relevant_ids = [1 , 2, 5] # 1 avion, 2 train, 5 TGV
    else:
        print(f"Erreur, dans de types de transport entrée : {transport}")
    return
    
def donneeVoiture(villeD, villeA):

    # =========== calculle distance voiture
    CoordVilleA = CoodonnesVille(villeA)
    lat, lon = CoordVilleA
    lat_villeA = lat 
    lon_villeA = lon

    CoordVilleB = CoodonnesVille(villeD)
    lat, lon = CoordVilleB
    lat_villeB = lat
    lon_villeB = lon

    url = f"http://router.project-osrm.org/route/v1/driving/{lat_villeA},{lon_villeA};{lat_villeB},{lon_villeB}?overview=false"

    try :
        res = requests.get(url)
        data = res.json()

        if data['code'] == 'ok' :
            distance_metres = data['routes'][0]['distance']
            distance_km = distance_metres / 100

    except Exception as e :
        print(f"Erreur losr de la récupération de la distance sur route : {e} ")

    # =========== calculle co2 voiture

    return


test = CoodonnesVille("Paris")
lat, lon  = test
print(f"Latitude : {lat}, Longitude : {lon}")