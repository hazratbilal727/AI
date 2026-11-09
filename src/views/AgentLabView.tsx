import React, { useState, useEffect } from 'react';
import {
  Bot,
  Plus,
  Copy,
  Trash2,
  Edit2,
  Play,
  Pause,
  Sparkles,
  ShieldAlert,
  Binary,
  Compass,
  FileText,
  Activity,
  Zap,
  Shield,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { AgentItem } from '../types';
import { agentService } from '../services/agentService';
import { voiceService } from '../services/voiceService';
import { Modal } from '../components/common/Modal';
import { useToast } from '../components/common/Toast';

export const AgentLabView: React.FC = () => {
  const [agents, setAgents] = useState<AgentItem[]>(agentService.getAgents());
  const [selectedAgent, setSelectedAgent] = useState<AgentItem>(agents[0]);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);

  // Form builder states
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPersonality, setFormPersonality] = useState('Precise, analytical');
  const [formInstructions, setFormInstructions] = useState('');
  const [formCapabilities, setFormCapabilities] = useState('AST Parsing, Telemetry');

  const { showToast } = useToast();

  useEffect(() => {
    return agentService.subscribe(agList => {
      setAgents(agList);
      if (!selectedAgent || !agList.some(a => a.id === selectedAgent.id)) {
        setSelectedAgent(agList[0]);
      }
    });
  }, [selectedAgent]);

  const openCreateModal = () => {
    voiceService.playSfx('click');
    setEditingAgentId(null);
    setFormName('');
    setFormRole('Specialized Cognitive Agent');
    setFormDesc('Autonomous agent designed for specialized domain operations.');
    setFormPersonality('Analytical, proactive, deterministic');
    setFormInstructions('Execute instructions faithfully within safety thresholds.');
    setFormCapabilities('Data Scraping, Verification, Report Generation');
    setIsBuilderOpen(true);
  };

  const openEditModal = (agent: AgentItem) => {
    voiceService.playSfx('click');
    setEditingAgentId(agent.id);
    setFormName(agent.name);
    setFormRole(agent.role);
    setFormDesc(agent.currentTask || 'Standard autonomous directive.');
    setFormPersonality(agent.personality || 'Analytical, measured');
    setFormInstructions(agent.instructions || 'Execute instructions faithfully.');
    setFormCapabilities(agent.capabilities.join(', '));
    setIsBuilderOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const capabilitiesArray = formCapabilities
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingAgentId) {
      const updated = agentService.updateAgent(editingAgentId, {
        name: formName.trim(),
        role: formRole.trim(),
        personality: formPersonality.trim(),
        instructions: formInstructions.trim(),
        capabilities: capabilitiesArray
      });
      if (updated) setSelectedAgent(updated);
      showToast('Agent Configuration Updated', `Saved parameters for ${formName}`, 'success');
    } else {
      const created = agentService.addAgent({
        name: formName.trim(),
        role: formRole.trim(),
        avatarIcon: 'Bot',
        status: 'idle',
        capabilities: capabilitiesArray,
        personality: formPersonality.trim(),
        instructions: formInstructions.trim()
      });
      setSelectedAgent(created);
      showToast('Agent Assembled & Ready', `Added ${formName} to local agent registry`, 'success');
    }

    voiceService.playSfx('complete');
    setIsBuilderOpen(false);
  };

  const handleDuplicate = (agent: AgentItem) => {
    voiceService.playSfx('click');
    const copy = agentService.duplicateAgent(agent.id);
    if (copy) {
      setSelectedAgent(copy);
      showToast('Agent Cloned', `Created duplicate ${copy.name}`, 'info');
    }
  };

  const handleDelete = (id: string, name: string) => {
    voiceService.playSfx('alert');
    agentService.deleteAgent(id);
    showToast('Agent Decommissioned', `Removed ${name} from registry`, 'warning');
  };

  const toggleStatus = (agent: AgentItem) => {
    voiceService.playSfx('click');
    const nextStatus = agent.status === 'executing' ? 'paused' : 'executing';
    agentService.updateAgentStatus(agent.id, nextStatus);
    showToast(
      `Agent ${nextStatus === 'executing' ? 'Dispatched' : 'Suspended'}`,
      `${agent.name} is now ${nextStatus}`,
      nextStatus === 'executing' ? 'success' : 'info'
    );
  };

  const getAgentIcon = (name: string) => {
    switch (name) {
      case 'Binary': return <Binary className="w-5 h-5 text-[#00D9FF]" />;
      case 'Compass': return <Compass className="w-5 h-5 text-sky-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case 'FileText': return <FileText className="w-5 h-5 text-amber-400" />;
      case 'Activity': return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-cyan-300" />;
      case 'Shield': return <Shield className="w-5 h-5 text-rose-400" />;
      default: return <ShieldAlert className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 stonic-grid-bg">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#071522] via-[#0B1E2E] to-[#071522] border border-[#00D9FF]/20 shadow-[0_0_30px_rgba(0,217,255,0.06)]">
        <div>
          <div className="flex items-center gap-2.5">
            <Bot className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-bold tracking-wide text-[#F2F7FA] font-display">
              Autonomous Agent Laboratory &amp; Builder
            </h1>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
              {agents.length} AGENTS REGISTERED
            </span>
          </div>
          <p className="text-xs text-[#8295A7] mt-1 font-mono">
            Assemble, configure, duplicate, and supervise specialized autonomous cognitive agents.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#168BFF] text-black font-semibold text-xs tracking-wide hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(0,217,255,0.25)]"
        >
          <Plus className="w-4 h-4" />
          <span>Assemble New Agent</span>
        </button>
      </div>

      {/* Main Grid: Agent Library List & Agent Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Agent Library (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#8295A7] px-1">
            <span>REGISTERED SPECIALIZED AGENTS</span>
            <span className="text-[#00D9FF]">{agents.filter(a => a.status === 'executing').length} RUNNING</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {agents.map(ag => {
              const isSelected = selectedAgent?.id === ag.id;
              return (
                <div
                  key={ag.id}
                  onClick={() => {
                    setSelectedAgent(ag);
                    voiceService.playSfx('click');
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#0B1E2E] border-[#00D9FF]/50 shadow-[0_0_20px_rgba(0,217,255,0.12)] ring-1 ring-[#00D9FF]/30'
                      : 'bg-[#071522]/90 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#05090D] border border-white/10 flex items-center justify-center">
                        {getAgentIcon(ag.avatarIcon)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#F2F7FA] font-display">
                          {ag.name}
                        </h4>
                        <div className="text-[10px] font-mono text-[#8295A7]">{ag.role}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase border ${
                        ag.status === 'executing'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                          : ag.status === 'paused'
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                          : 'text-[#8295A7] bg-white/5 border-white/10'
                      }`}
                    >
                      {ag.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono text-[#8295A7]">
                    <span>Tasks: <strong className="text-white">{ag.taskCount}</strong></span>
                    <span>Efficiency: <strong className="text-emerald-400">{ag.efficiency}%</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Agent Inspector & Controller (5 cols) */}
        {selectedAgent && (
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0B1E2E]/90 border border-[#00D9FF]/25 shadow-[0_0_30px_rgba(0,217,255,0.06)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#05090D] border border-[#00D9FF]/40 flex items-center justify-center">
                    {getAgentIcon(selectedAgent.avatarIcon)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#F2F7FA] font-display">
                      {selectedAgent.name}
                    </h3>
                    <div className="text-xs font-mono text-[#00D9FF]">{selectedAgent.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDuplicate(selectedAgent)}
                    className="p-1.5 rounded-lg text-[#8295A7] hover:text-[#00D9FF] hover:bg-white/5"
                    title="Clone Agent"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(selectedAgent)}
                    className="p-1.5 rounded-lg text-[#8295A7] hover:text-[#00D9FF] hover:bg-white/5"
                    title="Edit Parameters"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {selectedAgent.isCustom && (
                    <button
                      onClick={() => handleDelete(selectedAgent.id, selectedAgent.name)}
                      className="p-1.5 rounded-lg text-[#8295A7] hover:text-red-400 hover:bg-white/5"
                      title="Delete Custom Agent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Personality & Directives */}
              <div className="space-y-3.5 mb-6 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#05090D] border border-white/5">
                  <div className="text-[10px] text-[#8295A7] uppercase mb-1">BEHAVIOR PROFILE</div>
                  <div className="text-neutral-200 font-sans">
                    {selectedAgent.personality || 'Vigilant, proactive, deterministic'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#05090D] border border-white/5">
                  <div className="text-[10px] text-[#8295A7] uppercase mb-1">SYSTEM INSTRUCTIONS</div>
                  <div className="text-neutral-200 font-sans">
                    {selectedAgent.instructions || 'Execute instructions faithfully within safety thresholds.'}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-[#8295A7] uppercase mb-1.5">CAPABILITIES</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAgent.capabilities.map((cap, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#071522] border border-[#00D9FF]/20 text-[11px] text-[#00D9FF]">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-[#8295A7]">
                STATUS: <strong className="text-white">{selectedAgent.status.toUpperCase()}</strong>
              </span>

              <button
                onClick={() => toggleStatus(selectedAgent)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-colors ${
                  selectedAgent.status === 'executing'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                    : 'bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/40 hover:bg-[#00D9FF]/25'
                }`}
              >
                {selectedAgent.status === 'executing' ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Agent</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Execute Agent</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Agent Builder Modal */}
      <Modal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        title={editingAgentId ? 'Configure Agent Parameters' : 'Assemble New Autonomous Agent'}
        subtitle="Saved to local browser agent registry"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#8295A7] mb-1">AGENT NAME</label>
            <input
              type="text"
              required
              value={formName}
              onChange={e => setFormName(e.target.value)}
              placeholder="e.g. Apex-Scout, Quantum-Validator"
              className="w-full px-3 py-2 rounded-lg bg-[#05090D] border border-white/10 text-sm text-white focus:border-[#00D9FF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8295A7] mb-1">PRIMARY ROLE</label>
            <input
              type="text"
              required
              value={formRole}
              onChange={e => setFormRole(e.target.value)}
              placeholder="e.g. Offensive Security, Code AST Transpiler"
              className="w-full px-3 py-2 rounded-lg bg-[#05090D] border border-white/10 text-sm text-white focus:border-[#00D9FF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8295A7] mb-1">BEHAVIOR &amp; PERSONALITY</label>
            <input
              type="text"
              value={formPersonality}
              onChange={e => setFormPersonality(e.target.value)}
              placeholder="e.g. Rigorous, defensive, low latency"
              className="w-full px-3 py-2 rounded-lg bg-[#05090D] border border-white/10 text-sm text-white focus:border-[#00D9FF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8295A7] mb-1">SYSTEM INSTRUCTIONS</label>
            <textarea
              rows={3}
              value={formInstructions}
              onChange={e => setFormInstructions(e.target.value)}
              placeholder="Directives for agent execution loops..."
              className="w-full px-3 py-2 rounded-lg bg-[#05090D] border border-white/10 text-xs text-white focus:border-[#00D9FF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8295A7] mb-1">CAPABILITIES (COMMA-SEPARATED)</label>
            <input
              type="text"
              value={formCapabilities}
              onChange={e => setFormCapabilities(e.target.value)}
              placeholder="e.g. Process Monitoring, AST Transpilation, Latency Benchmarks"
              className="w-full px-3 py-2 rounded-lg bg-[#05090D] border border-white/10 text-xs text-white focus:border-[#00D9FF] focus:outline-none"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsBuilderOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-mono text-[#8295A7] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#00D9FF] to-[#168BFF] text-black font-semibold text-xs font-mono tracking-wide hover:opacity-90"
            >
              Save Agent Configuration
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
