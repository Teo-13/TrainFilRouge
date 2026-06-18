import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Home.css";

gsap.registerPlugin(ScrollTrigger);

type EmissionTransport = {
    key: string;
    id: number;
    label: string;
    apiName: string;
    emissions: number | null;
    available: boolean;
};

const transportIcons: Record<string, string> = {
    avion: "AV",
    tgv: "TGV",
    intercites: "IC",
    voiture_thermique: "VT",
    voiture_electrique: "VE",
    moto_thermique: "MT",
};

const formatEmission = (value: number | null) => {
    if (value === null) {
        return "Indisponible pour cette distance";
    }

    return `${value.toFixed(2).replace(".", ",")} kg CO2e`;
};

const Home = () => {
    const [distanceKm, setDistanceKm] = useState(10);
    const [emissions, setEmissions] = useState<EmissionTransport[]>([]);
    const [emissionsError, setEmissionsError] = useState("");
    const [emissionsLoading, setEmissionsLoading] = useState(false);

    // ===================== animation GSAP ======================
    useEffect(() => {
        const animation = gsap.context(() => {
            gsap.from(".sec2 .info-box", {
                scrollTrigger: {
                    trigger: ".sec2 .container",
                    toggleActions: "restart none none reset",
                    start: "top 80%",
                    markers: false,
                },
                x: (index) => (index % 2 === 0 ? -140 : 140),
                opacity: 0,
                ease: "power3.out",
                duration: 0.9,
                stagger: 0.15,
            });

            gsap.from(".sec2-example .box", {
                scrollTrigger: {
                    trigger: ".sec2-example .box",
                    toggleActions: "restart none none reset",
                    start: "top 80%",
                    markers: false,
                },
                y: 100,
                opacity: 0,
                scale: 0,
                ease: "elastic(0.4,0.15)",
                duration: 1,
                stagger: 0.1,
            });
        });

        return () => animation.revert();
    }, []);


    // ============= calcule de l'émission de CO2 selon la distance ============================
    const formaulaireDistance = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEmissionsLoading(true);
        setEmissionsError("");

        try {
            const res = await fetch("/api/emissions/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    distance: distanceKm,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Erreur serveur");
            }
            setEmissions(Array.isArray(data.transports) ? data.transports : []);
        } catch {
            setEmissions([]);
            setEmissionsError("Impossible de calculer les emissions CO2.");
        } finally {
            setEmissionsLoading(false);
        }
    };


    return (
        <div>
            <section className="hero-search">
                <h1>Voyager en train, c&apos;est bien ?</h1>
                <p>Comparez rapidement les emissions CO2 selon la distance. <a href="#emission">ici</a></p>
            </section>

            <section className="home-intro">
                <p>
                    Chaque fois que nous nous deplacons, notre choix de transport a un impact direct sur la planete.
                    Entre l&apos;avion, la voiture et le train, les ecarts d&apos;emissions CO2 peuvent etre tres importants.
                </p>
                <p>
                    Faire un trajet en avion pollue souvent beaucoup plus que de faire le meme voyage en train.
                    La distance et le type de transport changent fortement le resultat.
                </p>
            </section>


            <section className="sec2">
                <h2>Comprendre les differences entre transports</h2>
                <div className="container">
                    <div className="info-box info-box1">
                        <h3>Avion</h3>
                        <p>En moyenne, l&apos;avion emet beaucoup de CO2 par passager, surtout sur les trajets courts et moyens.</p>
                    </div>
                    <div className="info-box info-box2">
                        <h3>Train</h3>
                        <p>Le train reste l&apos;un des transports les moins polluants, notamment avec le TGV sur les longues distances.</p>
                    </div>
                    <div className="info-box info-box3">
                        <h3>Voiture</h3>
                        <p>La voiture thermique pollue davantage quand une seule personne voyage. Le covoiturage reduit fortement l&apos;impact par personne.</p>
                    </div>
                </div>
            </section>

            <section className="sec2-example">
                <h2>futur donnée</h2>
                <div className="container">
                    <div className="box box1">1</div>
                    <div className="box box2">2</div>
                    <div className="box box3">cc</div>
                    <div className="box box4"></div>
                    <div className="box box5"></div>
                </div>
            </section>

            <section className="blocemesionco2">
                <div className="co2-hero">
                    <h2>Calculer l&apos;impact carbone de votre trajet</h2>
                    <p>Entrez une distance et comparez les modes de transport (kg CO2e / personne).</p>
                </div>

                <div className="co2-card">
                    <div className="co2-input-row">
                        <label htmlFor="distance-km">Distance parcourue (km)</label>
                        <form onSubmit={formaulaireDistance}>
                            <input
                                id="distance-km"
                                type="number"
                                min="0"
                                step="1"
                                value={distanceKm}
                                onChange={(e) => setDistanceKm(Math.max(0, Number(e.target.value) || 0))}
                            />
                            <button type="submit" className="btn-submit" disabled={emissionsLoading}>
                                {emissionsLoading ? "Calcul en cours..." : "Envoyer"}
                            </button>
                        </form>
                    </div>

                    <div id="emission" className="co2-list">
                        {emissionsLoading && <p className="co2-message">Calcul en cours...</p>}
                        {emissionsError && <p className="co2-message co2-message--error">{emissionsError}</p>}

                        {!emissionsLoading && !emissionsError && emissions.map((transport) => (
                            <article
                                className={`co2-mode-card${transport.available ? "" : " co2-mode-card--disabled"}`}
                                key={transport.key}
                            >
                                <div className="co2-emoji-box" aria-hidden>
                                    {transportIcons[transport.key] || "TR"}
                                </div>
                                <div className="co2-row-main">
                                    <span className="co2-row-title">{transport.label}</span>
                                    <span className="co2-row-value">{formatEmission(transport.emissions)}</span>
                                </div>
                                <div className="co2-rank-badge">ID {transport.id}</div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
