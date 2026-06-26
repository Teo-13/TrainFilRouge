import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import cartevoitureImage from "../img/cartevoiture.png";
import "./voiture.css";

gsap.registerPlugin(ScrollTrigger);

type DatasetStat = {
    id: string;
    label: string;
    value: string;
    description: string;
};

type RoadFamilyStat = {
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

type VoitureOverview = {
    dataset: {
        name: string;
        sourceUrl: string;
        stats: DatasetStat[];
        roadFamilies: RoadFamilyStat[];
    };
    webFacts: WebFact[];
};

const didYouKnowFacts = [
    "La voiture reste le premier mode de transport du quotidien en France et represente 63 % des deplacements selon le SDES.",
    "Le fichier local du projet cartographie plus de 74 000 points de bornage sur le reseau routier observe dans le notebook.",
    "En 2025, 1,665 million de voitures neuves ont ete immatriculees en France selon le SDES.",
    "Le covoiturage et une meilleure occupation des vehicules reduisent fortement l'impact carbone par personne transportee.",
];

const roadRoleItems = [
    "relier les bassins d'emploi, les zones commerciales et les petites communes",
    "assurer les trajets quotidiens domicile-travail et domicile-etudes",
    "connecter les gares, aeroports, plateformes logistiques et centres-villes",
    "permettre l'acces a des territoires peu denses parfois moins desservis par le rail",
];

const voitureUsageItems = [
    "la voiture offre une forte souplesse horaire et geographique",
    "elle reste tres presente dans les couronnes periurbaines et les espaces ruraux",
    "son poids dans les deplacements explique pourquoi sa transition climatique est un enjeu central",
];

const Voiture = () => {
    const [overview, setOverview] = useState<VoitureOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadOverview = async () => {
            try {
                const response = await fetch("/api/voiture/overview");
                const data = await response.json().catch(() => null);

                if (!response.ok) {
                    throw new Error(data?.message || data?.error || "Impossible de charger les donnees voiture.");
                }

                setOverview(data as VoitureOverview);
            } catch (err) {
                const message = err instanceof Error ? err.message : "Impossible de charger les donnees voiture.";
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        loadOverview();
    }, []);

    useEffect(() => {
        const animation = gsap.context(() => {
            gsap.from(".voiture-color-grid--primary .voiture-color-card", {
                scrollTrigger: {
                    trigger: ".voiture-color-grid--primary",
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

            gsap.from(".voiture-color-grid--facts .voiture-color-card", {
                scrollTrigger: {
                    trigger: ".voiture-color-grid--facts",
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
    const roadFamilies = overview?.dataset.roadFamilies ?? [];
    const webFacts = overview?.webFacts ?? [];

    const statById = (id: string) => datasetStats.find((stat) => stat.id === id);

    const topKeyCards = [
        {
            id: "segments",
            title: "Sections cartographiees",
            value: statById("segments")?.value ?? "...",
            colorClass: "voiture-color-card--red",
            description: statById("segments")?.description ?? "Nombre de troncons presents dans le shapefile local.",
        },
        {
            id: "routes",
            title: "References de routes",
            value: statById("routes")?.value ?? "...",
            colorClass: "voiture-color-card--blue",
            description: statById("routes")?.description ?? "Nombre d'axes et references routieres distinctes.",
        },
        {
            id: "bornage",
            title: "Points de bornage",
            value: statById("bornage")?.value ?? "...",
            colorClass: "voiture-color-card--gold",
            description: statById("bornage")?.description ?? "Points rouges utilises pour reperer les sections sur la carte.",
        },
        {
            id: "length",
            title: "Longueur representee",
            value: statById("length")?.value ?? "...",
            colorClass: "voiture-color-card--teal",
            description: statById("length")?.description ?? "Longueur cumulee des sections visibles dans le fichier local.",
        },
    ];

    const bottomKeyCards = [
        {
            id: "cars-2025",
            title: "Voitures en circulation",
            value: webFacts[0]?.value ?? "39,7 M",
            colorClass: "voiture-color-card--orange",
            description: webFacts[0]?.description ?? "Ordre de grandeur du parc francais de voitures particulieres.",
        },
        {
            id: "roads-2024",
            title: "Routes en France",
            value: webFacts[1]?.value ?? "1,31 M km",
            colorClass: "voiture-color-card--green",
            description: webFacts[1]?.description ?? "Longueur totale du reseau routier relevee par le SDES.",
        },
        {
            id: "public-chargers-2026",
            title: "Bornes publiques",
            value: webFacts[2]?.value ?? "192 008",
            colorClass: "voiture-color-card--pink",
            description: webFacts[2]?.description ?? "Montre la progression du maillage de recharge accessible au public.",
        },
        {
            id: "car-co2",
            title: "Emission voiture thermique",
            value: webFacts[3]?.value ?? "142 g CO2e / km",
            colorClass: "voiture-color-card--gray",
            description: webFacts[3]?.description ?? "Repere carbone pour une voiture thermique moyenne.",
        },
    ];

    return (
        <div className="voiture-page">
            <section className="voiture-hero">
                <div className="voiture-hero__panel">
                    <p className="voiture-kicker">Donnees voiture</p>
                    <h1>La voiture en France, entre reseau routier massif, mobilite quotidienne et transition</h1>
                    <p className="voiture-hero__text">
                        Cette page combine le fichier routier utilise dans les notebooks du projet avec plusieurs
                        reperes officiels recents pour lire plus clairement la place de la voiture en France.
                    </p>
                </div>
            </section>

            <section className="voiture-shell voiture-copy-center">
                <h2>Le reseau routier francais</h2>
                <p>
                    La voiture reste un mode de deplacement central en France, surtout pour les trajets du quotidien
                    et dans les territoires peu denses. Le reseau routier assure des liaisons fines entre communes,
                    zones d'activite, gares, centres-villes et axes nationaux, ce qui explique son poids dans les
                    mobilites et dans les emissions de transport.
                </p>
            </section>

            {error && (
                <section className="voiture-shell voiture-status-section">
                    <p className="voiture-feedback voiture-feedback--error">{error}</p>
                </section>
            )}

            <section className="voiture-shell voiture-map-section">
                <h2>Carte du reseau routier et du bornage en France</h2>
                <div className="voiture-map-card">
                    <div className="voiture-map-visual">
                        <img src={cartevoitureImage} alt="Carte du reseau routier et du bornage en France" />
                    </div>

                    <div className="voiture-map-layout">
                        <div className="voiture-map-copy">
                            <h3>Comment lire cette carte ?</h3>
                            <p>
                                La visualisation issue du notebook superpose le lineaire routier principal avec les
                                points de bornage. Elle ne montre pas tout le trafic automobile, mais elle aide a
                                comprendre comment les grands axes sont structures et reperes sur le territoire.
                            </p>
                            <ul>
                                <li>les lignes bleues representent les sections de routes du fichier local ;</li>
                                <li>les points rouges correspondent au bornage, c'est-a-dire aux reperes kilometrés ;</li>
                                <li>
                                    ces reperes servent a localiser precisement un troncon, un point d'entretien ou un
                                    evenement sur le reseau.
                                </li>
                            </ul>
                        </div>

                        <div className="voiture-map-side">
                            <h3>Ce que montre le dataset local</h3>

                            {loading && <p className="voiture-feedback">Chargement des donnees...</p>}

                            {!loading && !error && (
                                <div className="voiture-family-list">
                                    {roadFamilies.map((family) => (
                                        <div className="voiture-family-row" key={family.label}>
                                            <span className="voiture-family-row__name">{family.label}</span>
                                            <div className="voiture-family-row__track" aria-hidden>
                                                <div
                                                    className="voiture-family-row__fill"
                                                    style={{ width: family.share }}
                                                />
                                            </div>
                                            <span className="voiture-family-row__share">{family.share}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!loading && !error && (
                                <p className="voiture-map-side__note">
                                    Le fichier utilise dans les notebooks couvre surtout le reseau routier national et
                                    ses raccordements, ce qui explique la forte presence des autoroutes, bretelles et
                                    sections de liaison.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="voiture-shell voiture-key-section">
                <h2>Chiffres cle du dataset local</h2>
                <div className="voiture-color-grid voiture-color-grid--primary">
                    {topKeyCards.map((card) => (
                        <article className={`voiture-color-card ${card.colorClass}`} key={card.id}>
                            <p>{card.title}</p>
                            <strong>{card.value}</strong>
                            <span>{card.description}</span>
                        </article>
                    ))}
                </div>
            </section>

            <section className="voiture-shell voiture-copy-block">
                <h2>Pourquoi la voiture reste si presente ?</h2>
                <p>
                    La voiture garde un avantage de souplesse important. Elle permet de partir quand on veut, d'aller
                    directement d'un point a un autre et de couvrir des trajets que les transports collectifs
                    desservent parfois moins bien, surtout hors des grands centres urbains.
                </p>
            </section>

            <section className="voiture-shell voiture-white-panel">
                <div className="voiture-white-panel__block">
                    <h2>La voiture au quotidien</h2>
                    <p>
                        D'apres le SDES, la voiture reste le premier mode de transport du quotidien et represente 63 %
                        des deplacements. Cela montre a quel point elle structure encore les habitudes de mobilite.
                    </p>
                    <ul>
                        {voitureUsageItems.map((item) => (
                            <li key={item}>{item} ;</li>
                        ))}
                    </ul>
                </div>

                <div className="voiture-white-panel__block">
                    <h2>Le role du reseau routier</h2>
                    <p>
                        Le reseau routier ne sert pas seulement a faire circuler des voitures. Il organise aussi les
                        correspondances avec d'autres modes et soutient une grande partie de l'activite quotidienne.
                    </p>
                    <ul>
                        {roadRoleItems.map((item) => (
                            <li key={item}>{item} ;</li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="voiture-shell voiture-copy-block voiture-copy-block--large">
                <h2>Un mode incontournable, mais plus emetteur</h2>
                <p>
                    La voiture rend de nombreux trajets possibles, mais son impact climatique reste eleve lorsqu'elle
                    est thermique et peu partagee. Le developpement des bornes de recharge, l'electrification des
                    vehicules et le covoiturage sont donc des leviers importants pour reduire l'empreinte des
                    deplacements routiers.
                </p>
            </section>

            <section className="voiture-shell voiture-key-section">
                <h2>Chiffres cle nationaux</h2>
                <div className="voiture-color-grid voiture-color-grid--facts">
                    {bottomKeyCards.map((card) => (
                        <article className={`voiture-color-card ${card.colorClass}`} key={card.id}>
                            <p>{card.title}</p>
                            <strong>{card.value}</strong>
                            <span>{card.description}</span>
                        </article>
                    ))}
                </div>
            </section>

            <section className="voiture-shell voiture-dataset-panel">
                <h2>A propos du dataset utilise</h2>
                <p>
                    Les chiffres locaux de cette page sont calcules a partir du fichier
                    `rrn-2025-metropole-shp.zip` utilise dans les notebooks du projet. Il contient notamment les
                    sections du reseau routier et le bornage associe. Les chiffres nationaux sur le parc automobile,
                    la longueur du reseau routier, les bornes de recharge et l'empreinte carbone proviennent de
                    publications officielles ou de references publiques recentes.
                </p>

                {!loading && !error && overview && (
                    <a
                        className="voiture-source-link"
                        href={overview.dataset.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Voir la source du dataset routier
                    </a>
                )}
            </section>

            {!loading && !error && webFacts.length > 0 && (
                <section className="voiture-shell voiture-sources-panel">
                    <h2>Sources officielles</h2>
                    <div className="voiture-sources-grid">
                        {webFacts.map((fact) => (
                            <article className="voiture-source-card" key={fact.id}>
                                <p className="voiture-source-card__label">{fact.label}</p>
                                <p className="voiture-source-card__text">{fact.description}</p>
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

            <section className="voiture-shell voiture-didyouknow">
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

export default Voiture;
