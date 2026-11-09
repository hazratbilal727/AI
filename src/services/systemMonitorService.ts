/**
 * STONIC AI - System Monitor Service
 */

import { SystemMetrics, SystemProcess } from '../types';
import { initialSystemMetrics, initialProcesses } from '../data/mockData';

class SystemMonitorService {
  private metrics: SystemMetrics = { ...initialSystemMetrics };
  private processes: SystemProcess[] = [...initialProcesses];
  private history: { time: string; cpu: number; ram: number; gpu: number; netDown: number }[] = [];
  private listeners: (() => void)[] = [];
  private timer: number | null = null;

  constructor() {
    this.initHistory();
    this.startSimulation();
  }

  private initHistory() {
    const now = Date.now();
    for (let i = 20; i >= 0; i--) {
      const t = new Date(now - i * 3000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.history.push({
        time: t,
        cpu: 15 + Math.random() * 8,
        ram: 4000 + Math.random() * 200,
        gpu: 20 + Math.random() * 10,
        netDown: 800 + Math.random() * 300
      });
    }
  }

  getMetrics(): SystemMetrics {
    return { ...this.metrics };
  }

  getProcesses(): SystemProcess[] {
    return [...this.processes];
  }

  getHistory() {
    return [...this.history];
  }

  killProcess(pid: number): void {
    this.processes = this.processes.filter(p => p.pid !== pid);
    this.metrics.processCount = this.processes.length;
    this.notify();
  }

  private startSimulation() {
    if (typeof window === 'undefined') return;
    this.timer = window.setInterval(() => {
      // Jitter metrics realistically
      const cpuDelta = (Math.random() - 0.5) * 2;
      const ramDelta = (Math.random() - 0.5) * 40;
      const gpuDelta = (Math.random() - 0.5) * 3;
      const netDownDelta = (Math.random() - 0.5) * 80;

      this.metrics.cpuUsage = Number(Math.max(8, Math.min(65, this.metrics.cpuUsage + cpuDelta)).toFixed(1));
      this.metrics.ramUsageMb = Math.round(Math.max(3800, Math.min(8200, this.metrics.ramUsageMb + ramDelta)));
      this.metrics.gpuUsage = Number(Math.max(12, Math.min(85, this.metrics.gpuUsage + gpuDelta)).toFixed(1));
      this.metrics.networkDownKbps = Math.round(Math.max(300, Math.min(2400, this.metrics.networkDownKbps + netDownDelta)));
      this.metrics.uptimeSeconds += 2;

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.history.push({
        time: timeStr,
        cpu: this.metrics.cpuUsage,
        ram: this.metrics.ramUsageMb,
        gpu: this.metrics.gpuUsage,
        netDown: this.metrics.networkDownKbps
      });

      if (this.history.length > 25) {
        this.history.shift();
      }

      this.notify();
    }, 2000);
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }
}

export const systemMonitorService = new SystemMonitorService();
