import Link from "next/link";

export default function NotFound() {
  return (
    <main className="simple-state">
      <div className="simple-state-icon" aria-hidden="true">🧭</div>
      <p className="eyebrow">Wrong turn</p>
      <h1>That page isn&apos;t on the trail.</h1>
      <p>The link may be outdated, or the page may have moved.</p>
      <Link className="primary-button" href="/learn">
        Return to the coding trail
      </Link>
    </main>
  );
}
