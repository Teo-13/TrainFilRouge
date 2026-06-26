# TrainFilRouge

Stack:
- Front: React + TypeScript (Vite)
- Back: Flask (Python)

## Fonctionnement du scoring

Le site n'utilise pas de regression logistique, pas de modele de machine learning
et pas d'optimisation lineaire. Le scoring est une methode deterministe de
comparaison multicritere.

### 1) Score par type pour les barres

Pour chaque transport (`train`, `voiture`, `avion`), le backend calcule trois
scores separes:

- `scoreTemps`: compare les temps de trajet.
- `scorePrix`: compare les prix estimes.
- `scoreEmission`: compare les emissions CO2.

Chaque score est normalise entre 0 et 100 avec une normalisation min-max. Comme
une petite valeur est meilleure pour le temps, le prix et le CO2, la formule est
inversee:

```text
score = 100 - ((valeur - minimum) / (maximum - minimum)) * 100
```

Donc:

- le meilleur transport sur un critere recoit `100`;
- le moins bon recoit `0`;
- les autres sont places entre les deux.

Ces scores servent aux barres affichees dans les cartes transport.

### 2) Score global et classement

Le deuxieme scoring sert a classer les transports selon les preferences cochees
dans le formulaire:

- `Plus rapide` utilise `scoreTemps`;
- `Moins cher` utilise `scorePrix`;
- `Eco-responsable` utilise `scoreEmission`.

Si plusieurs preferences sont cochees, le score global est la moyenne simple des
scores selectionnes. Si aucune preference n'est cochee, le site utilise les trois
criteres avec le meme poids.

Exemple:

```text
score_global = (scoreTemps + scoreEmission) / 2
```

si l'utilisateur coche `Plus rapide` et `Eco-responsable`.

Le backend renvoie ensuite `classementTransports`, trie du meilleur score global
au moins bon. Ce classement est affiche dans la page de comparaison.

## Setup

### 1) Environnement Python (venv)
Dans le dossier racine:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
```

### 2) Lancer le backend

```powershell
cd backend
python app.py
```

API test:

```
GET http://localhost:5002/api/health
```

### 3) Installer et lancer le front

Dans un autre terminal:

```powershell
cd frontend
npm install

npm install react-router
npm install react-router-dom

npm run dev
```

Le front tourne sur http://localhost:5174 et proxy vers le back sur /api.
