export default function Loading() {
  return (
    <main className="app-loading" aria-live="polite" aria-busy="true">
      <div className="loading-brand" aria-hidden="true">
        <span className="brand-mark">&lt;/&gt;</span>
        <strong>CodeTrail</strong>
      </div>

      <section className="loading-card">
        <div className="loading-spinner" aria-hidden="true" />
        <strong>Loading your trail…</strong>
        <span>Getting your progress ready.</span>
      </section>
    </main>
  );
}
