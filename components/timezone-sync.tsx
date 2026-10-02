"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function TimezoneSync({ enabled }: { enabled: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!timeZone) return;

    const storageKey = `codetrail-timezone:${timeZone}`;
    if (sessionStorage.getItem(storageKey)) return;

    let cancelled = false;

    async function sync() {
      try {
        const response = await fetch("/api/profile/timezone", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ timeZone }),
        });

        if (!cancelled && response.ok) {
          sessionStorage.setItem(storageKey, "1");
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
  }, [enabled, router]);

  return null;
}
