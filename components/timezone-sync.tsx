"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function TimezoneSync({
  enabled,
  currentTimeZone,
}: {
  enabled: boolean;
  currentTimeZone: string;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;

    const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!browserTimeZone || browserTimeZone === currentTimeZone) return;

    let cancelled = false;

    async function sync() {
      try {
        const response = await fetch("/api/profile/timezone", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ timeZone: browserTimeZone }),
        });

        if (!cancelled && response.ok) {
          router.refresh();
        }
      } catch {
        // The app still works if timezone sync is temporarily unavailable.
      }
    }

    void sync();

    return () => {
      cancelled = true;
    };
  }, [currentTimeZone, enabled, router]);

  return null;
}
