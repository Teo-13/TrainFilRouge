import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
// import { BiLogoReact } from "react-icons/bi";

const NavBar = () => {

    return (
        <nav>

            <Link to="/">
                <span>
                    {/* <BiLogoReact className='text-6xl'/> */}
                    <span>React Router</span>
                </span>
            </Link>

            <div>
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