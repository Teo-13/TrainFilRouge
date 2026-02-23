import React from "react";

import { useEffect, useState } from "react";

const Contact = () => {

    const [messageHello, setMessageHello] = useState("");
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [city, setCity] = useState(null);
  const [message, setMessage] = useState("");
  // 1 Etats pour stocker les inputs
  const [age, setAge] = useState("");
  const [name, setName] = useState("");

  // 2 Fonction appelée au submit
  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault(); // empêche le rechergement de la page

    // 3 Envoi des dnnées au backend 
    fetch("http://localhost:5000/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        age: age
      })
    });
  };
  
  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  useEffect(() => {
  fetch("http://localhost:5000/api/data")
    .then(res => res.json())
    .then(data => {
      setTemperature(data.temperature);  // 👈 UNE seule variable
      setHumidity(data.humidity);   
      setCity(data.city);    
      setMessageHello(data.message);
    });
  }, []);

  function checkTemperature(temperature: number | null) {
    if (temperature === null) {
      return "Données indisponibles";
    } else if (temperature > 30) {
      return "Il fait chaud !";
    } else if (temperature < 15) {
      return "Il fait froid !";
    } else {
      return "Il fait doux !";
    }
  }

    return (
        <div>
            <h1>Contact</h1>
            <p>Voulez vous nous contacter ? </p>

            <div>
                <div>
                    <h1>Mon site Flask + React</h1>
                    <p>{message}</p>
                    <ul>
                    {users.map(user => (
                        <li key={user.id}>{user.name}</li>
                    ))}
                    </ul>
                </div>

                <div>
                    <p>Température : {temperature} °C</p>
                    <p>{checkTemperature(temperature)}</p>
                    <p>Humidité : {humidity} %</p>
                    <p>{messageHello}</p>
                    <p>Cité : {city} </p>
                </div>

                <div>
                    <h1>Formulaire</h1>
                    <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />

                    <input type="text" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />

                    <button onClick={handleSubmit}>Envoyer</button>

                    <p>Nom : {name === "" ? "Pas défine" : name }</p>
                    <p>age : {age === "" ? "Pas défine": age}</p>
                    <p>{name} et {age}</p>
                </div>
            </div>
        </div>
    )
}

export default Contact;







// import { useEffect, useState } from "react";

// type Health = {
//   status: string;
// };

// export default function App() {
//   const [health, setHealth] = useState<Health | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetch("/api/health")
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error("Backend n'est pas connecté !!");
//         }
//         return res.json();
//       })
//       .then((data: Health) => setHealth(data))
//       .catch((err) => setError(err.message));
//   }, []);

//   return (
//     <main className="page">
//       <h1>TrainFilRouge</h1>
//       <p>React + TypeScript + Flask</p>
//       <section className="card">
//         <h2>API health</h2>
//         {error && <p className="error">Error: {error}</p>}
//         {!error && !health && <p>Loading...</p>}
//         {health && <pre>{JSON.stringify(health, null, 2)}</pre>}
//       </section>
//     </main>
//   );
// }
