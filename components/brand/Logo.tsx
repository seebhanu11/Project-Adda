import Link from "next/link";

interface LogoProps {
  className?: string;
  withTagline?: boolean;
}

export function Logo({ className = "", withTagline = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-3 transition-opacity hover:opacity-90 ${className}`}
      aria-label="Project Adda — Home"
    >
      {/* Geometric Icon Symbol */}
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#141414] border border-[#262626] transition-transform group-hover:scale-105">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          {/* Stylized P & A intersection */}
          <path
            d="M5 20V4H13C15.2091 4 17 5.79086 17 8C17 10.2091 15.2091 12 13 12H5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 12L19 20"
            stroke="#0099ff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-semibold text-lg tracking-[-0.04em] text-white">
            PROJECT
          </span>
          <span className="font-light text-lg tracking-[-0.04em] text-[#999999]">
            ADDA
          </span>
        </div>
        {withTagline && (
          <span className="text-[11px] font-medium tracking-[0.02em] text-[#999999] mt-0.5">
            Your Ideas. Our Space.
          </span>
        )}
      </div>
    </Link>
  );
}
