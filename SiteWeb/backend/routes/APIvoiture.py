from collections import Counter
from functools import lru_cache
from pathlib import Path
import struct
import zipfile

from flask import Blueprint, jsonify


voiture_bp = Blueprint("voiture", __name__)

DATASET_PATH = Path(__file__).resolve().parents[3] / "NoteBook" / "rrn-2025-metropole-shp.zip"
DATASET_SOURCE_URL = "https://www.data.gouv.fr/datasets/liaisons-du-reseau-routier-national"


def _format_int(value):
    return f"{value:,}".replace(",", " ")


def _format_ratio(value, total):
    if total <= 0:
        return "0%"

    return f"{round((value / total) * 100)}%"


def _read_dbf_rows(zip_file, dbf_name, selected_fields):
    data = zip_file.read(dbf_name)
    num_records = struct.unpack("<I", data[4:8])[0]
    header_len = struct.unpack("<H", data[8:10])[0]
    record_len = struct.unpack("<H", data[10:12])[0]

    fields = []
    position = 32
    while position < header_len - 1:
        field = data[position:position + 32]
        if field[0] == 0x0D:
            break

        field_name = field[:11].split(b"\x00", 1)[0].decode("ascii", "ignore")
        field_len = field[16]
        fields.append((field_name, field_len))
        position += 32

    rows = []
    for index in range(num_records):
        record = data[header_len + index * record_len:header_len + (index + 1) * record_len]
        if record[:1] == b"*":
            continue

        values = {}
        offset = 1
        for field_name, field_len in fields:
            raw_value = record[offset:offset + field_len]
            offset += field_len

            if field_name in selected_fields:
                values[field_name] = raw_value.decode("latin1", "ignore").strip()

        rows.append(values)

    return rows


def _normalize_route_family(route_name):
    route_name = (route_name or "").strip().upper()
    if route_name.startswith("A"):
        return "Autoroutes"
    if route_name.startswith("N") or route_name.startswith("RN"):
        return "Routes nationales"
    return "Bretelles et raccordements"


@lru_cache(maxsize=1)
def _load_voiture_overview():
    with zipfile.ZipFile(DATASET_PATH) as archive:
        segment_rows = _read_dbf_rows(
            archive,
            "VSMAP_TOUT.dbf",
            {"route", "lib_rte", "dist_deb", "dist_fin", "gestionnai"},
        )
        bornage_rows = _read_dbf_rows(
            archive,
            "BORNAGE_TOUT.dbf",
            {"route", "gestionnai", "qualite"},
        )

    total_segments = len(segment_rows)
    unique_routes = len({row.get("route", "") for row in segment_rows if row.get("route", "")})
    total_length_m = 0
    for row in segment_rows:
        try:
            start_distance = float(row.get("dist_deb") or 0)
            end_distance = float(row.get("dist_fin") or 0)
        except ValueError:
            continue

        total_length_m += max(0, end_distance - start_distance)

    total_length_km = round(total_length_m / 1000)
    bornage_points = len(bornage_rows)
    managers = len({row.get("gestionnai", "") for row in segment_rows if row.get("gestionnai", "")})

    family_counts = Counter()
    for row in segment_rows:
        family_key = _normalize_route_family(row.get("lib_rte") or row.get("route"))
        family_counts[family_key] += 1

    road_families = [
        {
            "label": label,
            "count": count,
            "formattedCount": _format_int(count),
            "share": _format_ratio(count, total_segments),
        }
        for label, count in (
            ("Autoroutes", family_counts.get("Autoroutes", 0)),
            ("Routes nationales", family_counts.get("Routes nationales", 0)),
            ("Bretelles et raccordements", family_counts.get("Bretelles et raccordements", 0)),
        )
    ]

    dataset_stats = [
        {
            "id": "segments",
            "label": "Sections cartographiees",
            "value": _format_int(total_segments),
            "description": "Nombre de troncons du reseau routier representes dans le shapefile utilise par le notebook.",
        },
        {
            "id": "routes",
            "label": "References de routes",
            "value": _format_int(unique_routes),
            "description": "References distinctes de routes ou d'axes routiers presentes dans le fichier local.",
        },
        {
            "id": "bornage",
            "label": "Points de bornage",
            "value": _format_int(bornage_points),
            "description": "Points de reperage kilometrique visibles en rouge sur la carte du notebook.",
        },
        {
            "id": "length",
            "label": "Longueur representee",
            "value": f"{_format_int(total_length_km)} km",
            "description": "Longueur cumulee des sections routieres decrites dans le fichier local.",
        },
        {
            "id": "managers",
            "label": "Gestionnaires",
            "value": _format_int(managers),
            "description": "Nombre de gestionnaires differents identifies dans la base locale.",
        },
    ]

    web_facts = [
        {
            "id": "cars-2025",
            "label": "Voitures en circulation",
            "value": "39,7 M",
            "description": "Le SDES comptabilise 39,7 millions de voitures particulieres en circulation au 1er janvier 2025.",
            "sources": [
                {
                    "label": "SDES - parc automobile au 1er janvier 2025",
                    "url": "https://www.statistiques.developpement-durable.gouv.fr/donnees-sur-le-parc-automobile-francais-au-1er-janvier-2025",
                }
            ],
        },
        {
            "id": "roads-2024",
            "label": "Longueur des routes",
            "value": "1,31 M km",
            "description": "Les chiffres cles des transports 2026 recensent 1 310 184 km de routes en France en 2024.",
            "sources": [
                {
                    "label": "SDES - infrastructures de transport 2024",
                    "url": "https://www.statistiques.developpement-durable.gouv.fr/edition-numerique/chiffres-cles-transports/fr/infrastructures-de-transport",
                }
            ],
        },
        {
            "id": "public-chargers-2026",
            "label": "Bornes publiques",
            "value": "192 008",
            "description": "Avere-France et le ministere de la Transition ecologique annoncent 192 008 points de recharge ouverts au public au 31 mars 2026.",
            "sources": [
                {
                    "label": "Avere-France - barometre du 09/04/2026",
                    "url": "https://www.avere-france.org/publication/barometre-192-008-points-de-recharge-ouverts-au-public-fin-mars-2026/",
                }
            ],
        },
        {
            "id": "car-co2",
            "label": "Emission voiture thermique",
            "value": "142 g CO2e / km",
            "description": "Impact CO2 affiche 142 g CO2e par kilometre pour une voiture thermique moyenne en France.",
            "sources": [
                {
                    "label": "Impact CO2 - voiture thermique",
                    "url": "https://impactco2.fr/outils/transport/voiturethermique",
                }
            ],
        },
    ]

    return {
        "dataset": {
            "name": DATASET_PATH.name,
            "sourceUrl": DATASET_SOURCE_URL,
            "stats": dataset_stats,
            "roadFamilies": road_families,
        },
        "webFacts": web_facts,
    }


@voiture_bp.route("/overview", methods=["GET"])
def voiture_overview():
    try:
        return jsonify(_load_voiture_overview())
    except FileNotFoundError:
        return jsonify({"error": "Dataset voiture introuvable."}), 404
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
