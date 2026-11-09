import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Command,
  LayoutDashboard,
  Terminal,
  Cpu,
  Bot,
  Globe,
  Sliders,
  CheckSquare,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  Brain,
  Code2,
  Workflow
} from 'lucide-react';
import { AppSection } from '../../types';
import { voiceService } from '../../services/voiceService';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: AppSection) => void;
  onRunCommand?: (cmd: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onRunCommand
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const commands: {
    id: string;
    label: string;
    category: 'Workspaces' | 'Actions' | 'Systems';
    section?: AppSection;
    command?: string;
    icon: React.ReactNode;
  }[] = [
    // Workspaces
    { id: 'ws-dash', label: 'Command Core Dashboard', category: 'Workspaces', section: 'dashboard', icon: <LayoutDashboard className="w-4 h-4 text-[#00D9FF]" /> },
    { id: 'ws-cmd', label: 'AI Command Center', category: 'Workspaces', section: 'command-center', icon: <Terminal className="w-4 h-4 text-[#00D9FF]" /> },
    { id: 'ws-ctrl', label: 'AI Control Room', category: 'Workspaces', section: 'control-room', icon: <Cpu className="w-4 h-4 text-emerald-400" /> },
    { id: 'ws-chat', label: 'AI Assistant Console', category: 'Workspaces', section: 'assistant', icon: <Terminal className="w-4 h-4 text-sky-400" /> },
    { id: 'ws-aglab', label: 'Agent Laboratory & Builder', category: 'Workspaces', section: 'agent-lab', icon: <Bot className="w-4 h-4 text-indigo-400" /> },
    { id: 'ws-auto', label: 'Automation Studio (Node Builder)', category: 'Workspaces', section: 'automation-studio', icon: <Workflow className="w-4 h-4 text-amber-400" /> },
    { id: 'ws-miss', label: 'Mission Control Matrix', category: 'Workspaces', section: 'mission-control', icon: <CheckSquare className="w-4 h-4 text-emerald-400" /> },
    { id: 'ws-vault', label: 'Knowledge Vault & Graph', category: 'Workspaces', section: 'knowledge-vault', icon: <Brain className="w-4 h-4 text-cyan-300" /> },
    { id: 'ws-res', label: 'AI Research Laboratory', category: 'Workspaces', section: 'research-lab', icon: <Globe className="w-4 h-4 text-sky-400" /> },
    { id: 'ws-code', label: 'Code Laboratory & Editor', category: 'Workspaces', section: 'code-lab', icon: <Code2 className="w-4 h-4 text-purple-400" /> },
    { id: 'ws-mon', label: 'System Monitor & Processes', category: 'Workspaces', section: 'system-monitor', icon: <Cpu className="w-4 h-4 text-rose-400" /> },
    { id: 'ws-sec', label: 'Security Operations Center (SOC)', category: 'Workspaces', section: 'security-center', icon: <Shield className="w-4 h-4 text-red-400" /> },
    { id: 'ws-sim', label: 'Simulation Laboratory', category: 'Workspaces', section: 'simulation-lab', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { id: 'ws-work', label: 'Digital Workspace & Planner', category: 'Workspaces', section: 'workspace', icon: <Layers className="w-4 h-4 text-emerald-400" /> },
    { id: 'ws-pers', label: 'Personalization & Themes', category: 'Workspaces', section: 'personalization', icon: <Sliders className="w-4 h-4 text-[#00D9FF]" /> },

    // Actions
    { id: 'act-voice', label: 'Activate Voice Mode ("Hey Stonic")', category: 'Actions', section: 'voice', icon: <Sparkles className="w-4 h-4 text-[#00D9FF]" /> },
    { id: 'act-globe', label: 'Open World Sensor 3D Globe', category: 'Actions', section: 'world-monitor', icon: <Globe className="w-4 h-4 text-sky-400" /> },
    { id: 'act-mem', label: 'Index New Memory Register', category: 'Actions', section: 'memory', icon: <Brain className="w-4 h-4 text-emerald-400" /> },
    { id: 'act-sett', label: 'Open System Governance Settings', category: 'Actions', section: 'settings', icon: <Sliders className="w-4 h-4 text-neutral-400" /> }
  ];

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          handleExecute(filtered[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  const handleExecute = (item: typeof commands[0]) => {
    voiceService.playSfx('click');
    onClose();
    if (item.section) {
      onNavigate(item.section);
    } else if (item.command) {
      onRunCommand?.(item.command);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-xl rounded-2xl bg-[#071522] border border-[#00D9FF]/40 shadow-[0_0_50px_rgba(0,217,255,0.2)] overflow-hidden z-10 flex flex-col max-h-[520px]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#00D9FF]/20 bg-[#0B1927]">
          <Search className="w-5 h-5 text-[#00D9FF] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search all workspaces, agents, tasks (Ctrl+K)..."
            className="flex-1 bg-transparent text-sm text-[#F2F7FA] placeholder-[#8295A7] focus:outline-none font-sans"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] font-mono text-[#8295A7]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => handleExecute(item)}
              onMouseEnter={() => setSelectedIndex(idx)}
              className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                selectedIndex === idx
                  ? 'bg-[#00D9FF]/15 border border-[#00D9FF]/40 text-[#F2F7FA]'
                  : 'text-[#8295A7] hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#05090D] border border-white/10 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#F2F7FA] font-display truncate">
                    {item.label}
                  </div>
                  <div className="text-[10px] font-mono text-[#8295A7]">{item.category}</div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-mono text-[#00D9FF] shrink-0">
                <span>Navigate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-xs font-mono text-[#8295A7]">
              No commands or workspaces found matching &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#05090D] border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#8295A7]">
          <span>STONIC Global Command Matrix</span>
          <span>Use ↑ ↓ to navigate · ↵ to select</span>
        </div>
      </div>
    </div>
  );
};
