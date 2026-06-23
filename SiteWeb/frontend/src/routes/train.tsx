import React, { useEffect, useState } from "react";
import "./train.css";

const Train = () => {
    const [step, setStep] = useState(1);


    return (
        <div>
            <section className="bandeau-image">
                <h1>Partie sur le Train</h1>
                <div className="image">
                    <img src="./src/img/train.jpeg" alt="" />
                    <img src="./src/img/train2.jpeg" alt="" />
                    <img src="" alt="" />
                    <img src="" alt="" />
                </div>
            </section>

            <section>
               <button value={1}>{"<"}</button>
                {step === 1 && (
                    <div>
                        texte
                    </div>
                )}

                {step == 2 && (
                    <div>
                        carte france des gares
                    </div>
                )}

                <button>{">"}</button>
            </section>



            <section>
                histoire 
            </section>
        </div>
    );
};

export default Train;
