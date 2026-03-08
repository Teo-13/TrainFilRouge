import React, { useEffect, useState } from "react";

const About = () => {
    const [status, setStatus] = useState("");
    const [depart, setDepart] = useState("");
    const [destition, setDestitiont] = useState("");
    const [nombre_trouve, setNombre_trouve] = useState("");

    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/dataexcel")
            .then((res) => res.json())
            .then((resJson) => {
                setStatus(resJson.status)
            })
    }, []);

    return (
        <div>
            <p>coucou : {status}</p>
        </div>
    );
};

export default About;