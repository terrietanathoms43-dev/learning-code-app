import Link from "next/link";

export default function NotFound() {
  return (
    <main className="simple-state">
      <div className="simple-state-icon" aria-hidden="true">🧭</div>
      <p className="eyebrow">Wrong turn</p>
      <h1>That lesson is not on the trail yet.</h1>
      <p>Head back to the Python path and choose an unlocked node.</p>
      <Link className="primary-button" href="/learn">Return to trail</Link>
    </main>
  );
}
