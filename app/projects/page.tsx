import { redirect } from "next/navigation";
import { ProjectWorkspace, type SavedProject } from "@/components/project-workspace";
import { TopNav } from "@/components/top-nav";
import { getLearningDashboard } from "@/lib/learning-dashboard";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId =
    !claimsError && claimsData?.claims && typeof claimsData.claims.sub === "string"
      ? claimsData.claims.sub
      : null;

  if (!userId) redirect("/login?next=/projects");

  const [dashboard, projectsResult] = await Promise.all([
    getLearningDashboard(),
    supabase
      .from("coding_projects")
      .select("id, title, language, code, created_at, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(50),
  ]);

  const projects = (projectsResult.data ?? []) as SavedProject[];

  return (
    <div className="site-shell projects-page">
      <TopNav
        stats={{
          streak: dashboard.streak,
          totalXp: dashboard.totalXp,
          signedIn: dashboard.signedIn,
          timeZone: dashboard.timeZone,
          username: dashboard.username,
        }}
      />
      <main className="projects-layout">
        <section className="projects-hero">
          <div>
            <p className="eyebrow">Build beyond the lessons</p>
            <h1>Your coding workspace.</h1>
            <p>
              Save experiments, mini projects and practice code privately to your account.
            </p>
          </div>
        </section>

        <ProjectWorkspace initialProjects={projects} />
      </main>
    </div>
  );
}
