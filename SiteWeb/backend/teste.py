from geopy.geocoders import Nominatim
from geopy.distance import geodesic

def villesDistance(villeD, villeA) :
    geolocator = Nominatim(user_agent="mon_application_voyage")
    
    loc1 = geolocator.geocode(villeD)
    loc2 = geolocator.geocode(villeA)
    
    if loc1 and loc2 :
        coord1 = (loc1.latitude, loc1.longitude)
        coord2 = (loc2.latitude, loc2.longitude)
        
		#
        distance = geodesic(coord1,coord2).kilometers
        return round(distance, 2)
    else:
           return None

    

villeDepart = input("Ville départ ?")
villeArrivee = input("Ville arrivée ?")

distance = villesDistance(villeDepart,villeArrivee)

print(f'distance à vole d\'oiseau et : {distance}')