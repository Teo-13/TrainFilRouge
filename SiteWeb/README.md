# TrainFilRouge

Stack:
- Front: React + TypeScript (Vite)
- Back: Flask (Python)

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
GET http://localhost:5000/api/health
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

Le front tourne sur http://localhost:5173 et proxy vers le back sur /api.
