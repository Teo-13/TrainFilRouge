# =============================================================
# Fonction calculer coordonnée ville 
# =============================================================

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