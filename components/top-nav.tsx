import Link from "next/link";
import { TimezoneSync } from "@/components/timezone-sync";

type TopNavProps = {
  stats?: {
    streak: number;
    totalXp: number;
    signedIn?: boolean;
    timeZone?: string;
  };
};

export function TopNav({ stats }: TopNavProps) {
  return (
    <>
      <TimezoneSync
        enabled={Boolean(stats?.signedIn)}
        currentTimeZone={stats?.timeZone ?? "UTC"}
      />
      <header className="topbar">
      <Link className="brand" href="/">
        <span className="brand-mark" aria-hidden="true">&lt;/&gt;</span>
        <span>CodeTrail</span>
      </Link>

      <nav className="topnav-links" aria-label="Main navigation">
        <Link href="/learn">Learn</Link>
        <Link href="/practice">Practice</Link>
        <Link href="/progress">Progress</Link>
        {stats?.signedIn ? <Link href="/profile">Profile</Link> : <Link href="/login">Sign in</Link>}
      </nav>

      <div className="top-stats" aria-label="Learning stats">
        <Link className="profile-chip" href={stats?.signedIn ? "/profile" : "/login"}>
          {stats?.signedIn ? "👤" : "Sign in"}
        </Link>
        <span className="stat-chip">🔥 <strong>{stats?.streak ?? 0}</strong></span>
        <span className="stat-chip">⚡ <strong>5/5</strong></span>
        <span className="stat-chip">⭐ <strong>{stats?.totalXp ?? 0} XP</strong></span>
      </div>
      </header>
    </>
  );
}
