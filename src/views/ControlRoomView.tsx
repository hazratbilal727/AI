import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Activity,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Shield,
  Radio,
  Sliders,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import { AssistantState } from '../types';
import { OrbitalCore } from '../components/ai-core/OrbitalCore';
import { voiceService } from '../services/voiceService';
import { useToast } from '../components/common/Toast';

export const ControlRoomView: React.FC = () => {
  const [operationalState, setOperationalState] = useState<AssistantState>('READY');
  const [activeModules, setActiveModules] = useState([
    { id: 'mod-1', name: 'Neural Core Vector Bus', status: 'optimal', load: 18.4 },
    { id: 'mod-2', name: 'Acoustic Phoneme Synthesizer', status: 'optimal', load: 24.1 },
    { id: 'mod-3', name: 'Planetary Sensor Mesh Ingest', status: 'optimal', load: 12.0 },
    { id: 'mod-4', name: 'Vault-08 Cryptographic Seal', status: 'secure', load: 8.5 }
  ]);

  const { showToast } = useToast();

  const statesList: {
    state: AssistantState;
    label: string;
    color: string;
    bg: string;
    border: string;
    description: string;
  }[] = [
    { state: 'STANDBY', label: 'Standby', color: 'text-neutral-400', bg: 'bg-neutral-500/10', border: 'border-neutral-500/30', description: 'Low-power idle state; listeners active' },
    { state: 'READY', label: 'Ready', color: 'text-[#00D9FF]', bg: 'bg-[#00D9FF]/10', border: 'border-[#00D9FF]/30', description: 'Fully synchronized; awaiting directives' },
    { state: 'LISTENING', label: 'Listening', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', description: 'Acoustic waveform intake and tokenization' },
    { state: 'PROCESSING', label: 'Processing', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30', description: 'Neural tensor matrix cross-referencing' },
    { state: 'EXECUTING', label: 'Executing', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', description: 'Dispatching instructions to agent threads' },
    { state: 'RESPONDING', label: 'Responding', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', description: 'Synthesizing voice & visual responses' },
    { state: 'ERROR', label: 'Error', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', description: 'Parity check anomaly or timeout triggered' }
  ];

  const handleSetState = (s: AssistantState) => {
    voiceService.playSfx(s === 'ERROR' ? 'alert' : 'activate');
    setOperationalState(s);
    showToast(`State Switched to ${s}`, `AI Control Room operating state calibrated`, s === 'ERROR' ? 'error' : 'info');
  };

  const currentConfig = statesList.find(s => s.state === operationalState) || statesList[1];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 stonic-grid-bg">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#071522] via-[#0B1E2E] to-[#071522] border border-[#00D9FF]/20 shadow-[0_0_30px_rgba(0,217,255,0.06)]">
        <div>
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-bold tracking-wide text-[#F2F7FA] font-display">
              AI Operations Control Room
            </h1>
            <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border uppercase ${currentConfig.bg} ${currentConfig.color} ${currentConfig.border}`}>
              STATE: {operationalState}
            </span>
          </div>
          <p className="text-xs text-[#8295A7] mt-1 font-mono">
            Cinematic operational command deck monitoring real-time cognitive phases and multi-module loads.
          </p>
        </div>

        {/* State Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 rounded-xl bg-[#05090D] border border-white/10">
          {statesList.map(st => (
            <button
              key={st.state}
              onClick={() => handleSetState(st.state)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                operationalState === st.state
                  ? `${st.bg} ${st.color} ${st.border} font-bold shadow-sm`
                  : 'text-[#8295A7] hover:text-[#F2F7FA]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Control Room Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Active System Modules (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0B1E2E]/90 border border-[#00D9FF]/20">
            <h3 className="text-xs font-mono text-[#00D9FF] uppercase tracking-wider mb-3">
              ACTIVE COGNITIVE MODULES
            </h3>
            <div className="space-y-3">
              {activeModules.map(mod => (
                <div key={mod.id} className="p-3 rounded-xl bg-[#05090D] border border-white/5">
                  <div className="flex items-center justify-between text-xs font-medium text-[#F2F7FA] font-display mb-1.5">
                    <span>{mod.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">
                      {mod.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#8295A7] mb-1">
                    <span>Load</span>
                    <span className="text-[#00D9FF]">{mod.load}%</span>
                  </div>
                  <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00D9FF] to-[#168BFF] rounded-full"
                      style={{ width: `${mod.load * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1E2E]/90 border border-[#00D9FF]/20">
            <h3 className="text-xs font-mono text-[#8295A7] uppercase tracking-wider mb-2">
              CURRENT STATE DIRECTIVE
            </h3>
            <p className="text-xs text-[#F2F7FA] font-sans leading-relaxed">
              {currentConfig.description}
            </p>
          </div>
        </div>

        {/* Center: Large Cinematic Core (8 cols) */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-8 rounded-2xl bg-[#071522] border border-[#00D9FF]/25 shadow-[0_0_35px_rgba(0,217,255,0.08)] relative overflow-hidden min-h-[480px]">
          <div className="absolute inset-0 stonic-radial-gradient pointer-events-none" />

          <div className="w-full flex items-center justify-between z-10 text-xs font-mono text-[#8295A7] mb-4">
            <span className="text-[#00D9FF]">ORBITAL LATENT SPACE MATRIX</span>
            <span className="text-white">FREQ: 4.82 GHz · PHASE 0.002°</span>
          </div>

          <div className="my-auto">
            <OrbitalCore
              state={operationalState === 'ERROR' ? 'READY' : operationalState}
              size={380}
              interactive={true}
              onCoreClick={() => {
                const cycle: AssistantState[] = ['STANDBY', 'READY', 'LISTENING', 'PROCESSING', 'EXECUTING', 'RESPONDING'];
                const nxt = cycle[(cycle.indexOf(operationalState) + 1) % cycle.length];
                handleSetState(nxt);
              }}
            />
          </div>

          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 z-10 pt-4 border-t border-white/5 text-center text-xs font-mono text-[#8295A7]">
            <div className="p-2.5 rounded-lg bg-[#05090D] border border-white/5">
              <div className="text-[10px]">TENSOR PIPELINE</div>
              <div className="text-sm font-semibold text-white mt-0.5">Active</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#05090D] border border-white/5">
              <div className="text-[10px]">AUDIO BUS</div>
              <div className="text-sm font-semibold text-[#00D9FF] mt-0.5">48kHz</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#05090D] border border-white/5">
              <div className="text-[10px]">ZERO-TRUST</div>
              <div className="text-sm font-semibold text-emerald-400 mt-0.5">Enforced</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#05090D] border border-white/5">
              <div className="text-[10px]">THREAT LEVEL</div>
              <div className="text-sm font-semibold text-emerald-400 mt-0.5">DEFCON 5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
