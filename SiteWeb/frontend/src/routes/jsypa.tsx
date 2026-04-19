import React, { useEffect, useState } from "react";
import "./jsypa.css";

const jsypa = () => {
    const [villeDepart, setVilleDepart] = useState("");
    const [villeArrivee, setVilleArrivee] = useState("");
    const [temps, setTemps] = useState("");
    const [prix, setPrix] = useState("");
    const [EmissionCo2, setEmissionCo2] = useState("");



    const [formError, setFormError] = useState("");

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
            alert("Distance : " + data.distance);
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
                    <div className="bloc train">
                        <div className="icon">🚄</div>
                        <h3>Train</h3>
                        <p>Le choix le plus écologique.</p>
                    </div>

                    <div className="bloc voiture">
                        <div className="icon">🚗</div>
                        <h3>Voiture</h3>
                        <p>Pour plus de liberté.</p>
                    </div>

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
