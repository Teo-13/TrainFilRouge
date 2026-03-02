import React, { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
};

type SendResponse = {
  status: "ok" | "error";
  message: string;
  resultatAge?: string;
};

const Contact = () => {
  const [helloMessage, setHelloMessage] = useState("");
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [dataMessage, setDataMessage] = useState("");

  const [age, setAge] = useState("");
  const [name, setName] = useState("");
  const [resultatAge, setResultatAge] = useState("");
  const [formError, setFormError] = useState("");

  const [users, setUsers] = useState<User[]>([]);

  const [villedepart, setVilledepart] = useState("");
  const [villearrivee, setVillearrivee] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    const ageTrimmed = age.trim();

    if (ageTrimmed === "") {
      setFormError("Le champ age est obligatoire.");
      return;
    }

    if (!/^\d+$/.test(ageTrimmed)) {
      setFormError("Le champ age doit etre un entier.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          age: ageTrimmed,
        }),
      });

      const data: SendResponse = await res.json();

      if (!res.ok) {
        setResultatAge("");
        setFormError(data.message || "Erreur serveur.");
        return;
      }

      setResultatAge(data.resultatAge ?? "");
    } catch {
      setResultatAge("");
      setFormError("Impossible de contacter le serveur.");
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then((res) => res.json())
      .then((data) => setHelloMessage(data.message));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/data")
      .then((res) => res.json())
      .then((data) => {
        setTemperature(data.temperature);
        setHumidity(data.humidity);
        setCity(data.city);
        setDataMessage(data.message);
      });
  }, []);

  function checkTemperature(value: number | null) {
    if (value === null) {
      return "Donnees indisponibles";
    }
    if (value > 30) {
      return "Il fait chaud !";
    }
    if (value < 15) {
      return "Il fait froid !";
    }
    return "Il fait doux !";
  }

  return (
    <div>
      <h1>Contact</h1>
      <p>Voulez vous nous contacter ?</p>

      <div>
        <div>
          <h1>Mon site Flask + React</h1>
          <p>{helloMessage}</p>
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>

        <div>
          <p>Temperature : {temperature} C</p>
          <p>{checkTemperature(temperature)}</p>
          <p>Humidite : {humidity} %</p>
          <p>{dataMessage}</p>
          <p>Ville : {city}</p>
        </div>

        <div>
          <h1>Formulaire</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <button type="submit">Envoyer</button>
          </form>

          {formError && <p>{formError}</p>}

          <p>Nom : {name === "" ? "Pas defini" : name}</p>
          <p>Age : {age === "" ? "Pas defini" : age}</p>
          <p>{resultatAge === "" ? "Rien du back" : "Résultat du back :  " + resultatAge}</p>
        </div>

        <div>
          <input type="text" placeholder="Ville de départ" value={villedepart} onChange={(e) => setVilledepart(e.target.value)}/>
          <input type="text" placeholder="Ville d'arrivée" value={villearrivee} onChange={(e) => setVillearrivee(e.target.value)}/>
          
          <p>{villedepart} vers  {villearrivee}</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
