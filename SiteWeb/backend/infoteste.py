import requests
from geopy.geocoders import Nominatim








# --- Exécution ---
villeD = input("Départ ? ")
villeA = input("Arrivée ? ")

name, emissions, temps_heures, distance_km, totalpeage, cout_carburant= donneeVoiture(villeD, villeA)

print("\n--- RÉSULTATS ---")
print(f"Transport : {name}")
print(f"Émissions : {emissions} kgCO2e")
print(f"Temps : {temps_heures} heures")
print(f"Distance : {distance_km:.2f} mètres")
print(f"totalpeage : {totalpeage:.2f} €")
print(f"cout_carburant : {cout_carburant:.2f} €")