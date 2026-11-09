import React, { useEffect, useRef } from 'react';
import { AssistantState } from '../../types';

interface OrbitalCoreProps {
  state: AssistantState;
  size?: number;
  interactive?: boolean;
  onCoreClick?: () => void;
}

export const OrbitalCore: React.FC<OrbitalCoreProps> = ({
  state,
  size = 360,
  interactive = true,
  onCoreClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle1 = 0;
    let angle2 = 0;
    let angle3 = 0;
    let pulseFactor = 0;

    // Particle system
    const particleCount = 48;
    const particles = Array.from({ length: particleCount }).map(() => ({
      angle: Math.random() * Math.PI * 2,
      radius: 40 + Math.random() * 110,
      speed: (0.005 + Math.random() * 0.015) * (Math.random() > 0.5 ? 1 : -1),
      size: 1 + Math.random() * 2,
      alpha: 0.2 + Math.random() * 0.7
    }));

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      const centerX = size / 2;
      const centerY = size / 2;

      // Speed multiplier based on state
      let speedMult = 1;
      let primaryColor = '#00D9FF';
      let secondaryColor = '#168BFF';

      if (state === 'THINKING') {
        speedMult = 2.4;
        primaryColor = '#38BDF8';
        secondaryColor = '#818CF8';
      } else if (state === 'LISTENING') {
        speedMult = 1.6;
        primaryColor = '#10B981';
        secondaryColor = '#00D9FF';
      } else if (state === 'SPEAKING') {
        speedMult = 1.8;
        primaryColor = '#00F0FF';
        secondaryColor = '#3B82F6';
      }

      angle1 += 0.008 * speedMult;
      angle2 -= 0.012 * speedMult;
      angle3 += 0.005 * speedMult;
      pulseFactor += 0.04 * speedMult;

      const dynamicPulse = Math.sin(pulseFactor) * 4;

      // 1. Outermost subtle boundary ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 2. Outer segmented orbital ring with tick marks
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle1);
      const outerR = 135;
      for (let i = 0; i < 36; i++) {
        const rad = (i * Math.PI * 2) / 36;
        const tickLen = i % 3 === 0 ? 8 : 4;
        const isCyan = i % 4 === 0;
        ctx.beginPath();
        ctx.moveTo(Math.cos(rad) * outerR, Math.sin(rad) * outerR);
        ctx.lineTo(Math.cos(rad) * (outerR - tickLen), Math.sin(rad) * (outerR - tickLen));
        ctx.strokeStyle = isCyan ? 'rgba(0, 217, 255, 0.4)' : 'rgba(22, 139, 255, 0.18)';
        ctx.lineWidth = i % 3 === 0 ? 1.5 : 1;
        ctx.stroke();
      }
      ctx.restore();

      // 3. Middle counter-rotating orbital track with gap notches
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle2);
      ctx.beginPath();
      ctx.arc(0, 0, 105, 0.2, Math.PI * 0.7);
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 105, Math.PI * 0.9, Math.PI * 1.5);
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 105, Math.PI * 1.65, Math.PI * 1.95);
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.6)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      // 4. Inner orbital ring with coordinates
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle3);
      ctx.beginPath();
      ctx.arc(0, 0, 78, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.2)';
      ctx.setLineDash([4, 6]);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 5. Dynamic particles
      particles.forEach(p => {
        p.angle += p.speed * speedMult;
        const px = centerX + Math.cos(p.angle) * p.radius;
        const py = centerY + Math.sin(p.angle) * p.radius;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = primaryColor;
        ctx.globalAlpha = p.alpha * 0.7;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 6. Central glowing core
      const coreR = Math.max(24, 38 + dynamicPulse);

      // Radial gradient glow
      const glowGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreR * 2.2);
      glowGrad.addColorStop(0, 'rgba(0, 217, 255, 0.85)');
      glowGrad.addColorStop(0.35, 'rgba(22, 139, 255, 0.35)');
      glowGrad.addColorStop(0.7, 'rgba(0, 217, 255, 0.08)');
      glowGrad.addColorStop(1, 'rgba(0, 217, 255, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreR * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Inner polygon / faceted diamond core
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle1 * 1.5);
      ctx.beginPath();
      const sides = 6;
      for (let s = 0; s < sides; s++) {
        const polyAngle = (s * Math.PI * 2) / sides;
        const x = Math.cos(polyAngle) * (coreR * 0.75);
        const y = Math.sin(polyAngle) * (coreR * 0.75);
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(242, 247, 250, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = 'rgba(0, 217, 255, 0.25)';
      ctx.fill();
      ctx.restore();

      // Center bright nucleus
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6 + Math.abs(dynamicPulse * 0.5), 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#00D9FF';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, size]);

  const getStateBadge = () => {
    switch (state) {
      case 'READY':
        return { text: 'READY', color: 'text-[#00D9FF]', bg: 'bg-[#00D9FF]/10', border: 'border-[#00D9FF]/30' };
      case 'LISTENING':
        return { text: 'LISTENING', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
      case 'THINKING':
        return { text: 'THINKING', color: 'text-sky-300', bg: 'bg-sky-500/10', border: 'border-sky-500/30' };
      case 'SPEAKING':
        return { text: 'SPEAKING', color: 'text-cyan-300', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' };
      default:
        return { text: 'ONLINE', color: 'text-[#00D9FF]', bg: 'bg-[#00D9FF]/10', border: 'border-[#00D9FF]/30' };
    }
  };

  const badge = getStateBadge();

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${
        interactive ? 'cursor-pointer group' : ''
      }`}
      onClick={onCoreClick}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="absolute inset-0 pointer-events-none transition-transform duration-500 group-hover:scale-102"
      />

      {/* Center Status HUD Display */}
      <div className="z-10 flex flex-col items-center justify-center pointer-events-none">
        <div
          className={`px-3 py-1 rounded-full text-[11px] font-mono tracking-widest uppercase border ${badge.bg} ${badge.color} ${badge.border} backdrop-blur-md shadow-sm transition-all duration-300`}
        >
          {badge.text}
        </div>
        <div className="text-[10px] font-mono text-[#8295A7] tracking-wider mt-1 opacity-80">
          CORE V4.2
        </div>
      </div>

      {/* Surrounding HUD telemetry marks */}
      <div className="absolute top-2 left-6 text-[9px] font-mono text-[#00D9FF]/60 tracking-wider">
        RAD: 142.8°
      </div>
      <div className="absolute top-2 right-6 text-[9px] font-mono text-[#00D9FF]/60 tracking-wider">
        SYNC: 99.8%
      </div>
      <div className="absolute bottom-2 left-6 text-[9px] font-mono text-[#8295A7]/70 tracking-wider">
        FREQ: 4.82 GHz
      </div>
      <div className="absolute bottom-2 right-6 text-[9px] font-mono text-[#8295A7]/70 tracking-wider">
        DAMP: 0.94
      </div>
    </div>
  );
};
