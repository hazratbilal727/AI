import React, { useEffect, useRef, useState } from 'react';
import { voiceService } from '../../services/voiceService';
import { useToast } from '../common/Toast';

interface SystemAccessGlobeProps {
  onStateChange?: (active: boolean) => void;
}

export const SystemAccessGlobe: React.FC<SystemAccessGlobeProps> = ({ onStateChange }) => {
  const [isActive, setIsActive] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotationAngle = 0;

    // Generate 3D spherical points
    const pointCount = 180;
    const points: { x: number; y: number; z: number; size: number }[] = [];
    const radius = 55;

    for (let i = 0; i < pointCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / pointCount);
      const theta = Math.sqrt(pointCount * Math.PI) * phi;
      points.push({
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        size: 1.2 + Math.random() * 1.5
      });
    }

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      rotationAngle += isActive ? 0.012 : 0.002;

      const cosR = Math.cos(rotationAngle);
      const sinR = Math.sin(rotationAngle);

      // Sort points by rotated z for depth ordering
      const transformed = points.map(p => {
        // Rotate around Y axis and tilt X axis slightly
        const rx = p.x * cosR - p.z * sinR;
        const rz = p.x * sinR + p.z * cosR;
        const ry = p.y * 0.95 - rz * 0.15;
        return { ...p, rx, ry, rz };
      });

      transformed.sort((a, b) => a.rz - b.rz);

      transformed.forEach(p => {
        // Perspective projection
        const scale = 220 / (220 + p.rz);
        const screenX = centerX + p.rx * scale;
        const screenY = centerY + p.ry * scale;

        const alpha = Math.max(0.1, (p.rz + radius) / (2 * radius));
        ctx.beginPath();
        ctx.arc(screenX, screenY, p.size * scale, 0, Math.PI * 2);

        if (isActive) {
          ctx.fillStyle = `rgba(0, 217, 255, ${alpha * 0.9})`;
          ctx.shadowColor = '#00D9FF';
          ctx.shadowBlur = p.rz > 0 ? 6 : 0;
        } else {
          ctx.fillStyle = `rgba(239, 68, 68, ${alpha * 0.8})`;
          ctx.shadowColor = '#EF4444';
          ctx.shadowBlur = p.rz > 0 ? 6 : 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Subtle atmospheric ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
      ctx.strokeStyle = isActive ? 'rgba(0, 217, 255, 0.12)' : 'rgba(239, 68, 68, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isActive]);

  const toggleAccess = () => {
    voiceService.playSfx(isActive ? 'alert' : 'activate');
    const next = !isActive;
    setIsActive(next);
    onStateChange?.(next);
    showToast(
      next ? 'System Access Granted' : 'System Access Terminated',
      next ? 'Neural bus linked to all 4 input registers' : 'IPC connection severed',
      next ? 'success' : 'error'
    );
  };

  return (
    <div className="flex flex-col items-center justify-between p-4 rounded-2xl bg-gradient-to-b from-[#0B1E2E]/80 to-[#071522]/90 border border-[#00D9FF]/20 min-h-[220px]">
      {/* 3D Particle Canvas */}
      <div className="relative flex-1 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={160}
          height={140}
          className="select-none pointer-events-none"
        />
      </div>

      {/* Label & Action */}
      <div className="w-full flex flex-col items-center pt-2">
        <div className="text-[10px] font-mono tracking-widest text-[#8295A7] uppercase mb-2">
          SYSTEM ACCESS
        </div>

        <button
          onClick={toggleAccess}
          className={`w-full py-1.5 px-4 rounded-lg font-mono text-[11px] font-semibold tracking-wider transition-all duration-200 border ${
            isActive
              ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
              : 'bg-[#00D9FF]/15 hover:bg-[#00D9FF]/25 text-[#00D9FF] border-[#00D9FF]/40 shadow-[0_0_12px_rgba(0,217,255,0.2)]'
          }`}
        >
          {isActive ? 'TERMINATE' : 'ENGAGE'}
        </button>
      </div>
    </div>
  );
};
