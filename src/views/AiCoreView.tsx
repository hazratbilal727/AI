import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Activity,
  Zap,
  Sliders,
  RotateCcw,
  ShieldCheck,
  Disc,
  Radio,
  Power
} from 'lucide-react';
import { OrbitalCore } from '../components/ai-core/OrbitalCore';
import { HudCard } from '../components/common/HudCard';
import { AssistantState } from '../types';
import { assistantService } from '../services/assistantService';
import { voiceService } from '../services/voiceService';
import { useToast } from '../components/common/Toast';

export const AiCoreView: React.FC = () => {
  const [coreState, setCoreState] = useState<AssistantState>(assistantService.getState());
  const [coreMode, setCoreMode] = useState<'quantum' | 'stealth' | 'overclock'>('quantum');
  const [frequency, setFrequency] = useState(4.82);
  const [damping, setDamping] = useState(94);
  const [sensitivity, setSensitivity] = useState(85);
  const [neuralLoad, setNeuralLoad] = useState(18.4);
  const { showToast } = useToast();

  useEffect(() => {
    return assistantService.subscribe((_, st) => setCoreState(st));
  }, []);

  // Subtle live jitter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setNeuralLoad(prev => {
        const delta = (Math.random() - 0.5) * 0.8;
        return Number(Math.max(12, Math.min(35, prev + delta)).toFixed(1));
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleStateCycle = () => {
    voiceService.playSfx('activate');
    const order: AssistantState[] = ['READY', 'LISTENING', 'THINKING', 'SPEAKING'];
    const nextIdx = (order.indexOf(coreState) + 1) % order.length;
    assistantService.setState(order[nextIdx]);
  };

  const handleModeChange = (mode: 'quantum' | 'stealth' | 'overclock') => {
    voiceService.playSfx('pulse');
    setCoreMode(mode);
    if (mode === 'stealth') {
      setFrequency(2.4);
      setDamping(98);
      showToast('Stealth Mode Engaged', 'Low-emissions orbital profile active', 'info');
    } else if (mode === 'overclock') {
      setFrequency(5.6);
      setDamping(88);
      showToast('Neural Boost Active', 'Max throughput multi-agent pipeline engaged', 'warning');
    } else {
      setFrequency(4.82);
      setDamping(94);
      showToast('Quantum Mode Initialized', 'Balanced harmonic frequency restored', 'success');
    }
  };

  const handleCalibrate = () => {
    voiceService.playSfx('complete');
    showToast('Orbital Calibration Complete', 'Phase drift calibrated to 0.002°', 'success');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 stonic-grid-bg">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-xl bg-[#071522] border border-[#00D9FF]/20">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-bold tracking-wide text-[#F2F7FA] font-display">
              AI Core Architecture &amp; Matrix
            </h1>
          </div>
          <p className="text-xs text-[#8295A7] mt-1 font-mono">
            Concentric multi-orbital harmonic lattice · Sub-nanosecond telemetry feedback loop
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCalibrate}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] hover:bg-[#00D9FF]/20 text-xs font-mono transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Calibrate Phases</span>
          </button>
        </div>
      </div>

      {/* Main Core Showcase & Diagnostics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Core Mode Controls */}
        <div className="lg:col-span-4 space-y-6">
          <HudCard
            title="Core Operational Mode"
            subtitle="GOVERNANCE"
            icon={<Power className="w-4 h-4" />}
          >
            <div className="space-y-3">
              {[
                {
                  id: 'quantum' as const,
                  label: 'Quantum Harmonic Core',
                  desc: 'Default balance of reasoning and energy consumption'
                },
                {
                  id: 'overclock' as const,
                  label: 'Neural Boost Overclock',
                  desc: 'High-velocity inference with parallel sub-agents'
                },
                {
                  id: 'stealth' as const,
                  label: 'Low-Emission Stealth Mesh',
                  desc: 'Ultra-low heat, silent background watchdog operation'
                }
              ].map(m => (
                <div
                  key={m.id}
                  onClick={() => handleModeChange(m.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    coreMode === m.id
                      ? 'bg-[#00D9FF]/15 border-[#00D9FF]/50 shadow-[0_0_15px_rgba(0,217,255,0.15)] text-[#F2F7FA]'
                      : 'bg-[#05090D] border-white/10 hover:border-white/20 text-[#8295A7]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold font-display">
                    <span className={coreMode === m.id ? 'text-[#00D9FF]' : ''}>{m.label}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        coreMode === m.id ? 'bg-[#00D9FF] shadow-[0_0_6px_#00D9FF]' : 'bg-neutral-600'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] font-mono text-[#8295A7] mt-1">{m.desc}</p>
                </div>
              ))}
            </div>
          </HudCard>

          {/* Real-time Parameters */}
          <HudCard
            title="Kinematic Parameters"
            subtitle="DIALS & THRESHOLDS"
            icon={<Sliders className="w-4 h-4" />}
          >
            <div className="space-y-4 text-xs font-mono">
              <div>
                <div className="flex justify-between text-[#8295A7] mb-1.5">
                  <span>Frequency Velocity</span>
                  <span className="text-[#00D9FF] font-semibold">{frequency} GHz</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="6.0"
                  step="0.1"
                  value={frequency}
                  onChange={e => setFrequency(parseFloat(e.target.value))}
                  className="w-full accent-[#00D9FF] bg-black/40 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[#8295A7] mb-1.5">
                  <span>Harmonic Damping</span>
                  <span className="text-[#00D9FF] font-semibold">{damping}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={damping}
                  onChange={e => setDamping(parseInt(e.target.value))}
                  className="w-full accent-[#00D9FF] bg-black/40 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[#8295A7] mb-1.5">
                  <span>Sensory Acoustic Threshold</span>
                  <span className="text-emerald-400 font-semibold">{sensitivity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={sensitivity}
                  onChange={e => setSensitivity(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 bg-black/40 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </HudCard>
        </div>

        {/* Center/Right: Large Orbital Core Stage */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-8 rounded-xl bg-[#071522] border border-[#00D9FF]/20 relative overflow-hidden min-h-[500px]">
          <div className="absolute inset-0 stonic-radial-gradient pointer-events-none" />

          {/* Top Bar inside Stage */}
          <div className="w-full flex items-center justify-between z-10 text-xs font-mono text-[#8295A7] mb-6">
            <div className="flex items-center gap-2">
              <Disc className="w-4 h-4 text-[#00D9FF]" />
              <span className="text-[#F2F7FA] font-medium tracking-wider">
                CORE STATUS: {coreState}
              </span>
            </div>
            <div className="text-[11px] text-[#00D9FF] font-semibold">
              LOAD: {neuralLoad}% · IPC: 0.8ms
            </div>
          </div>

          <div className="my-auto">
            <OrbitalCore
              state={coreState}
              size={400}
              interactive={true}
              onCoreClick={handleStateCycle}
            />
          </div>

          {/* Bottom Telemetry Strip */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-4 border-t border-[#00D9FF]/10 z-10 text-xs font-mono text-[#8295A7]">
            <div className="p-2.5 rounded bg-[#0B1927]/60 border border-white/5">
              <div className="text-[10px] text-[#8295A7]">ORBIT RINGS</div>
              <div className="text-sm font-semibold text-[#F2F7FA] mt-0.5">3 Tracks</div>
            </div>
            <div className="p-2.5 rounded bg-[#0B1927]/60 border border-white/5">
              <div className="text-[10px] text-[#8295A7]">PARTICLE BUFFER</div>
              <div className="text-sm font-semibold text-[#00D9FF] mt-0.5">48 Photons</div>
            </div>
            <div className="p-2.5 rounded bg-[#0B1927]/60 border border-white/5">
              <div className="text-[10px] text-[#8295A7]">ENCLAVE INTEGRITY</div>
              <div className="text-sm font-semibold text-emerald-400 mt-0.5">100.0%</div>
            </div>
            <div className="p-2.5 rounded bg-[#0B1927]/60 border border-white/5">
              <div className="text-[10px] text-[#8295A7]">AUDIO CARRIER</div>
              <div className="text-sm font-semibold text-[#F2F7FA] mt-0.5">Procedural</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
