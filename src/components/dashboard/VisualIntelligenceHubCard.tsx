import React, { useState } from 'react';
import { Maximize2, Sparkles, Box, RefreshCw } from 'lucide-react';
import { voiceService } from '../../services/voiceService';
import { useToast } from '../common/Toast';

interface VisualIntelligenceHubCardProps {
  onOpenFullHub?: () => void;
}

export const VisualIntelligenceHubCard: React.FC<VisualIntelligenceHubCardProps> = ({
  onOpenFullHub
}) => {
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [materialized, setMaterialized] = useState(false);
  const { showToast } = useToast();

  const handleSimulateMaterialize = () => {
    voiceService.playSfx('pulse');
    setIsSynthesizing(true);
    showToast('Materializing Mockup', 'Compiling isometric flowchart blueprint...', 'info');

    setTimeout(() => {
      setIsSynthesizing(false);
      setMaterialized(true);
      voiceService.playSfx('complete');
      showToast('Visual Output Ready', 'Neural flowchart materialized', 'success');
    }, 1200);
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#0B1E2E]/90 to-[#071522]/95 border border-[#00D9FF]/20 p-5 shadow-[0_0_30px_rgba(0,217,255,0.06)] overflow-hidden min-h-[220px] flex flex-col justify-between">
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00D9FF]/40" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00D9FF]/40" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00D9FF]/40" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00D9FF]/40" />

      {/* Top Bar inside Card */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#00D9FF]/15 border border-[#00D9FF]/40 text-[#00D9FF] text-[10px] font-mono tracking-wider">
            VISUAL HUB
          </span>
          <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] font-mono text-[#8295A7]">
            1/1
          </span>
        </div>

        <button
          onClick={onOpenFullHub}
          className="p-1.5 rounded-lg text-[#8295A7] hover:text-[#00D9FF] hover:bg-white/5 transition-colors"
          title="Expand Full Visual Hub"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Center Materialization View */}
      {materialized ? (
        <div className="my-auto py-3 flex flex-col items-center justify-center text-center animate-fade-in">
          {/* Holographic Wireframe Flowchart Preview */}
          <div className="w-full max-w-md h-24 rounded-lg bg-[#05090D] border border-[#00D9FF]/30 p-2 relative flex items-center justify-around stonic-grid-bg">
            <div className="px-2.5 py-1 rounded bg-[#00D9FF]/20 border border-[#00D9FF]/50 text-[10px] font-mono text-[#00D9FF]">
              INPUT_STREAM
            </div>
            <div className="h-0.5 w-8 bg-[#00D9FF] animate-pulse" />
            <div className="px-2.5 py-1 rounded bg-indigo-500/20 border border-indigo-500/50 text-[10px] font-mono text-indigo-300">
              NEURAL_ROUTING
            </div>
            <div className="h-0.5 w-8 bg-[#00D9FF] animate-pulse" />
            <div className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/50 text-[10px] font-mono text-emerald-300">
              DESKTOP_OUTPUT
            </div>
          </div>
          <div className="mt-2 text-xs font-mono text-[#00D9FF]">
            BLUEPRINT // FLOWCHART_ARCH_V4.2
          </div>
          <button
            onClick={() => setMaterialized(false)}
            className="mt-1 text-[10px] font-mono text-[#8295A7] hover:text-white underline"
          >
            Reset Stage
          </button>
        </div>
      ) : (
        <div className="my-auto py-6 flex flex-col items-center justify-center text-center">
          {/* Futuristic Hexagonal Cube Icon */}
          <div className="w-12 h-12 mb-3 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-xl border border-[#00D9FF]/30 rotate-45 animate-pulse" />
            <Box className="w-6 h-6 text-[#00D9FF]" />
          </div>

          <h3 className="text-sm font-bold tracking-wider text-[#F2F7FA] font-display uppercase mb-1">
            VISUAL INTELLIGENCE HUB
          </h3>
          <p className="text-xs text-[#8295A7] font-mono max-w-sm leading-relaxed mb-3">
            Images, Flowcharts, and Mockups will materialize here.
          </p>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#00D9FF]/80 tracking-widest uppercase">
              {isSynthesizing ? 'MATERIALIZING BLUEPRINT...' : 'SYSTEM READY - AWAITING DATA INPUT'}
            </span>

            <button
              onClick={handleSimulateMaterialize}
              disabled={isSynthesizing}
              className="ml-2 px-2.5 py-1 rounded bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 border border-[#00D9FF]/30 text-[10px] font-mono text-[#00D9FF] transition-colors"
            >
              {isSynthesizing ? 'Rendering...' : 'Materialize Sample'}
            </button>
          </div>
        </div>
      )}

      {/* Subtle Bottom Status Line */}
      <div className="w-full flex items-center justify-between text-[9px] font-mono text-[#8295A7] pt-2 border-t border-white/5">
        <span>RENDER_ACCEL: WEBGL2</span>
        <span>LATENCY: 0.4MS</span>
      </div>
    </div>
  );
};
