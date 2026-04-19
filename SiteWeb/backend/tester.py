import requests
import sqlite3
import pandas as pd

# ─────────────────────────────────────────────
# 1. Récupération des données depuis l'API
# ─────────────────────────────────────────────

url = "https://geo.api.gouv.fr/communes?fields=nom,code,codeDepartement,codeRegion,population,centre"
response = requests.get(url)

if response.status_code != 200:
    raise Exception("Erreur API")

data = response.json()

# ─────────────────────────────────────────────
# 2. Transformation des données
# ─────────────────────────────────────────────

# Extraire latitude / longitude du champ "centre"
for commune in data:
    if commune.get("centre"):
        commune["latitude"] = commune["centre"]["coordinates"][1]
        commune["longitude"] = commune["centre"]["coordinates"][0]
    else:
        commune["latitude"] = None
        commune["longitude"] = None

# Conversion en DataFrame
df = pd.DataFrame(data)

# Supprimer la colonne "centre" (inutile maintenant)
df = df.drop(columns=["centre"], errors="ignore")

# ─────────────────────────────────────────────
# 3. Création de la base SQLite
# ─────────────────────────────────────────────

conn = sqlite3.connect("communes.db")
cursor = conn.cursor()

# Création de la table
cursor.execute("""
CREATE TABLE IF NOT EXISTS communes (
    code TEXT PRIMARY KEY,
    nom TEXT,
    code_departement TEXT,
    code_region TEXT,
    population INTEGER,
    latitude REAL,
    longitude REAL
)
""")

# ─────────────────────────────────────────────
# 4. Insertion des données
# ─────────────────────────────────────────────

for _, row in df.iterrows():
    cursor.execute("""
    INSERT OR REPLACE INTO communes (
        code, nom, code_departement, code_region, population, latitude, longitude
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        row["code"],
        row["nom"],
        row["codeDepartement"],
        row["codeRegion"],
        row.get("population"),
        row.get("latitude"),
        row.get("longitude")
    ))

# Sauvegarde
conn.commit()
conn.close()

print("✅ Données insérées dans communes.db")