import React from 'react';

interface PSMLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  light?: boolean;
}

export function PSMLogo({ className = '', size = 44, showText = false, light = false }: PSMLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Stylized Red/Maroon PSM Spiral Emblem matching physical printout */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
      >
        <circle cx="50" cy="50" r="48" fill={light ? "#ffffff" : "#ffffff"} stroke="#881337" strokeWidth="3" />
        
        {/* Outer stylized spiral loop (Red/Merah Hati) */}
        <path
          d="M 50 18 C 70 18 84 32 84 52 C 84 72 68 84 48 84 C 28 84 18 70 18 52 C 18 36 28 26 44 26 C 58 26 68 34 68 46 C 68 56 60 64 50 64 C 42 64 36 58 36 50 C 36 44 40 40 46 40 C 50 40 54 44 54 48"
          stroke="#991b1b"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Inner swoosh accent (Deep Maroon / Charcoal) */}
        <path
          d="M 38 60 C 42 66 52 68 60 62 C 68 56 70 44 64 36"
          stroke="#3b0764"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Center dot/core */}
        <circle cx="48" cy="48" r="4.5" fill="#e11d48" />
      </svg>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-black tracking-wider text-base ${light ? 'text-white' : 'text-[#881337]'}`}>
            PT. PSM
          </span>
          <span className={`text-[10px] tracking-tight font-semibold ${light ? 'text-rose-200' : 'text-slate-600'}`}>
            PUTRA SAIJAAN MANDIRI
          </span>
        </div>
      )}
    </div>
  );
}
