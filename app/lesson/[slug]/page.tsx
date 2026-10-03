import { notFound, redirect } from "next/navigation";
import { LessonPlayer } from "@/components/lesson-player";
import { getLesson, implementedLessonSlugs } from "@/lib/course-data";
import { createClient } from "@/lib/supabase/server";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLesson(slug);

  if (!lesson) notFound();

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    if (slug !== implementedLessonSlugs[0]) redirect("/learn");
    return <LessonPlayer lesson={lesson} />;
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const signedIn =
    !claimsError &&
    claimsData?.claims &&
    typeof claimsData.claims.sub === "string";

  if (!signedIn) {
    if (slug !== implementedLessonSlugs[0]) redirect("/learn");
    return <LessonPlayer lesson={lesson} />;
  }

  const { data: canAccess, error: accessError } = await supabase.rpc(
    "can_access_lesson",
    { p_slug: slug },
  );

  if (accessError || canAccess !== true) {
    redirect("/learn");
  }

  return <LessonPlayer lesson={lesson} />;
}
