import React, { useEffect, useState } from 'react';
import { Radio, Clock, Shield, Sparkles, Mic } from 'lucide-react';
import { AssistantState } from '../../types';
import { assistantService } from '../../services/assistantService';
import { voiceService } from '../../services/voiceService';

interface StatusBarProps {
  onQuickWake?: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({ onQuickWake }) => {
  const [state, setState] = useState<AssistantState>(assistantService.getState());
  const [time, setTime] = useState<{ local: string; utc: string }>({ local: '', utc: '' });

  useEffect(() => {
    const unsub = assistantService.subscribe((_, st) => setState(st));

    const updateClock = () => {
      const now = new Date();
      setTime({
        local: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        utc: `${now.toUTCString().slice(17, 25)} UTC`
      });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  const handleWake = () => {
    voiceService.playSfx('activate');
    if (state === 'READY') {
      assistantService.setState('LISTENING');
    } else {
      assistantService.setState('READY');
    }
    onQuickWake?.();
  };

  return (
    <footer className="h-10 px-6 border-t border-[#00D9FF]/15 bg-[#05090D] flex items-center justify-between text-xs font-mono text-[#8295A7] z-30 shrink-0">
      {/* Left: State & Enclave Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              state === 'LISTENING'
                ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]'
                : state === 'THINKING'
                ? 'bg-sky-400 shadow-[0_0_8px_#38BDF8]'
                : state === 'SPEAKING'
                ? 'bg-cyan-300 shadow-[0_0_8px_#00D9FF]'
                : 'bg-[#00D9FF] shadow-[0_0_6px_#00D9FF]'
            }`}
          />
          <span className="text-[#F2F7FA] font-medium tracking-wide">
            STATUS: {state}
          </span>
        </div>

        <span className="text-neutral-800">|</span>

        <div className="hidden sm:flex items-center gap-1.5 text-[#8295A7]">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>ZERO-TRUST ENCLAVE</span>
        </div>
      </div>

      {/* Center: Quick Wake Mic Button */}
      <div className="flex items-center">
        <button
          onClick={handleWake}
          className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono transition-all duration-200 ${
            state === 'LISTENING'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-[#0B1927] text-[#8295A7] hover:text-[#00D9FF] hover:border-[#00D9FF]/40 border-white/10'
          }`}
          title="Toggle Assistant Listening State"
        >
          <Mic className={`w-3 h-3 ${state === 'LISTENING' ? 'text-emerald-400 animate-pulse' : ''}`} />
          <span>{state === 'LISTENING' ? 'LISTENING...' : 'VOICE COCKPIT'}</span>
        </button>
      </div>

      {/* Right: Real-time clocks & Frequency */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1.5 text-[#8295A7]">
          <Radio className="w-3.5 h-3.5 text-[#00D9FF]" />
          <span>48.0 kHz PROCEDURAL</span>
        </div>

        <span className="hidden md:inline text-neutral-800">|</span>

        <div className="flex items-center gap-2 text-[#F2F7FA]">
          <Clock className="w-3.5 h-3.5 text-[#00D9FF]" />
          <span className="tabular-nums font-semibold">{time.local}</span>
          <span className="text-[#8295A7] text-[10px]">({time.utc})</span>
        </div>
      </div>
    </footer>
  );
};
