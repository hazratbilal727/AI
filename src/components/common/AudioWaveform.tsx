import React, { useEffect, useState } from 'react';

interface AudioWaveformProps {
  active?: boolean;
  barsCount?: number;
  height?: number;
  color?: string;
  className?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  active = true,
  barsCount = 28,
  height = 40,
  color = '#00D9FF',
  className = ''
}) => {
  const [amplitudes, setAmplitudes] = useState<number[]>(() =>
    Array.from({ length: barsCount }, () => Math.random() * 0.4 + 0.1)
  );

  useEffect(() => {
    let animId: number;
    let t = 0;

    const tick = () => {
      t += 0.08;
      if (active) {
        setAmplitudes(
          Array.from({ length: barsCount }, (_, i) => {
            const wave1 = Math.sin(t * 1.5 + i * 0.3);
            const wave2 = Math.cos(t * 2.2 + i * 0.15);
            const raw = (wave1 + wave2 + 2) / 4;
            const variance = Math.random() * 0.2;
            return Math.min(1, Math.max(0.12, raw * 0.8 + variance));
          })
        );
      } else {
        setAmplitudes(Array.from({ length: barsCount }, () => 0.08));
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [active, barsCount]);

  return (
    <div
      className={`flex items-center justify-center gap-[3px] select-none ${className}`}
      style={{ height }}
    >
      {amplitudes.map((amp, idx) => {
        const barHeight = Math.max(4, amp * height);
        return (
          <div
            key={idx}
            className="w-[3px] rounded-full transition-all duration-75"
            style={{
              height: `${barHeight}px`,
              backgroundColor: color,
              opacity: active ? 0.35 + amp * 0.65 : 0.2,
              boxShadow: active && amp > 0.6 ? `0 0 6px ${color}` : 'none'
            }}
          />
        );
      })}
    </div>
  );
};
