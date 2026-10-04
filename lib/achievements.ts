import type { LearningDashboard } from "@/lib/learning-dashboard";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
};

type AchievementDashboard = Pick<
  LearningDashboard,
  "completedLessons" | "completedLessonSlugs" | "streak" | "totalXp"
>;

export function getAchievements(
  dashboard: AchievementDashboard,
  additionalDashboards?:
    | (Pick<LearningDashboard, "completedLessons"> & {
        completedLessonSlugs?: string[];
      })
    | Array<
        Pick<LearningDashboard, "completedLessons"> & {
          completedLessonSlugs?: string[];
        }
      >,
): Achievement[] {
  const completed = new Set(dashboard.completedLessonSlugs);
  const extras = Array.isArray(additionalDashboards)
    ? additionalDashboards
    : additionalDashboards
      ? [additionalDashboards]
      : [];
  const allCompletedLessons =
    dashboard.completedLessons +
    extras.reduce((total, world) => total + world.completedLessons, 0);
  const additionalCompleted = new Set(
    extras.flatMap((world) => world.completedLessonSlugs ?? []),
  );

  return [
    {
      id: "first-step",
      title: "First Step",
      description: "Complete your first coding lesson.",
      icon: "🌱",
      unlocked: allCompletedLessons >= 1,
      progress: Math.min(allCompletedLessons, 1),
      target: 1,
    },
    {
      id: "trailblazer",
      title: "Trailblazer",
      description: "Complete three lessons on the Python trail.",
      icon: "🧭",
      unlocked: dashboard.completedLessons >= 3,
      progress: Math.min(dashboard.completedLessons, 3),
      target: 3,
    },
    {
      id: "checkpoint-champ",
      title: "Checkpoint Champ",
      description: "Clear the first Python checkpoint.",
      icon: "⭐",
      unlocked: completed.has("checkpoint-1"),
      progress: completed.has("checkpoint-1") ? 1 : 0,
      target: 1,
    },
    {
      id: "logic-builder",
      title: "Logic Builder",
      description: "Complete the Conditions lesson.",
      icon: "🔀",
      unlocked: completed.has("conditions"),
      progress: completed.has("conditions") ? 1 : 0,
      target: 1,
    },
    {
      id: "loop-rider",
      title: "Loop Rider",
      description: "Complete the Loops lesson.",
      icon: "🔁",
      unlocked: completed.has("loops"),
      progress: completed.has("loops") ? 1 : 0,
      target: 1,
    },
    {
      id: "function-builder",
      title: "Function Builder",
      description: "Complete the Functions lesson.",
      icon: "🛠️",
      unlocked: completed.has("functions"),
      progress: completed.has("functions") ? 1 : 0,
      target: 1,
    },
    {
      id: "python-pioneer",
      title: "Python Pioneer",
      description: "Finish the Python Foundations mini project.",
      icon: "🎓",
      unlocked: completed.has("mini-project"),
      progress: completed.has("mini-project") ? 1 : 0,
      target: 1,
    },
    {
      id: "web-builder",
      title: "Web Builder",
      description: "Finish the Web Foundations mini project.",
      icon: "🌐",
      unlocked: additionalCompleted.has("web-mini-project"),
      progress: additionalCompleted.has("web-mini-project") ? 1 : 0,
      target: 1,
    },
    {
      id: "logic-lab-graduate",
      title: "Logic Lab Graduate",
      description: "Finish the JavaScript Foundations score-tracker project.",
      icon: "⚡",
      unlocked: additionalCompleted.has("js-mini-project"),
      progress: additionalCompleted.has("js-mini-project") ? 1 : 0,
      target: 1,
    },
    {
      id: "streak-spark",
      title: "Streak Spark",
      description: "Keep a three-day coding streak.",
      icon: "🔥",
      unlocked: dashboard.streak >= 3,
      progress: Math.min(dashboard.streak, 3),
      target: 3,
    },
    {
      id: "xp-hunter",
      title: "XP Hunter",
      description: "Earn 250 total XP.",
      icon: "💫",
      unlocked: dashboard.totalXp >= 250,
      progress: Math.min(dashboard.totalXp, 250),
      target: 250,
    },
  ];
}
