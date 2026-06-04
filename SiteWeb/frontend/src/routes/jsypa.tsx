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
    const [avionName, setAvionName] = useState("");
    const [avionEmissions, setAvionEmissions] = useState("");
    const [avionTemps, setAvionTemps] = useState("");
    const [avionDistance_km, setAvionDistance_km] = useState("");
    const [avionPrix, setAvionPrix] = useState("");
    const [avionAeroportDepart, setAvionAeroportDepart] = useState("");
    const [avionAeroportArrivee, setAvionAeroportArrivee] = useState("");
    const [avionSource, setAvionSource] = useState("");
    



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

            setVoitureName(String(data.voitureName ?? ""));
            setVoitureEmissions(String(data.voitureEmissions ?? ""));
            setVoitureTemps_heures(String(data.voitureTemps_heures ?? ""));
            setVoitureDistance_km(String(data.voitureDistance_km ?? ""));
            setVoiturePrix(String(data.voiturePrix ?? ""));
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
            setAvionName(String(data.avionName ?? ""));
            setAvionEmissions(String(data.avionEmissions ?? ""));
            setAvionTemps(String(data.avionTemps ?? ""));
            setAvionDistance_km(String(data.avionDistance_km ?? ""));
            setAvionPrix(String(data.avionPrix ?? ""));
            setAvionAeroportDepart(String(data.avionAeroportDepart ?? ""));
            setAvionAeroportArrivee(String(data.avionAeroportArrivee ?? ""));
            setAvionSource(String(data.avionSource ?? ""));
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
                                            width: trainTemps_minutes ? "100%" : "0%",
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{trainTemps || trainTemps_minutes || "..."}</span>
                            </div>

                            <div className="train-metric">
                                <span className="train-metric__icon" title="Prix">
                                    💰
                                </span>
                                <div className="train-metric__track train-metric__track--price">
                                    <div
                                        className="train-metric__fill"
                                        style={{
                                            width: trainPrix ? "100%" : "0%",
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{trainPrix || "..."}</span>
                            </div>

                            <div className="train-metric">
                                <span className="train-metric__icon" title="Émissions">
                                    🌱
                                </span>
                                <div className="train-metric__track train-metric__track--eco">
                                    <div
                                        className="train-metric__fill"
                                        style={{
                                            width: trainEmissions ? "100%" : "0%",
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{trainEmissions || "..."}</span>
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

                        <div className="train-card__image" aria-hidden>
                            <div className="train-card__image-inner">
                                <span className="train-card__image-emoji">🚗</span>
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
                                            width: trainTemps_minutes ? "100%" : "0%",
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{trainTemps || trainTemps_minutes || "..."}</span>
                            </div>

                            <div className="train-metric">
                                <span className="train-metric__icon" title="Prix">
                                    💰
                                </span>
                                <div className="train-metric__track train-metric__track--price">
                                    <div
                                        className="train-metric__fill"
                                        style={{
                                            width: trainPrix ? "100%" : "0%",
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{trainPrix || "..."}</span>
                            </div>

                            <div className="train-metric">
                                <span className="train-metric__icon" title="Émissions">
                                    🌱
                                </span>
                                <div className="train-metric__track train-metric__track--eco">
                                    <div
                                        className="train-metric__fill"
                                        style={{
                                            width: trainEmissions ? "100%" : "0%",
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{trainEmissions || "..."}</span>
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

                        <div className="train-card__image" aria-hidden>
                            <div className="train-card__image-inner">
                                <span className="train-card__image-emoji">✈️</span>
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
                                            width: trainTemps_minutes ? "100%" : "0%",
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{trainTemps || trainTemps_minutes || "..."}</span>
                            </div>

                            <div className="train-metric">
                                <span className="train-metric__icon" title="Prix">
                                    💰
                                </span>
                                <div className="train-metric__track train-metric__track--price">
                                    <div
                                        className="train-metric__fill"
                                        style={{
                                            width: trainPrix ? "100%" : "0%",
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{trainPrix || "..."}</span>
                            </div>

                            <div className="train-metric">
                                <span className="train-metric__icon" title="Émissions">
                                    🌱
                                </span>
                                <div className="train-metric__track train-metric__track--eco">
                                    <div
                                        className="train-metric__fill"
                                        style={{
                                            width: trainEmissions ? "100%" : "0%",
                                        }}
                                    />
                                </div>
                                <span className="train-metric__value">{trainEmissions || "..."}</span>
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
