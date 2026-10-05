export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="3" width="20" height="26" rx="2.5" fill="#1F3A5F" />
      <rect x="8" y="8" width="12" height="1.6" rx="0.8" fill="#FAFAF6" opacity="0.85" />
      <rect x="8" y="12.4" width="9" height="1.6" rx="0.8" fill="#FAFAF6" opacity="0.65" />
      <path
        d="M13 19.5L16.2 22.7L23.5 15"
        stroke="#E2A03D"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
