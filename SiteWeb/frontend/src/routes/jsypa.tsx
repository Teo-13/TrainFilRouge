import React, { useEffect, useState } from "react";

const Jsypa = () => {
    const [villeDepart, setVilleDepart] = useState("");
    const [villeArrivee, setVilleArrivee] = useState("");
    const [temps, setTemps] = useState("");
    const [prix, setPrix] = useState("");
    const [EmissionCo2, setEmissionCo2] = useState("");

    const [formError, setFormError] = useState("");

    const formualireVille = async (e: React.FormEvent<HTMLFormElement>) => {
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
        <div>
            <form onSubmit={formualireVille}>
                <input type="text" value={villeDepart} onChange={(e) => setVilleDepart(e.target.value)} placeholder="Ville Départ" />
                <input type="text" value={villeArrivee} onChange={(e) => setVilleArrivee(e.target.value)} placeholder="Ville Arrivée" />

                
                <label>
                    Moins de temps :
                    <input type="checkbox" value={temps} />
                </label>
                <button type="submit">Calculer la distance</button>
            </form>

            <p>Ville de d'épart : {villeDepart === "" ? "Non définie"  :<span>{villeDepart}</span>}</p>
            <p>Ville d'arrivée : {villeArrivee === "" ? "Non définie" : <span>{villeArrivee}</span>}</p>
        </div>
    );
};

export default Jsypa;

