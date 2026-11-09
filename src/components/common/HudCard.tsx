import React from 'react';

interface HudCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const HudCard: React.FC<HudCardProps> = ({
  title,
  subtitle,
  icon,
  headerAction,
  children,
  className = '',
  glow = false
}) => {
  return (
    <div
      className={`relative rounded-xl bg-[#0B1927]/80 border ${
        glow ? 'border-[#00D9FF]/40 shadow-[0_0_20px_rgba(0,217,255,0.08)]' : 'border-[#00D9FF]/15'
      } backdrop-blur-md transition-all duration-200 overflow-hidden ${className}`}
    >
      {/* Corner bracket tech accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00D9FF]/40" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00D9FF]/40" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00D9FF]/40" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00D9FF]/40" />

      {/* Header bar if title provided */}
      {title && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#00D9FF]/10 bg-[#071522]/50">
          <div className="flex items-center gap-2.5">
            {icon && <span className="text-[#00D9FF] text-base">{icon}</span>}
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-[#F2F7FA] font-display">
                {title}
              </h3>
              {subtitle && (
                <p className="text-[11px] text-[#8295A7] font-mono tracking-wider">{subtitle}</p>
              )}
            </div>
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      {/* Body container with standard padding */}
      <div className="p-5">{children}</div>
    </div>
  );
};
