import re
import unicodedata

from geopy.geocoders import Nominatim

departements = (
    ("01", "Ain"),
    ("02", "Aisne"),
    ("03", "Allier"),
    ("04", "Alpes-de-Haute-Provence"),
    ("05", "Hautes-Alpes"),
    ("06", "Alpes-Maritimes"),
    ("07", "Ardeche"),
    ("08", "Ardennes"),
    ("09", "Ariege"),
    ("10", "Aube"),
    ("11", "Aude"),
    ("12", "Aveyron"),
    ("13", "Bouches-du-Rhone"),
    ("14", "Calvados"),
    ("15", "Cantal"),
    ("16", "Charente"),
    ("17", "Charente-Maritime"),
    ("18", "Cher"),
    ("19", "Correze"),
    ("2A", "Corse-du-Sud"),
    ("2B", "Haute-Corse"),
    ("21", "Cote-d'Or"),
    ("22", "Cotes-d'Armor"),
    ("23", "Creuse"),
    ("24", "Dordogne"),
    ("25", "Doubs"),
    ("26", "Drome"),
    ("27", "Eure"),
    ("28", "Eure-et-Loir"),
    ("29", "Finistere"),
    ("30", "Gard"),
    ("31", "Haute-Garonne"),
    ("32", "Gers"),
    ("33", "Gironde"),
    ("34", "Herault"),
    ("35", "Ille-et-Vilaine"),
    ("36", "Indre"),
    ("37", "Indre-et-Loire"),
    ("38", "Isere"),
    ("39", "Jura"),
    ("40", "Landes"),
    ("41", "Loir-et-Cher"),
    ("42", "Loire"),
    ("43", "Haute-Loire"),
    ("44", "Loire-Atlantique"),
    ("45", "Loiret"),
    ("46", "Lot"),
    ("47", "Lot-et-Garonne"),
    ("48", "Lozere"),
    ("49", "Maine-et-Loire"),
    ("50", "Manche"),
    ("51", "Marne"),
    ("52", "Haute-Marne"),
    ("53", "Mayenne"),
    ("54", "Meurthe-et-Moselle"),
    ("55", "Meuse"),
    ("56", "Morbihan"),
    ("57", "Moselle"),
    ("58", "Nievre"),
    ("59", "Nord"),
    ("60", "Oise"),
    ("61", "Orne"),
    ("62", "Pas-de-Calais"),
    ("63", "Puy-de-Dome"),
    ("64", "Pyrenees-Atlantiques"),
    ("65", "Hautes-Pyrenees"),
    ("66", "Pyrenees-Orientales"),
    ("67", "Bas-Rhin"),
    ("68", "Haut-Rhin"),
    ("69", "Rhone"),
    ("70", "Haute-Saone"),
    ("71", "Saone-et-Loire"),
    ("72", "Sarthe"),
    ("73", "Savoie"),
    ("74", "Haute-Savoie"),
    ("75", "Paris"),
    ("76", "Seine-Maritime"),
    ("77", "Seine-et-Marne"),
    ("78", "Yvelines"),
    ("79", "Deux-Sevres"),
    ("80", "Somme"),
    ("81", "Tarn"),
    ("82", "Tarn-et-Garonne"),
    ("83", "Var"),
    ("84", "Vaucluse"),
    ("85", "Vendee"),
    ("86", "Vienne"),
    ("87", "Haute-Vienne"),
    ("88", "Vosges"),
    ("89", "Yonne"),
    ("90", "Territoire de Belfort"),
    ("91", "Essonne"),
    ("92", "Hauts-de-Seine"),
    ("93", "Seine-Saint-Denis"),
    ("94", "Val-de-Marne"),
    ("95", "Val-d'Oise"),
    ("971", "Guadeloupe"),
    ("972", "Martinique"),
    ("973", "Guyane"),
    ("974", "La Reunion"),
    ("976", "Mayotte"),
)


def normaliser_texte(value):
    texte = str(value or "").strip().lower()
    texte = unicodedata.normalize("NFD", texte)
    texte = "".join(char for char in texte if unicodedata.category(char) != "Mn")
    texte = re.sub(r"[^a-z0-9]+", " ", texte)
    return re.sub(r"\s+", " ", texte).strip()


def obtenir_departement_simple(code_postal):
    code_postal_str = str(code_postal or "").strip()

    if not code_postal_str:
        return ""

    if code_postal_str.startswith(("97", "98")):
        return code_postal_str[:3]

    return code_postal_str[:2]


def trouver_departement_par_code_ou_nom(valeur):
    recherche = normaliser_texte(valeur)

    if not recherche:
        return None

    for code, nom in departements:
        if recherche in {normaliser_texte(code), normaliser_texte(nom)}:
            return {
                "code": code,
                "nom": nom,
                "nom_normalise": normaliser_texte(nom),
            }

    return None


def CoodonnesVille(ville):
    geolocator = Nominatim(user_agent="mon_application_voyage")
    try:
        location = geolocator.geocode(ville)
        if location:
            return (location.latitude, location.longitude)
        return None
    except Exception:
        return None
