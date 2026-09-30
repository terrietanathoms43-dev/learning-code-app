import Link from "next/link";

export function TopNav() {
  return (
    <header className="topbar">
      <Link className="brand" href="/">
        <span className="brand-mark" aria-hidden="true">&lt;/&gt;</span>
        <span>CodeTrail</span>
      </Link>

      <nav className="topnav-links" aria-label="Main navigation">
        <Link href="/learn">Learn</Link>
        <Link href="/learn#practice">Practice</Link>
        <Link href="/learn#progress">Progress</Link>
      </nav>

      <div className="top-stats" aria-label="Learning stats">
        <span className="stat-chip">🔥 <strong>1</strong></span>
        <span className="stat-chip">⚡ <strong>5/5</strong></span>
        <span className="stat-chip">⭐ <strong>20 XP</strong></span>
      </div>
    </header>
  );
}
