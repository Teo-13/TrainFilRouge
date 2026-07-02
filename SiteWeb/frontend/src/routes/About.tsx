import "./About.css";

const stackItems = [
  {
    title: "Frontend",
    value: "React + TypeScript + Vite",
    description: "Interface web, navigation entre les pages et affichage dynamique des resultats.",
  },
  {
    title: "Backend",
    value: "Flask + Python",
    description: "APIs internes, chargement des datasets et calcul des trajets, prix et emissions.",
  },
  {
    title: "Traitement des donnees",
    value: "Pandas + CSV + Shapefile",
    description: "Lecture, filtrage et synthese de jeux de donnees transport et activites.",
  },
  {
    title: "Geolocalisation",
    value: "Geopy + Nominatim",
    description: "Transformation des villes en coordonnees pour lancer les calculs de trajet.",
  },
];

const featureItems = [
  "Comparer train, voiture et avion entre deux villes.",
  "Prendre en compte le temps, le prix et l'impact CO2.",
  "Mettre en avant le transport le plus pertinent selon les criteres choisis.",
  "Afficher des informations de contexte sur les reseaux train, voiture et avion.",
  "Proposer des activites locales via les datasets festivals, musees et lieux historiques.",
];

const datasets = [
  {
    title: "gares-de-voyageurs.csv",
    tag: "Train",
    stats: "2 782 gares, 2 470 communes",
    role: "Utilise pour presenter le reseau ferroviaire francais et enrichir la page train.",
    content: "Le fichier contient notamment le nom de la gare, son segment, sa commune, ses codes UIC et sa position geographique.",
  },
  {
    title: "fr-airports.csv",
    tag: "Avion",
    stats: "1 756 plateformes, 1 100 communes",
    role: "Utilise pour representer les aeroports, heliports et plateformes aeriennes en France.",
    content: "On y trouve le type d'aeroport, la commune, les coordonnees, le code IATA et le service regulier ou non.",
  },
  {
    title: "rrn-2025-metropole-shp.zip",
    tag: "Voiture",
    stats: "56 205 sections, 74 182 bornages, 43 172 km",
    role: "Base du travail sur le reseau routier national et de la visualisation voiture.",
    content: "Le jeu de donnees contient des troncons routiers, des references d'axes, des distances de debut et fin et les gestionnaires du reseau.",
  },
  {
    title: "festivals.csv",
    tag: "Activites",
    stats: "7 283 festivals",
    role: "Alimente la page Quoi faire pour proposer des evenements culturels selon la ville, le departement ou la region.",
    content: "Le fichier contient le nom du festival, la commune, le code postal, la region, la discipline dominante, la periode et le site internet.",
  },
  {
    title: "museofile.csv",
    tag: "Activites",
    stats: "1 216 musees",
    role: "Permet d'afficher des lieux culturels plus permanents dans la page Quoi faire.",
    content: "On y trouve le nom officiel, l'adresse, la ville, le departement, la region, le domaine thematique, l'histoire du lieu et son site web.",
  },
  {
    title: "base-des-lieux-et-des-equipements-culturels (2).csv",
    tag: "Activites",
    stats: "53 503 lieux historiques filtres",
    role: "Utilise pour afficher les lieux patrimoniaux et historiques selon les filtres du formulaire.",
    content: "Le dataset contient le nom du lieu, le type d'equipement, l'adresse, la commune, le label, le domaine et les informations de protection patrimoniale.",
  },
];

const internalApis = [
  {
    endpoint: "/api/distance",
    role: "Compare train, voiture et avion pour un trajet et retourne temps, prix, distance et emissions.",
  },
  {
    endpoint: "/api/emissions",
    role: "Retourne l'impact carbone de plusieurs transports pour une distance saisie.",
  },
  {
    endpoint: "/api/activiter",
    role: "Filtre et renvoie festivals, musees et lieux historiques selon le formulaire Quoi faire.",
  },
  {
    endpoint: "/api/train/overview",
    role: "Expose des indicateurs de synthese sur le dataset ferroviaire local.",
  },
  {
    endpoint: "/api/avion/overview",
    role: "Expose des statistiques sur les plateformes aeriennes du projet.",
  },
  {
    endpoint: "/api/voiture/overview",
    role: "Expose des indicateurs sur le reseau routier national utilise dans le notebook.",
  },
];

const externalApis = [
  {
    name: "Navitia / SNCF",
    role: "Utilise pour recuperer un trajet train quand une cle API est disponible.",
  },
  {
    name: "API SNCF des gares",
    role: "Utilisee pour trouver une gare principale a partir d'une ville.",
  },
  {
    name: "OSRM",
    role: "Utilisee pour calculer les distances et temps de trajet en voiture.",
  },
  {
    name: "Impact CO2",
    role: "Utilisee pour recuperer les emissions estimees selon le mode de transport.",
  },
  {
    name: "Nominatim",
    role: "Utilisee pour convertir une ville en coordonnees geographiques.",
  },
  {
    name: "OurAirports",
    role: "Utilisee pour identifier les aeroports pertinents pour les trajets en avion.",
  },
];

const outputs = [
  "temps estime du trajet",
  "distance calculee",
  "prix estime",
  "emissions CO2",
  "gares ou aeroports de depart et d'arrivee",
  "transport optimal selon les criteres coches",
  "activites locales a faire sur place",
];

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero__content">
          <p className="about-kicker">Presentation du projet</p>
          <h1>Train Fil Rouge</h1>
          <p className="about-hero__lead">
            Train Fil Rouge est une application web qui aide un utilisateur a comparer plusieurs moyens
            de transport et a trouver quoi faire une fois arrive a destination.
          </p>
        </div>

        <div className="about-hero__panel">
          <p className="about-panel__label">Objectif</p>
          <p className="about-panel__text">
            Relier des donnees de mobilite, des APIs de calcul et des jeux de donnees culturels pour
            proposer une experience utile, lisible et exploitable a l'oral comme dans l'application.
          </p>
        </div>
      </section>

      <section className="about-shell">
        <div className="about-section-heading">
          <p className="about-kicker">Vision</p>
          <h2>Ce que fait le projet</h2>
        </div>

        <div className="about-overview-card">
          <p>
            Le projet repose sur deux idees principales : comparer les transports entre deux villes et
            enrichir le voyage avec des activites locales. L'utilisateur peut donc choisir un trajet,
            comparer train, voiture et avion, puis filtrer des activites culturelles comme des festivals,
            des musees ou des lieux historiques.
          </p>
        </div>
      </section>

      <section className="about-shell">
        <div className="about-section-heading">
          <p className="about-kicker">Techno</p>
          <h2>Technologies utilisees</h2>
        </div>

        <div className="about-grid about-grid--stack">
          {stackItems.map((item) => (
            <article className="about-card" key={item.title}>
              <p className="about-card__eyebrow">{item.title}</p>
              <h3>{item.value}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-shell">
        <div className="about-section-heading">
          <p className="about-kicker">Fonctionnalites</p>
          <h2>Ce que l'application produit</h2>
        </div>

        <div className="about-two-columns">
          <article className="about-card">
            <h3>Fonctionnalites principales</h3>
            <ul className="about-list">
              {featureItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="about-card">
            <h3>Donnees renvoyees a l'utilisateur</h3>
            <ul className="about-list">
              {outputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="about-shell">
        <div className="about-section-heading">
          <p className="about-kicker">Datasets</p>
          <h2>Jeux de donnees utilises</h2>
        </div>

        <div className="about-grid">
          {datasets.map((dataset) => (
            <article className="about-card" key={dataset.title}>
              <div className="about-card__meta">
                <span className="about-card__tag">{dataset.tag}</span>
                <span className="about-card__stat">{dataset.stats}</span>
              </div>
              <h3>{dataset.title}</h3>
              <p>{dataset.role}</p>
              <p className="about-card__detail">{dataset.content}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-shell">
        <div className="about-section-heading">
          <p className="about-kicker">APIs</p>
          <h2>APIs internes et externes</h2>
        </div>

        <div className="about-two-columns">
          <article className="about-card">
            <h3>APIs du projet</h3>
            <ul className="about-api-list">
              {internalApis.map((api) => (
                <li key={api.endpoint}>
                  <strong>{api.endpoint}</strong>
                  <span>{api.role}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="about-card">
            <h3>Services externes appeles</h3>
            <ul className="about-api-list">
              {externalApis.map((api) => (
                <li key={api.name}>
                  <strong>{api.name}</strong>
                  <span>{api.role}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="about-shell">
        <div className="about-section-heading">
          <p className="about-kicker">Architecture</p>
          <h2>Comment circulent les donnees</h2>
        </div>

        <div className="about-timeline">
          <article className="about-step">
            <span className="about-step__index">01</span>
            <div>
              <h3>Saisie utilisateur</h3>
              <p>L'utilisateur saisit deux villes ou choisit un filtre d'activites dans le frontend React.</p>
            </div>
          </article>

          <article className="about-step">
            <span className="about-step__index">02</span>
            <div>
              <h3>Traitement backend</h3>
              <p>Le backend Flask lit les datasets locaux et appelle les APIs externes utiles au calcul.</p>
            </div>
          </article>

          <article className="about-step">
            <span className="about-step__index">03</span>
            <div>
              <h3>Calcul et filtrage</h3>
              <p>Le projet calcule temps, distance, prix, CO2 et filtre les activites selon la localisation demandee.</p>
            </div>
          </article>

          <article className="about-step">
            <span className="about-step__index">04</span>
            <div>
              <h3>Restitution</h3>
              <p>Les resultats sont renvoyes en JSON puis affiches sous forme de cartes, comparatifs et sections dataset.</p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default About;
