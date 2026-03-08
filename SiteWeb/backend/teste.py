import time
import random

machineJoueur = random.randint(1,100)
compteur = 0

while True:
	
	JoueurNombre = int(input("quelle est votre nombre ? De 1 à 100 : "))
	compteur += 1
	
	if JoueurNombre >= 101 or JoueurNombre <= -1 :
		print(f"Erreur : nombre incorrecte {JoueurNombre}")
		
		continue
		
	if machineJoueur > JoueurNombre :
		print("C'est plus grand ")
		continue
	elif machineJoueur < JoueurNombre :
		print("C'est plus petit ")
		continue
	else:
		break

	
   

print(f"Bravo ! Vous avez gané ! Le nombre était {machineJoueur} et vous avez trouvé en {time.time()} secondes !")
print("Nombre d essais : ", compteur)
