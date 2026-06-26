from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import pandas as pd
import os

from routes.APIdistance import distance_bp
from routes.APIemissionDistance import emsissionDistance_bp
from routes.APIactiviter import activiter_bp
from routes.APItrain import train_bp
from routes.APIavion import avion_bp
from routes.APIvoiture import voiture_bp

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIST_DIR = BASE_DIR.parent / "frontend" / "dist"

app = Flask(__name__)
CORS(app)  # autorise React a appeler l'API

# ==== import des routes ====
app.register_blueprint(distance_bp, url_prefix='/api/distance')
app.register_blueprint(emsissionDistance_bp, url_prefix='/api/emissions')
app.register_blueprint(activiter_bp, url_prefix='/api/activiter')
app.register_blueprint(train_bp, url_prefix='/api/train')
app.register_blueprint(avion_bp, url_prefix='/api/avion')
app.register_blueprint(voiture_bp, url_prefix='/api/voiture')



@app.route("/api/status")
def status():
    return jsonify({
        "status": "ok"
    })


@app.route("/api/health")
def health():
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


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path.startswith("api/"):
        return jsonify({"error": "Route API introuvable."}), 404

    if not FRONTEND_DIST_DIR.exists():
        return jsonify({
            "error": "Frontend non construit. Lancez 'npm run build' dans SiteWeb/frontend.",
        }), 404

    requested_file = FRONTEND_DIST_DIR / path
    if path and requested_file.is_file():
        return send_from_directory(FRONTEND_DIST_DIR, path)

    index_file = FRONTEND_DIST_DIR / "index.html"
    if index_file.is_file():
        return send_from_directory(FRONTEND_DIST_DIR, "index.html")

    return jsonify({"error": "index.html introuvable dans le build frontend."}), 404


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
    app.run(debug=True, host="0.0.0.0", port=5002)
