export function SaturnLogo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none" className={className}>
      <defs>
        <linearGradient id="planet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6"/>
          <stop offset="100%" stopColor="#1E3A8A"/>
        </linearGradient>
        <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0"/>
          <stop offset="30%" stopColor="#60A5FA" stopOpacity="0.8"/>
          <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <circle cx="256" cy="256" r="140" fill="url(#planet)"/>
      <circle cx="220" cy="220" r="100" fill="url(#shine)"/>
      <ellipse cx="256" cy="256" rx="230" ry="70" stroke="url(#ring)" strokeWidth="18" fill="none" transform="rotate(-20 256 256)" opacity="0.4"/>
      <clipPath id="frontClip">
        <rect x="0" y="256" width="512" height="256"/>
      </clipPath>
      <ellipse cx="256" cy="256" rx="230" ry="70" stroke="url(#ring)" strokeWidth="22" fill="none" transform="rotate(-20 256 256)" clipPath="url(#frontClip)"/>
    </svg>
  );
}
