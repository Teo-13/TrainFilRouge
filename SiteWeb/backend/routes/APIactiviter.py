from functools import lru_cache
from pathlib import Path

import pandas as pd
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin

from utils.CoordonneVille import (
    normaliser_texte,
    obtenir_departement_simple,
    trouver_departement_par_code_ou_nom,
)

activiter_bp = Blueprint("activiter", __name__)

DATASET_PATH = Path(__file__).resolve().parents[3] / "dataset" / "festivals.csv"


def _clean_value(value):
    return str(value or "").strip()


@lru_cache(maxsize=1)
def charger_festivals():
    dataframe = pd.read_csv(DATASET_PATH, sep=";", encoding="utf-8-sig").fillna("")

    dataframe["commune_normalisee"] = dataframe["Commune principale de déroulement"].map(normaliser_texte)
    dataframe["departement_normalise"] = dataframe["Département principal de déroulement"].map(normaliser_texte)
    dataframe["region_normalisee"] = dataframe["Région principale de déroulement"].map(normaliser_texte)
    dataframe["code_postal_normalise"] = (
        dataframe["Code postal (de la commune principale de déroulement)"]
        .astype(str)
        .str.strip()
        .str.replace(r"\.0$", "", regex=True)
    )
    dataframe["departement_code"] = dataframe["code_postal_normalise"].map(obtenir_departement_simple)

    return dataframe


def formater_festival(ligne):
    return {
        "nom": ligne["Nom du festival"],
        "region": ligne["Région principale de déroulement"],
        "departement": ligne["Département principal de déroulement"],
        "commune": ligne["Commune principale de déroulement"],
        "codePostal": ligne["Code postal (de la commune principale de déroulement)"],
        "discipline": ligne["Discipline dominante"],
        "periode": ligne["Période principale de déroulement du festival"],
        "siteInternet": ligne["Site internet du festival"],
        "adresse": ligne["Adresse postale"],
    }


def rechercher_par_ville(dataframe, ville, code_postal):
    ville_normalisee = normaliser_texte(ville)
    code_postal_normalise = _clean_value(code_postal)

    return dataframe[
        (dataframe["commune_normalisee"] == ville_normalisee)
        & (dataframe["code_postal_normalise"] == code_postal_normalise)
    ]


def rechercher_par_departement(dataframe, departement):
    departement_info = trouver_departement_par_code_ou_nom(departement)
    departement_normalise = normaliser_texte(departement)

    if departement_info:
        resultat = dataframe[
            (dataframe["departement_normalise"] == departement_info["nom_normalise"])
            | (dataframe["departement_code"] == departement_info["code"])
        ]
        return resultat, departement_info["nom"]

    return dataframe[dataframe["departement_normalise"] == departement_normalise], departement


def rechercher_par_region(dataframe, region):
    region_normalisee = normaliser_texte(region)
    return dataframe[dataframe["region_normalisee"] == region_normalisee]


@activiter_bp.route("/", methods=["POST", "OPTIONS"])
@cross_origin()
def activiter():
    if request.method == "OPTIONS":
        return "", 200

    data = request.get_json(silent=True) or {}

    suite = _clean_value(data.get("suite")).lower()
    ville = _clean_value(data.get("ville"))
    code_postal = _clean_value(data.get("codePostal"))
    departement = _clean_value(data.get("departement"))
    region = _clean_value(data.get("region"))

    if suite not in {"ville", "departement", "region"}:
        return jsonify({
            "status": "error",
            "message": "Le type de recherche est invalide.",
        }), 400

    festivals = charger_festivals()

    if suite == "ville":
        if not ville or not code_postal:
            return jsonify({
                "status": "error",
                "message": "La ville et le code postal sont obligatoires.",
            }), 400

        resultat = rechercher_par_ville(festivals, ville, code_postal)
        recherche = f"{ville} ({code_postal})"
    elif suite == "departement":
        if not departement:
            return jsonify({
                "status": "error",
                "message": "Le departement est obligatoire.",
            }), 400

        resultat, recherche = rechercher_par_departement(festivals, departement)
    else:
        if not region:
            return jsonify({
                "status": "error",
                "message": "La region est obligatoire.",
            }), 400

        resultat = rechercher_par_region(festivals, region)
        recherche = region

    festivals_formates = [
        formater_festival(ligne)
        for _, ligne in resultat.sort_values("Nom du festival").head(100).iterrows()
    ]

    if festivals_formates:
        message = f"{len(festivals_formates)} festival(s) trouve(s) pour {recherche}."
    else:
        message = f"Aucun festival trouve pour {recherche}."

    return jsonify({
        "status": "ok",
        "message": message,
        "nombre": len(festivals_formates),
        "recherche": {
            "type": suite,
            "valeur": recherche,
        },
        "festivals": festivals_formates,
    })
