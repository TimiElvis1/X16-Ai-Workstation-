import React from 'react';

interface IcrLogoProps {
  className?: string;
  size?: number;
  isDark?: boolean;
  withText?: boolean;
  withGlow?: boolean;
}

export const IcrLogo: React.FC<IcrLogoProps> = ({
  className = '',
  size = 40,
  isDark = true,
  withText = false,
  withGlow = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic Emblem Graphic */}
      <div className="relative shrink-0 flex items-center justify-center">
        {withGlow && (
          <div
            className={`absolute -inset-1 rounded-2xl blur-md opacity-75 transition-opacity duration-300 ${
              isDark
                ? 'bg-gradient-to-tr from-cyan-500 via-amber-500 to-emerald-400 opacity-60 group-hover:opacity-90'
                : 'bg-gradient-to-tr from-amber-500 via-yellow-500 to-amber-600 opacity-40 group-hover:opacity-75'
            }`}
          />
        )}

        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="icrGradTop" x1="12" y1="8" x2="52" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={isDark ? "#22d3ee" : "#d97706"} />
              <stop offset="50%" stopColor={isDark ? "#38bdf8" : "#f59e0b"} />
              <stop offset="100%" stopColor={isDark ? "#818cf8" : "#b45309"} />
            </linearGradient>

            <linearGradient id="icrGradLeft" x1="6" y1="24" x2="32" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={isDark ? "#0891b2" : "#b45309"} />
              <stop offset="100%" stopColor={isDark ? "#0e7490" : "#78350f"} />
            </linearGradient>

            <linearGradient id="icrGradRight" x1="32" y1="24" x2="58" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={isDark ? "#0284c7" : "#92400e"} />
              <stop offset="100%" stopColor={isDark ? "#0369a1" : "#451a03"} />
            </linearGradient>

            <linearGradient id="icrCoreGrad" x1="24" y1="20" x2="40" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={isDark ? "#67e8f9" : "#fbbf24"} />
              <stop offset="100%" stopColor={isDark ? "#f59e0b" : "#d97706"} />
            </linearGradient>

            <filter id="icrInnerGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Rounded Shield Frame */}
          <rect
            x="3"
            y="3"
            width="58"
            height="58"
            rx="16"
            fill={isDark ? "#09090b" : "#ffffff"}
            stroke={isDark ? "#27272a" : "#e8dfd3"}
            strokeWidth="2"
          />

          {/* Isometric Computational Repository Cube */}
          {/* Top Face (Compute Ingress) */}
          <path
            d="M32 10 L52 21 L32 32 L12 21 Z"
            fill="url(#icrGradTop)"
            fillOpacity={isDark ? "0.85" : "0.9"}
            stroke={isDark ? "#38bdf8" : "#f59e0b"}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Left Face (Storage Substrate) */}
          <path
            d="M12 21 L32 32 L32 53 L12 42 Z"
            fill="url(#icrGradLeft)"
            fillOpacity={isDark ? "0.9" : "0.95"}
            stroke={isDark ? "#0891b2" : "#92400e"}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Right Face (Integration Nexus) */}
          <path
            d="M32 32 L52 21 L52 42 L32 53 Z"
            fill="url(#icrGradRight)"
            fillOpacity={isDark ? "0.95" : "0.95"}
            stroke={isDark ? "#0284c7" : "#78350f"}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Core Computational Diamond Matrix (Floating ICR Core) */}
          <path
            d="M32 23 L40 27.5 L32 32 L24 27.5 Z"
            fill="url(#icrCoreGrad)"
            stroke={isDark ? "#ffffff" : "#ffffff"}
            strokeWidth="1"
            filter="url(#icrInnerGlow)"
          />

          {/* Data Circuit Lines on Left Face: Representing "I" and "C" Integrational Channels */}
          <path
            d="M17 28 L27 34 L27 45"
            stroke={isDark ? "#a5f3fc" : "#fef3c7"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.8"
          />
          <circle cx="17" cy="28" r="1.5" fill={isDark ? "#67e8f9" : "#fbbf24"} />
          <circle cx="27" cy="45" r="1.5" fill={isDark ? "#67e8f9" : "#fbbf24"} />

          {/* Data Circuit Lines on Right Face: Representing "R" Repository Loop */}
          <path
            d="M47 28 L37 34 L37 45"
            stroke={isDark ? "#bae6fd" : "#fef3c7"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.8"
          />
          <circle cx="47" cy="28" r="1.5" fill={isDark ? "#38bdf8" : "#f59e0b"} />
          <circle cx="37" cy="45" r="1.5" fill={isDark ? "#38bdf8" : "#f59e0b"} />

          {/* Central Pulse Axis */}
          <line
            x1="32"
            y1="10"
            x2="32"
            y2="53"
            stroke={isDark ? "#ffffff" : "#ffffff"}
            strokeWidth="1.2"
            strokeDasharray="2 3"
            strokeOpacity={isDark ? "0.6" : "0.5"}
          />
        </svg>
      </div>

      {/* Optional Integrated Wordmark */}
      {withText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center space-x-2">
            <span
              className={`font-black text-xl sm:text-2xl tracking-widest font-iin-digital ${
                isDark
                  ? 'text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                  : 'text-[#92400e]'
              }`}
            >
              ICR
            </span>
            <span
              className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-extrabold tracking-wider uppercase border ${
                isDark
                  ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500/60'
                  : 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]'
              }`}
            >
              COMPUTE
            </span>
          </div>
          <span
            className={`text-[10px] font-mono tracking-tight ${
              isDark ? 'text-zinc-400' : 'text-[#78716c]'
            }`}
          >
            Integrational Compute Repository
          </span>
        </div>
      )}
    </div>
  );
};
