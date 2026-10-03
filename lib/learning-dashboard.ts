import { implementedLessonSlugs, pythonPath, type PathNode } from "@/lib/course-data";
import { createClient } from "@/lib/supabase/server";

export type DashboardEvent = {
  amount: number;
  createdAt: string;
  lessonSlug: string | null;
  lessonTitle: string;
};

export type LearningDashboard = {
  signedIn: boolean;
  displayName: string;
  username: string | null;
  nodes: PathNode[];
  totalXp: number;
  todayXp: number;
  streak: number;
  dailyGoalXp: number;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  completedLessonSlugs: string[];
  recentEvents: DashboardEvent[];
  timeZone: string;
};

type DashboardSnapshot = {
  profile?: {
    display_name?: string | null;
    username?: string | null;
    daily_goal_xp?: number | null;
    time_zone?: string | null;
  } | null;
  stats?: {
    total_xp?: number | string | null;
    today_xp?: number | string | null;
    streak?: number | string | null;
  } | null;
  published_lessons?: Array<{
    id?: string;
    slug?: string;
    title?: string;
    sort_order?: number;
  }> | null;
  progress?: Array<{
    lesson_id?: string;
    status?: string;
    completed_at?: string | null;
    slug?: string;
    title?: string;
  }> | null;
  recent_events?: Array<{
    amount?: number | string;
    created_at?: string;
    lesson_id?: string | null;
    slug?: string | null;
    title?: string | null;
  }> | null;
};

const implementedSet = new Set(implementedLessonSlugs);

function buildNodes(completedSlugs: Set<string>, availableSlugs: Set<string>) {
  let currentAssigned = false;

  return pythonPath.map((node) => {
    let status: PathNode["status"] = "locked";

    if (completedSlugs.has(node.slug)) {
      status = "completed";
    } else if (availableSlugs.has(node.slug) && !currentAssigned) {
      status = "current";
      currentAssigned = true;
    }

    return { ...node, status };
  });
}

function guestDashboard(): LearningDashboard {
  const available = new Set<string>([implementedLessonSlugs[0]]);
  return {
    signedIn: false,
    displayName: "Coder",
    username: null,
    nodes: buildNodes(new Set<string>(), available),
    totalXp: 0,
    todayXp: 0,
    streak: 0,
    dailyGoalXp: 50,
    completedLessons: 0,
    totalLessons: implementedLessonSlugs.length,
    progressPercent: 0,
    completedLessonSlugs: [],
    recentEvents: [],
    timeZone: "UTC",
  };
}

export async function getLearningDashboard(): Promise<LearningDashboard> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return guestDashboard();
  }

  try {
    const supabase = await createClient();
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
    const userId =
      !claimsError && claimsData?.claims && typeof claimsData.claims.sub === "string"
        ? claimsData.claims.sub
        : null;

    if (!userId) return guestDashboard();

    const { data, error } = await supabase.rpc("get_learning_dashboard_snapshot");

    if (error || !data || typeof data !== "object") {
      console.error("[dashboard_snapshot]", {
        code: error?.code ?? null,
        message: error?.message?.slice(0, 180) ?? "empty snapshot",
      });
      return guestDashboard();
    }

    const snapshot = data as DashboardSnapshot;
    const profile = snapshot.profile ?? null;
    const stats = snapshot.stats ?? null;
    const publishedLessons = Array.isArray(snapshot.published_lessons)
      ? snapshot.published_lessons
      : [];
    const progressRows = Array.isArray(snapshot.progress) ? snapshot.progress : [];
    const recentRows = Array.isArray(snapshot.recent_events) ? snapshot.recent_events : [];

    const publishedImplemented = publishedLessons
      .map((lesson) => lesson.slug)
      .filter((slug): slug is string => Boolean(slug && implementedSet.has(slug)));

    const availableSlugs = new Set<string>(
      publishedImplemented.length ? publishedImplemented : implementedLessonSlugs,
    );

    const completedSlugs = new Set<string>();
    for (const row of progressRows) {
      if (row.status !== "completed" || !row.slug) continue;
      if (implementedSet.has(row.slug)) completedSlugs.add(row.slug);
    }

    const nodes = buildNodes(completedSlugs, availableSlugs);
    const totalLessons = availableSlugs.size;
    const completedLessons = [...completedSlugs].filter((slug) =>
      availableSlugs.has(slug),
    ).length;
    const totalXp = Number(stats?.total_xp || 0);
    const todayXp = Number(stats?.today_xp || 0);
    const streak = Number(stats?.streak || 0);
    const dailyGoalXp = Number(profile?.daily_goal_xp || 50);
    const timeZone = profile?.time_zone || "UTC";

    return {
      signedIn: true,
      displayName: profile?.display_name || "Coder",
      username: profile?.username || null,
      nodes,
      totalXp,
      todayXp,
      streak,
      dailyGoalXp,
      completedLessons,
      totalLessons,
      progressPercent:
        totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      completedLessonSlugs: [...completedSlugs],
      timeZone,
      recentEvents: recentRows.map((event) => ({
        amount: Number(event.amount || 0),
        createdAt: event.created_at || new Date(0).toISOString(),
        lessonSlug: event.slug || null,
        lessonTitle: event.title || "Coding activity",
      })),
    };
  } catch (error) {
    console.error("[dashboard_snapshot]", {
      message: error instanceof Error ? error.message.slice(0, 180) : "unknown error",
    });
    return guestDashboard();
  }
}
