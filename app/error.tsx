"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="error-shell">
      <div className="error-card">
        <span className="error-icon" aria-hidden="true">🧭</span>
        <p className="eyebrow">Trail interrupted</p>
        <h1>Something went wrong.</h1>
        <p>
          Your progress is safe. Try loading this part of CodeTrail again.
        </p>
        <button className="primary-button" type="button" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
