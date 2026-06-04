# Ta liste de données
personnes = [
    {"nom": "teo", "prenom": "mm", "score": 4},
    {"nom": "lucas", "prenom": "bb", "score": 2},
    {"nom": "chloe", "prenom": "aa", "score": 9},
    {"nom": "anatole", "prenom": "cc", "score": 1}
]

# Tri par ordre croissant du score
personnes_triees = sorted(personnes, key=lambda x: x["score"])

# Affichage du résultat
for personne in personnes_triees:
    print(f"{personne['nom']} : {personne['score']}")

    