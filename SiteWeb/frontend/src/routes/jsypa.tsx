import React, { useRef, useState } from "react";
import "./jsypa.css";

type ResultatDistance = {
    status: string;
    transportOptimal: string;
    voitureName: string;
    voitureEmissions: number;
    voitureTemps_heures: number;
    voitureTemps_minutes: number;
    voitureDistance_km: number;
    voiturePrix: number;
    trainName: string;
    trainEmissions: number;
    trainTemps_minutes: number;
    trainTemps: string;
    trainDistance_km: number;
    trainPrix: number;
    trainGareDepart: string;
    trainGareArrivee: string;
    avionName: string;
    avionEmissions: number;
    avionTemps: string;
    avionTemps_minutes: number;
    avionDistance_km: number;
    avionPrix: number;
    avionAeroportDepart: string;
    avionAeroportArrivee: string;
};

const formatNumber = (value: number, digits = 2) => {
    if (!Number.isFinite(value)) {
        return "...";
    }

    return value.toFixed(digits).replace(".", ",");
};

const formatMoney = (value: number) => `${formatNumber(value)} EUR`;
const formatDistance = (value: number) => `${formatNumber(value)} km`;
const formatEmissions = (value: number) => `${formatNumber(value)} kg CO2e`;

const Jsypa = () => {
    const sliderRef = useRef<HTMLDivElement | null>(null);

    const [villeDepart, setVilleDepart] = useState("");
    const [villeArrivee, setVilleArrivee] = useState("");
    const [temps, setTemps] = useState("");
    const [prix, setPrix] = useState("");
    const [emissionCo2, setEmissionCo2] = useState("");
    const [resultat, setResultat] = useState<ResultatDistance | null>(null);
    const [formError, setFormError] = useState("");

    const scrollArticles = (direction: "left" | "right") => {
        const slider = sliderRef.current;
        if (!slider) {
            return;
        }

        const scrollAmount = slider.clientWidth * 0.85;
        slider.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    const formulaireVille = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError("");

        try {
            const res = await fetch("/api/distance/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    villeDepart,
                    villeArrivee,
                    temps,
                    prix,
                    EmissionCo2: emissionCo2,
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.message || data?.error || "Erreur serveur");
            }

            setResultat(data as ResultatDistance);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erreur inconnue";
            setResultat(null);
            setFormError(message);
        }
    };

    const transportOptimal = resultat?.transportOptimal ?? "";

    const transportCards = [
        {
            key: "train",
            title: resultat?.trainName || "Train",
            badge: "🚆",
            details: [
                `Ville de depart : ${villeDepart || "..."}`,
                `Gare de depart : ${resultat?.trainGareDepart || "..."}`,
                `Temps : ${resultat?.trainTemps || "..."}`,
                `Prix : ${resultat ? formatMoney(resultat.trainPrix) : "..."}`,
                `Distance : ${resultat ? formatDistance(resultat.trainDistance_km) : "..."}`,
                `Emissions : ${resultat ? formatEmissions(resultat.trainEmissions) : "..."}`,
                `Gare d'arrivee : ${resultat?.trainGareArrivee || "..."}`,
                `Ville d'arrivee : ${villeArrivee || "..."}`,
            ],
        },
        {
            key: "voiture",
            title: resultat?.voitureName || "Voiture",
            badge: "🚗",
            details: [
                `Ville de depart : ${villeDepart || "..."}`,
                `Temps : ${resultat ? `${formatNumber(resultat.voitureTemps_heures, 1)} h` : "..."}`,
                `Prix : ${resultat ? formatMoney(resultat.voiturePrix) : "..."}`,
                `Distance : ${resultat ? formatDistance(resultat.voitureDistance_km) : "..."}`,
                `Emissions : ${resultat ? formatEmissions(resultat.voitureEmissions) : "..."}`,
                `Ville d'arrivee : ${villeArrivee || "..."}`,
            ],
        },
        {
            key: "avion",
            title: resultat?.avionName || "Avion",
            badge: "✈️",
            details: [
                `Ville de depart : ${villeDepart || "..."}`,
                `Aeroport de depart : ${resultat?.avionAeroportDepart || "..."}`,
                `Temps : ${resultat?.avionTemps || "..."}`,
                `Prix : ${resultat ? formatMoney(resultat.avionPrix) : "..."}`,
                `Distance : ${resultat ? formatDistance(resultat.avionDistance_km) : "..."}`,
                `Emissions : ${resultat ? formatEmissions(resultat.avionEmissions) : "..."}`,
                `Aeroport d'arrivee : ${resultat?.avionAeroportArrivee || "..."}`,
                `Ville d'arrivee : ${villeArrivee || "..."}`,
            ],
        },
    ];

    return (
        <div className="transport-container">
            <section className="hero-search">
                <h1>Calculez votre itineraire</h1>
                <div className="formulaire-card">
                    <form onSubmit={formulaireVille}>
                        <div className="input-group">
                            <input
                                type="text"
                                value={villeDepart}
                                onChange={(e) => setVilleDepart(e.target.value)}
                                placeholder="Ville de depart"
                            />
                            <input
                                type="text"
                                value={villeArrivee}
                                onChange={(e) => setVilleArrivee(e.target.value)}
                                placeholder="Ville d'arrivee"
                            />
                        </div>

                        <div className="options-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={temps === "oui"}
                                    onChange={(e) => setTemps(e.target.checked ? "oui" : "non")}
                                />
                                Plus rapide
                            </label>

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={prix === "oui"}
                                    onChange={(e) => setPrix(e.target.checked ? "oui" : "non")}
                                />
                                Moins cher
                            </label>

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={emissionCo2 === "oui"}
                                    onChange={(e) => setEmissionCo2(e.target.checked ? "oui" : "non")}
                                />
                                Eco-responsable
                            </label>
                        </div>

                        <button type="submit" className="btn-submit">Comparer les trajets</button>
                    </form>

                    {formError && <p className="form-feedback">{formError}</p>}
                </div>
            </section>

            <section className="listeTransports">
                <div className="info-trajet">
                    <h2>Recapitulatif de votre recherche</h2>
                    <p>
                        <strong>Depart :</strong> {villeDepart || "..."}
                        <span className="arrow"> -&gt; </span>
                        <strong>Arrivee :</strong> {villeArrivee || "..."}
                    </p>
                </div>

                <div className="liste-shell">
                    <button
                        type="button"
                        className="liste-arrow liste-arrow--left"
                        aria-label="Article precedent"
                        onClick={() => scrollArticles("left")}
                    >
                        &lt;
                    </button>

                    <div className="liste" ref={sliderRef}>
                        {transportCards.map((card) => (
                            <article className="train-card" key={card.key}>
                                <div className="train-card__head">
                                    <h3 className="train-card__title">{card.title}</h3>
                                    {transportOptimal === card.key && (
                                        <span className="train-card__badge">Choix optimal</span>
                                    )}
                                </div>

                                <div className="train-card__image" aria-hidden>
                                    <div className="train-card__image-inner">
                                        <span className="train-card__image-emoji">{card.badge}</span>
                                    </div>
                                </div>

                                <div className="trajetVoiture">
                                    <p className="train-card__footer-label">Details trajet</p>
                                    {card.details.map((detail, index) => (
                                        <p className="train-card__detail" key={`${card.key}-${index}`}>{detail}</p>
                                    ))}
                                </div>

                            </article>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="liste-arrow liste-arrow--right"
                        aria-label="Article suivant"
                        onClick={() => scrollArticles("right")}
                    >
                        &gt;
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Jsypa;
