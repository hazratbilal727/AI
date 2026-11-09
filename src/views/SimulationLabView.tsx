import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Cpu, Network, Zap, 
  Layers, Mic, Workflow, ChevronRight, Activity, Sparkles
} from 'lucide-react';
import { playSound } from '../services/voiceService';

type SimModule = 'ai-pipeline' | 'swarm' | 'neural-net' | 'data-flow' | 'voice-spec' | 'automation';

export const SimulationLabView: React.FC = () => {
  const [activeModule, setActiveModule] = useState<SimModule>('ai-pipeline');
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState<number>(1);
  const [tick, setTick] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([
    '> Simulation Lab Environment initialized.',
    '> Clock source: High-Resolution Performance Counter (Simulated 60Hz).'
  ]);

  // Tick loop
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [isRunning, speed]);

  const toggleRun = () => {
    playSound('click');
    setIsRunning(!isRunning);
    setLogs(prev => [...prev, `> Simulation ${!isRunning ? 'RESUMED' : 'PAUSED'}.`]);
  };

  const resetSim = () => {
    playSound('activate');
    setTick(0);
    setLogs(prev => [...prev, '> Simulation parameters reset to T0.']);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#0B1927]/90 border border-cyan-500/30 rounded-xl p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-[0_0_20px_rgba(0,217,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-wider text-white">SIMULATION LABORATORY</h1>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
              Interactive Sandbox
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate computational pipelines, multi-agent swarms, neural backpropagation, and spectral voice decoders in real time.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          {/* Speed selector */}
          <div className="flex items-center bg-[#071522] border border-cyan-500/20 rounded-lg p-0.5 text-xs font-mono">
            {[1, 2, 4].map(s => (
              <button
                key={s}
                onClick={() => { playSound('click'); setSpeed(s); }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  speed === s ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            onClick={toggleRun}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase transition-all ${
              isRunning 
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30' 
                : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isRunning ? 'Pause' : 'Resume'}
          </button>

          <button
            onClick={resetSim}
            className="p-1.5 rounded-lg bg-[#071522] border border-cyan-500/20 text-slate-400 hover:text-white transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Module Selector Bar */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {[
          { id: 'ai-pipeline', label: 'AI Pipeline', icon: Cpu },
          { id: 'swarm', label: 'Swarm Mesh', icon: Network },
          { id: 'neural-net', label: 'Neural Network', icon: Zap },
          { id: 'data-flow', label: 'Data Bus', icon: Layers },
          { id: 'voice-spec', label: 'Spectral Voice', icon: Mic },
          { id: 'automation', label: 'Automations', icon: Workflow }
        ].map(mod => {
          const Icon = mod.icon;
          const isActive = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => {
                playSound('click');
                setActiveModule(mod.id as SimModule);
              }}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-mono ${
                isActive
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,217,255,0.2)]'
                  : 'bg-[#0B1927]/80 border-cyan-500/10 text-slate-400 hover:text-slate-200 hover:border-cyan-500/30'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{mod.label}</span>
            </button>
          );
        })}
      </div>

      {/* Simulation Stage */}
      <div className="bg-[#071522] border border-cyan-500/30 rounded-xl p-6 min-h-[380px] flex flex-col justify-between relative overflow-hidden shadow-2xl">
        {/* Ambient Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00d9ff06_1px,transparent_1px),linear-gradient(to_bottom,#00d9ff06_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* 1. AI PIPELINE */}
        {activeModule === 'ai-pipeline' && (
          <div className="space-y-8 relative z-10 my-auto">
            <div className="text-center">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Transformer Multi-Head Attention Feedforward Simulator
              </h3>
              <p className="text-xs text-cyan-400/80 font-mono mt-1">Iteration Step #{tick} • Tokens Processed: {tick * 32}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {[
                { title: 'User Prompt', desc: 'String Vectorizer', stage: 0 },
                { title: 'Byte Tokenizer', desc: 'BPE Vocab 128k', stage: 1 },
                { title: 'Embedding Tensor', desc: '4096 Dimension', stage: 2 },
                { title: 'Self-Attention', desc: '64 Attention Heads', stage: 3 },
                { title: 'Softmax Output', desc: 'Logit Probabilities', stage: 4 }
              ].map((step, idx) => {
                const active = (tick % 5) === step.stage;
                return (
                  <React.Fragment key={idx}>
                    <div className={`p-4 rounded-xl border text-center transition-all w-44 ${
                      active
                        ? 'bg-cyan-500/25 border-cyan-400 shadow-[0_0_20px_rgba(0,217,255,0.4)] scale-105'
                        : 'bg-[#0B1927]/90 border-cyan-500/20 opacity-70'
                    }`}>
                      <div className="text-xs font-bold text-white font-mono">{step.title}</div>
                      <div className="text-[10px] text-cyan-300 font-mono mt-1">{step.desc}</div>
                      <div className="mt-2 text-[9px] font-mono uppercase">
                        {active ? (
                          <span className="text-cyan-400 animate-pulse">PROCESSING</span>
                        ) : (
                          <span className="text-slate-500">STANDBY</span>
                        )}
                      </div>
                    </div>
                    {idx < 4 && <ChevronRight className="w-5 h-5 text-cyan-500/40 hidden md:block" />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. SWARM MESH */}
        {activeModule === 'swarm' && (
          <div className="relative z-10 my-auto text-center space-y-6">
            <div className="text-center">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Autonomous Swarm Consensus Mesh
              </h3>
              <p className="text-xs text-cyan-400/80 font-mono mt-1">Gossip Protocol Latency: 1.2ms • Active Peer Nodes: 8</p>
            </div>

            <div className="flex justify-center items-center gap-12 relative">
              {['Sentinel-01', 'CyberGuard-X', 'AeroScan-09', 'DataSync-04'].map((node, i) => {
                const isLeader = (tick % 4) === i;
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isLeader
                        ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_25px_rgba(0,217,255,0.5)] scale-110'
                        : 'bg-[#0B1927] border-cyan-500/20 text-slate-400'
                    }`}>
                      <Network className={`w-8 h-8 ${isLeader ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
                    </div>
                    <div className="text-xs font-mono font-bold text-white mt-2">{node}</div>
                    <div className="text-[10px] font-mono text-cyan-400">
                      {isLeader ? 'LEADER (RAFT)' : 'FOLLOWER'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. NEURAL NETWORK */}
        {activeModule === 'neural-net' && (
          <div className="relative z-10 my-auto text-center space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Deep Neural Layer Backpropagation Simulation
            </h3>
            <svg className="w-full max-w-xl h-48 mx-auto">
              {/* Layers: 3 inputs, 4 hidden, 2 output */}
              {[
                { x: 50, ys: [40, 96, 152], color: '#38bdf8' },
                { x: 250, ys: [24, 72, 120, 168], color: '#00d9ff' },
                { x: 450, ys: [60, 132], color: '#a855f7' }
              ].map((layer, lIdx) => (
                <g key={lIdx}>
                  {layer.ys.map((y, nIdx) => (
                    <circle
                      key={nIdx}
                      cx={layer.x}
                      cy={y}
                      r={10}
                      fill={layer.color}
                      opacity={0.8}
                      className="animate-pulse"
                    />
                  ))}
                </g>
              ))}
              {/* Interconnect lines */}
              <line x1="60" y1="96" x2="240" y2="72" stroke="rgba(0,217,255,0.3)" strokeWidth="1.5" />
              <line x1="60" y1="40" x2="240" y2="24" stroke="rgba(0,217,255,0.4)" strokeWidth="1.5" />
              <line x1="60" y1="152" x2="240" y2="168" stroke="rgba(0,217,255,0.3)" strokeWidth="1.5" />
              <line x1="260" y1="72" x2="440" y2="60" stroke="rgba(168,85,247,0.5)" strokeWidth="2" />
              <line x1="260" y1="120" x2="440" y2="132" stroke="rgba(168,85,247,0.5)" strokeWidth="2" />
            </svg>
            <div className="text-[11px] font-mono text-slate-400">
              Loss: <span className="text-emerald-400">{(0.042 / (1 + tick * 0.05)).toFixed(5)}</span> • Gradient Norm: <span className="text-cyan-300">0.0019</span>
            </div>
          </div>
        )}

        {/* 4. DATA BUS */}
        {activeModule === 'data-flow' && (
          <div className="relative z-10 my-auto text-center space-y-6">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              High-Throughput Ring Buffer Pipeline
            </h3>
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              {['Ingress Queue', 'Sanitization Engine', 'Vector Embedding', 'Egress Socket'].map((queue, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#0B1927] border border-cyan-500/20 text-center">
                  <div className="text-xs font-mono font-bold text-white">{queue}</div>
                  <div className="text-lg font-bold text-cyan-400 font-mono my-2">
                    {Math.floor(Math.sin(tick + i) * 20 + 45)} MB/s
                  </div>
                  <div className="w-full bg-[#071522] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-cyan-400 h-full transition-all"
                      style={{ width: `${(tick * 15 + i * 20) % 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. VOICE SPECTRUM */}
        {activeModule === 'voice-spec' && (
          <div className="relative z-10 my-auto text-center space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Phoneme Spectral Decomposition (FFT 1024)
            </h3>
            <div className="flex items-end justify-center gap-1.5 h-36 max-w-md mx-auto">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2.5 rounded-t bg-cyan-400 shadow-[0_0_8px_rgba(0,217,255,0.6)] transition-all duration-75"
                  style={{
                    height: `${Math.max(12, Math.abs(Math.sin(tick * 0.3 + i * 0.4)) * 120)}px`
                  }}
                />
              ))}
            </div>
            <div className="text-xs font-mono text-cyan-300">
              Confidence: 98.4% • Voiceprint Match: Commander Authorized
            </div>
          </div>
        )}

        {/* 6. AUTOMATION EXECUTION */}
        {activeModule === 'automation' && (
          <div className="relative z-10 my-auto text-center space-y-6">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Asynchronous DAG Automation Engine
            </h3>
            <div className="flex items-center justify-center gap-4">
              {['Trigger Event', 'Condition Filter', 'API Dispatch', 'Ledger Write'].map((step, i) => {
                const active = (tick % 4) === i;
                return (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border w-40 text-center transition-all ${
                      active
                        ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(0,217,255,0.4)]'
                        : 'bg-[#0B1927] border-cyan-500/20 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold text-white">{step}</div>
                    <div className="text-[10px] font-mono text-cyan-400 mt-1">
                      {active ? 'RUNNING' : 'QUEUED'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Simulation Output Bar */}
        <div className="mt-6 pt-3 border-t border-cyan-500/20 flex items-center justify-between text-xs font-mono text-slate-400">
          <div>
            STATUS: <span className="text-cyan-400 font-bold">{isRunning ? 'ACTIVE RUNTIME' : 'SUSPENDED'}</span>
          </div>
          <div>
            TOTAL TICKS: <span className="text-white font-bold">{tick}</span>
          </div>
          <div>
            EXECUTION EFFICIENCY: <span className="text-emerald-400 font-bold">99.98%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
