import React, { useEffect, useState } from "react";
import "./contact.css";


const Contact = () => {
  const [helloMessage, setHelloMessage] = useState("");
  const [suite, setSuite] = useState(1);
  const [ville, setVille] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [departement, setDepartement] = useState("");
  const [region, setRegion] = useState("");
  const [formError, setFormError] = useState("");
  


// formualire 
  const forSuite = (etape: number) => {
    setSuite(etape);
  };


  const formulaireVille = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    try {
      const res = await fetch("/api/activiter", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          suite,
          ville,
          codePostal,
          departement,
          region
        }),
      });

      if (!res.ok) {
      throw new Error("Erreur serveur");
      }

    } catch {

    }

  }
  
  return (
    <div>
      <section className="hero-search">
          <h1>Quelle activité à faire ?</h1>

          <div className="formulaire-card">

            <div>
              <button onClick={() => forSuite(1)} style={{ backgroundColor: suite === 1 ? 'blue' : 'white' }}>Ville</button>
              <button onClick={() => forSuite(2)} style={{ backgroundColor: suite === 2 ? 'blue' : 'white' }}>Département</button>
              <button onClick={() => forSuite(3)} style={{ backgroundColor: suite === 3 ? 'blue' : 'white' }}>Région</button>
            </div>

            {suite === 1 && (
              <form onSubmit={formulaireVille}>

                <label className="checkbox-label">
                  Ville : 
                  <input required type="texte" onChange={(e) => setVille(e.target.value)}></input>
                </label>

                <label className="checkbox-label">
                  code postal : 
                  <input required type="number" onChange={(e) => setCodePostal(e.target.value)}></input>
                </label>
                
                <button type="submit" className="btn-submit">Comparer les trajets</button>
              </form>
            )}

            {suite === 2 && (
              <form onSubmit={formulaireVille}>
                <label className="checkbox-label">
                  Département : 
                  <input required type="texte" onChange={(e) => setDepartement(e.target.value)}></input>
                </label>
                <button type="submit" className="btn-submit">Comparer les trajets</button>
              </form>
            )}

            {suite === 3 && (
              <form onSubmit={formulaireVille}>
                <label className="checkbox-label">
                  Région : 
                  <input required type="texte" onChange={(e) => setRegion(e.target.value)}></input>
                </label>
                <button type="submit" className="btn-submit">Comparer les trajets</button>
              </form>
            )}
          </div>
      </section>

      <section>

      </section>


    </div>
  );
};

export default Contact;
