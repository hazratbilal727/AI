import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Cpu, HardDrive, Wifi, ShieldAlert, Zap, 
  Trash2, RefreshCw, AlertTriangle, Layers, Server, Clock, Database
} from 'lucide-react';
import { systemMonitorService } from '../services/systemMonitorService';
import { SystemMetrics, SystemProcess } from '../types';
import { playSound } from '../services/voiceService';

export const SystemMonitorView: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>(systemMonitorService.getMetrics());
  const [processes, setProcesses] = useState<SystemProcess[]>(systemMonitorService.getProcesses());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Poll metrics every 1.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(systemMonitorService.getMetrics());
      setProcesses(systemMonitorService.getProcesses());
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Draw real-time Canvas telemetry line graphs
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 217, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const history = systemMonitorService.getHistory();
    const len = history.length;
    if (len < 2) return;

    // Helper to draw series
    const drawSeries = (data: number[], strokeColor: string, fillColor: string) => {
      ctx.beginPath();
      const step = width / (len - 1);
      data.forEach((val, i) => {
        const x = i * step;
        const y = height - (Math.min(100, Math.max(0, val)) / 100) * (height - 20) - 10;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Area fill
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
    };

    const gpuSeries = history.map(h => h.gpu);
    const ramSeries = history.map(h => (h.ram / 8192) * 100);
    const cpuSeries = history.map(h => h.cpu);

    // GPU (Purple/blue)
    drawSeries(gpuSeries, 'rgba(139, 92, 246, 0.8)', 'rgba(139, 92, 246, 0.05)');
    // RAM (Blue)
    drawSeries(ramSeries, 'rgba(22, 139, 255, 0.8)', 'rgba(22, 139, 255, 0.07)');
    // CPU (Cyan)
    drawSeries(cpuSeries, 'rgba(0, 217, 255, 0.9)', 'rgba(0, 217, 255, 0.12)');

  }, [metrics]);

  const handleKill = (pid: number) => {
    playSound('alert');
    systemMonitorService.killProcess(pid);
    setProcesses(systemMonitorService.getProcesses());
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#0B1927]/90 border border-cyan-500/30 rounded-xl p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-[0_0_20px_rgba(0,217,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Activity className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-wider text-white">SYSTEM TELEMETRY & RESOURCES</h1>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Realtime Kernel
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time simulated telemetry stream monitoring compute cores, VRAM buffers, network IO, and background workers.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Uptime: <span className="text-white">{Math.floor(metrics.uptimeSeconds / 3600)}h {Math.floor((metrics.uptimeSeconds % 3600) / 60)}m</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>Processes: <span className="text-white">{processes.length}</span></span>
          </div>
        </div>
      </div>

      {/* 4 Metrics Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* CPU */}
        <div className="bg-[#0B1927]/80 border border-cyan-500/20 rounded-xl p-3.5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>CPU LOAD</span>
            </div>
            <span className="text-cyan-300 font-bold">{metrics.cpuUsage}%</span>
          </div>
          <div className="h-1.5 w-full bg-[#071522] rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-400 transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(0,217,255,0.8)]"
              style={{ width: `${metrics.cpuUsage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
            <span>Temp: {metrics.temperatureC}°C</span>
            <span>Freq: 3.8 GHz</span>
          </div>
        </div>

        {/* RAM */}
        <div className="bg-[#0B1927]/80 border border-cyan-500/20 rounded-xl p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>RAM USAGE</span>
            </div>
            <span className="text-blue-300 font-bold">{Math.round((metrics.ramUsageMb / metrics.ramTotalMb) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-[#071522] rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(22,139,255,0.8)]"
              style={{ width: `${(metrics.ramUsageMb / metrics.ramTotalMb) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
            <span>Allocated: {(metrics.ramUsageMb / 1024).toFixed(1)} GB</span>
            <span>Total: {(metrics.ramTotalMb / 1024).toFixed(0)} GB</span>
          </div>
        </div>

        {/* GPU */}
        <div className="bg-[#0B1927]/80 border border-cyan-500/20 rounded-xl p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>GPU ENGINE</span>
            </div>
            <span className="text-purple-300 font-bold">{metrics.gpuUsage}%</span>
          </div>
          <div className="h-1.5 w-full bg-[#071522] rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"
              style={{ width: `${metrics.gpuUsage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
            <span>VRAM: 8.4 GB</span>
            <span>Fan: 48%</span>
          </div>
        </div>

        {/* Network */}
        <div className="bg-[#0B1927]/80 border border-cyan-500/20 rounded-xl p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <div className="flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span>NETWORK IO</span>
            </div>
            <span className="text-emerald-300 font-bold">{(metrics.networkDownKbps / 1024).toFixed(1)} MB/s</span>
          </div>
          <div className="h-1.5 w-full bg-[#071522] rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-400 transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"
              style={{ width: `${Math.min(100, (metrics.networkDownKbps / 1024) * 8)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
            <span>UP: {(metrics.networkUpKbps / 1024).toFixed(1)} MB/s</span>
            <span>Ping: 12ms</span>
          </div>
        </div>
      </div>

      {/* Real-time Telemetry Canvas Graph */}
      <div className="bg-[#071522] border border-cyan-500/30 rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-white">REALTIME HARMONIC FREQUENCY GRAPH</h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,217,255,0.8)]" />
              <span className="text-cyan-300">CPU</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-blue-300">RAM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-purple-300">GPU</span>
            </div>
          </div>
        </div>

        <div className="relative h-48 w-full bg-[#05090D] rounded-lg border border-cyan-500/20 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={900}
            height={192}
            className="w-full h-full block"
          />
        </div>
      </div>

      {/* Process Monitor & Storage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Process Table */}
        <div className="lg:col-span-8 bg-[#0B1927]/90 border border-cyan-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-mono uppercase tracking-wider text-white">ACTIVE OS PROCESSES & MICROSERVICES</h2>
            </div>
            <button
              onClick={() => {
                playSound('click');
                setProcesses(systemMonitorService.getProcesses());
              }}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cyan-500/20 text-slate-400 text-[11px] uppercase">
                  <th className="pb-2">PID</th>
                  <th className="pb-2">Process Name</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">CPU</th>
                  <th className="pb-2 text-right">Memory</th>
                  <th className="pb-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/10 text-slate-300">
                {processes.map(proc => (
                  <tr key={proc.pid} className="hover:bg-cyan-500/5 transition-colors">
                    <td className="py-2.5 text-slate-500">{proc.pid}</td>
                    <td className="py-2.5 font-medium text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {proc.name}
                    </td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        proc.status === 'running' 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-yellow-950 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {proc.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-cyan-300">{proc.cpu}%</td>
                    <td className="py-2.5 text-right">{proc.memoryMb} MB</td>
                    <td className="py-2.5 text-center">
                      <button
                        onClick={() => handleKill(proc.pid)}
                        className="p-1 rounded bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/60 transition-colors"
                        title="Kill Process"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Storage & SSD Breakdown */}
        <div className="lg:col-span-4 bg-[#0B1927]/90 border border-cyan-500/20 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-mono uppercase tracking-wider text-white">DRIVE UTILIZATION (NVMe)</h2>
            </div>

            <div className="p-3 bg-[#071522] rounded-lg border border-cyan-500/20 mb-4">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">Total Volume</span>
                <span className="text-white font-bold">2,048 GB</span>
              </div>
              <div className="h-3 w-full bg-[#05090D] rounded-full overflow-hidden flex">
                <div style={{ width: '38%' }} className="bg-cyan-500 h-full" title="System / Models (38%)" />
                <div style={{ width: '22%' }} className="bg-blue-600 h-full" title="Knowledge Vault (22%)" />
                <div style={{ width: '12%' }} className="bg-purple-600 h-full" title="Cache & Buffers (12%)" />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded bg-cyan-500" />
                  <span>Models (38%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded bg-blue-600" />
                  <span>Vault (22%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded bg-purple-600" />
                  <span>Free (28%)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="flex justify-between p-2 rounded bg-[#071522]/60 border border-cyan-500/10">
                <span className="text-slate-400">Read Throughput:</span>
                <span className="text-cyan-400">5,420 MB/s</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#071522]/60 border border-cyan-500/10">
                <span className="text-slate-400">Write Throughput:</span>
                <span className="text-cyan-400">4,890 MB/s</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#071522]/60 border border-cyan-500/10">
                <span className="text-slate-400">Disk Health:</span>
                <span className="text-emerald-400">100% SMART OK</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-500/20 text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Protected by STONIC Real-Time Sentinel Guard
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
