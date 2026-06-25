from collections import Counter
from csv import DictReader
from functools import lru_cache
from pathlib import Path

from flask import Blueprint, jsonify


train_bp = Blueprint("train", __name__)

DATASET_PATH = Path(__file__).resolve().parents[3] / "NoteBook" / "gares-de-voyageurs.csv"
DATASET_SOURCE_URL = "https://ressources.data.sncf.com/explore/dataset/gares-de-voyageurs/"


def _format_int(value):
    return f"{value:,}".replace(",", " ")


def _format_ratio(value, total):
    if total <= 0:
        return "0%"

    return f"{round((value / total) * 100)}%"


@lru_cache(maxsize=1)
def _load_train_overview():
    with DATASET_PATH.open(encoding="utf-8-sig", newline="") as csv_file:
        rows = list(DictReader(csv_file, delimiter=";"))

    total_stations = len(rows)
    unique_communes = len({row.get("Code commune", "").strip() for row in rows if row.get("Code commune", "").strip()})

    segment_counts = Counter()
    for row in rows:
        raw_segment = (row.get("Segment(s) DRG") or "").strip()
        main_segment = raw_segment.split(";")[0].strip() if raw_segment else "Inconnu"
        segment_counts[main_segment] += 1

    tgv_stations = sum("TGV" in (row.get("Nom") or "").upper() for row in rows)
    multimodal_stations = sum(
        (
            "TGV" in (row.get("Nom") or "").upper()
            or any(
                keyword
                in (row.get("Nom") or "")
                .upper()
                .replace("É", "E")
                .replace("È", "E")
                .replace("Ê", "E")
                .replace("Ë", "E")
                for keyword in ("AEROPORT", "AERODROME")
            )
        )
        for row in rows
    )

    dataset_stats = [
        {
            "id": "stations",
            "label": "Gares voyageurs",
            "value": _format_int(total_stations),
            "description": "Nombre de gares presentes dans le dataset local utilise par la page.",
        },
        {
            "id": "communes",
            "label": "Communes desservies",
            "value": _format_int(unique_communes),
            "description": "Communes distinctes reliees a au moins une gare voyageur.",
        },
        {
            "id": "segment-c",
            "label": "Gares segment C",
            "value": _format_int(segment_counts.get("C", 0)),
            "description": "Le maillage local domine le dataset, signe d'un reseau fin sur le territoire.",
            "badge": _format_ratio(segment_counts.get("C", 0), total_stations),
        },
        {
            "id": "multimodal",
            "label": "Gares TGV ou aeroport",
            "value": _format_int(multimodal_stations),
            "description": "Points de connexion vers la grande vitesse ou l'intermodalite aerienne.",
        },
    ]

    segment_breakdown = [
        {
            "label": label,
            "count": count,
            "formattedCount": _format_int(count),
            "share": _format_ratio(count, total_stations),
        }
        for label, count in (
            ("Segment A", segment_counts.get("A", 0)),
            ("Segment B", segment_counts.get("B", 0)),
            ("Segment C", segment_counts.get("C", 0)),
        )
    ]

    web_facts = [
        {
            "id": "daily-travelers",
            "label": "Voyageurs par jour",
            "value": "5 M",
            "description": "SNCF Voyageurs indique transporter 5 millions de voyageurs chaque jour.",
            "sources": [
                {
                    "label": "SNCF Voyageurs - maj 23/06/2026",
                    "url": "https://www.groupe-sncf.com/fr/groupe/portrait-entreprise/groupe-societes/sncf-voyageurs",
                }
            ],
        },
        {
            "id": "daily-trains",
            "label": "Trains par jour",
            "value": "15 000",
            "description": "Nombre de trains qui circulent chaque jour selon la page societe de SNCF Voyageurs.",
            "sources": [
                {
                    "label": "SNCF Voyageurs - maj 23/06/2026",
                    "url": "https://www.groupe-sncf.com/fr/groupe/portrait-entreprise/groupe-societes/sncf-voyageurs",
                }
            ],
        },
        {
            "id": "tgv-passengers",
            "label": "Passagers TGV en 2025",
            "value": "168 M",
            "description": "TGV INOUI annonce plus de 168 millions de passagers transportes en France et en Europe en 2025.",
            "sources": [
                {
                    "label": "SNCF Voyageurs - maj 23/06/2026",
                    "url": "https://www.groupe-sncf.com/fr/groupe/portrait-entreprise/groupe-societes/sncf-voyageurs",
                }
            ],
        },
        {
            "id": "tgv-co2",
            "label": "Emission TGV",
            "value": "2,5 g CO2e / passager-km",
            "description": "Valeur communiquee par SNCF Voyageurs pour les trains longue distance en 2024.",
            "sources": [
                {
                    "label": "Methodologie GES SNCF Voyageurs 2024",
                    "url": "https://www.groupe-sncf.com/medias-publics/2024-10/sncf-voyageurs-methodologie-generale-info-ges-2024-en.pdf?VersionId=1zslhAnnLXRnD4DfUEV.WAsBkds.h1fw",
                }
            ],
        },
    ]

    return {
        "dataset": {
            "name": DATASET_PATH.name,
            "sourceUrl": DATASET_SOURCE_URL,
            "stats": dataset_stats,
            "segments": segment_breakdown,
        },
        "webFacts": web_facts,
    }


@train_bp.route("/overview", methods=["GET"])
def train_overview():
    try:
        return jsonify(_load_train_overview())
    except FileNotFoundError:
        return jsonify({"error": "Dataset train introuvable."}), 404
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
