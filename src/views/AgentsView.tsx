import React, { useState, useEffect } from 'react';
import {
  Bot,
  Activity,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  Binary,
  Compass,
  Sparkles,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { AgentItem } from '../types';
import { agentService } from '../services/agentService';
import { voiceService } from '../services/voiceService';
import { useToast } from '../components/common/Toast';

export const AgentsView: React.FC = () => {
  const [agents, setAgents] = useState<AgentItem[]>(agentService.getAgents());
  const { showToast } = useToast();

  useEffect(() => {
    return agentService.subscribe(setAgents);
  }, []);

  const toggleAgentState = (id: string) => {
    voiceService.playSfx('click');
    const agent = agentService.getAgentById(id);
    if (!agent) return;

    const nextStatus: AgentItem['status'] =
      agent.status === 'executing' ? 'paused' : 'executing';

    agentService.updateAgentStatus(id, nextStatus);
    showToast(
      `Agent ${nextStatus === 'executing' ? 'Resumed' : 'Suspended'}`,
      `${agent.name} is now ${nextStatus}`,
      nextStatus === 'executing' ? 'success' : 'warning'
    );
  };

  const getAgentIcon = (name: string) => {
    switch (name) {
      case 'Binary':
        return <Binary className="w-5 h-5 text-[#00D9FF]" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-sky-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 stonic-grid-bg">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-xl bg-[#071522] border border-[#00D9FF]/20">
        <div>
          <div className="flex items-center gap-2.5">
            <Bot className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-bold tracking-wide text-[#F2F7FA] font-display">
              Autonomous Agent Fleet
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
              4 SPECIALIZED AGENTS
            </span>
          </div>
          <p className="text-xs text-[#8295A7] mt-1 font-mono">
            Autonomous multi-process agent fleet executing localized tasks across system threads.
          </p>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map(agent => (
          <div
            key={agent.id}
            className="p-6 rounded-xl bg-[#0B1927]/90 border border-[#00D9FF]/20 hover:border-[#00D9FF]/40 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Agent Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-[#071522] border border-[#00D9FF]/30 flex items-center justify-center">
                    {getAgentIcon(agent.avatarIcon)}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#F2F7FA] font-display">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-[#8295A7] font-mono">{agent.role}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                    agent.status === 'executing'
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                      : agent.status === 'paused'
                      ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                      : 'text-neutral-400 bg-white/5 border-white/10'
                  }`}
                >
                  {agent.status}
                </span>
              </div>

              {/* Current Task Description */}
              <div className="p-3.5 rounded-lg bg-[#05090D] border border-white/5 mb-4">
                <div className="text-[10px] font-mono text-[#8295A7] uppercase tracking-wider mb-1">
                  CURRENT ASSIGNMENT
                </div>
                <p className="text-xs text-[#F2F7FA] font-sans leading-relaxed">
                  {agent.currentTask || 'Idle - standing by in queue for incoming task dispatch.'}
                </p>
              </div>

              {/* Capabilities */}
              <div className="space-y-1.5 mb-4">
                <div className="text-[10px] font-mono text-[#8295A7] uppercase tracking-wider">
                  CORE SPECIALIZATIONS
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {agent.capabilities.map((cap, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#071522] border border-white/10 text-[#8295A7]"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Metrics & Control Footer */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-4 text-[#8295A7]">
                <div>
                  <span className="text-[#00D9FF] font-semibold">{agent.taskCount}</span> Tasks Done
                </div>
                <div>
                  <span className="text-emerald-400 font-semibold">{agent.efficiency}%</span> Efficiency
                </div>
              </div>

              <button
                onClick={() => toggleAgentState(agent.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                  agent.status === 'executing'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                    : 'bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/30 hover:bg-[#00D9FF]/20'
                }`}
              >
                {agent.status === 'executing' ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Execute</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
