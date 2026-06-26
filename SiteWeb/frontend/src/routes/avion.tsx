import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import carteavionImage from "../img/carteavion.png";
import "./avion.css";

gsap.registerPlugin(ScrollTrigger);

type DatasetStat = {
    id: string;
    label: string;
    value: string;
    description: string;
    badge?: string;
};

type TypeStat = {
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

type AvionOverview = {
    dataset: {
        name: string;
        sourceUrl: string;
        stats: DatasetStat[];
        types: TypeStat[];
    };
    webFacts: WebFact[];
};

const typeDescriptions = [
    "Grand aeroport : grandes plateformes nationales et internationales, souvent connectees aux principaux hubs europeens et long-courriers.",
    "Aeroport regional : plateformes intermediaires qui structurent les liaisons interregionales, touristiques ou transfrontalieres.",
    "Petit aeroport : terrains de proximite, aerodromes ou petites plateformes utiles a l'aviation locale, d'affaires ou de formation.",
    "Heliport : infrastructures dediees aux helicopteres, souvent concentrees dans les zones denses, littorales ou hospitalieres.",
];

const didYouKnowFacts = [
    "Le transport aerien francais repose sur un reseau tres diversifie de grandes plateformes, d'aeroports regionaux et d'heliports.",
    "Les hubs parisiens concentrent une part majeure du trafic passagers, mais les aeroports regionaux structurent aussi les mobilites touristiques et economiques.",
    "Le trafic interieur metropolitain reste plus fragile que l'international dans les dernieres notes de la DGAC.",
    "L'avion moyen-courrier reste l'un des modes les plus emetteurs de CO2e par passager-km parmi les transports interurbains.",
];

const roleItems = [
    "vols domestiques, europeens et intercontinentaux",
    "fret aerien et logistique rapide",
    "connexions avec train, bus, tramway et voiture de location",
    "gestion des controles, de la maintenance et des operations au sol",
    "liaisons strategiques pour les territoires insulaires et ultramarins",
];

const Avion = () => {
    const [overview, setOverview] = useState<AvionOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadOverview = async () => {
            try {
                const response = await fetch("/api/avion/overview");
                const data = await response.json().catch(() => null);

                if (!response.ok) {
                    throw new Error(data?.message || data?.error || "Impossible de charger les donnees avion.");
                }

                setOverview(data as AvionOverview);
            } catch (err) {
                const message = err instanceof Error ? err.message : "Impossible de charger les donnees avion.";
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        loadOverview();
    }, []);

    useEffect(() => {
        const animation = gsap.context(() => {
            gsap.from(".avion-color-grid--primary .avion-color-card", {
                scrollTrigger: {
                    trigger: ".avion-color-grid--primary",
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

            gsap.from(".avion-color-grid--facts .avion-color-card", {
                scrollTrigger: {
                    trigger: ".avion-color-grid--facts",
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
    const typeStats = overview?.dataset.types ?? [];
    const webFacts = overview?.webFacts ?? [];

    const statById = (id: string) => datasetStats.find((stat) => stat.id === id);

    const topKeyCards = [
        {
            id: "platforms",
            title: "Plateformes recensees",
            value: statById("platforms")?.value ?? "...",
            colorClass: "avion-color-card--red",
            description: statById("platforms")?.description ?? "Ensemble des aeroports, heliports et autres plateformes du fichier local.",
        },
        {
            id: "municipalities",
            title: "Communes avec plateforme",
            value: statById("municipalities")?.value ?? "...",
            colorClass: "avion-color-card--blue",
            description: statById("municipalities")?.description ?? "Mesure la diffusion territoriale du reseau aerien dans le pays.",
        },
        {
            id: "scheduled",
            title: "Service regulier",
            value: statById("scheduled-service")?.value ?? "...",
            colorClass: "avion-color-card--gold",
            description: statById("scheduled-service")?.description ?? "Met en avant les plateformes identifiees avec desserte commerciale reguliere.",
        },
    ];

    const bottomKeyCards = [
        {
            id: "france-t1-2026",
            title: "Trafic France T1 2026",
            value: webFacts[0]?.value ?? "37,3 M",
            colorClass: "avion-color-card--orange",
            description: webFacts[0]?.description ?? "Volume de passagers a l'arrivee et au depart de France sur le trimestre.",
        },
        {
            id: "winter-seats",
            title: "Sieges hiver 2025-2026",
            value: webFacts[1]?.value ?? "37,6 M",
            colorClass: "avion-color-card--green",
            description: webFacts[1]?.description ?? "Indique le niveau d'offre commerciale programmee au depart de la metropole.",
        },
        {
            id: "paris-airports-2025",
            title: "Paris Aeroport en 2025",
            value: webFacts[2]?.value ?? "107 M",
            colorClass: "avion-color-card--pink",
            description: webFacts[2]?.description ?? "Montre le poids des hubs parisiens dans le trafic national.",
        },
        {
            id: "avion-co2",
            title: "Emission avion moyen",
            value: webFacts[3]?.value ?? "185 g CO2e / km",
            colorClass: "avion-color-card--gray",
            description: webFacts[3]?.description ?? "Repere carbone par personne pour un trajet moyen-courrier.",
        },
    ];

    return (
        <div className="avion-page">
            <section className="avion-hero">
                <div className="avion-hero__panel">
                    <p className="avion-kicker">Donnees avion</p>
                    <h1>L&apos;avion en France, entre hubs majeurs, aeroports regionaux et connectivite internationale</h1>
                    <p className="avion-hero__text">
                        Cette page combine le dataset local du projet sur les plateformes aeriennes francaises
                        avec quelques reperes officiels pour donner une lecture simple du reseau aeroportuaire.
                    </p>
                </div>
            </section>

            <section className="avion-shell avion-copy-center">
                <h2>Le reseau aeroportuaire francais</h2>
                <p>
                    Le transport aerien francais repose sur un ensemble de grands hubs internationaux, d&apos;aeroports
                    regionaux et de plateformes plus petites. Ce maillage permet de relier les metropoles francaises
                    a l&apos;Europe, aux liaisons long-courriers et aux territoires ultramarins, tout en soutenant le
                    tourisme, les deplacements professionnels et le fret.
                </p>
            </section>

            {error && (
                <section className="avion-shell avion-status-section">
                    <p className="avion-feedback avion-feedback--error">{error}</p>
                </section>
            )}

            <section className="avion-shell avion-map-section">
                <h2>Carte des plateformes aeriennes en France</h2>
                <div className="avion-map-card">
                    <div className="avion-map-visual">
                        <img src={carteavionImage} alt="Carte des plateformes aeriennes en France colorees par type" />
                    </div>

                    <div className="avion-map-content">
                        <h3>Repartition des types visibles sur la carte</h3>

                        {loading && <p className="avion-feedback">Chargement des donnees...</p>}

                        {!loading && !error && (
                            <div className="avion-segments">
                                {typeStats.map((segment) => (
                                    <div className="avion-segment-row" key={segment.label}>
                                        <span className="avion-segment-row__name">{segment.label}</span>
                                        <div className="avion-segment-row__track" aria-hidden>
                                            <div
                                                className="avion-segment-row__fill"
                                                style={{ width: segment.share }}
                                            />
                                        </div>
                                        <span className="avion-segment-row__share">{segment.share}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="avion-segment-copy">
                            <h3>A quoi correspondent les differents types ?</h3>
                            <p>
                                La carte issue du notebook colore les plateformes selon leur type dominant dans le dataset.
                            </p>
                            <ul>
                                {typeDescriptions.map((segment) => (
                                    <li key={segment}>{segment}</li>
                                ))}
                            </ul>
                            <p>
                                Cette lecture montre un reseau tres etendu de petites plateformes, complete par un
                                nombre reduit de grands hubs qui concentrent l&apos;essentiel du trafic commercial.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="avion-shell avion-key-section">
                <h2>Chiffres cle</h2>
                <div className="avion-color-grid avion-color-grid--primary">
                    {topKeyCards.map((card) => (
                        <article className={`avion-color-card ${card.colorClass}`} key={card.id}>
                            <p>{card.title}</p>
                            <strong>{card.value}</strong>
                            <span>{card.description}</span>
                        </article>
                    ))}
                </div>
            </section>

            <section className="avion-shell avion-copy-block">
                <h2>Pourquoi autant de petites plateformes ?</h2>
                <p>
                    Le reseau francais ne se limite pas aux aeroports internationaux. Il comprend aussi de nombreux
                    petits aerodromes, heliports et plateformes locales utiles a la formation, a l&apos;aviation d&apos;affaires,
                    aux secours, aux liaisons insulaires ou a certaines activites saisonnieres.
                </p>
            </section>

            <section className="avion-shell avion-white-panel">
                <div className="avion-white-panel__block">
                    <h2>L&apos;avion au quotidien</h2>
                    <p>
                        Le trafic reste important en France, meme si sa dynamique varie selon les liaisons. Les dernieres
                        notes de la DGAC montrent un trafic toujours soutenu sur l&apos;international, tandis que le trafic
                        interieur metropolitain demeure plus en retrait qu&apos;avant la crise sanitaire.
                    </p>
                    <ul>
                        <li>les hubs parisiens structurent une grande partie des correspondances ;</li>
                        <li>les aeroports regionaux relient tourisme, affaires et bassins economiques ;</li>
                        <li>les plateformes plus petites assurent des usages de proximite ou specialises.</li>
                    </ul>
                </div>

                <div className="avion-white-panel__block">
                    <h2>Le role des aeroports</h2>
                    <p>
                        Un aeroport n&apos;est pas seulement une piste. C&apos;est une infrastructure complexe qui combine
                        accueil des passagers, surete, logistique, maintenance et connexions avec d&apos;autres modes.
                    </p>
                    <ul>
                        {roleItems.map((item) => (
                            <li key={item}>{item} ;</li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="avion-shell avion-copy-block avion-copy-block--large">
                <h2>Un mode de transport rapide, mais tres emissif</h2>
                <p>
                    L&apos;avion reste un levier fort de connectivite, surtout pour les longues distances, les liaisons
                    internationales ou certains territoires eloignes. En contrepartie, son impact climatique par
                    passager-kilometre est nettement plus eleve que celui du train, en particulier sur les trajets
                    courts et moyens ou les alternatives ferroviaires existent.
                </p>
            </section>

            <section className="avion-shell avion-key-section">
                <h2>Chiffres cle</h2>
                <div className="avion-color-grid avion-color-grid--facts">
                    {bottomKeyCards.map((card) => (
                        <article className={`avion-color-card ${card.colorClass}`} key={card.id}>
                            <p>{card.title}</p>
                            <strong>{card.value}</strong>
                            <span>{card.description}</span>
                        </article>
                    ))}
                </div>
            </section>

            <section className="avion-shell avion-dataset-panel">
                <h2>A propos du dataset utilise</h2>
                <p>
                    Les statistiques locales de cette page proviennent du fichier `fr-airports.csv` present dans les
                    notebooks du projet. Les indicateurs affiches ici, comme le nombre de plateformes, les communes
                    concernees, la presence d&apos;un service regulier ou la repartition par types, sont calcules a partir
                    de ce jeu de donnees. Les chiffres de trafic, d&apos;offre en sieges et d&apos;emissions proviennent quant
                    a eux de sources officielles recentes.
                </p>

                {!loading && !error && overview && (
                    <a
                        className="avion-source-link"
                        href={overview.dataset.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Voir la source du dataset
                    </a>
                )}
            </section>

            {!loading && !error && webFacts.length > 0 && (
                <section className="avion-shell avion-sources-panel">
                    <h2>Sources officielles</h2>
                    <div className="avion-sources-grid">
                        {webFacts.map((fact) => (
                            <article className="avion-source-card" key={fact.id}>
                                <p className="avion-source-card__label">{fact.label}</p>
                                <p className="avion-source-card__text">{fact.description}</p>
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

            <section className="avion-shell avion-didyouknow">
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

export default Avion;
