import React, { useState } from "react";
import "./jsypa.css";

const jsypa = () => {
    const [villeDepart, setVilleDepart] = useState("");
    const [villeArrivee, setVilleArrivee] = useState("");
    const [temps, setTemps] = useState("");
    const [prix, setPrix] = useState("");
    const [EmissionCo2, setEmissionCo2] = useState("");

    const [voitureName, setVoitureName] = useState("");
    const [voitureEmissions, setVoitureEmissions] = useState("");
    const [voitureTemps_heures, setVoitureTemps_heures] = useState("");
    const [voitureDistance_km, setVoitureDistance_km] = useState("");
    const [voiturePrix, setVoiturePrix] = useState("");
    



    const [formError, setFormError] = useState("");

    /** Scores affichés sur /5 pour les jauges train (à brancher sur l’API plus tard) */
    const TRAIN_MAX = 5;
    const [trainScores] = useState({ temps: 3.8, prix: 4.6, eco: 2.1 });

    const formulaireVille = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire
        setFormError("");

        // const ageTrimmed = age.trim();
        
        try {
            const res = await fetch("http://localhost:5000/api/distance/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    villeDepart,
                    villeArrivee,
                    temps,
                    prix,
                    EmissionCo2
                }),
            });

            if (!res.ok) {
            throw new Error("Erreur serveur");
            }
            const data = await res.json();

            setVoitureName(String(data.voitureName ?? ""));
            setVoitureEmissions(String(data.voitureEmissions ?? ""));
            setVoitureTemps_heures(String(data.voitureTemps_heures ?? ""));
            setVoitureDistance_km(String(data.voitureDistance_km ?? ""));
            setVoiturePrix(String(data.voiturePrix ?? ""));
        } catch (err) {
        alert("Erreur : " + err);
        }
    };


    return (
        <div className="transport-container">
            <section className="hero-search">
                <h1>Calculez votre itinéraire</h1>
                <div className="formulaire-card">
                    <form onSubmit={formulaireVille}>
                        <div className="input-group">
                            <input type="text" value={villeDepart} onChange={(e) => setVilleDepart(e.target.value)} placeholder="Ville de départ" />
                            <input type="text" value={villeArrivee} onChange={(e) => setVilleArrivee(e.target.value)} placeholder="Ville d'arrivée" />
                        </div>

                        <div className="options-group">
                            
                            <label className="checkbox-label">
                                <input type="checkbox" checked={temps === "oui"} onChange={(e) => setTemps(e.target.checked ? "oui" : "non")} />
                                🚀 Plus rapide
                            </label>
                            

                            <label className="checkbox-label">
                                <input type="checkbox" checked={prix === "oui"} onChange={(e) => setPrix(e.target.checked ? "oui" : "non")} />
                                💰 Moins cher
                            </label>

                            <label className="checkbox-label">
                                <input type="checkbox" checked={EmissionCo2 === "oui"} onChange={(e) => setEmissionCo2(e.target.checked ? "oui" : "non")}/>
                                🌱 Éco-responsable
                            </label>
                        </div>

                        <button type="submit" className="btn-submit">Comparer les trajets</button>
                    </form>
                </div>
            </section>

            <section className="listeTransports">
                <div className="info-trajet">
                    <h2>Récapitulatif de votre recherche</h2>
                    <label>
                        <strong>Départ :</strong> {villeDepart || "..."} 
                        <span className="arrow"> → </span> 
                        <strong>Arrivée :</strong> {villeArrivee || "..."}
                    </label>
                </div>

                <div className="liste">
                    {/* ============= Partie Train ==============*/}
                    <article className="train-card">
                        <h3 className="train-card__title">Train</h3>

                        <div className="train-card__image" aria-hidden>
                            <div className="train-card__image-inner">
                                <span className="train-card__image-emoji">🚄</span>
                            </div>
                        </div>

                        <div className="train-card__metrics">
                            <div className="train-metric">
                                <span className="train-metric__icon" title="Temps">
                                    ⌛
                                </span>
                                <div className="train-metric__track train-metric__track--time">
                                    <div
                                        className="train-metric__fill"
                                        style={{
                                            width: `${Math.min(100, (trainScores.temps / TRAIN_MAX) * 100)}%`,
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{trainScores.temps}</span>
                            </div>

                            <div className="train-metric">
                                <span className="train-metric__icon" title="Prix">
                                    💰
                                </span>
                                <div className="train-metric__track train-metric__track--price">
                                    <div
                                        className="train-metric__fill"
                                        style={{
                                            width: `${Math.min(100, (trainScores.prix / TRAIN_MAX) * 100)}%`,
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{trainScores.prix}</span>
                            </div>

                            <div className="train-metric">
                                <span className="train-metric__icon" title="Émissions">
                                    🌱
                                </span>
                                <div className="train-metric__track train-metric__track--eco">
                                    <div
                                        className="train-metric__fill"
                                        style={{
                                            width: `${Math.min(100, (trainScores.eco / TRAIN_MAX) * 100)}%`,
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{trainScores.eco}</span>
                            </div>
                        </div>

                        <div className="train-card__footer">
                            <p className="train-card__footer-label">Détails trajets</p>
                            <button type="button" className="train-card__more">
                                En savoir plus
                            </button>
                        </div>
                    </article>

                    {/* ============= Partie Voiture ==============*/}
                    <div className="bloc voiture">
                        <div className="icon">🚗</div>
                        <h3>Voiture</h3>
                        <p>Pour plus de liberté.</p>
                        <p>temps : {voitureTemps_heures}</p>
                        <p>Distances : {voitureDistance_km}</p>
                        <p>Prix en (€) : {voiturePrix}</p>
                        <p>Emisions : {voitureEmissions}</p>
                    </div>

                    {/* ============= Partie Avion ==============*/}
                    <div className="bloc avion">
                        <div className="icon">✈️</div>
                        <h3>Avion</h3>
                        <p>Le plus rapide sur longue distance.</p>
                    </div>
                </div>

            </section>
        </div>
    );
};

export default jsypa;
