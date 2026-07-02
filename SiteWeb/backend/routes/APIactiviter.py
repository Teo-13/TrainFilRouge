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


def _resolve_dataset_dir():
    project_root = Path(__file__).resolve().parents[3]

    for directory_name in ("Dataset", "dataset"):
        dataset_dir = project_root / directory_name
        if dataset_dir.exists():
            return dataset_dir

    return project_root / "Dataset"


DATASET_DIR = _resolve_dataset_dir()
FESTIVALS_PATH = DATASET_DIR / "festivals.csv"
MUSEES_PATH = DATASET_DIR / "museofile.csv"
LIEUX_HISTORIQUES_PATH = DATASET_DIR / "base-des-lieux-et-des-equipements-culturels (2).csv"


def _clean_value(value):
    return str(value or "").strip()


def _read_csv(path, sep):
    return pd.read_csv(path, sep=sep, encoding="utf-8-sig", dtype=str).fillna("")


def _prepare_location_columns(
    dataframe,
    *,
    commune_column,
    postal_column,
    departement_column,
    region_column,
    departement_code_column=None,
):
    dataframe = dataframe.copy()
    dataframe["commune_normalisee"] = dataframe[commune_column].map(normaliser_texte)
    dataframe["departement_normalise"] = dataframe[departement_column].map(normaliser_texte)
    dataframe["region_normalisee"] = dataframe[region_column].map(normaliser_texte)
    dataframe["code_postal_normalise"] = (
        dataframe[postal_column]
        .astype(str)
        .str.strip()
        .str.replace(r"\.0$", "", regex=True)
    )

    if departement_code_column and departement_code_column in dataframe.columns:
        dataframe["departement_code"] = (
            dataframe[departement_code_column]
            .astype(str)
            .str.strip()
            .str.replace(r"\.0$", "", regex=True)
        )
    else:
        dataframe["departement_code"] = dataframe["code_postal_normalise"].map(obtenir_departement_simple)

    return dataframe


@lru_cache(maxsize=1)
def charger_festivals():
    dataframe = _read_csv(FESTIVALS_PATH, sep=";")
    return _prepare_location_columns(
        dataframe,
        commune_column="Commune principale de déroulement",
        postal_column="Code postal (de la commune principale de déroulement)",
        departement_column="Département principal de déroulement",
        region_column="Région principale de déroulement",
    )


@lru_cache(maxsize=1)
def charger_musees():
    dataframe = _read_csv(MUSEES_PATH, sep="|")
    return _prepare_location_columns(
        dataframe,
        commune_column="Ville",
        postal_column="Code_postal",
        departement_column="Departement",
        region_column="Region",
    )


@lru_cache(maxsize=1)
def charger_lieux_historiques():
    dataframe = _read_csv(LIEUX_HISTORIQUES_PATH, sep=";")
    dataframe = _prepare_location_columns(
        dataframe,
        commune_column="libelle_geographique",
        postal_column="Code Postal",
        departement_column="Département",
        region_column="Région",
        departement_code_column="N_Département",
    )

    dataframe["est_lieu_historique"] = (
        dataframe["Domaine"].map(normaliser_texte).str.contains("patrimoine", na=False)
        | dataframe["Type équipement ou lieu"].map(normaliser_texte).str.contains("monument", na=False)
        | dataframe["Label et appellation"].map(normaliser_texte).str.contains("monument", na=False)
        | dataframe["Precision_protection_sites_et_monuments"].map(normaliser_texte).ne("")
    )

    return dataframe[dataframe["est_lieu_historique"]].copy()


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


def formater_musee(ligne):
    return {
        "nom": ligne["Nom_officiel"],
        "region": ligne["Region"],
        "departement": ligne["Departement"],
        "commune": ligne["Ville"],
        "codePostal": ligne["Code_postal"],
        "adresse": ligne["Adresse"],
        "lieu": ligne["Lieu"],
        "categorie": ligne["Categorie"],
        "domaineThematique": ligne["Domaine_thematique"],
        "histoire": ligne["Histoire"],
        "atout": ligne["Atout"],
        "siteInternet": ligne["URL"],
        "telephone": ligne["Telephone"],
    }


def formater_lieu_historique(ligne):
    return {
        "nom": ligne["Nom"],
        "region": ligne["Région"],
        "departement": ligne["Département"],
        "commune": ligne["libelle_geographique"],
        "codePostal": ligne["Code Postal"],
        "adresse": ligne["Adresse postale"],
        "typeLieu": ligne["Type équipement ou lieu"],
        "label": ligne["Label et appellation"],
        "domaine": ligne["Domaine"],
        "sousDomaine": ligne["Sous_domaine"],
        "protection": ligne["Precision_protection_sites_et_monuments"],
        "coordonnees": ligne["coordonnees_geo"],
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


def filtrer_dataframe(dataframe, suite, *, ville="", code_postal="", departement="", region=""):
    if suite == "ville":
        return rechercher_par_ville(dataframe, ville, code_postal), f"{ville} ({code_postal})"

    if suite == "departement":
        resultat, recherche = rechercher_par_departement(dataframe, departement)
        return resultat, recherche

    return rechercher_par_region(dataframe, region), region


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
    filtres = data.get("filtres") or {}

    if suite not in {"ville", "departement", "region"}:
        return jsonify({
            "status": "error",
            "message": "Le type de recherche est invalide.",
        }), 400

    if suite == "ville":
        if not ville or not code_postal:
            return jsonify({
                "status": "error",
                "message": "La ville et le code postal sont obligatoires.",
            }), 400
    elif suite == "departement":
        if not departement:
            return jsonify({
                "status": "error",
                "message": "Le departement est obligatoire.",
            }), 400
    else:
        if not region:
            return jsonify({
                "status": "error",
                "message": "La region est obligatoire.",
            }), 400

    filtres_actifs = [
        nom
        for nom, actif in (
            ("festivals", bool(filtres.get("festivals"))),
            ("musees", bool(filtres.get("musees"))),
            ("lieuxHistoriques", bool(filtres.get("lieuxHistoriques"))),
        )
        if actif
    ]

    if not filtres_actifs:
        filtres_actifs = ["festivals", "musees", "lieuxHistoriques"]

    definitions = {
        "festivals": {
            "loader": charger_festivals,
            "formatter": formater_festival,
            "sort_column": "Nom du festival",
        },
        "musees": {
            "loader": charger_musees,
            "formatter": formater_musee,
            "sort_column": "Nom_officiel",
        },
        "lieuxHistoriques": {
            "loader": charger_lieux_historiques,
            "formatter": formater_lieu_historique,
            "sort_column": "Nom",
        },
    }

    resultats = {}
    recherche = ""

    for filtre in filtres_actifs:
        definition = definitions[filtre]
        dataframe = definition["loader"]()
        resultat, recherche = filtrer_dataframe(
            dataframe,
            suite,
            ville=ville,
            code_postal=code_postal,
            departement=departement,
            region=region,
        )
        resultats[filtre] = [
            definition["formatter"](ligne)
            for _, ligne in resultat.sort_values(definition["sort_column"]).head(100).iterrows()
        ]

    total_resultats = sum(len(items) for items in resultats.values())

    if total_resultats:
        message = f"{total_resultats} resultat(s) trouve(s) pour {recherche}."
    else:
        message = f"Aucun resultat trouve pour {recherche}."

    return jsonify({
        "status": "ok",
        "message": message,
        "nombre": total_resultats,
        "recherche": {
            "type": suite,
            "valeur": recherche,
        },
        "filtresActifs": filtres_actifs,
        "resultats": {
            "festivals": resultats.get("festivals", []),
            "musees": resultats.get("musees", []),
            "lieuxHistoriques": resultats.get("lieuxHistoriques", []),
        },
        "festivals": resultats.get("festivals", []),
    })
