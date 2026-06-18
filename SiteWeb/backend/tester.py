def obtenir_departement_simple(code_postal):
    # On force en string pour pouvoir découper
    cp_str = str(code_postal).strip()
    
    # Gestion des DOM-TOM (les codes postaux commencent par 97 ou 98)
    if cp_str.startswith(('97', '98')):
        return cp_str[:3]
        
    # Cas général (Métropole)
    return cp_str[:2]

# Tests
codepostal = int(input("quelle est votre code postal ?"))

resultat = obtenir_departement_simple(codepostal)

print("votre département : ", resultat)