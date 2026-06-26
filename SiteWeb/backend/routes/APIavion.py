from collections import Counter
from functools import lru_cache
from pathlib import Path

import pandas as pd
from flask import Blueprint, jsonify


avion_bp = Blueprint("avion", __name__)

DATASET_PATH = Path(__file__).resolve().parents[3] / "NoteBook" / "fr-airports.csv"
DATASET_SOURCE_URL = "https://github.com/davidmegginson/ourairports-data"

TYPE_LABELS = {
    "large_airport": "Grand aeroport",
    "medium_airport": "Aeroport regional",
    "small_airport": "Petit aeroport",
    "heliport": "Heliport",
}


def _format_int(value):
    return f"{value:,}".replace(",", " ")


def _format_ratio(value, total):
    if total <= 0:
        return "0%"

    return f"{round((value / total) * 100)}%"


@lru_cache(maxsize=1)
def _load_avion_overview():
    dataframe = pd.read_csv(DATASET_PATH).fillna("")
    france = dataframe[dataframe["iso_country"] == "FR"].copy()

    total_platforms = len(france)
    municipalities = (
        france["municipality"]
        .astype(str)
        .str.strip()
        .replace("", pd.NA)
        .dropna()
        .nunique()
    )
    scheduled_service = int((france["scheduled_service"] == 1).sum())
    iata_codes = int(
        france["iata_code"]
        .astype(str)
        .str.strip()
        .replace("", pd.NA)
        .dropna()
        .nunique()
    )

    selected_types = ["large_airport", "medium_airport", "small_airport", "heliport"]
    type_counts = Counter(france[france["type"].isin(selected_types)]["type"])
    visible_total = sum(type_counts.values())

    dataset_stats = [
        {
            "id": "platforms",
            "label": "Plateformes recensees",
            "value": _format_int(total_platforms),
            "description": "Nombre total de plateformes aeriennes francaises presentes dans le dataset local.",
        },
        {
            "id": "municipalities",
            "label": "Communes avec plateforme",
            "value": _format_int(municipalities),
            "description": "Communes distinctes reliees a au moins un aeroport, aerodrome ou heliport.",
        },
        {
            "id": "scheduled-service",
            "label": "Service regulier",
            "value": _format_int(scheduled_service),
            "description": "Plateformes signalees avec desserte reguliere dans le fichier local.",
            "badge": _format_ratio(scheduled_service, total_platforms),
        },
        {
            "id": "iata",
            "label": "Codes IATA",
            "value": _format_int(iata_codes),
            "description": "Plateformes disposant d'un code IATA dans le jeu de donnees.",
        },
    ]

    type_breakdown = [
        {
            "label": TYPE_LABELS[type_key],
            "count": count,
            "formattedCount": _format_int(count),
            "share": _format_ratio(count, visible_total),
        }
        for type_key, count in (
            ("large_airport", type_counts.get("large_airport", 0)),
            ("medium_airport", type_counts.get("medium_airport", 0)),
            ("small_airport", type_counts.get("small_airport", 0)),
            ("heliport", type_counts.get("heliport", 0)),
        )
    ]

    web_facts = [
        {
            "id": "france-t1-2026",
            "label": "Trafic France T1 2026",
            "value": "37,3 M",
            "description": "La DGAC indique 37,3 millions de passagers a l'arrivee et au depart de France au premier trimestre 2026.",
            "sources": [
                {
                    "label": "Ministere des Transports - analyses du transport aerien (maj 17/04/2026)",
                    "url": "https://www.ecologie.gouv.fr/politiques-publiques/analyses-du-transport-aerien",
                }
            ],
        },
        {
            "id": "winter-seats",
            "label": "Sieges hiver 2025-2026",
            "value": "37,6 M",
            "description": "Offre en sieges au depart de France metropolitaine pour la saison hiver 2025-2026 selon la DGAC.",
            "sources": [
                {
                    "label": "Ministere des Transports - analyses du transport aerien (maj 17/04/2026)",
                    "url": "https://www.ecologie.gouv.fr/politiques-publiques/analyses-du-transport-aerien",
                }
            ],
        },
        {
            "id": "paris-airports-2025",
            "label": "Paris Aeroport en 2025",
            "value": "107 M",
            "description": "Le groupe ADP annonce 107 millions de passagers pour Paris Aeroport sur l'ensemble de l'annee 2025.",
            "sources": [
                {
                    "label": "Paris Aeroport - traffic figures 2025 (15/01/2026)",
                    "url": "https://www.parisaeroport.fr/en/group/finance/investor-relations/traffic",
                }
            ],
        },
        {
            "id": "avion-co2",
            "label": "Emission avion moyen",
            "value": "185 g CO2e / km",
            "description": "Impact CO2 affiche environ 185 g CO2e par kilometre et par personne pour un avion trajet moyen en France.",
            "sources": [
                {
                    "label": "Impact CO2 - avion trajet moyen",
                    "url": "https://impactco2.fr/outils/transport/avion-moyencourrier",
                }
            ],
        },
    ]

    return {
        "dataset": {
            "name": DATASET_PATH.name,
            "sourceUrl": DATASET_SOURCE_URL,
            "stats": dataset_stats,
            "types": type_breakdown,
        },
        "webFacts": web_facts,
    }


@avion_bp.route("/overview", methods=["GET"])
def avion_overview():
    try:
        return jsonify(_load_avion_overview())
    except FileNotFoundError:
        return jsonify({"error": "Dataset avion introuvable."}), 404
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
