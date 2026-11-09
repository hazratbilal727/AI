import React, { useState } from 'react';
import {
  Plus,
  FileText,
  Brain,
  History,
  Grid,
  Sparkles,
  Check,
  FolderOpen
} from 'lucide-react';
import { SystemAccessGlobe } from './SystemAccessGlobe';
import { voiceService } from '../../services/voiceService';
import { useToast } from '../common/Toast';

interface ConvergenceMatrixProps {
  onOpenMemory?: () => void;
  onOpenHistory?: () => void;
  onOpenApps?: () => void;
}

export const ConvergenceMatrix: React.FC<ConvergenceMatrixProps> = ({
  onOpenMemory,
  onOpenHistory,
  onOpenApps
}) => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [filesCount, setFilesCount] = useState(3);
  const { showToast } = useToast();

  const handleAddFiles = () => {
    voiceService.playSfx('click');
    setFilesCount(prev => prev + 1);
    showToast('File Attached', 'Document ingested into neural memory buffer', 'success');
  };

  const handleNodeClick = (node: string, action?: () => void) => {
    voiceService.playSfx('click');
    setActiveNode(node);
    action?.();
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-[#071522]/95 via-[#0B1E2E]/90 to-[#071522]/95 border border-[#00D9FF]/20 p-5 shadow-[0_0_30px_rgba(0,217,255,0.06)] overflow-hidden">
      {/* Background cyber grid */}
      <div className="absolute inset-0 stonic-grid-bg opacity-30 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Vertical Mini Dock */}
        <div className="hidden sm:flex flex-col items-center justify-center p-2 rounded-2xl bg-[#05090D]/80 border border-white/10 shrink-0 space-y-3">
          <button
            onClick={handleAddFiles}
            className="w-8 h-8 rounded-xl bg-[#00D9FF]/15 border border-[#00D9FF]/40 text-[#00D9FF] hover:bg-[#00D9FF]/25 flex items-center justify-center transition-all shadow-[0_0_10px_rgba(0,217,255,0.2)]"
            title="Add Context / Document"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => showToast('AI Docs Active', '3 documents indexed in local memory', 'info')}
            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 hover:border-[#00D9FF]/40 text-[#8295A7] hover:text-[#00D9FF] flex items-center justify-center transition-all"
            title="Browse Indexed Files"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenMemory}
            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 hover:border-[#00D9FF]/40 text-[#8295A7] hover:text-[#00D9FF] flex items-center justify-center transition-all"
            title="Open Memory Enclave"
          >
            <Brain className="w-4 h-4" />
          </button>
          <div className="text-[9px] font-mono text-[#8295A7] tracking-widest uppercase [writing-mode:vertical-rl] rotate-180 pt-1">
            MY AI DOCS
          </div>
        </div>

        {/* 4 Connected Input Nodes */}
        <div className="flex-1 flex flex-col justify-center space-y-3 max-w-xs">
          {/* Node 1: ADD FILES */}
          <div
            onClick={handleAddFiles}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-[#05090D]/90 border border-[#00D9FF]/40 hover:border-[#00D9FF] transition-all cursor-pointer group shadow-[0_0_15px_rgba(0,217,255,0.08)]"
          >
            <div className="w-7 h-7 rounded-lg bg-[#00D9FF]/20 border border-[#00D9FF]/40 text-[#00D9FF] flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#F2F7FA] font-display flex items-center gap-2">
                <span>ADD FILES</span>
                <span className="text-[10px] font-mono text-[#00D9FF]">({filesCount})</span>
              </div>
              <div className="text-[10px] font-mono text-[#8295A7] truncate">
                All file formats supported
              </div>
            </div>
          </div>

          {/* Node 2: MEMORY */}
          <div
            onClick={() => handleNodeClick('memory', onOpenMemory)}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-[#05090D]/90 border border-red-500/30 hover:border-red-500 transition-all cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#F2F7FA] font-display flex items-center gap-2">
                <span>MEMORY</span>
                <span className="text-[10px] font-mono text-red-400">Vault-08</span>
              </div>
              <div className="text-[10px] font-mono text-[#8295A7] truncate">
                Persistent storage
              </div>
            </div>
          </div>

          {/* Node 3: HISTORY */}
          <div
            onClick={() => handleNodeClick('history', onOpenHistory)}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-[#05090D]/90 border border-[#168BFF]/30 hover:border-[#168BFF] transition-all cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#168BFF]/20 border border-[#168BFF]/40 text-[#168BFF] flex items-center justify-center shrink-0">
              <History className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#F2F7FA] font-display">
                <span>HISTORY</span>
              </div>
              <div className="text-[10px] font-mono text-[#8295A7] truncate">
                Recorded conversations
              </div>
            </div>
          </div>

          {/* Node 4: APPS */}
          <div
            onClick={() => handleNodeClick('apps', onOpenApps)}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-[#05090D]/90 border border-indigo-500/30 hover:border-indigo-500 transition-all cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0">
              <Grid className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#F2F7FA] font-display">
                <span>APPS</span>
              </div>
              <div className="text-[10px] font-mono text-[#8295A7] truncate">
                External integrations
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Glowing Convergence Beam (SVG) */}
        <div className="hidden lg:flex w-24 h-48 items-center justify-center shrink-0">
          <svg viewBox="0 0 100 200" className="w-full h-full">
            <defs>
              <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00D9FF" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Dotted converging curved tracks */}
            <path d="M 0,25 C 50,25 60,100 100,100" fill="none" stroke="#00D9FF" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
            <path d="M 0,75 C 40,75 60,100 100,100" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            <path d="M 0,125 C 40,125 60,100 100,100" fill="none" stroke="#168BFF" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            <path d="M 0,175 C 50,175 60,100 100,100" fill="none" stroke="#818CF8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />

            {/* Central convergence node */}
            <circle cx="100" cy="100" r="4" fill="#00D9FF" filter="drop-shadow(0 0 6px #00D9FF)" />
          </svg>
        </div>

        {/* System Access Particle Globe (Right section of Convergence) */}
        <div className="w-full sm:w-56 shrink-0">
          <SystemAccessGlobe />
        </div>
      </div>
    </div>
  );
};
