import { notFound, redirect } from "next/navigation";
import { LessonPlayer } from "@/components/lesson-player";
import { getLesson } from "@/lib/course-data";
import { getLearningDashboard } from "@/lib/learning-dashboard";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLesson(slug);

  if (!lesson) notFound();

  const dashboard = await getLearningDashboard();
  const pathNode = dashboard.nodes.find((node) => node.slug === slug);

  if (!pathNode || pathNode.status === "locked") {
    redirect("/learn");
  }

  return <LessonPlayer lesson={lesson} />;
}
