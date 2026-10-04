import Link from "next/link";

type LearningWorld = "python" | "web" | "javascript";

const worlds: Array<{
  id: LearningWorld;
  href: string;
  icon: string;
  title: string;
  subtitle: string;
}> = [
  {
    id: "python",
    href: "/learn",
    icon: "🐍",
    title: "Python Foundations",
    subtitle: "Beginner Meadow",
  },
  {
    id: "web",
    href: "/learn/web",
    icon: "🌐",
    title: "Web Foundations",
    subtitle: "Pixel Garden",
  },
  {
    id: "javascript",
    href: "/learn/javascript",
    icon: "⚡",
    title: "JavaScript Foundations",
    subtitle: "Logic Lab",
  },
];

export function WorldSwitcher({ active }: { active: LearningWorld }) {
  return (
    <nav className="world-switcher" aria-label="Learning worlds">
      {worlds.map((world) => (
        <Link
          className={`world-switcher-link ${world.id === active ? "is-active" : ""}`}
          href={world.href}
          key={world.id}
          aria-current={world.id === active ? "page" : undefined}
        >
          <span aria-hidden="true">{world.icon}</span>
          <span>
            <strong>{world.title}</strong>
            <small>{world.subtitle}</small>
          </span>
        </Link>
      ))}
    </nav>
  );
}
