import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
// import { BiLogoReact } from "react-icons/bi";

const NavBar = () => {

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

                <Link to="/contact">
                    Contact
                </Link>

                <Link to="/apropos">
                    A propos
                </Link>
            </div>

        </nav>
    )
}

export default NavBar;