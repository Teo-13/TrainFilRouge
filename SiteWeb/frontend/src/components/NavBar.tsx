import React, { useEffect, useState } from "react";
import { Link, useViewTransitionState } from "react-router-dom";
import "./NavBar.css";
// import { BiLogoReact } from "react-icons/bi";


const NavBar = () => {
    const [status, setstatus] = useState("")
    let color ="";

    useEffect(() => {
        fetch("http://localhost:5000/api/status")
            .then((res) => res.json())
            .then((data) => setstatus(data.status))
    })

  
    if (status === "ok") {
        color = "green"
    } else {
        color = 'red'
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

            

            <div className="droite">
                <Link to="/">
                    Accueil
                </Link>

                <Link to="/jsypa">
                    Quel trajet
                </Link>

                <Link to="/contact">
                    Quoi faire
                </Link>

                <Link to="/transport">
                    Transport
                </Link>

                <Link to="/apropos">
                    A propos
                </Link>
                
                {/* check backend */}
                <div style={{background: color}} className="cercle"></div>

            </div>
        </nav>
    )
}

export default NavBar;