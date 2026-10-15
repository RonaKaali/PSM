import React from 'react';

interface PSMLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  light?: boolean;
}

export function PSMLogo({ className = '', size = 48, showText = false, light = false }: PSMLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/logopsm.png"
        alt="PT. Putra Saijaan Mandiri Logo"
        style={{ height: `${size}px`, width: 'auto' }}
        className="object-contain drop-shadow-sm shrink-0 rounded-sm"
      />
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
