import React, { useState, useEffect } from 'react';
import { 
  X, Search, LayoutGrid, Terminal, Cpu, Bot, Workflow, 
  Target, Database, BookOpen, FileCode, Play, Briefcase, 
  Film, Globe, Activity, ShieldAlert, Wifi, Settings, Palette
} from 'lucide-react';
import { AppSection } from '../types';
import { playSound } from '../services/voiceService';

interface LauncherOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: AppSection) => void;
  currentSection: AppSection;
}

interface LauncherApp {
  id: AppSection;
  title: string;
  category: 'CORE' | 'AUTOMATION' | 'INTELLIGENCE' | 'WORKSPACE' | 'SYSTEM';
  description: string;
  icon: any;
  color: string;
}

const launcherApps: LauncherApp[] = [
  // CORE
  { id: 'dashboard', title: 'Main Dashboard', category: 'CORE', description: 'Convergence matrix & biometric feed', icon: LayoutGrid, color: 'text-cyan-400' },
  { id: 'command-center', title: 'AI Command Center', category: 'CORE', description: 'Orbital core & executive terminal', icon: Terminal, color: 'text-cyan-400' },
  { id: 'control-room', title: 'AI Control Room', category: 'CORE', description: 'Cognitive state & neural diagnostics', icon: Cpu, color: 'text-blue-400' },
  { id: 'agent-lab', title: 'Agent Laboratory', category: 'CORE', description: 'Deploy & configure autonomous agents', icon: Bot, color: 'text-purple-400' },

  // AUTOMATION
  { id: 'automation-studio', title: 'Automation Studio', category: 'AUTOMATION', description: 'Visual node pipeline DAG editor', icon: Workflow, color: 'text-cyan-400' },
  { id: 'mission-control', title: 'Mission Control', category: 'AUTOMATION', description: 'Strategic Kanban & milestone tracker', icon: Target, color: 'text-amber-400' },
  { id: 'tasks', title: 'Autonomous Tasks', category: 'AUTOMATION', description: 'Real-time task queue execution', icon: Play, color: 'text-emerald-400' },

  // INTELLIGENCE & LABS
  { id: 'knowledge-vault', title: 'Knowledge Vault', category: 'INTELLIGENCE', description: 'Document repo & vector graph', icon: Database, color: 'text-blue-400' },
  { id: 'research-lab', title: 'Research Lab', category: 'INTELLIGENCE', description: 'Deep research report synthesizer', icon: BookOpen, color: 'text-cyan-400' },
  { id: 'code-lab', title: 'Code Lab Simulator', category: 'INTELLIGENCE', description: 'Multi-language sandboxed IDE', icon: FileCode, color: 'text-emerald-400' },
  { id: 'simulation-lab', title: 'Simulation Lab', category: 'INTELLIGENCE', description: 'Interactive neural & swarm models', icon: Cpu, color: 'text-purple-400' },

  // WORKSPACE
  { id: 'digital-workspace', title: 'Digital Workspace', category: 'WORKSPACE', description: 'Tactical notes, tasks & calendar', icon: Briefcase, color: 'text-amber-400' },
  { id: 'media-studio', title: 'Media Studio', category: 'WORKSPACE', description: 'Multimodal asset & sound visualizer', icon: Film, color: 'text-pink-400' },
  { id: 'world-monitor', title: 'World Telemetry', category: 'WORKSPACE', description: 'Global satellite map & latency grid', icon: Globe, color: 'text-cyan-400' },

  // SYSTEM
  { id: 'system-monitor', title: 'System Monitor', category: 'SYSTEM', description: 'CPU/RAM/GPU telemetry & processes', icon: Activity, color: 'text-cyan-400' },
  { id: 'security-center', title: 'Security SOC', category: 'SYSTEM', description: 'DEFCON radar & drill defense', icon: ShieldAlert, color: 'text-red-400' },
  { id: 'remote-uplink', title: 'Remote Uplink', category: 'SYSTEM', description: 'Pair mobile companion PWA', icon: Wifi, color: 'text-blue-400' },
  { id: 'personalization', title: 'Personalization', category: 'SYSTEM', description: 'Themes, glowing accents & audio FX', icon: Palette, color: 'text-purple-400' },
  { id: 'settings', title: 'System Settings', category: 'SYSTEM', description: 'Identity, voice & network config', icon: Settings, color: 'text-slate-400' }
];

export const LauncherOverlay: React.FC<LauncherOverlayProps> = ({
  isOpen,
  onClose,
  onNavigate,
  currentSection
}) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = launcherApps.filter(app => 
    app.title.toLowerCase().includes(search.toLowerCase()) ||
    app.description.toLowerCase().includes(search.toLowerCase()) ||
    app.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = ['CORE', 'AUTOMATION', 'INTELLIGENCE', 'WORKSPACE', 'SYSTEM'] as const;

  return (
    <div className="fixed inset-0 z-50 bg-[#05090D]/95 backdrop-blur-xl flex flex-col p-6 animate-fade-in overflow-y-auto custom-scrollbar">
      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono tracking-wider text-white">APPLICATION LAUNCHER</h1>
            <p className="text-xs text-slate-400 font-mono">STONIC AI Integrated Module Directory</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-80">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search all applications..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
            className="w-full pl-9 pr-3 py-2 bg-[#0B1927] border border-cyan-500/30 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono shadow-inner"
          />
        </div>

        {/* Close */}
        <button
          onClick={() => {
            playSound('click');
            onClose();
          }}
          className="p-2 rounded-lg bg-[#0B1927] border border-cyan-500/20 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Grid categorized */}
      <div className="max-w-6xl w-full mx-auto py-8 space-y-8">
        {categories.map(cat => {
          const appsInCat = filtered.filter(a => a.category === cat);
          if (appsInCat.length === 0) return null;

          return (
            <div key={cat} className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400/80">
                <span>{cat} MODULES</span>
                <div className="h-px flex-1 bg-cyan-500/15" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {appsInCat.map(app => {
                  const Icon = app.icon;
                  const isActive = currentSection === app.id;

                  return (
                    <button
                      key={app.id}
                      onClick={() => {
                        playSound('click');
                        onNavigate(app.id);
                        onClose();
                      }}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between group ${
                        isActive
                          ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(0,217,255,0.3)]'
                          : 'bg-[#0B1927]/80 border-cyan-500/15 hover:border-cyan-500/50 hover:bg-[#0B1927] hover:shadow-[0_0_15px_rgba(0,217,255,0.1)]'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2.5 rounded-lg bg-black/40 border border-white/5 ${app.color} group-hover:scale-110 transition-transform`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {isActive && (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                            Active
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors font-mono">
                          {app.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {app.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
