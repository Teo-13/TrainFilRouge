import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import { initSlider } from "./jsteste.ts";

const Home = () => {
    const sliderRootRef = useRef<HTMLDivElement | null>(null);
    const [distanceKm, setDistanceKm] = useState(10);

    useEffect(() => {
        const cleanup = initSlider(sliderRootRef.current);
        return cleanup;
    }, []);

    return (
        <div>
            <section className="hero-search">
                <h1>Voyager en train, c'est bien ?</h1>
                <p>Est ce que</p>
            </section>

            <section>
                donner sur la pollution des transport 
            </section>

            {/* <div className="slider" ref={sliderRootRef}>
                <button className="btn left">◀</button>

                <div className="cards-container" id="slider">
                    <div className="card">1</div>
                    <div className="card">2</div>
                    <div className="card">3</div>
                    <div className="card">4</div>
                    <div className="card">5</div>
                    <div className="card">6</div>
                    <div className="card">7</div>
                    <div className="card">8</div>
                    <div className="card">Voir plus</div>
                </div>

                <button className="btn right">▶</button>
            </div> */}

            <section className="blocemesionco2">
                <div className="co2-hero">
                    <h2>Calculer l&apos;impact carbone de votre trajet</h2>
                    <p>Entrez une distance et comparez les modes de transport (kg CO2e / personne).</p>
                </div>

                <div className="co2-card">
                    <div className="co2-input-row">
                        <label htmlFor="distance-km">Distance parcourue (km)</label>
                        <input
                            id="distance-km"
                            type="number"
                            min="0"
                            step="1"
                            value={distanceKm}
                            onChange={(e) => setDistanceKm(Math.max(0, Number(e.target.value) || 0))}
                        />
                    </div>

                    <div className="co2-list">
                        <article className="co2-mode-card">
                            <div className="co2-emoji-box" aria-hidden>
                                ✈️
                            </div>
                            <div className="co2-row-main">
                                <span className="co2-row-title">Avion</span>
                                <span className="co2-row-value">142,50 Kg CO2e</span>
                            </div>
                            <div className="co2-rank-badge">Top 1</div>
                        </article>

                        <article className="co2-mode-card">
                            <div className="co2-emoji-box" aria-hidden>
                                🚗
                            </div>
                            <div className="co2-row-main">
                                <span className="co2-row-title">Voiture thermique</span>
                                <span className="co2-row-value">1,42 Kg CO2e</span>
                            </div>
                            <div className="co2-rank-badge">Top 2</div>
                        </article>

                        <article className="co2-mode-card">
                            <div className="co2-emoji-box" aria-hidden>
                                🚌
                            </div>
                            <div className="co2-row-main">
                                <span className="co2-row-title">Bus thermique</span>
                                <span className="co2-row-value">1,22 Kg CO2e</span>
                            </div>
                            <div className="co2-rank-badge">Top 3</div>
                        </article>

                        <article className="co2-mode-card">
                            <div className="co2-emoji-box" aria-hidden>
                                🏍️
                            </div>
                            <div className="co2-row-main">
                                <span className="co2-row-title">Scooter / moto thermique</span>
                                <span className="co2-row-value">0,76 Kg CO2e</span>
                            </div>
                            <div className="co2-rank-badge">Top 4</div>
                        </article>

                        <article className="co2-mode-card">
                            <div className="co2-emoji-box" aria-hidden>
                                🚕
                            </div>
                            <div className="co2-row-main">
                                <span className="co2-row-title">Covoiturage thermique</span>
                                <span className="co2-row-value">0,71 Kg CO2e</span>
                            </div>
                            <div className="co2-rank-badge">Top 5</div>
                        </article>

                        <article className="co2-mode-card">
                            <div className="co2-emoji-box" aria-hidden>
                                🔌🚗
                            </div>
                            <div className="co2-row-main">
                                <span className="co2-row-title">Voiture électrique</span>
                                <span className="co2-row-value">0,67 Kg CO2e</span>
                            </div>
                            <div className="co2-rank-badge">Top 6</div>
                        </article>

                        <article className="co2-mode-card">
                            <div className="co2-emoji-box" aria-hidden>
                                🚙
                            </div>
                            <div className="co2-row-main">
                                <span className="co2-row-title">Covoiturage électrique</span>
                                <span className="co2-row-value">0,34 Kg CO2e</span>
                            </div>
                            <div className="co2-rank-badge">Top 7</div>
                        </article>

                        <article className="co2-mode-card">
                            <div className="co2-emoji-box" aria-hidden>
                                🛴
                            </div>
                            <div className="co2-row-main">
                                <span className="co2-row-title">Trottinette électrique</span>
                                <span className="co2-row-value">0,25 Kg CO2e</span>
                            </div>
                            <div className="co2-rank-badge">Top 8</div>
                        </article>

                        <article className="co2-mode-card">
                            <div className="co2-emoji-box" aria-hidden>
                                ⚡🚲
                            </div>
                            <div className="co2-row-main">
                                <span className="co2-row-title">Vélo à assistance électrique</span>
                                <span className="co2-row-value">0,11 Kg CO2e</span>
                            </div>
                            <div className="co2-rank-badge">Top 9</div>
                        </article>

                        <article className="co2-mode-card">
                            <div className="co2-emoji-box" aria-hidden>
                                🚇
                            </div>
                            <div className="co2-row-main">
                                <span className="co2-row-title">Métro</span>
                                <span className="co2-row-value">0,04 Kg CO2e</span>
                            </div>
                            <div className="co2-rank-badge">Top 10</div>
                        </article>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
