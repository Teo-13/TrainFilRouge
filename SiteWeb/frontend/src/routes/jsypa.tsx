import React, { useState } from "react";
import "./jsypa.css";

type ScoreTransport = {
    global: string;
    temps: string;
    prix: string;
    emission: string;
};

// Ligne du classement renvoyee par le backend apres application des preferences.
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

// Convertit un score /100 en largeur CSS pour les barres temps/prix/emissions.
const largeurScore = (score: string) => {
    const valeur = Number(score);
    if (!Number.isFinite(valeur)) {
        return "0%";
    }

    return `${Math.max(0, Math.min(100, valeur))}%`;
};

// Affiche tous les scores de maniere uniforme dans l'interface.
const formatScore = (score: string | number) => {
    const valeur = Number(score);
    if (!Number.isFinite(valeur)) {
        return "...";
    }

    return `${Math.round(valeur)} / 100`;
};

const jsypa = () => {
    const [villeDepart, setVilleDepart] = useState("");
    const [villeArrivee, setVilleArrivee] = useState("");
    const [temps, setTemps] = useState("");
    const [prix, setPrix] = useState("");
    const [EmissionCo2, setEmissionCo2] = useState("");

    const [voitureName, setVoitureName] = useState("");
    const [voitureEmissions, setVoitureEmissions] = useState("");
    const [voitureTemps_heures, setVoitureTemps_heures] = useState("");
    const [voitureTemps_minutes, setVoitureTemps_minutes] = useState("");
    const [voitureDistance_km, setVoitureDistance_km] = useState("");
    const [voiturePrix, setVoiturePrix] = useState("");
    const [voitureScore, setVoitureScore] = useState<ScoreTransport>(scoreVide);
    const [trainName, setTrainName] = useState("");
    const [trainEmissions, setTrainEmissions] = useState("");
    const [trainTemps_minutes, setTrainTemps_minutes] = useState("");
    const [trainTemps, setTrainTemps] = useState("");
    const [trainDistance_km, setTrainDistance_km] = useState("");
    const [trainPrix, setTrainPrix] = useState("");
    const [trainPrixSource, setTrainPrixSource] = useState("");
    const [trainGareDepart, setTrainGareDepart] = useState("");
    const [trainGareArrivee, setTrainGareArrivee] = useState("");
    const [trainDepart, setTrainDepart] = useState("");
    const [trainArrivee, setTrainArrivee] = useState("");
    const [trainLignes, setTrainLignes] = useState("");
    const [trainSource, setTrainSource] = useState("");
    const [trainScore, setTrainScore] = useState<ScoreTransport>(scoreVide);
    const [avionName, setAvionName] = useState("");
    const [avionEmissions, setAvionEmissions] = useState("");
    const [avionTemps_minutes, setAvionTemps_minutes] = useState("");
    const [avionTemps, setAvionTemps] = useState("");
    const [avionDistance_km, setAvionDistance_km] = useState("");
    const [avionPrix, setAvionPrix] = useState("");
    const [avionAeroportDepart, setAvionAeroportDepart] = useState("");
    const [avionAeroportArrivee, setAvionAeroportArrivee] = useState("");
    const [avionSource, setAvionSource] = useState("");
    const [avionScore, setAvionScore] = useState<ScoreTransport>(scoreVide);
    const [classementTransports, setClassementTransports] = useState<ClassementTransport[]>([]);
    



    const [formError, setFormError] = useState("");

    /** Scores affichés sur /5 pour les jauges train (à brancher sur l’API plus tard) */
    const formulaireVille = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire
        setFormError("");

        // const ageTrimmed = age.trim();
        
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
                    EmissionCo2
                }),
            });

            if (!res.ok) {
            throw new Error("Erreur serveur");
            }
            const data = await res.json();

            // Classement global calcule par le backend selon les checkbox.
            setClassementTransports(Array.isArray(data.classementTransports) ? data.classementTransports : []);

            setVoitureName(String(data.voitureName ?? ""));
            setVoitureEmissions(String(data.voitureEmissions ?? ""));
            setVoitureTemps_heures(String(data.voitureTemps_heures ?? ""));
            setVoitureTemps_minutes(String(data.voitureTemps_minutes ?? ""));
            setVoitureDistance_km(String(data.voitureDistance_km ?? ""));
            setVoiturePrix(String(data.voiturePrix ?? ""));
            // Scores separes pour les barres + score global de la voiture.
            setVoitureScore({
                global: String(data.voitureScore ?? ""),
                temps: String(data.voitureScoreTemps ?? ""),
                prix: String(data.voitureScorePrix ?? ""),
                emission: String(data.voitureScoreEmission ?? ""),
            });
            setTrainName(String(data.trainName ?? ""));
            setTrainEmissions(String(data.trainEmissions ?? ""));
            setTrainTemps_minutes(String(data.trainTemps_minutes ?? ""));
            setTrainTemps(String(data.trainTemps ?? ""));
            setTrainDistance_km(String(data.trainDistance_km ?? ""));
            setTrainPrix(String(data.trainPrix ?? ""));
            setTrainPrixSource(String(data.trainPrixSource ?? ""));
            setTrainGareDepart(String(data.trainGareDepart ?? ""));
            setTrainGareArrivee(String(data.trainGareArrivee ?? ""));
            setTrainDepart(String(data.trainDepart ?? ""));
            setTrainArrivee(String(data.trainArrivee ?? ""));
            setTrainLignes(String(data.trainLignes ?? ""));
            setTrainSource(String(data.trainSource ?? ""));
            // Scores separes pour les barres + score global du train.
            setTrainScore({
                global: String(data.trainScore ?? ""),
                temps: String(data.trainScoreTemps ?? ""),
                prix: String(data.trainScorePrix ?? ""),
                emission: String(data.trainScoreEmission ?? ""),
            });
            setAvionName(String(data.avionName ?? ""));
            setAvionEmissions(String(data.avionEmissions ?? ""));
            setAvionTemps_minutes(String(data.avionTemps_minutes ?? ""));
            setAvionTemps(String(data.avionTemps ?? ""));
            setAvionDistance_km(String(data.avionDistance_km ?? ""));
            setAvionPrix(String(data.avionPrix ?? ""));
            setAvionAeroportDepart(String(data.avionAeroportDepart ?? ""));
            setAvionAeroportArrivee(String(data.avionAeroportArrivee ?? ""));
            setAvionSource(String(data.avionSource ?? ""));
            // Scores separes pour les barres + score global de l'avion.
            setAvionScore({
                global: String(data.avionScore ?? ""),
                temps: String(data.avionScoreTemps ?? ""),
                prix: String(data.avionScorePrix ?? ""),
                emission: String(data.avionScoreEmission ?? ""),
            });
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
                        <div className="score-badge">Score : {formatScore(trainScore.global)}</div>

                        <div className="train-card__image" aria-hidden>
                            <div className="train-card__image-inner">
                                <span className="train-card__image-emoji">🚄</span>
                            </div>
                        </div>

                        <div className="train-card__metrics">
                            {/* ====== partie scroring =======*/}
                            <div className="train-metric">
                                <span className="train-metric__icon" title="Temps">
                                    ⌛
                                </span>
                                <div className="train-metric__track train-metric__track--time">
                                    <div
                                        className="train-metric__fill"
                                        style={{
                                            width: largeurScore(trainScore.temps),
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{formatScore(trainScore.temps)}</span>
                            </div>

                            <div className="train-metric">
                                <span className="train-metric__icon" title="Prix">
                                    💰
                                </span>
                                <div className="train-metric__track train-metric__track--price">
                                    <div
                                        className="train-metric__fill"
                                        style={{
                                            width: largeurScore(trainScore.prix),
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{formatScore(trainScore.prix)}</span>
                            </div>

                            <div className="train-metric">
                                <span className="train-metric__icon" title="Émissions">
                                    🌱
                                </span>
                                <div className="train-metric__track train-metric__track--eco">
                                    <div
                                        className="train-metric__fill"
                                        style={{
                                            width: largeurScore(trainScore.emission),
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{formatScore(trainScore.emission)}</span>
                            </div>
                        </div>

                        <div className="trajetVoiture">
                            <p className="train-card__footer-label">Détails trajets</p>

                            <p>Ville de départ : {villeDepart || "..."}</p>
                            <p>|</p>
                            <p>Aeroport depart : {trainGareDepart || "..."}</p>
                            <p>|</p>
                            <p>|    temps : {trainTemps || "..."}</p>
                            <p>|    prix : {trainPrix || "..."}</p>
                            <p>|    Distances : {trainDistance_km || "..."}</p>
                            <p>|    Emisions : {trainEmissions || "..."}</p>
                            <p>|</p>
                            <p>Aeroport arrivee : {trainGareArrivee || "..."}</p>
                            <p>|</p>
                            <p>Ville de départ : {villeArrivee || "..."}</p>
                        </div>

                        
                        <button type="button" className="train-card__footer">
                            En savoir plus
                        </button>
                        
                    </article>

                    {/* ============= Partie Voiture ==============*/}
                    <article className="train-card">
                        <h3 className="train-card__title">Voiture</h3>
                        <div className="score-badge">Score : {formatScore(voitureScore.global)}</div>

                        <div className="train-card__image" aria-hidden>
                            <div className="train-card__image-inner">
                                <span className="train-card__image-emoji">🚗</span>
                            </div>
                        </div>

                        <div className="train-card__metrics">
                            {/* ====== partie scroring =======*/}
                            <div className="train-metric">
                                <span className="train-metric__icon" title="Temps">
                                    ⌛
                                </span>
                                <div className="train-metric__track train-metric__track--time">
                                    <div
                                        className="train-metric__fill"
                                        style={{
                                            width: largeurScore(voitureScore.temps),
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{formatScore(voitureScore.temps)}</span>
                            </div>

                            <div className="train-metric">
                                <span className="train-metric__icon" title="Prix">
                                    💰
                                </span>
                                <div className="train-metric__track train-metric__track--price">
                                    <div
                                        className="train-metric__fill"
                                        style={{
                                            width: largeurScore(voitureScore.prix),
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{formatScore(voitureScore.prix)}</span>
                            </div>

                            <div className="train-metric">
                                <span className="train-metric__icon" title="Émissions">
                                    🌱
                                </span>
                                <div className="train-metric__track train-metric__track--eco">
                                    <div
                                        className="train-metric__fill"
                                        style={{
                                            width: largeurScore(voitureScore.emission),
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{formatScore(voitureScore.emission)}</span>
                            </div>
                        </div>
                        

                        <div className="trajetVoiture">
                            <p className="train-card__footer-label">Détails trajets</p>

                            <p>Ville de départ : {villeDepart || "..."}</p>
                            <p>|</p>
                            <p>|    temps : {voitureTemps_heures || "..."}</p>
                            <p>|    prix : {voiturePrix || "..."}</p>
                            <p>|    Distances : {voitureDistance_km || "..."}</p>
                            <p>|    Emisions : {voitureEmissions || "..."}</p>
                            <p>|</p>
                            <p>Ville de départ : {villeArrivee || "..."}</p>
                        </div>

                        
                        <button type="button" className="train-card__footer">
                            En savoir plus
                        </button>
                        
                    </article>


                    {/* ============= Partie Avion ==============*/}
                    <article className="train-card">
                        <h3 className="train-card__title">Avion</h3>
                        <div className="score-badge">Score : {formatScore(avionScore.global)}</div>

                        <div className="train-card__image" aria-hidden>
                            <div className="train-card__image-inner">
                                <span className="train-card__image-emoji">✈️</span>
                            </div>
                        </div>

                        <div className="train-card__metrics">
                            {/* ====== partie scroring =======*/}
                            <div className="train-metric">
                                <span className="train-metric__icon" title="Temps">
                                    ⌛
                                </span>
                                <div className="train-metric__track train-metric__track--time">
                                    <div
                                        className="train-metric__fill"
                                        style={{
                                            width: largeurScore(avionScore.temps),
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{formatScore(avionScore.temps)}</span>
                            </div>

                            <div className="train-metric">
                                <span className="train-metric__icon" title="Prix">
                                    💰
                                </span>
                                <div className="train-metric__track train-metric__track--price">
                                    <div
                                        className="train-metric__fill"
                                        style={{
                                            width: largeurScore(avionScore.prix),
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{formatScore(avionScore.prix)}</span>
                            </div>

                            <div className="train-metric">
                                <span className="train-metric__icon" title="Émissions">
                                    🌱
                                </span>
                                <div className="train-metric__track train-metric__track--eco">
                                    <div
                                        className="train-metric__fill"
                                        style={{
                                            width: largeurScore(avionScore.emission),
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{formatScore(avionScore.emission)}</span>
                            </div>
                        </div>

                        <div className="trajetVoiture">
                            <p className="train-card__footer-label">Détails trajets</p>

                            <p>Ville de départ : {villeDepart || "..."}</p>
                            <p>|</p>
                            <p>Aeroport depart : {avionAeroportDepart || "..."}</p>
                            <p>|</p>
                            <p>|    temps : {avionTemps || "..."}</p>
                            <p>|    prix : {avionPrix || "..."}</p>
                            <p>|    Distances : {avionDistance_km || "..."}</p>
                            <p>|    Emisions : {avionEmissions || "..."}</p>
                            <p>|</p>
                            <p>Aeroport arrivee : {avionAeroportArrivee || "..."}</p>
                            <p>|</p>
                            <p>Ville de départ : {villeArrivee || "..."}</p>
                        </div>

                        
                        <button type="button" className="train-card__footer">
                            En savoir plus
                        </button>
                        
                    </article>

                </div>

            </section>
        </div>
    );
};

export default jsypa;
