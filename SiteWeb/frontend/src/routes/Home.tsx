import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dGare from "../img/departementGare.png";
import dAero from "../img/departementAeroport.png";
import imgTransport from "../img/transport.png";
import imgGare from "../img/gare.png";
import cartetrainImage from "../img/cartetrain.png";
import "./home.css";

gsap.registerPlugin(ScrollTrigger);

type EmissionTransport = {
    key: string;
    id: number;
    label: string;
    apiName: string;
    emissions: number | null;
    available: boolean;
};

type SourceLink = {
    label: string;
    url: string;
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

const transportCards = [
    {
        title: "Train",
        value: "2,5 g CO2e / passager-km",
        className: "info-box2",
        description:
            "Le TGV fait partie des options longue distance les moins emettrices. Il sert de repere bas carbone dans beaucoup de trajets interurbains.",
    },
    {
        title: "Voiture",
        value: "142 g CO2e / km",
        className: "info-box3",
        description:
            "La voiture reste tres souple pour le quotidien, mais son impact grimpe vite si elle est thermique et peu remplie. Le covoiturage change fortement le bilan par personne.",
    },
    {
        title: "Avion",
        value: "185 g CO2e / km",
        className: "info-box1",
        description:
            "L'avion reste utile pour les longues distances, mais il emet beaucoup plus par passager-km, surtout quand une alternative ferroviaire existe.",
    },
];

const keyFacts = [
    {
        id: "transport-share",
        title: "Part du transport",
        value: "34 %",
        colorClass: "box1",
        description: "En 2024, les transports sont le premier secteur emetteur de GES en France.",
    },
    {
        id: "transport-emissions",
        title: "Emissions du transport",
        value: "124,9 Mt",
        colorClass: "box2",
        description: "Volume d'emissions du secteur transport en 2024, hors UTCATF.",
    },
    {
        id: "tourists-2024",
        title: "Touristes internationaux",
        value: "100 M+",
        colorClass: "box3",
        description: "La France a accueilli plus de 100 millions de touristes internationaux en 2024.",
    },
    {
        id: "overnight-stays",
        title: "Nuitees en 2024",
        value: "451 M",
        colorClass: "box4",
        description: "Frequentation des hebergements collectifs de tourisme en France en 2024.",
    },
    {
        id: "tourism-transport",
        title: "Tourisme : part du transport",
        value: "69 %",
        colorClass: "box5",
        description: "Le transport represente la majeure partie de l'empreinte carbone du tourisme en France.",
    },
];

const sourceCards: Array<{ title: string; text: string; links: SourceLink[] }> = [
    {
        title: "Climat et transports",
        text: "Le SDES indique que les transports sont le premier secteur emetteur en France, avec 124,9 Mt CO2e en 2024, soit 34 % des emissions hors UTCATF.",
        links: [
            {
                label: "SDES - panorama francais des GES",
                url: "https://www.statistiques.developpement-durable.gouv.fr/edition-numerique/chiffres-cles-du-climat/fr/10-panorama-francais-des-gaz-a",
            },
        ],
    },
    {
        title: "Pollution de l'air",
        text: "L'ADEME rappelle que le transport routier est aussi un fort emetteur de polluants atmospheriques, notamment les particules et les oxydes d'azote.",
        links: [
            {
                label: "ADEME - qualite de l'air et mobilites durables",
                url: "https://www.ademe.fr/les-defis-de-la-transition/air-et-mobilite/",
            },
        ],
    },
    {
        title: "Tourisme en France",
        text: "Atout France souligne une annee 2024 record avec plus de 100 millions de touristes internationaux et 71 milliards d'euros de recettes internationales.",
        links: [
            {
                label: "Atout France - bilan touristique 2024",
                url: "https://www.atout-france.fr/fr/actualites/bilan-vacances-dhiver-2024",
            },
            {
                label: "Insee - l'essentiel sur le tourisme",
                url: "https://www.insee.fr/fr/statistiques/7653005",
            },
        ],
    },
    {
        title: "Tourisme et emissions",
        text: "Selon l'ADEME, le tourisme en France a emis 97 Mt CO2e en 2022 et 69 % de cette empreinte provient du transport, dont 29 % pour l'aerien seul.",
        links: [
            {
                label: "ADEME - emissions du tourisme en France",
                url: "https://www.ademe.fr/presse/communique-national/journee-mondiale-du-tourisme-bilan-des-emissions-de-ges-du-secteur-du-tourisme-en-france/",
            },
        ],
    },
];

const Home = () => {
    const [distanceKm, setDistanceKm] = useState(10);
    const [emissions, setEmissions] = useState<EmissionTransport[]>([]);
    const [emissionsError, setEmissionsError] = useState("");
    const [emissionsLoading, setEmissionsLoading] = useState(false);

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
                    trigger: ".sec2-example .container",
                    toggleActions: "restart none none reset",
                    start: "top 80%",
                    markers: false,
                },
                y: 100,
                opacity: 0,
                scale: 0.2,
                ease: "power3.out",
                duration: 0.9,
                stagger: 0.08,
            });
        });

        return () => animation.revert();
    }, []);

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
                throw new Error(data?.message || data?.error || "Erreur serveur");
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
        <div className="home-page">
            <section className="hero-search">
                <h1>Comparer les transports, comprendre leur impact et replacer le tourisme dans le paysage francais</h1>
                <p>
                    Garde ton calculateur d&apos;emissions CO2 selon la distance, puis lis les grands ordres de grandeur
                    sur le train, la voiture, l&apos;avion, la pollution liee aux transports et la place du tourisme en
                    France. <a href="#emission">Aller au calculateur</a>
                </p>
            </section>

            <section className="home-intro">
                <p>
                    En France, le choix du mode de transport compte autant pour le climat que pour l&apos;organisation des
                    mobilites quotidiennes et touristiques. Le train structure les grands axes et une partie des sejours
                    sans voiture, la voiture reste dominante dans les trajets du quotidien, et l&apos;avion concentre une
                    forte intensite carbone sur longue distance.
                </p>
                <p>
                    Cette page garde ton comparateur CO2, mais ajoute aussi des reperes plus larges pour mieux situer
                    les trois grands modes dans le contexte francais.
                </p>
            </section>

            <section className="home-map-section">
                <div className="home-map-shell">
                    <div className="home-map-copy">
                        <h2>Le territoire francais, le rail et les flux touristiques</h2>
                        <p>
                            Le tourisme en France s&apos;appuie sur un territoire tres accessible: grandes lignes
                            ferroviaires, reseau routier massif, villes touristiques bien reliees et hubs aeroportuaires
                            importants. La carte ferroviaire rappelle qu&apos;une grande partie des destinations majeures
                            peut etre reliee par le rail, surtout pour les deplacements interurbains et une partie des
                            sejours loisirs.
                        </p>
                        <p>
                            Cela ne signifie pas que tout peut se faire en train, mais cela montre qu&apos;en France le
                            tourisme et les mobilites longue distance ne reposent pas uniquement sur la voiture ou
                            l&apos;avion.
                        </p>
                    </div>
                    <div className="home-map-card">
                        <img src={imgTransport} alt="Carte du reseau ferroviaire francais" />
                    </div>
                </div>
            </section>

            <section className="sec2">
                <h2>Trois modes, trois ordres de grandeur</h2>
                <div className="container">
                    {transportCards.map((card) => (
                        <div className={`info-box ${card.className}`} key={card.title}>
                            <h3>{card.title}</h3>
                            <strong>{card.value}</strong>
                            <p>{card.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="home-story-panel">
                <div className="home-story-block">
                    <h2>Pollution et emissions des transports</h2>
                    <p>
                        Les transports sont le premier secteur emetteur de gaz a effet de serre en France. Le sujet ne
                        se limite pas au CO2: le transport routier participe aussi fortement a la pollution de l&apos;air,
                        notamment via les particules et les oxydes d&apos;azote. C&apos;est pour cela que le choix modal,
                        l&apos;electrification, le covoiturage et le report vers le rail comptent autant.
                    </p>
                </div>

                <div className="home-story-block">
                    <h2>Le tourisme en France</h2>
                    <p>
                        La France reste l&apos;une des toutes premieres destinations touristiques mondiales. En 2024, elle
                        a accueilli plus de 100 millions de touristes internationaux, avec 71 milliards d&apos;euros de
                        recettes internationales. Les hebergements collectifs ont comptabilise 451 millions de nuitees,
                        ce qui montre le poids economique et territorial du tourisme.
                    </p>
                </div>

                <div className="home-story-block">
                    <h2>Tourisme et transport</h2>
                    <p>
                        Le tourisme a lui aussi une empreinte carbone importante. D&apos;apres l&apos;ADEME, le secteur du
                        tourisme en France a emis 97 Mt CO2e en 2022, et le transport represente 69 % de cette
                        empreinte. Cela signifie que la facon d&apos;aller en vacances ou de circuler sur place pese souvent
                        davantage que beaucoup d&apos;autres postes du sejour.
                    </p>
                </div>
            </section>

            <section className="home-map-section">
                <div className="home-map-shell">
                    <div className="home-map-copy">
                        <h2>Distribution des infrastructures sur le territoire </h2>
                        <p>
                            La densité des gares révèle une concentration marquée dans le Nord de la France — notamment dans le Nord-Pas-de-Calais et autour de l'Île-de-France — ainsi que dans quelques départements du Sud-Ouest, tandis qu'une grande partie du territoire reste faiblement desservie par le train. À droite, la carte des aéroports présente un profil très différent : la distribution est plus homogène sur l'ensemble du territoire, avec toutefois des pics notables dans le Nord et dans plusieurs départements du Sud (Pyrénées, Méditerranée), souvent liés à la présence d'aérodromes locaux ou militaires.
                        </p>
                        <p>
                            Cette comparaison souligne une complémentarité géographique entre les deux modes de transport : le train couvre densément les zones urbaines et les corridors historiques, tandis que l'avion offre une présence plus diffuse, notamment dans des territoires moins bien connectés au réseau ferré. Même si certain départements restent faiblement desservis par les deux modes, la combinaison de ces infrastructures permet de répondre à une variété de besoins de mobilité sur l'ensemble du territoire français.
                        </p>                   
                    </div>
                    <div className="home-map-card">
                        <img src={dGare} alt="Distribution des gares par département" />
                        <img src={dAero} alt="Distribution des aéroports par département" />
                    </div>
                </div>
            </section>
            <section className="sec2-example">
                <h2>Quelques reperes cle</h2>
                <div className="container">
                    {keyFacts.map((fact) => (
                        <article className={`box ${fact.colorClass}`} key={fact.id}>
                            <p>{fact.title}</p>
                            <strong>{fact.value}</strong>
                            <span>{fact.description}</span>
                        </article>
                    ))}
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

                        {!emissionsLoading &&
                            !emissionsError &&
                            emissions.map((transport) => (
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

            <section className="home-sources-panel">
                <h2>Sources officielles et publiques</h2>
                <div className="home-sources-grid">
                    {sourceCards.map((card) => (
                        <article className="home-source-card" key={card.title}>
                            <h3>{card.title}</h3>
                            <p>{card.text}</p>
                            {card.links.map((link) => (
                                <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                                    {link.label}
                                </a>
                            ))}
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
