import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <svg
        viewBox="0 0 240 180"
        className="mb-6 w-64 text-base-content"
        role="img"
        aria-label="A clapperboard in a spotlight"
      >
        <polygon points="120,0 60,160 180,160" className="fill-primary/15" />
        <ellipse cx="120" cy="165" rx="70" ry="9" className="fill-base-300" />
        <g transform="rotate(-8 120 80)">
          <rect x="70" y="70" width="100" height="62" rx="6" className="fill-neutral" />
          <rect x="70" y="52" width="100" height="18" rx="4" className="fill-primary" />
          <path
            d="M82 52l12 18M104 52l12 18M126 52l12 18M148 52l12 18"
            className="stroke-neutral"
            strokeWidth="6"
            fill="none"
          />
          <text
            x="120"
            y="112"
            textAnchor="middle"
            fontSize="28"
            fontWeight="700"
            className="fill-neutral-content"
          >
            404
          </text>
        </g>
      </svg>
      <h1 className="text-4xl font-bold text-primary">Scene not found</h1>
      <p className="mt-3 opacity-70">
        The page you are looking for has wrapped up or never made it to the
        set. Head back to the lobby and find your next studio.
      </p>
      <Link href="/" className="btn btn-primary mt-6">
        Return to Home
      </Link>
    </div>
  );
}