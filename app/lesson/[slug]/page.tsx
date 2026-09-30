import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/lesson-player";
import { getLesson } from "@/lib/course-data";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLesson(slug);

  if (!lesson) notFound();

  return <LessonPlayer lesson={lesson} />;
}
