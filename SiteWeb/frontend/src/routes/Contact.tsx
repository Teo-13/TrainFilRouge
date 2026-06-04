import React, { useEffect, useState } from "react";
import "./contact.css";


const Contact = () => {
  const [helloMessage, setHelloMessage] = useState("");

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setHelloMessage(data.message));
  }, []);


  return (
    <div>
      <section className="hero-search">
                <h1>Quelle activité à faire ?</h1>
                <p>Comparez rapidement les emissions CO2 selon la distance.</p>
            </section>
        <div>
          <p>{helloMessage}</p>
        </div>


    </div>
  );
};

export default Contact;
