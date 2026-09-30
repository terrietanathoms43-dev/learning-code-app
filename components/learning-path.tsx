import Link from "next/link";
import type { PathNode } from "@/lib/course-data";

const xPositions = [50, 31, 68, 38, 64, 34, 69, 43, 61];

export function LearningPath({ nodes }: { nodes: PathNode[] }) {
  const step = 154;
  const topPadding = 74;
  const height = topPadding * 2 + Math.max(nodes.length - 1, 0) * step;
  const points = nodes.map((_, index) => {
    const x = xPositions[index % xPositions.length];
    const y = topPadding + index * step;
    return `${x},${y}`;
  });
  const currentIndex = nodes.findIndex((node) => node.status === "current");
  const lastCompletedIndex = nodes.reduce(
    (lastIndex, node, index) => (node.status === "completed" ? index : lastIndex),
    -1,
  );
  const progressIndex = currentIndex >= 0 ? currentIndex : lastCompletedIndex;
  const completedPoints =
    progressIndex >= 0 ? points.slice(0, progressIndex + 1).join(" ") : "";

  return (
    <div className="path-canvas" style={{ height }}>
      <div className="path-scenery path-scenery-one" aria-hidden="true">☁️</div>
      <div className="path-scenery path-scenery-two" aria-hidden="true">🌲</div>
      <div className="path-scenery path-scenery-three" aria-hidden="true">🌼</div>

      <svg
        className="trail-svg"
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polyline className="trail-base" points={points.join(" ")} />
        {completedPoints && <polyline className="trail-progress" points={completedPoints} />}
      </svg>

      {nodes.map((node, index) => {
        const left = xPositions[index % xPositions.length];
        const top = topPadding + index * step;
        const nodeClass = `path-node path-node--${node.status} path-node--${node.kind}`;

        const content = (
          <>
            <span className="path-node-orbit" aria-hidden="true" />
            <span className="path-node-face" aria-hidden="true">{node.icon}</span>
            <span className="path-node-copy">
              <strong>{node.title}</strong>
              <small>{node.subtitle}</small>
              <em>{node.xp} XP</em>
            </span>
          </>
        );

        return (
          <div
            className="path-node-wrap"
            key={node.slug}
            style={{ left: `${left}%`, top }}
          >
            {node.status === "locked" ? (
              <div className={nodeClass} aria-label={`${node.title}, locked`}>
                {content}
                <span className="lock-badge" aria-hidden="true">🔒</span>
              </div>
            ) : (
              <Link
                className={nodeClass}
                href={`/lesson/${node.slug}`}
                aria-label={`${node.title}, ${node.status}`}
              >
                {content}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
