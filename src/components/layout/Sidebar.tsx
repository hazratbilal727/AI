import React, { useState } from 'react';
import {
  LayoutDashboard,
  Terminal,
  Cpu,
  MessageSquare,
  Brain,
  Zap,
  Bot,
  Workflow,
  Target,
  CheckSquare,
  Database,
  BookOpen,
  FileCode,
  Briefcase,
  Film,
  Eye,
  Mic,
  Globe,
  Activity,
  ShieldAlert,
  Palette,
  Smartphone,
  Sliders,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { AppSection } from '../../types';
import { voiceService } from '../../services/voiceService';

interface SidebarProps {
  currentSection: AppSection;
  onNavigate: (section: AppSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeAgentsCount?: number;
  pendingTasksCount?: number;
}

interface NavGroup {
  name: string;
  items: {
    id: AppSection;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onNavigate,
  collapsed,
  onToggleCollapse,
  activeAgentsCount = 2,
  pendingTasksCount = 2
}) => {
  const groups: NavGroup[] = [
    {
      name: 'CORE COMMAND',
      items: [
        { id: 'dashboard', label: 'Dashboard Hub', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'command-center', label: 'Command Center', icon: <Terminal className="w-4 h-4" /> },
        { id: 'control-room', label: 'Control Room', icon: <Cpu className="w-4 h-4" /> },
        { id: 'assistant', label: 'AI Assistant', icon: <MessageSquare className="w-4 h-4" /> },
        { id: 'core', label: 'Cognitive Core', icon: <Cpu className="w-4 h-4" /> },
        { 
          id: 'agents', 
          label: 'Agent Lab', 
          icon: <Bot className="w-4 h-4" />,
          badge: activeAgentsCount > 0 ? `${activeAgentsCount} run` : undefined,
          badgeColor: 'text-[#00D9FF] bg-[#00D9FF]/10 border-[#00D9FF]/30'
        }
      ]
    },
    {
      name: 'AUTOMATION & MISSIONS',
      items: [
        { id: 'automation-studio', label: 'Automation Studio', icon: <Workflow className="w-4 h-4" /> },
        { id: 'mission-control', label: 'Mission Control', icon: <Target className="w-4 h-4" /> },
        { 
          id: 'tasks', 
          label: 'Tactical Tasks', 
          icon: <CheckSquare className="w-4 h-4" />,
          badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
          badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
        }
      ]
    },
    {
      name: 'INTELLIGENCE & LABS',
      items: [
        { id: 'knowledge-vault', label: 'Knowledge Vault', icon: <Database className="w-4 h-4" /> },
        { id: 'research-lab', label: 'Research Lab', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'code-lab', label: 'Code Lab Simulator', icon: <FileCode className="w-4 h-4" /> },
        { id: 'simulation-lab', label: 'Simulation Lab', icon: <Cpu className="w-4 h-4" /> },
        { id: 'memory', label: 'Memory Vault', icon: <Brain className="w-4 h-4" />, badge: 6 },
        { id: 'skills', label: 'Skills Registry', icon: <Zap className="w-4 h-4" />, badge: 6 }
      ]
    },
    {
      name: 'WORKSPACE & MEDIA',
      items: [
        { id: 'digital-workspace', label: 'Digital Workspace', icon: <Briefcase className="w-4 h-4" /> },
        { id: 'media-studio', label: 'Media Studio', icon: <Film className="w-4 h-4" /> },
        { id: 'visual-hub', label: 'Visual Hub', icon: <Eye className="w-4 h-4" /> },
        { id: 'voice', label: 'Voice Interface', icon: <Mic className="w-4 h-4" /> },
        { id: 'world-monitor', label: 'World Telemetry', icon: <Globe className="w-4 h-4" /> }
      ]
    },
    {
      name: 'SYSTEM & DEFENSE',
      items: [
        { id: 'system-monitor', label: 'System Monitor', icon: <Activity className="w-4 h-4" /> },
        { id: 'security-center', label: 'Security SOC', icon: <ShieldAlert className="w-4 h-4" /> },
        { id: 'personalization', label: 'Personalization', icon: <Palette className="w-4 h-4" /> },
        { id: 'character', label: 'Character Profile', icon: <UserCheck className="w-4 h-4" /> },
        { id: 'remote', label: 'Remote Uplink', icon: <Smartphone className="w-4 h-4" /> },
        { id: 'settings', label: 'System Settings', icon: <Sliders className="w-4 h-4" /> }
      ]
    }
  ];

  const handleNav = (id: AppSection) => {
    voiceService.playSfx('click');
    onNavigate(id);
  };

  return (
    <aside
      className={`relative h-[calc(100vh-3.5rem-2.5rem)] flex flex-col border-r border-[#00D9FF]/15 bg-[#071522]/95 backdrop-blur-md transition-all duration-300 z-20 shrink-0 select-none ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Navigation Header / Collapse toggle */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#00D9FF]/10 shrink-0">
        {!collapsed && (
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
            STONIC CIRCUITS
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-md text-[#8295A7] hover:text-[#00D9FF] hover:bg-[#00D9FF]/10 transition-colors ml-auto"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Groups list */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-3 custom-scrollbar">
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-0.5">
            {!collapsed && (
              <div className="px-2 pt-1 pb-1 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                {group.name}
              </div>
            )}
            {group.items.map(item => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 group text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00D9FF]/20 to-[#168BFF]/10 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[0_0_12px_rgba(0,217,255,0.15)] font-semibold'
                      : 'text-[#8295A7] hover:text-[#F2F7FA] hover:bg-white/5 border border-transparent'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span
                    className={`transition-colors shrink-0 ${
                      isActive ? 'text-[#00D9FF]' : 'text-[#8295A7] group-hover:text-[#F2F7FA]'
                    }`}
                  >
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between truncate">
                      <span className="truncate">{item.label}</span>
                      {item.badge !== undefined && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                            item.badgeColor || 'text-[#8295A7] bg-white/5 border-white/10'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Diagnostic Panel */}
      {!collapsed && (
        <div className="p-2.5 border-t border-[#00D9FF]/10 bg-[#0B1927]/60 shrink-0">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8295A7] mb-1">
            <span className="flex items-center gap-1 text-cyan-400">
              <Activity className="w-3 h-3" />
              NEURAL LOAD
            </span>
            <span className="text-[#00D9FF] font-semibold">18.4%</span>
          </div>
          <div className="w-full h-1 rounded-full bg-black/40 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00D9FF] to-[#168BFF] rounded-full transition-all duration-500"
              style={{ width: '18.4%' }}
            />
          </div>
        </div>
      )}
    </aside>
  );
};
