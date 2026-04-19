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
            <div>
                <div>
                    <h1>Data set 1 : </h1>
                    <p>Data set sur tous les ville de France avec cordonnées GPS</p>
                    <p>https://www.data.gouv.fr/datasets/communes-et-villes-de-france-en-csv-excel-json-parquet-et-feather</p>
                </div>
                <div>
                    <h1>Data set 2 : </h1>
                </div>
            </div>
        </div>
    );
};

export default About;