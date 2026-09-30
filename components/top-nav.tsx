import Link from "next/link";

type TopNavProps = {
  stats?: {
    streak: number;
    totalXp: number;
  };
};

export function TopNav({ stats }: TopNavProps) {
  return (
    <header className="topbar">
      <Link className="brand" href="/">
        <span className="brand-mark" aria-hidden="true">&lt;/&gt;</span>
        <span>CodeTrail</span>
      </Link>

      <nav className="topnav-links" aria-label="Main navigation">
        <Link href="/learn">Learn</Link>
        <Link href="/practice">Practice</Link>
        <Link href="/progress">Progress</Link>
      </nav>

      <div className="top-stats" aria-label="Learning stats">
        <span className="stat-chip">🔥 <strong>{stats?.streak ?? 0}</strong></span>
        <span className="stat-chip">⚡ <strong>5/5</strong></span>
        <span className="stat-chip">⭐ <strong>{stats?.totalXp ?? 0} XP</strong></span>
      </div>
    </header>
  );
}
