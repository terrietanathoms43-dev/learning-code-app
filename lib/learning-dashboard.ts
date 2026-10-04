import {
  pythonLessonSlugs,
  pythonPath,
  webLessonSlugs,
  webPath,
  type PathNode,
} from "@/lib/course-data";
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

type WorldDefinition = {
  path: PathNode[];
  lessonSlugs: string[];
};

type DashboardContext = {
  signedIn: boolean;
  snapshot: DashboardSnapshot | null;
};

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

type DashboardLoadOptions = {
  supabase?: ServerSupabaseClient;
  userId?: string | null;
};

const pythonWorld: WorldDefinition = {
  path: pythonPath,
  lessonSlugs: pythonLessonSlugs,
};

const webWorld: WorldDefinition = {
  path: webPath,
  lessonSlugs: webLessonSlugs,
};

function buildNodes(
  path: PathNode[],
  completedSlugs: Set<string>,
  availableSlugs: Set<string>,
) {
  let currentAssigned = false;

  return path.map((node) => {
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

function emptyDashboard(
  world: WorldDefinition,
  signedIn = false,
): LearningDashboard {
  const firstLesson = world.lessonSlugs[0];
  const available = new Set<string>(firstLesson ? [firstLesson] : []);

  return {
    signedIn,
    displayName: "Coder",
    username: null,
    nodes: buildNodes(world.path, new Set<string>(), available),
    totalXp: 0,
    todayXp: 0,
    streak: 0,
    dailyGoalXp: 50,
    completedLessons: 0,
    totalLessons: world.lessonSlugs.length,
    progressPercent: 0,
    completedLessonSlugs: [],
    recentEvents: [],
    timeZone: "UTC",
  };
}

async function loadDashboardContext(
  options: DashboardLoadOptions = {},
): Promise<DashboardContext> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return { signedIn: false, snapshot: null };
  }

  let signedIn = false;

  try {
    const supabase = options.supabase ?? (await createClient());
    let userId: string | null;

    if ("userId" in options) {
      userId = options.userId ?? null;
    } else {
      const { data: claimsData, error: claimsError } =
        await supabase.auth.getClaims();
      userId =
        !claimsError &&
        claimsData?.claims &&
        typeof claimsData.claims.sub === "string"
          ? claimsData.claims.sub
          : null;
    }

    if (!userId) return { signedIn: false, snapshot: null };
    signedIn = true;

    const { data, error } = await supabase.rpc("get_learning_dashboard_snapshot");

    if (error || !data || typeof data !== "object") {
      console.error("[dashboard_snapshot]", {
        code: error?.code ?? null,
        message: error?.message?.slice(0, 180) ?? "empty snapshot",
      });
      return { signedIn: true, snapshot: null };
    }

    return { signedIn: true, snapshot: data as DashboardSnapshot };
  } catch (error) {
    console.error("[dashboard_snapshot]", {
      message: error instanceof Error ? error.message.slice(0, 180) : "unknown error",
    });
    return { signedIn, snapshot: null };
  }
}

function buildWorldDashboard(
  world: WorldDefinition,
  context: DashboardContext,
): LearningDashboard {
  if (!context.snapshot) {
    return emptyDashboard(world, context.signedIn);
  }

  const worldSet = new Set(world.lessonSlugs);
  const snapshot = context.snapshot;
  const profile = snapshot.profile ?? null;
  const stats = snapshot.stats ?? null;
  const publishedLessons = Array.isArray(snapshot.published_lessons)
    ? snapshot.published_lessons
    : [];
  const progressRows = Array.isArray(snapshot.progress) ? snapshot.progress : [];
  const recentRows = Array.isArray(snapshot.recent_events) ? snapshot.recent_events : [];

  const publishedWorldSlugs = publishedLessons
    .map((lesson) => lesson.slug)
    .filter((slug): slug is string => Boolean(slug && worldSet.has(slug)));

  const availableSlugs = new Set<string>(
    publishedWorldSlugs.length ? publishedWorldSlugs : world.lessonSlugs,
  );

  const completedSlugs = new Set<string>();
  for (const row of progressRows) {
    if (row.status !== "completed" || !row.slug) continue;
    if (worldSet.has(row.slug)) completedSlugs.add(row.slug);
  }

  const nodes = buildNodes(world.path, completedSlugs, availableSlugs);
  const totalLessons = availableSlugs.size;
  const completedLessons = world.lessonSlugs.filter(
    (slug) => availableSlugs.has(slug) && completedSlugs.has(slug),
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
    completedLessonSlugs: world.lessonSlugs.filter((slug) =>
      completedSlugs.has(slug),
    ),
    timeZone,
    recentEvents: recentRows.map((event) => ({
      amount: Number(event.amount || 0),
      createdAt: event.created_at || new Date(0).toISOString(),
      lessonSlug: event.slug || null,
      lessonTitle: event.title || "Coding activity",
    })),
  };
}

export async function getLearningDashboard(
  options: DashboardLoadOptions = {},
) {
  const context = await loadDashboardContext(options);
  return buildWorldDashboard(pythonWorld, context);
}

export async function getWebLearningDashboard(
  options: DashboardLoadOptions = {},
) {
  const context = await loadDashboardContext(options);
  return buildWorldDashboard(webWorld, context);
}

export async function getLearningDashboards(
  options: DashboardLoadOptions = {},
) {
  const context = await loadDashboardContext(options);

  return {
    python: buildWorldDashboard(pythonWorld, context),
    web: buildWorldDashboard(webWorld, context),
  };
}
