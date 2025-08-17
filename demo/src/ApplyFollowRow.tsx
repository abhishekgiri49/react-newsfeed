import { useState } from "react";

export default function ApplyFollowRow({
  onQuickApply = async () => new Promise((r) => setTimeout(r, 900)),
  onFollow = async (isFollowing: any) => new Promise((r) => setTimeout(r, 300)),
}) {
  const [applying, setApplying] = useState(false);
  const [following, setFollowing] = useState(false);

  const handleApply = async () => {
    try {
      setApplying(true);
      await onQuickApply();
    } finally {
      setApplying(false);
    }
  };

  const handleFollow = async () => {
    const next = !following;
    setFollowing(next); // optimistic
    try {
      await onFollow(next);
    } catch {
      setFollowing(!next); // revert on error
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Quick Apply */}
      <button
        type="button"
        onClick={handleApply}
        disabled={applying}
        className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold
                   bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed
                   shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        {applying ? (
          <span className="inline-flex items-center gap-2">
            <Spinner />
            Applying…
          </span>
        ) : (
          "Quick Apply"
        )}
      </button>

      {/* Follow */}
      <button
        type="button"
        onClick={handleFollow}
        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium
                    shadow-sm focus:outline-none focus-visible:ring-2
                    ${
                      following
                        ? "border-transparent bg-gray-900 text-white hover:bg-black focus-visible:ring-gray-500"
                        : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-400"
                    }`}
        aria-pressed={following}
      >
        <Heart filled={following} />
        {following ? "Following" : "Follow"}
      </button>

      {/* a11y status region */}
      <span className="sr-only" aria-live="polite">
        {applying ? "Submitting application" : ""}
        {following ? " Now following." : " Not following."}
      </span>
    </div>
  );
}

/* Minimal inline icons so you don't need extra deps */
function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      role="img"
      aria-label="Loading"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        opacity=".25"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
    </svg>
  );
}

function Heart({ filled }: any) {
  return filled ? (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21s-7.5-4.6-9.7-8.1C.6 10.2 1.2 7.2 3.4 5.6 6 3.5 9.3 4.5 12 7c2.7-2.5 6-3.5 8.6-1.4 2.2 1.6 2.8 4.6 1.1 7.3C19.5 16.4 12 21 12 21z"
        className="fill-current"
      />
    </svg>
  ) : (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12.1 8.6C9.9 6.5 6.7 6.5 4.6 8.6 2.5 10.7 2.5 14 4.6 16.1L12 23l7.4-6.9c2.1-2.1 2.1-5.4 0-7.5-2.1-2.1-5.3-2.1-7.4 0z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
