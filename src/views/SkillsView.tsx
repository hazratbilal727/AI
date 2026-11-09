import React, { useState } from 'react';
import {
  Zap,
  Code2,
  Globe,
  Cpu,
  FolderGit2,
  Mic,
  Radio,
  ToggleLeft,
  ToggleRight,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { SkillItem } from '../types';
import { initialSkills } from '../data/mockData';
import { StorageService } from '../services/storage';
import { voiceService } from '../services/voiceService';
import { useToast } from '../components/common/Toast';

export const SkillsView: React.FC = () => {
  const [skills, setSkills] = useState<SkillItem[]>(() =>
    StorageService.getItem<SkillItem[]>('skills', initialSkills)
  );
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const { showToast } = useToast();

  const toggleSkill = (id: string) => {
    voiceService.playSfx('click');
    setSkills(prev => {
      const updated = prev.map(s => (s.id === id ? { ...s, enabled: !s.enabled } : s));
      StorageService.setItem('skills', updated);
      const target = updated.find(s => s.id === id);
      showToast(
        target?.enabled ? 'Skill Enabled' : 'Skill Suspended',
        `${target?.name} is now ${target?.enabled ? 'active in cognitive pipeline' : 'standby'}`,
        target?.enabled ? 'success' : 'warning'
      );
      return updated;
    });
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Code2':
        return <Code2 className="w-5 h-5 text-[#00D9FF]" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-sky-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'FolderGit2':
        return <FolderGit2 className="w-5 h-5 text-amber-400" />;
      case 'Mic':
        return <Mic className="w-5 h-5 text-cyan-300" />;
      default:
        return <Radio className="w-5 h-5 text-[#00D9FF]" />;
    }
  };

  const filteredSkills = skills.filter(
    s => selectedFilter === 'all' || s.category === selectedFilter
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 stonic-grid-bg">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-xl bg-[#071522] border border-[#00D9FF]/20">
        <div>
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-bold tracking-wide text-[#F2F7FA] font-display">
              System Capabilities &amp; Skills
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
              6 MODULES LOADED
            </span>
          </div>
          <p className="text-xs text-[#8295A7] mt-1 font-mono">
            Autonomous capability circuits loaded into the execution sandbox.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'automation', 'research', 'system', 'files', 'productivity'].map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedFilter(cat);
                voiceService.playSfx('click');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-colors ${
                selectedFilter === cat
                  ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40'
                  : 'text-[#8295A7] hover:text-[#F2F7FA] hover:bg-white/5 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map(skill => (
          <div
            key={skill.id}
            className={`p-5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
              skill.enabled
                ? 'bg-[#0B1927]/90 border-[#00D9FF]/30 shadow-[0_0_20px_rgba(0,217,255,0.06)]'
                : 'bg-[#071522]/50 border-white/5 opacity-60'
            }`}
          >
            <div>
              {/* Header: Icon, Category, Status Toggle */}
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#071522] border border-white/10 flex items-center justify-center">
                  {getIcon(skill.iconName)}
                </div>

                <button
                  onClick={() => toggleSkill(skill.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                    skill.enabled
                      ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                      : 'text-neutral-500 bg-black/40 border border-white/10'
                  }`}
                >
                  {skill.enabled ? (
                    <>
                      <ToggleRight className="w-4 h-4 text-emerald-400" />
                      <span>ENABLED</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4 text-neutral-500" />
                      <span>DISABLED</span>
                    </>
                  )}
                </button>
              </div>

              {/* Title & Version */}
              <div className="flex items-baseline justify-between mb-1.5">
                <h3 className="text-base font-semibold text-[#F2F7FA] font-display">
                  {skill.name}
                </h3>
                <span className="text-[10px] font-mono text-[#8295A7]">v{skill.version}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-[#8295A7] font-sans leading-relaxed mb-4">
                {skill.description}
              </p>
            </div>

            {/* Bottom Meta */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#8295A7]">
              <span className="text-[#00D9FF] uppercase text-[10px] tracking-wider">
                {skill.category}
              </span>
              <span className="flex items-center gap-1 text-[#8295A7]">
                <Sliders className="w-3 h-3 text-[#00D9FF]" />
                {skill.parametersCount} Tunable Parameters
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
