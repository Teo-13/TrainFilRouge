import { useState } from "react";
import "./jsypa.css";
import "./Contact.css";

type Festival = {
  nom: string;
  region: string;
  departement: string;
  commune: string;
  codePostal: string;
  discipline: string;
  periode: string;
  siteInternet: string;
  adresse: string;
};

type Musee = {
  nom: string;
  region: string;
  departement: string;
  commune: string;
  codePostal: string;
  adresse: string;
  lieu: string;
  categorie: string;
  domaineThematique: string;
  histoire: string;
  atout: string;
  siteInternet: string;
  telephone: string;
};

type LieuHistorique = {
  nom: string;
  region: string;
  departement: string;
  commune: string;
  codePostal: string;
  adresse: string;
  typeLieu: string;
  label: string;
  domaine: string;
  sousDomaine: string;
  protection: string;
  coordonnees: string;
};

type ResultatsActivites = {
  festivals: Festival[];
  musees: Musee[];
  lieuxHistoriques: LieuHistorique[];
};

type ApiResponse = {
  message?: string;
  filtresActifs?: string[];
  resultats?: Partial<ResultatsActivites>;
  festivals?: Festival[];
};

const initialResultats: ResultatsActivites = {
  festivals: [],
  musees: [],
  lieuxHistoriques: [],
};

const truncateText = (value: string, maxLength = 220) => {
  if (!value) {
    return "";
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trim()}...`;
};

const normaliseUrl = (value: string) => {
  if (!value) {
    return "";
  }

  return value.startsWith("http") ? value : `https://${value}`;
};

const Contact = () => {
  const [suite, setSuite] = useState(1);
  const [ville, setVille] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [departement, setDepartement] = useState("");
  const [region, setRegion] = useState("");
  const [resultats, setResultats] = useState<ResultatsActivites>(initialResultats);
  const [filtresActifs, setFiltresActifs] = useState<string[]>([]);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [afficheFestival, setAfficheFestival] = useState("non");
  const [afficheMusee, setAfficheMusee] = useState("non");
  const [afficheLieuHistorique, setAfficheLieuHistorique] = useState("non");

  const resetResults = () => {
    setResultats(initialResultats);
    setFiltresActifs([]);
    setHasSearched(false);
  };

  const forSuite = (etape: number) => {
    setSuite(etape);
    setFormError("");
    setFormSuccess("");
    resetResults();
  };

  const formulaireVille = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setIsSubmitting(true);

    const payload = {
      suite: suite === 1 ? "ville" : suite === 2 ? "departement" : "region",
      ville: suite === 1 ? ville.trim() : "",
      codePostal: suite === 1 ? codePostal.trim() : "",
      departement: suite === 2 ? departement.trim() : "",
      region: suite === 3 ? region.trim() : "",
      filtres: {
        festivals: afficheFestival === "oui",
        musees: afficheMusee === "oui",
        lieuxHistoriques: afficheLieuHistorique === "oui",
      },
    };

    try {
      const res = await fetch("/api/activiter/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => null)) as ApiResponse | null;

      if (!res.ok) {
        throw new Error(data?.message || "Erreur serveur");
      }

      const resultatsRecus = data?.resultats;

      setFormSuccess(data?.message || "Recherche terminee.");
      setResultats({
        festivals: Array.isArray(resultatsRecus?.festivals)
          ? resultatsRecus.festivals
          : Array.isArray(data?.festivals)
            ? data.festivals
            : [],
        musees: Array.isArray(resultatsRecus?.musees) ? resultatsRecus.musees : [],
        lieuxHistoriques: Array.isArray(resultatsRecus?.lieuxHistoriques)
          ? resultatsRecus.lieuxHistoriques
          : [],
      });
      setFiltresActifs(
        Array.isArray(data?.filtresActifs) ? data.filtresActifs : ["festivals", "musees", "lieuxHistoriques"],
      );
      setHasSearched(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      setFormError(message);
      resetResults();
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFiltres = () => (
    <div className="contact-filter-block">
      <h3>Datasets a afficher</h3>
      <div className="options-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={afficheFestival === "oui"}
            onChange={(e) => setAfficheFestival(e.target.checked ? "oui" : "non")}
          />
          Dataset Festivals
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={afficheMusee === "oui"}
            onChange={(e) => setAfficheMusee(e.target.checked ? "oui" : "non")}
          />
          Dataset Musees
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={afficheLieuHistorique === "oui"}
            onChange={(e) => setAfficheLieuHistorique(e.target.checked ? "oui" : "non")}
          />
          Dataset Lieux historiques
        </label>
      </div>
    </div>
  );

  const sections = [
    {
      key: "festivals",
      title: "Festivals",
      items: resultats.festivals,
      renderCard: (festival: Festival) => (
        <article
          className="contact-festival-card"
          key={`${festival.nom}-${festival.commune}-${festival.codePostal}`}
        >
          <div className="contact-festival-card__top">
            <span className="contact-festival-card__tag">{festival.discipline || "Festival"}</span>
            <h3>{festival.nom}</h3>
          </div>

          <div className="contact-festival-card__content">
            <p>
              <strong>Lieu :</strong> {festival.commune}, {festival.departement}
            </p>
            <p>
              <strong>Region :</strong> {festival.region}
            </p>
            <p>
              <strong>Code postal :</strong> {festival.codePostal}
            </p>
            <p>
              <strong>Periode :</strong> {festival.periode || "Non renseignee"}
            </p>
            <p>
              <strong>Adresse :</strong> {festival.adresse || "Non renseignee"}
            </p>
          </div>

          {festival.siteInternet && (
            <a
              className="contact-festival-card__link"
              href={normaliseUrl(festival.siteInternet)}
              target="_blank"
              rel="noreferrer"
            >
              Voir le site
            </a>
          )}
        </article>
      ),
    },
    {
      key: "musees",
      title: "Musees",
      items: resultats.musees,
      renderCard: (musee: Musee) => (
        <article
          className="contact-festival-card"
          key={`${musee.nom}-${musee.commune}-${musee.codePostal}`}
        >
          <div className="contact-festival-card__top">
            <span className="contact-festival-card__tag">{musee.categorie || "Musee"}</span>
            <h3>{musee.nom}</h3>
          </div>

          <div className="contact-festival-card__content">
            <p>
              <strong>Lieu :</strong> {musee.commune}, {musee.departement}
            </p>
            <p>
              <strong>Region :</strong> {musee.region}
            </p>
            <p>
              <strong>Adresse :</strong> {musee.adresse || musee.lieu || "Non renseignee"}
            </p>
            <p>
              <strong>Domaines :</strong> {musee.domaineThematique || "Non renseignes"}
            </p>
            <p>
              <strong>Resume :</strong> {truncateText(musee.atout || musee.histoire) || "Non renseigne"}
            </p>
            <p>
              <strong>Telephone :</strong> {musee.telephone || "Non renseigne"}
            </p>
          </div>

          {musee.siteInternet && (
            <a
              className="contact-festival-card__link"
              href={normaliseUrl(musee.siteInternet)}
              target="_blank"
              rel="noreferrer"
            >
              Voir le site
            </a>
          )}
        </article>
      ),
    },
    {
      key: "lieuxHistoriques",
      title: "Lieux historiques",
      items: resultats.lieuxHistoriques,
      renderCard: (lieu: LieuHistorique) => (
        <article
          className="contact-festival-card"
          key={`${lieu.nom}-${lieu.commune}-${lieu.codePostal}`}
        >
          <div className="contact-festival-card__top">
            <span className="contact-festival-card__tag">{lieu.typeLieu || "Patrimoine"}</span>
            <h3>{lieu.nom}</h3>
          </div>

          <div className="contact-festival-card__content">
            <p>
              <strong>Lieu :</strong> {lieu.commune}, {lieu.departement}
            </p>
            <p>
              <strong>Region :</strong> {lieu.region}
            </p>
            <p>
              <strong>Label :</strong> {lieu.label || "Non renseigne"}
            </p>
            <p>
              <strong>Domaine :</strong> {lieu.domaine || lieu.sousDomaine || "Non renseigne"}
            </p>
            <p>
              <strong>Adresse :</strong> {lieu.adresse || "Non renseignee"}
            </p>
            <p>
              <strong>Protection :</strong> {truncateText(lieu.protection) || "Non renseignee"}
            </p>
          </div>
        </article>
      ),
    },
  ].filter((section) => filtresActifs.includes(section.key));

  return (
    <div className="transport-container contact-page">
      <section className="hero-search">
        <h1>Quelle activite faire ?</h1>
        <p className="contact-lead">Choisissez une recherche par ville, departement ou region.</p>

        <div className="formulaire-card">
          <div className="contact-buttons">
            <button
              type="button"
              className={suite === 1 ? "contact-button is-active" : "contact-button"}
              onClick={() => forSuite(1)}
            >
              Ville
            </button>
            <button
              type="button"
              className={suite === 2 ? "contact-button is-active" : "contact-button"}
              onClick={() => forSuite(2)}
            >
              Departement
            </button>
            <button
              type="button"
              className={suite === 3 ? "contact-button is-active" : "contact-button"}
              onClick={() => forSuite(3)}
            >
              Region
            </button>
          </div>

          {suite === 1 && (
            <form onSubmit={formulaireVille}>
              <div className="input-group">
                <input
                  required
                  type="text"
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  placeholder="Ville"
                  autoComplete="address-level2"
                />
                <input
                  required
                  type="text"
                  value={codePostal}
                  onChange={(e) => setCodePostal(e.target.value)}
                  placeholder="Code postal"
                  inputMode="numeric"
                  pattern="[0-9]{5}"
                  maxLength={5}
                  autoComplete="postal-code"
                />
              </div>
              {renderFiltres()}
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : "Envoyer"}
              </button>
            </form>
          )}

          {suite === 2 && (
            <form onSubmit={formulaireVille}>
              <div className="input-group contact-input-group--single">
                <input
                  required
                  type="text"
                  value={departement}
                  onChange={(e) => setDepartement(e.target.value)}
                  placeholder="Departement"
                />
              </div>
              {renderFiltres()}
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : "Envoyer"}
              </button>
            </form>
          )}

          {suite === 3 && (
            <form onSubmit={formulaireVille}>
              <div className="input-group contact-input-group--single">
                <input
                  required
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Region"
                />
              </div>
              {renderFiltres()}
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : "Envoyer"}
              </button>
            </form>
          )}

          {formError && <p className="contact-feedback contact-feedback--error">{formError}</p>}
          {formSuccess && <p className="contact-feedback contact-feedback--success">{formSuccess}</p>}
        </div>
      </section>

      <section className="contact-results">
        <div className="contact-results__header">
          <h2>Resultats trouves</h2>
          <p>Les datasets s&apos;affichent selon le filtre choisi dans le formulaire.</p>
        </div>

        {!hasSearched ? (
          <div className="contact-empty">
            <p>Lancez une recherche pour afficher les datasets correspondants.</p>
          </div>
        ) : sections.length === 0 ? (
          <div className="contact-empty">
            <p>Aucun dataset selectionne pour l&apos;affichage.</p>
          </div>
        ) : (
          <div className="contact-dataset-list">
            {sections.map((section) => (
              <section className="contact-dataset-section" key={section.key}>
                <div className="contact-dataset-section__header">
                  <h3>{section.title}</h3>
                  <span>{section.items.length} resultat(s)</span>
                </div>

                {section.items.length === 0 ? (
                  <div className="contact-empty contact-empty--dataset">
                    <p>Aucun resultat pour ce dataset.</p>
                  </div>
                ) : (
                  <div className="contact-festival-grid">
                    {section.items.map((item) => section.renderCard(item as never))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Contact;
