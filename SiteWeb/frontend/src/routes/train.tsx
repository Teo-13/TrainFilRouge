import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import cartetrainImage from "../img/cartetrain.png";
import "./train.css";

gsap.registerPlugin(ScrollTrigger);

type DatasetStat = {
    id: string;
    label: string;
    value: string;
    description: string;
    badge?: string;
};

type SegmentStat = {
    label: string;
    count: number;
    formattedCount: string;
    share: string;
};

type SourceLink = {
    label: string;
    url: string;
};

type WebFact = {
    id: string;
    label: string;
    value: string;
    description: string;
    sources: SourceLink[];
};

type TrainOverview = {
    dataset: {
        name: string;
        sourceUrl: string;
        stats: DatasetStat[];
        segments: SegmentStat[];
    };
    webFacts: WebFact[];
};

const segmentDescriptions = [
    "Segment A : gares majeures accueillant un trafic tres important, souvent desservies par les TGV et les grandes lignes nationales.",
    "Segment B : gares intermediaires assurant principalement les liaisons regionales et interregionales.",
    "Segment C : gares de proximite qui permettent de desservir les communes locales et les zones rurales.",
];

const didYouKnowFacts = [
    "La France possede le 2e plus grand reseau ferroviaire d'Europe.",
    "Le reseau compte environ 27 500 km de lignes ferroviaires.",
    "Plus de 2 700 gares voyageurs sont reparties sur le territoire.",
    "Le TGV est l'un des moyens de transport longue distance les moins emetteurs de CO2.",
];

const roleItems = [
    "trains TER, Intercites et TGV",
    "bus urbains et regionaux",
    "tramway ou metro dans les grandes villes",
    "velos et parkings relais",
    "parfois des connexions directes avec un aeroport",
];

const Train = () => {
    const [overview, setOverview] = useState<TrainOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadOverview = async () => {
            try {
                const response = await fetch("/api/train/overview");
                const data = await response.json().catch(() => null);

                if (!response.ok) {
                    throw new Error(data?.message || data?.error || "Impossible de charger les donnees train.");
                }

                setOverview(data as TrainOverview);
            } catch (err) {
                const message = err instanceof Error ? err.message : "Impossible de charger les donnees train.";
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        loadOverview();
    }, []);

    useEffect(() => {
        const animation = gsap.context(() => {
            gsap.from(".train-color-grid--primary .train-color-card", {
                scrollTrigger: {
                    trigger: ".train-color-grid--primary",
                    toggleActions: "restart none none reset",
                    start: "top 82%",
                },
                y: 80,
                opacity: 0,
                scale: 0.88,
                ease: "power3.out",
                duration: 0.85,
                stagger: {
                    each: 0.12,
                    from: "start",
                },
            });

            gsap.from(".train-color-grid--facts .train-color-card", {
                scrollTrigger: {
                    trigger: ".train-color-grid--facts",
                    toggleActions: "restart none none reset",
                    start: "top 82%",
                },
                y: 80,
                opacity: 0,
                scale: 0.88,
                ease: "power3.out",
                duration: 0.85,
                stagger: {
                    each: 0.12,
                    from: "start",
                },
            });
        });

        return () => animation.revert();
    }, [overview]);

    const datasetStats = overview?.dataset.stats ?? [];
    const segmentStats = overview?.dataset.segments ?? [];
    const webFacts = overview?.webFacts ?? [];

    const statById = (id: string) => datasetStats.find((stat) => stat.id === id);

    const topKeyCards = [
        {
            id: "stations",
            title: "Gares voyageurs",
            value: statById("stations")?.value ?? "...",
            colorClass: "train-color-card--red",
        },
        {
            id: "communes",
            title: "Communes desservies",
            value: statById("communes")?.value ?? "...",
            colorClass: "train-color-card--blue",
        },
        {
            id: "rails",
            title: "Voies ferrees (rails) en km",
            value: "48 335",
            colorClass: "train-color-card--gold",
        },
    ];

    const bottomKeyCards = [
        {
            id: "daily-travelers",
            title: "Voyageurs par jour",
            value: webFacts[0]?.value ?? "5 M",
            colorClass: "train-color-card--orange",
        },
        {
            id: "daily-trains",
            title: "Trains par jour",
            value: webFacts[1]?.value ?? "15 000",
            colorClass: "train-color-card--green",
        },
        {
            id: "tgv-passengers",
            title: "Passagers TGV en 2025",
            value: webFacts[2]?.value ?? "168 M",
            colorClass: "train-color-card--pink",
        },
        {
            id: "tgv-co2",
            title: "Emission TGV",
            value: webFacts[3]?.value ?? "2,5 g CO2e / passager-km",
            colorClass: "train-color-card--gray",
        },
    ];

    return (
        <div className="train-page">
            <section className="train-hero">
                <div className="train-hero__panel">
                    <p className="train-kicker">Donnees train</p>
                    <h1>Le train en France, entre maillage local et trafic massif</h1>
                    <p className="train-hero__text">
                        Cette page melange le dataset local du projet avec quelques reperes officiels SNCF
                        pour donner une lecture simple du reseau ferroviaire.
                    </p>
                </div>
            </section>

            <section className="train-shell train-copy-center">
                <h2>Le reseau ferroviaire francais</h2>
                <p>
                    Le reseau ferroviaire francais est l&apos;un des plus developpes d&apos;Europe. Il permet de relier les
                    grandes metropoles grace aux lignes a grande vitesse, tout en assurant la desserte des villes
                    moyennes et des territoires ruraux grace aux trains regionaux TER et Intercites. Ce maillage joue
                    un role essentiel dans la mobilite quotidienne de millions de voyageurs.
                </p>
            </section>

            <section className="train-shell train-map-section">
                <h2>Carte du reseau ferroviaire en France</h2>
                <div className="train-map-card">
                    <div className="train-map-visual">
                        <img src={cartetrainImage} alt="Carte du reseau ferroviaire en France" />
                    </div>

                    <div className="train-map-content">
                        <h3>Repartition des segments SNCF</h3>

                        {loading && <p className="train-feedback">Chargement des donnees...</p>}
                        {error && <p className="train-feedback train-feedback--error">{error}</p>}

                        {!loading && !error && (
                            <div className="train-segments">
                                {segmentStats.map((segment) => (
                                    <div className="train-segment-row" key={segment.label}>
                                        <span className="train-segment-row__name">{segment.label}</span>
                                        <div className="train-segment-row__track" aria-hidden>
                                            <div
                                                className="train-segment-row__fill"
                                                style={{ width: segment.share }}
                                            />
                                        </div>
                                        <span className="train-segment-row__share">{segment.share}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="train-segment-copy">
                            <h3>A quoi correspondent les segments A, B et C ?</h3>
                            <p>
                                Les gares du dataset sont classees selon leur niveau d&apos;importance.
                            </p>
                            <ul>
                                {segmentDescriptions.map((segment) => (
                                    <li key={segment}>{segment}</li>
                                ))}
                            </ul>
                            <p>
                                Cette classification montre que le reseau francais repose principalement sur un
                                maillage dense de petites et moyennes gares, indispensables aux deplacements du
                                quotidien.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="train-shell train-key-section">
                <h2>Chiffres cle</h2>
                <div className="train-color-grid train-color-grid--primary">
                    {topKeyCards.map((card) => (
                        <article className={`train-color-card ${card.colorClass}`} key={card.id}>
                            <p>{card.title}</p>
                            <strong>{card.value}</strong>
                        </article>
                    ))}
                </div>
            </section>

            <section className="train-shell train-copy-block">
                <h2>Pourquoi autant de petites gares ?</h2>
                <p>
                    Meme si les lignes a grande vitesse sont les plus connues, la majorite des gares francaises sont
                    des gares de proximite. Elles permettent aux habitants de rejoindre leur lieu de travail, leurs
                    etudes ou les grandes villes grace aux correspondances avec les reseaux regionaux.
                </p>
            </section>

            <section className="train-shell train-white-panel">
                <div className="train-white-panel__block">
                    <h2>Le train au quotidien</h2>
                    <p>Chaque jour en France :</p>
                    <ul>
                        <li>environ 5 millions de voyageurs prennent le train ;</li>
                        <li>pres de 15 000 trains circulent sur le reseau national ;</li>
                        <li>
                            des milliers de conducteurs, agents de circulation et techniciens assurent le fonctionnement
                            du reseau 24 heures sur 24.
                        </li>
                    </ul>
                    <p>Ces chiffres illustrent l&apos;importance du train dans la mobilite des Francais.</p>
                </div>

                <div className="train-white-panel__block">
                    <h2>Le role des gares</h2>
                    <p>
                        Une gare n&apos;est pas seulement un point d&apos;arret. Elle constitue un veritable pole d&apos;echanges
                        entre plusieurs moyens de transport :
                    </p>
                    <ul>
                        {roleItems.map((item) => (
                            <li key={item}>{item} ;</li>
                        ))}
                    </ul>
                    <p>
                        Cette intermodalite facilite les deplacements sans utiliser systematiquement la voiture.
                    </p>
                </div>
            </section>

            <section className="train-shell train-copy-block train-copy-block--large">
                <h2>Un moyen de transport plus respectueux de l&apos;environnement</h2>
                <p>
                    Le transport ferroviaire est l&apos;un des moyens de deplacement les moins emetteurs de gaz a effet
                    de serre. En France, un trajet en TGV emet en moyenne 2,5 g de CO2e par passager et par
                    kilometre, soit plusieurs dizaines de fois moins qu&apos;un deplacement en voiture individuelle ou en
                    avion sur une distance comparable. Le developpement du rail constitue ainsi un levier important
                    pour reduire les emissions liees aux transports.
                </p>
            </section>

            <section className="train-shell train-key-section">
                <h2>Chiffres cle</h2>
                <div className="train-color-grid train-color-grid--facts">
                    {bottomKeyCards.map((card) => (
                        <article className={`train-color-card ${card.colorClass}`} key={card.id}>
                            <p>{card.title}</p>
                            <strong>{card.value}</strong>
                        </article>
                    ))}
                </div>
            </section>

            <section className="train-shell train-dataset-panel">
                <h2>A propos du dataset utilise</h2>
                <p>
                    Les statistiques presentees dans cette page proviennent d&apos;un jeu de donnees local contenant les
                    gares voyageurs francaises. Les indicateurs (nombre de gares, communes desservies, repartition par
                    segments...) sont calcules directement a partir de ce dataset. Les chiffres concernant le trafic
                    ferroviaire, les voyageurs et les emissions de CO2 proviennent quant a eux de publications
                    officielles de la SNCF et servent a remettre les donnees du projet dans leur contexte national.
                </p>

                {!loading && !error && overview && (
                    <a
                        className="train-source-link"
                        href={overview.dataset.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Voir la source du dataset
                    </a>
                )}

                {loading && <p className="train-feedback">Chargement des donnees...</p>}
                {error && <p className="train-feedback train-feedback--error">{error}</p>}
            </section>

            {!loading && !error && webFacts.length > 0 && (
                <section className="train-shell train-sources-panel">
                    <h2>Sources officielles</h2>
                    <div className="train-sources-grid">
                        {webFacts.map((fact) => (
                            <article className="train-source-card" key={fact.id}>
                                <p className="train-source-card__label">{fact.label}</p>
                                <p className="train-source-card__text">{fact.description}</p>
                                {fact.sources.map((source) => (
                                    <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                                        {source.label}
                                    </a>
                                ))}
                            </article>
                        ))}
                    </div>
                </section>
            )}

            <section className="train-shell train-didyouknow">
                <h2>Le saviez-vous ?</h2>
                <ul>
                    {didYouKnowFacts.map((fact) => (
                        <li key={fact}>{fact}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default Train;
