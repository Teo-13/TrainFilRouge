import React, { useEffect, useRef } from "react";
import "./Home.css";
import { initSlider } from "./jsteste.js";

const Home = () => {
    const sliderRootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const cleanup = initSlider(sliderRootRef.current);
        return cleanup;
    }, []);

    return (
        <div>

            <section className="AfficheBandeau">
                <h1>Voyager en train, c'est bien ?</h1>
                <p>Est ce que</p>
            </section>

            <div className="slider" ref={sliderRootRef}>
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
                    <div className="card">9</div>
                </div>

                <button className="btn right">▶</button>
            </div>

        </div>
        
    )
}

export default Home;
