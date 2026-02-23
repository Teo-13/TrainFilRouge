from asyncio.windows_events import NULL

from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # autorise React à appeler l'API


@app.route("/api/hello")
def hello():
    return jsonify({"message": "Bonjour depuis Flask 🚀"})

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
        message = "Erreur : la température n'est pas disponible."
    elif humidity > 45:
        message ="Attention, l'humidité est élevée !"
    else:
        message ="L'humidité est dans la normale."


    return jsonify({
        "temperature": temperature,
        "humidity": humidity,
        "city": city,
        "message": message
    })

@app.route("/api/send", methods=["POST"])
def Formulaire():

    data = request.json  # 1 récupérer le JSON envoyé
    name = data["name"]
    age = data["age"]

    print(name, age)

    return jsonify({
        "status": "ok",
        "message": f"Données reçues : {name}, {age}"
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
