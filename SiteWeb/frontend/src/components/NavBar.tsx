import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";
// import { BiLogoReact } from "react-icons/bi";


const NavBar = () => {
    const [status, setstatus] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isTransportOpen, setIsTransportOpen] = useState(false);
    const location = useLocation();
    const isTransportSection = location.pathname.startsWith("/transport");
    let color = "";

    useEffect(() => {
        fetch("/api/status")
            .then((res) => res.json())
            .then((data) => setstatus(data.status));
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
        setIsTransportOpen(false);
    }, [location.pathname]);

  
    if (status === "ok") {
        color = "green";
    } else {
        color = "red";
    }
    
    
    return (
        <nav>
            <div className="gauche">
                <Link to="/">
                    <span>
                        {/* <BiLogoReact className='text-6xl'/> */}
                        <span>Train Fil Rouge</span>
                    </span>
                </Link>
            </div>

            <button
                type="button"
                className={`nav-toggle${isMenuOpen ? " is-open" : ""}`}
                aria-expanded={isMenuOpen}
                aria-label="Ouvrir le menu"
                onClick={() => setIsMenuOpen((open) => !open)}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div className={`droite${isMenuOpen ? " is-open" : ""}`}>
                <Link to="/">
                    Accueil
                </Link>

                <Link to="/jsypa">
                    Quel trajet
                </Link>

                <Link to="/contact">
                    Quoi faire
                </Link>

                <div className={`nav-dropdown${isTransportOpen ? " is-open" : ""}`}>
                    <button
                        type="button"
                        className={`nav-dropdown__toggle${isTransportSection ? " is-active" : ""}`}
                        aria-expanded={isTransportOpen}
                        onClick={() => setIsTransportOpen((open) => !open)}
                    >
                        <span className="nav-dropdown__label">
                            Transport
                        </span>
                        <span className={`nav-dropdown__chevron${isTransportOpen ? " is-open" : ""}`} aria-hidden />
                    </button>

                    <div className="nav-dropdown__menu">
                        <Link to="/avion" className={location.pathname === "/avion" ? "is-active" : ""}>
                            Avion
                        </Link>
                        <Link to="/voiture" className={location.pathname === "/voiture" ? "is-active" : ""}>
                            Voiture
                        </Link>
                        <Link to="/train" className={location.pathname === "/train" ? "is-active" : ""}>
                            Train
                        </Link>
                    </div>
                </div>

                <Link to="/apropos">
                    A propos
                </Link>
                
                {/* check backend */}
                <div style={{background: color}} className="cercle"></div>
            </div>
        </nav>
    );
};

export default NavBar;
