import { useEffect, useState } from "react";
import "./train.css";

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
                    throw new Error(data?.error || "Impossible de charger les donnees train.");
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

    return (
        <div className="train-page">
            <section className="train-hero">
                <div className="train-hero__content">
                    <p className="train-kicker">Donnees train</p>
                    <h1>Le train en France, entre maillage local et trafic massif</h1>
                    <p className="train-hero__text">
                        Cette page melange le dataset local du projet avec quelques reperes officiels SNCF pour
                        donner une lecture simple du reseau ferroviaire.
                    </p>
                </div>
            </section>

            <section className="train-intro train-shell">
                <div className="train-panel">
                    <h2>Ce que montre la page</h2>
                    <p>
                        Les cartes ci-dessous recuperent d&apos;abord les informations du dataset local
                        <strong> gares-de-voyageurs.csv</strong>, puis ajoutent des chiffres trouves sur des sources
                        officielles SNCF.
                    </p>
                    <p>
                        Quand une information vient du web, un petit bouton <strong>i</strong> permet d&apos;ouvrir les
                        liens sources.
                    </p>
                </div>
            </section>

            <section className="train-shell train-section">
                <div className="train-section__head">
                    <div>
                        <p className="train-section__eyebrow">Dataset local</p>
                        <h2>Le reseau present dans le projet</h2>
                    </div>
                    {overview?.dataset && (
                        <a
                            className="train-source-link"
                            href={overview.dataset.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Source du dataset
                        </a>
                    )}
                </div>

                {loading && <p className="train-feedback">Chargement des donnees...</p>}
                {error && <p className="train-feedback train-feedback--error">{error}</p>}

                {!loading && !error && overview && (
                    <>
                        <div className="train-grid">
                            {overview.dataset.stats.map((stat) => (
                                <article className="train-stat-card" key={stat.id}>
                                    <div className="train-stat-card__top">
                                        <p className="train-stat-card__label">{stat.label}</p>
                                        {stat.badge && <span className="train-badge">{stat.badge}</span>}
                                    </div>
                                    <p className="train-stat-card__value">{stat.value}</p>
                                    <p className="train-stat-card__text">{stat.description}</p>
                                </article>
                            ))}
                        </div>

                        <div className="train-panel train-panel--segments">
                            <div className="train-section__head">
                                <div>
                                    <p className="train-section__eyebrow">Lecture rapide</p>
                                    <h3>Repartition des segments SNCF</h3>
                                </div>
                                <span className="train-panel__meta">{overview.dataset.name}</span>
                            </div>

                            <div>
                                ff
                            </div>

                            <div className="train-segments">
                                {overview.dataset.segments.map((segment) => (
                                    <div className="train-segment-row" key={segment.label}>
                                        <div className="train-segment-row__labels">
                                            <span>{segment.label}</span>
                                            <span>{segment.formattedCount}</span>
                                        </div>
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
                        </div>
                    </>
                )}
            </section>

            <section className="train-shell train-section">
                <div className="train-section__head">
                    <div>
                        <p className="train-section__eyebrow">Infos web</p>
                        <h2>Quelques chiffres officiels a remettre en contexte</h2>
                    </div>
                </div>

                {!loading && !error && overview && (
                    <div className="train-grid">
                        {overview.webFacts.map((fact) => (
                            <article className="train-fact-card" key={fact.id}>
                                <div className="train-fact-card__top">
                                    <p className="train-stat-card__label">{fact.label}</p>
                                    <details className="train-info">
                                        <summary aria-label={`Voir les sources pour ${fact.label}`}>i</summary>
                                        <div className="train-info__popover">
                                            <p>Sources</p>
                                            {fact.sources.map((source) => (
                                                <a
                                                    key={source.url}
                                                    href={source.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {source.label}
                                                </a>
                                            ))}
                                        </div>
                                    </details>
                                </div>
                                <p className="train-stat-card__value">{fact.value}</p>
                                <p className="train-stat-card__text">{fact.description}</p>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Train;
