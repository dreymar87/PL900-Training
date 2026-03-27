"use client";

export default function CertError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-4xl mb-4">&#9888;</div>
      <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
      <p className="text-sm text-text-secondary mb-6 text-center max-w-md">
        An error occurred while loading this page. This may be due to corrupted
        local data. Try again or clear your browser data for this site.
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
