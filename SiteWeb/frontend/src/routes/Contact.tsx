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

const Contact = () => {
  const [suite, setSuite] = useState(1);
  const [ville, setVille] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [departement, setDepartement] = useState("");
  const [region, setRegion] = useState("");
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [afficheFestival, setAfficheFestival] = useState("non");

  const forSuite = (etape: number) => {
    setSuite(etape);
    setFormError("");
    setFormSuccess("");
    setFestivals([]);
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
    };

    try {
      const res = await fetch("/api/activiter/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Erreur serveur");
      }

      setFormSuccess(data?.message || "Donnees envoyees.");
      setFestivals(Array.isArray(data?.festivals) ? data.festivals : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      setFormError(message);
      setFestivals([]);
    } finally {
      setIsSubmitting(false);
    }
  };

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

              <div>
                <h1>Acidité à afficher</h1>
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={afficheFestival === "oui"}
                        onChange={(e) => setAfficheFestival(e.target.checked ? "oui" : "non")}
                    />
                    Festival
                </label>

                  <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={afficheHistoire === "oui"}
                        onChange={(e) => setaAficheHistoire(e.target.checked ? "oui" : "non")}
                    />
                    Lieu historique
                </label>
              </div>

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
          <h2>Festivals trouves</h2>
          <p>Les resultats s&apos;affichent selon la ville, le departement ou la region saisis.</p>
        </div>

        {festivals.length === 0 ? (
          <div className="contact-empty">
            <p>Aucun festival affiche pour le moment.</p>
          </div>
        ) : (
          <div className="contact-festival-grid">
            {festivals.map((festival) => (
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
                    href={festival.siteInternet.startsWith("http") ? festival.siteInternet : `https://${festival.siteInternet}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Voir le site
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Contact;
