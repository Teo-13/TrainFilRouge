from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os


app = Flask(__name__)
CORS(app)  # autorise React a appeler l'API

@app.route("/api/status")
def status():
    return jsonify({
        "status": "ok"
    })

# Configuration
EXCEL_FILE = os.path.join(os.path.dirname(__file__), "bbdteste.xlsx")
@app.route("/api/dataexcel")
def dataexcel():
    try:
        # 1. Chargement
        data = pd.read_excel(EXCEL_FILE, sheet_name="Feuil1")
        
        # 2. Valeurs "en brute" pour le test
        ville_depart = "Paris"
        ville_dest = "Lyon"

        # 3. Filtrage forcé
        result = data[
            (data["depart"].astype(str) == ville_depart) & 
            (data["destination"].astype(str) == ville_dest)
        ]

        # 4. Envoi
        return jsonify({
            "status": "success",
            "depart": ville_depart, 
            "destition": ville_dest,
            "nombre_trouve": len(result),
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/api/hello")
def hello():
    return jsonify({"message": "Bonjour depuis Flask"})


@app.route("/api/users")
def users():
    return jsonify([
        {"id": 1, "name": "Alice"},
        {"id": 2, "name": "Bob"}
    ])


@app.route("/api/data")
def data():
    temperature = 45
    humidity = 60
    city = "Paris"

    if temperature is None:
        message = "Erreur : la temperature n'est pas disponible."
    elif humidity > 45:
        message = "Attention, l'humidite est elevee !"
    else:
        message = "L'humidite est dans la normale."

    return jsonify({
        "temperature": temperature,
        "humidity": humidity,
        "city": city,
        "message": message
    })


@app.route("/api/send", methods=["POST"])
def formulaire():
    data = request.json or {}
    name = str(data.get("name", "")).strip()
    age_raw = str(data.get("age", "")).strip()

    print(f"le nom est : {name} et l'age est : {age_raw}")

    
    if age_raw == "":
        return jsonify({"status": "error", "message": "Le champ age est obligatoire"}), 400

    try:
        age = int(age_raw)
    except ValueError:
        return jsonify({"status": "error", "message": "Le champ age doit etre un entier"}), 400

    if age < 18:
        prefix = "Vous etes trop jeune ! c'est "
    elif age > 60:
        prefix = "Vous etes vieux ! c'est "
    else:
        prefix = "Vous avez un age normal ! c'est "

    resultat_age = f"{prefix}{age}"

    return jsonify({
        "status": "ok",
        "message": f"Donnees recues : {name}, {age}, {resultat_age}",
        "resultatAge": resultat_age
    })



if __name__ == "__main__":
    app.run(debug=True, port=5000)
