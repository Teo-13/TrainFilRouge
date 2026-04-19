from geopy.geocoders import Nominatim
from geopy.distance import geodesic

def villesDistance(villeD, villeA) :
    geolocator = Nominatim(user_agent="mon_application_voyage")
    
    loc1 = geolocator.geocode(villeD)
    loc2 = geolocator.geocode(villeA)

    
    loc1teste = geolocator.geocode("Las Vegas")
    print(f'Las Vegas = {loc1teste}')
    loc1teste2 = geolocator.geocode("Aix en provence")
    print(f'Aix = {loc1teste2}')
    code  = loc2.country_code
    print(f'{villeD} ville 1 = {loc1}')
    print(f'{villeA} ville 2 = {code}')

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

print(f'distance à vole d\'oiseau et : {distance} km')
