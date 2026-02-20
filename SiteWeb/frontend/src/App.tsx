import { useEffect, useState } from "react";

type Health = {
  status: string;
};

export default function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Backend n'est pas connecté !!");
        }
        return res.json();
      })
      .then((data: Health) => setHealth(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main className="page">
      <h1>TrainFilRouge</h1>
      <p>React + TypeScript + Flask</p>
      <section className="card">
        <h2>API health</h2>
        {error && <p className="error">Error: {error}</p>}
        {!error && !health && <p>Loading...</p>}
        {health && <pre>{JSON.stringify(health, null, 2)}</pre>}
      </section>
    </main>
  );
}
