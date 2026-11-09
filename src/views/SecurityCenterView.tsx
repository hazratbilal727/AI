import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, Lock, Eye, 
  Terminal, Activity, Zap, RefreshCw, CheckCircle2, Radio, Server
} from 'lucide-react';
import { securityService } from '../services/securityService';
import { SecurityIncident } from '../types';
import { playSound } from '../services/voiceService';

export const SecurityCenterView: React.FC = () => {
  const [incidents, setIncidents] = useState<SecurityIncident[]>(securityService.getIncidents());
  const [defconLevel, setDefconLevel] = useState<number>(4);
  const radarCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Poll incidents
  useEffect(() => {
    const interval = setInterval(() => {
      const incs = securityService.getIncidents();
      setIncidents(incs);
      const openCritical = incs.filter(i => i.status === 'investigating' && (i.severity === 'critical' || i.severity === 'high'));
      if (openCritical.length >= 2) setDefconLevel(2);
      else if (openCritical.length === 1) setDefconLevel(3);
      else setDefconLevel(4);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Animated Radar sweep on Canvas
  useEffect(() => {
    const canvas = radarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;
    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(cx, cy) - 10;

      ctx.clearRect(0, 0, w, h);

      // Circles
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.2)';
      ctx.lineWidth = 1;
      [0.25, 0.5, 0.75, 1].forEach(pct => {
        ctx.beginPath();
        ctx.arc(cx, cy, r * pct, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - r, cy);
      ctx.lineTo(cx + r, cy);
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx, cy + r);
      ctx.stroke();

      // Sweep line
      angle += 0.03;
      const sweepX = cx + Math.cos(angle) * r;
      const sweepY = cy + Math.sin(angle) * r;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sweepX, sweepY);
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Sweep gradient sector
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, 'rgba(0, 217, 255, 0.2)');
      grad.addColorStop(1, 'rgba(0, 217, 255, 0.0)');

      // Draw blips for active incidents
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx + 40, cy - 30, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00d9ff';
      ctx.beginPath();
      ctx.arc(cx - 50, cy + 30, 3, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMitigate = (id: string) => {
    playSound('complete');
    securityService.mitigateIncident(id);
    setIncidents(securityService.getIncidents());
  };

  const handleTriggerDrill = (type: SecurityIncident['type']) => {
    playSound('alert');
    securityService.triggerSimulatedDrill(type);
    setIncidents(securityService.getIncidents());
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#0B1927]/90 border border-cyan-500/30 rounded-xl p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-[0_0_20px_rgba(0,217,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-wider text-white">SECURITY OPERATIONS CENTER (SOC)</h1>
            <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
              defconLevel <= 2 
                ? 'bg-red-950/80 border-red-500/50 text-red-300 animate-pulse' 
                : 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300'
            }`}>
              DEFCON {defconLevel} : {defconLevel <= 2 ? 'ELEVATED THREAT' : 'SYSTEM NOMINAL'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Active perimeter defense, real-time threat radar, heuristic intrusion detection, and automated anomaly isolation.
          </p>
        </div>

        {/* Drill Controls */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Simulate Drill:</span>
          <button
            onClick={() => handleTriggerDrill('anomaly_probe')}
            className="px-2.5 py-1.5 rounded bg-yellow-950/50 border border-yellow-500/30 text-yellow-300 text-xs font-mono hover:bg-yellow-900/60 transition-colors"
          >
            Port Probe
          </button>
          <button
            onClick={() => handleTriggerDrill('auth_failure')}
            className="px-2.5 py-1.5 rounded bg-amber-950/50 border border-amber-500/30 text-amber-300 text-xs font-mono hover:bg-amber-900/60 transition-colors"
          >
            Auth Spike
          </button>
          <button
            onClick={() => handleTriggerDrill('packet_burst')}
            className="px-2.5 py-1.5 rounded bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-mono hover:bg-red-900/60 transition-colors"
          >
            DDoS Wave
          </button>
        </div>
      </div>

      {/* Grid: Radar & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Radar Scanner */}
        <div className="lg:col-span-4 bg-[#0B1927]/80 border border-cyan-500/20 rounded-xl p-4 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20 text-xs font-mono text-cyan-400">
            <span>PERIMETER THREAT RADAR</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Scanning 360°
            </span>
          </div>

          <div className="relative my-2">
            <canvas
              ref={radarCanvasRef}
              width={220}
              height={220}
              className="block rounded-full bg-[#05090D] border border-cyan-500/40 shadow-[0_0_20px_rgba(0,217,255,0.15)]"
            />
          </div>

          <div className="w-full grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 mt-2">
            <div className="p-2 rounded bg-[#071522] border border-cyan-500/10">
              <span className="text-slate-500">BLOCKED IPS:</span>
              <div className="text-cyan-300 font-bold text-xs mt-0.5">14,289</div>
            </div>
            <div className="p-2 rounded bg-[#071522] border border-cyan-500/10">
              <span className="text-slate-500">HONEYPOT HITS:</span>
              <div className="text-amber-400 font-bold text-xs mt-0.5">38</div>
            </div>
          </div>
        </div>

        {/* Security Status Cards */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0B1927]/90 border border-cyan-500/20">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>CRYPTOGRAPHIC VAULT</span>
              </div>
              <div className="text-lg font-bold text-white font-mono">AES-256-GCM</div>
              <span className="text-[10px] font-mono text-emerald-400">Zero Leakage Detected</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B1927]/90 border border-cyan-500/20">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                <Eye className="w-4 h-4 text-blue-400" />
                <span>SENTINEL HEURISTICS</span>
              </div>
              <div className="text-lg font-bold text-white font-mono">NEURAL v4.2</div>
              <span className="text-[10px] font-mono text-cyan-300">Active Anomaly Filter</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B1927]/90 border border-cyan-500/20">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                <Radio className="w-4 h-4 text-purple-400" />
                <span>FIREWALL FILTER</span>
              </div>
              <div className="text-lg font-bold text-white font-mono">IPTABLES ZERO</div>
              <span className="text-[10px] font-mono text-emerald-400">100% Drops Enforced</span>
            </div>
          </div>

          {/* Active Incidents Table */}
          <div className="bg-[#0B1927]/90 border border-cyan-500/20 rounded-xl p-4 flex-1">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-cyan-500/20">
              <div className="flex items-center gap-2 text-xs font-mono text-white">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="uppercase tracking-wider">INCIDENT LOGS & ACTIVE DRILLS</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {incidents.filter(i => i.status === 'investigating').length} Unresolved
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
              {incidents.map(inc => (
                <div
                  key={inc.id}
                  className={`p-3 rounded-lg border transition-all flex items-center justify-between ${
                    inc.status === 'mitigated'
                      ? 'bg-[#071522]/40 border-cyan-500/10 opacity-70'
                      : inc.severity === 'critical'
                      ? 'bg-red-950/20 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.15)]'
                      : 'bg-[#071522] border-cyan-500/20'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.2 rounded uppercase ${
                        inc.severity === 'critical' ? 'bg-red-950 text-red-400 border border-red-500/40' :
                        inc.severity === 'high' ? 'bg-amber-950 text-amber-400 border border-amber-500/40' :
                        'bg-blue-950 text-blue-400 border border-blue-500/40'
                      }`}>
                        {inc.severity}
                      </span>
                      <span className="text-xs font-semibold text-white">{inc.title}</span>
                    </div>
                    <p className="text-xs text-slate-400">{inc.description}</p>
                    <div className="text-[10px] font-mono text-slate-500">
                      Origin: <span className="text-cyan-400">{inc.originIp}</span> • {inc.timestamp}
                    </div>
                  </div>

                  <div>
                    {inc.status === 'investigating' ? (
                      <button
                        onClick={() => handleMitigate(inc.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs hover:bg-emerald-500/30 transition-colors uppercase"
                      >
                        Mitigate
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mitigated
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
