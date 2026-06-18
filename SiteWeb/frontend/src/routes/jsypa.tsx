import React, { useRef, useState } from "react";
import "./jsypa.css";

type ScoreTransport = {
    global: string;
    temps: string;
    prix: string;
    emission: string;
};

type ClassementTransport = {
    transport: string;
    label: string;
    score: number;
    scoreTemps: number;
    scorePrix: number;
    scoreEmission: number;
};

const scoreVide: ScoreTransport = {
    global: "",
    temps: "",
    prix: "",
    emission: "",
};

const largeurScore = (score: string) => {
    const valeur = Number(score);
    if (!Number.isFinite(valeur)) {
        return "0%";
    }

    return `${Math.max(0, Math.min(100, valeur))}%`;
};

const formatScore = (score: string | number) => {
    const valeur = Number(score);
    if (!Number.isFinite(valeur)) {
        return "...";
    }

    return `${Math.round(valeur)} / 100`;
};

const Jsypa = () => {
    const sliderRef = useRef<HTMLDivElement | null>(null);

    const [villeDepart, setVilleDepart] = useState("");
    const [villeArrivee, setVilleArrivee] = useState("");
    const [temps, setTemps] = useState("");
    const [prix, setPrix] = useState("");
    const [emissionCo2, setEmissionCo2] = useState("");

    const [voitureName, setVoitureName] = useState("");
    const [voitureEmissions, setVoitureEmissions] = useState("");
    const [voitureTempsHeures, setVoitureTempsHeures] = useState("");
    const [voitureDistanceKm, setVoitureDistanceKm] = useState("");
    const [voiturePrix, setVoiturePrix] = useState("");
    const [voitureScore, setVoitureScore] = useState<ScoreTransport>(scoreVide);

    const [trainName, setTrainName] = useState("");
    const [trainEmissions, setTrainEmissions] = useState("");
    const [trainTemps, setTrainTemps] = useState("");
    const [trainDistanceKm, setTrainDistanceKm] = useState("");
    const [trainPrix, setTrainPrix] = useState("");
    const [trainGareDepart, setTrainGareDepart] = useState("");
    const [trainGareArrivee, setTrainGareArrivee] = useState("");
    const [trainScore, setTrainScore] = useState<ScoreTransport>(scoreVide);

    const [avionName, setAvionName] = useState("");
    const [avionEmissions, setAvionEmissions] = useState("");
    const [avionTemps, setAvionTemps] = useState("");
    const [avionDistanceKm, setAvionDistanceKm] = useState("");
    const [avionPrix, setAvionPrix] = useState("");
    const [avionAeroportDepart, setAvionAeroportDepart] = useState("");
    const [avionAeroportArrivee, setAvionAeroportArrivee] = useState("");
    const [avionScore, setAvionScore] = useState<ScoreTransport>(scoreVide);

    const [classementTransports, setClassementTransports] = useState<ClassementTransport[]>([]);
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
                throw new Error(data?.message || "Erreur serveur");
            }

            setClassementTransports(Array.isArray(data?.classementTransports) ? data.classementTransports : []);

            setVoitureName(String(data?.voitureName ?? ""));
            setVoitureEmissions(String(data?.voitureEmissions ?? ""));
            setVoitureTempsHeures(String(data?.voitureTemps_heures ?? ""));
            setVoitureDistanceKm(String(data?.voitureDistance_km ?? ""));
            setVoiturePrix(String(data?.voiturePrix ?? ""));
            setVoitureScore({
                global: String(data?.voitureScore ?? ""),
                temps: String(data?.voitureScoreTemps ?? ""),
                prix: String(data?.voitureScorePrix ?? ""),
                emission: String(data?.voitureScoreEmission ?? ""),
            });

            setTrainName(String(data?.trainName ?? ""));
            setTrainEmissions(String(data?.trainEmissions ?? ""));
            setTrainTemps(String(data?.trainTemps ?? ""));
            setTrainDistanceKm(String(data?.trainDistance_km ?? ""));
            setTrainPrix(String(data?.trainPrix ?? ""));
            setTrainGareDepart(String(data?.trainGareDepart ?? ""));
            setTrainGareArrivee(String(data?.trainGareArrivee ?? ""));
            setTrainScore({
                global: String(data?.trainScore ?? ""),
                temps: String(data?.trainScoreTemps ?? ""),
                prix: String(data?.trainScorePrix ?? ""),
                emission: String(data?.trainScoreEmission ?? ""),
            });

            setAvionName(String(data?.avionName ?? ""));
            setAvionEmissions(String(data?.avionEmissions ?? ""));
            setAvionTemps(String(data?.avionTemps ?? ""));
            setAvionDistanceKm(String(data?.avionDistance_km ?? ""));
            setAvionPrix(String(data?.avionPrix ?? ""));
            setAvionAeroportDepart(String(data?.avionAeroportDepart ?? ""));
            setAvionAeroportArrivee(String(data?.avionAeroportArrivee ?? ""));
            setAvionScore({
                global: String(data?.avionScore ?? ""),
                temps: String(data?.avionScoreTemps ?? ""),
                prix: String(data?.avionScorePrix ?? ""),
                emission: String(data?.avionScoreEmission ?? ""),
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erreur inconnue";
            setFormError(message);
        }
    };

    const transportCards = [
        {
            key: "train",
            title: trainName || "Train",
            emoji: "🚆",
            score: trainScore,
            details: [
                `Ville de depart : ${villeDepart || "..."}`,
                `Gare depart : ${trainGareDepart || "..."}`,
                `Temps : ${trainTemps || "..."}`,
                `Prix : ${trainPrix || "..."}`,
                `Distance : ${trainDistanceKm || "..."}`,
                `Emissions : ${trainEmissions || "..."}`,
                `Gare arrivee : ${trainGareArrivee || "..."}`,
                `Ville d'arrivee : ${villeArrivee || "..."}`,
            ],
        },
        {
            key: "voiture",
            title: voitureName || "Voiture",
            emoji: "🚗",
            score: voitureScore,
            details: [
                `Ville de depart : ${villeDepart || "..."}`,
                `Temps : ${voitureTempsHeures || "..."}`,
                `Prix : ${voiturePrix || "..."}`,
                `Distance : ${voitureDistanceKm || "..."}`,
                `Emissions : ${voitureEmissions || "..."}`,
                `Ville d'arrivee : ${villeArrivee || "..."}`,
            ],
        },
        {
            key: "avion",
            title: avionName || "Avion",
            emoji: "✈️",
            score: avionScore,
            details: [
                `Ville de depart : ${villeDepart || "..."}`,
                `Aeroport depart : ${avionAeroportDepart || "..."}`,
                `Temps : ${avionTemps || "..."}`,
                `Prix : ${avionPrix || "..."}`,
                `Distance : ${avionDistanceKm || "..."}`,
                `Emissions : ${avionEmissions || "..."}`,
                `Aeroport arrivee : ${avionAeroportArrivee || "..."}`,
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
                        <span className="arrow"> → </span>
                        <strong>Arrivee :</strong> {villeArrivee || "..."}
                    </p>
                </div>

                {classementTransports.length > 0 && (
                    <div className="classement-transports">
                        <h3>Classement des transports</h3>
                        <div className="classement-transports__list">
                            {classementTransports.map((transport, index) => (
                                <div className="classement-transports__item" key={transport.transport}>
                                    <div className="classement-transports__rank">{index + 1}</div>
                                    <div className="classement-transports__content">
                                        <strong>{transport.label}</strong>
                                        <span>
                                            Temps {Math.round(transport.scoreTemps)} | Prix {Math.round(transport.scorePrix)} |
                                            CO2 {Math.round(transport.scoreEmission)}
                                        </span>
                                    </div>
                                    <div className="classement-transports__score">{Math.round(transport.score)} / 100</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="liste-shell">
                    <button
                        type="button"
                        className="liste-arrow liste-arrow--left"
                        aria-label="Article precedent"
                        onClick={() => scrollArticles("left")}
                    >
                        ‹
                    </button>

                    <div className="liste" ref={sliderRef}>
                        {transportCards.map((card) => (
                            <article className="train-card" key={card.key}>
                                <h3 className="train-card__title">{card.title}</h3>
                                <div className="score-badge">Score : {formatScore(card.score.global)}</div>

                                <div className="train-card__image" aria-hidden>
                                    <div className="train-card__image-inner">
                                        <span className="train-card__image-emoji">{card.emoji}</span>
                                    </div>
                                </div>

                                <div className="train-card__metrics">
                                    <div className="train-metric">
                                        <span className="train-metric__icon" title="Temps">⌛</span>
                                        <div className="train-metric__track train-metric__track--time">
                                            <div
                                                className="train-metric__fill"
                                                style={{ width: largeurScore(card.score.temps) }}
                                            />
                                        </div>
                                        <span className="train-metric__value">{formatScore(card.score.temps)}</span>
                                    </div>

                                    <div className="train-metric">
                                        <span className="train-metric__icon" title="Prix">💰</span>
                                        <div className="train-metric__track train-metric__track--price">
                                            <div
                                                className="train-metric__fill"
                                                style={{ width: largeurScore(card.score.prix) }}
                                            />
                                        </div>
                                        <span className="train-metric__value">{formatScore(card.score.prix)}</span>
                                    </div>

                                    <div className="train-metric">
                                        <span className="train-metric__icon" title="Emissions">🌱</span>
                                        <div className="train-metric__track train-metric__track--eco">
                                            <div
                                                className="train-metric__fill"
                                                style={{ width: largeurScore(card.score.emission) }}
                                            />
                                        </div>
                                        <span className="train-metric__value">{formatScore(card.score.emission)}</span>
                                    </div>
                                </div>

                                <div className="trajetVoiture">
                                    <p className="train-card__footer-label">Details trajet</p>
                                    {card.details.map((detail, index) => (
                                        <p className="train-card__detail" key={`${card.key}-${index}`}>{detail}</p>
                                    ))}
                                </div>

                                <button type="button" className="train-card__footer">
                                    En savoir plus
                                </button>
                            </article>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="liste-arrow liste-arrow--right"
                        aria-label="Article suivant"
                        onClick={() => scrollArticles("right")}
                    >
                        ›
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Jsypa;
