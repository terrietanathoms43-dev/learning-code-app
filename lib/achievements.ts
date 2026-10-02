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

export function getAchievements(
  dashboard: Pick<
    LearningDashboard,
    "completedLessons" | "completedLessonSlugs" | "streak" | "totalXp"
  >,
): Achievement[] {
  const completed = new Set(dashboard.completedLessonSlugs);

  return [
    {
      id: "first-step",
      title: "First Step",
      description: "Complete your first coding lesson.",
      icon: "🌱",
      unlocked: dashboard.completedLessons >= 1,
      progress: Math.min(dashboard.completedLessons, 1),
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
