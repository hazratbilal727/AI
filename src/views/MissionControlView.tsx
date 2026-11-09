import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  Kanban,
  List,
  Calendar,
  Grid,
  Clock,
  Bot,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { MissionItem } from '../types';
import { missionService } from '../services/missionService';
import { agentService } from '../services/agentService';
import { voiceService } from '../services/voiceService';
import { Modal } from '../components/common/Modal';
import { useToast } from '../components/common/Toast';

export const MissionControlView: React.FC = () => {
  const [missions, setMissions] = useState<MissionItem[]>(missionService.getMissions());
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'timeline' | 'grid'>('kanban');
  const [selectedMission, setSelectedMission] = useState<MissionItem | null>(missions[0] || null);
  const [isNewMissionModalOpen, setIsNewMissionModalOpen] = useState(false);

  // New Mission form
  const [formCode, setFormCode] = useState('OP-AURORA');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPriority, setFormPriority] = useState<MissionItem['priority']>('high');
  const [formDeadline, setFormDeadline] = useState('2026-11-20');

  const agents = agentService.getAgents();
  const { showToast } = useToast();

  useEffect(() => {
    return missionService.subscribe(setMissions);
  }, []);

  const handleCreateMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newM = missionService.addMission({
      code: formCode.trim().toUpperCase(),
      title: formTitle.trim(),
      description: formDesc.trim(),
      status: 'active',
      priority: formPriority,
      assignedAgents: ['agent-sentinel', 'agent-cyber'],
      startDate: new Date().toISOString().split('T')[0],
      deadline: formDeadline,
      tags: ['Operations', 'Autonomous'],
      milestones: [
        { id: `ms-1`, title: 'Define operational boundary', completed: true },
        { id: `ms-2`, title: 'Execute primary agent sequence', completed: false },
        { id: `ms-3`, title: 'Cryptographic log sign-off', completed: false }
      ]
    });

    voiceService.playSfx('complete');
    setIsNewMissionModalOpen(false);
    setSelectedMission(newM);
    showToast('Mission Dispatched', `Operation ${newM.code} active in queue`, 'success');
  };

  const handleToggleMilestone = (missionId: string, milestoneId: string) => {
    voiceService.playSfx('click');
    missionService.toggleMilestone(missionId, milestoneId);
    const updated = missionService.getMissionById(missionId);
    if (updated) setSelectedMission(updated);
  };

  const getPriorityColor = (p: MissionItem['priority']) => {
    switch (p) {
      case 'urgent': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'high': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'medium': return 'text-[#00D9FF] bg-[#00D9FF]/10 border-[#00D9FF]/30';
      default: return 'text-[#8295A7] bg-white/5 border-white/10';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 stonic-grid-bg">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#071522] via-[#0B1E2E] to-[#071522] border border-[#00D9FF]/20 shadow-[0_0_30px_rgba(0,217,255,0.06)]">
        <div>
          <div className="flex items-center gap-2.5">
            <CheckSquare className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-bold tracking-wide text-[#F2F7FA] font-display">
              Mission Control Center
            </h1>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {missions.filter(m => m.status === 'active').length} ACTIVE MISSIONS
            </span>
          </div>
          <p className="text-xs text-[#8295A7] mt-1 font-mono">
            High-level mission portfolio with milestones, timeline dependencies, and agent task assignments.
          </p>
        </div>

        {/* View Switcher & New Mission */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#05090D] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'kanban' ? 'bg-[#00D9FF]/20 text-[#00D9FF]' : 'text-[#8295A7]'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'list' ? 'bg-[#00D9FF]/20 text-[#00D9FF]' : 'text-[#8295A7]'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'timeline' ? 'bg-[#00D9FF]/20 text-[#00D9FF]' : 'text-[#8295A7]'
              }`}
              title="Timeline View"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-[#00D9FF]/20 text-[#00D9FF]' : 'text-[#8295A7]'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              voiceService.playSfx('click');
              setIsNewMissionModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#168BFF] text-black font-semibold text-xs tracking-wide hover:opacity-90 shadow-[0_0_15px_rgba(0,217,255,0.25)]"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Mission</span>
          </button>
        </div>
      </div>

      {/* Main View Area based on viewMode */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['active', 'pending', 'completed'] as const).map(colStatus => {
            const colMissions = missions.filter(m => m.status === colStatus);
            return (
              <div key={colStatus} className="p-4 rounded-2xl bg-[#0B1E2E]/80 border border-[#00D9FF]/15 flex flex-col min-h-[460px]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5 text-xs font-mono">
                  <span className="uppercase text-[#00D9FF] font-semibold">{colStatus} MISSIONS</span>
                  <span className="text-[#8295A7]">({colMissions.length})</span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colMissions.map(m => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedMission(m);
                        voiceService.playSfx('click');
                      }}
                      className="p-4 rounded-xl bg-[#071522] border border-white/5 hover:border-[#00D9FF]/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-[#00D9FF] font-semibold">{m.code}</span>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase ${getPriorityColor(m.priority)}`}>
                          {m.priority}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-[#F2F7FA] font-display mb-1 group-hover:text-[#00D9FF] transition-colors">
                        {m.title}
                      </h4>
                      <p className="text-xs text-[#8295A7] font-sans line-clamp-2 mb-3">
                        {m.description}
                      </p>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-[#8295A7]">
                          <span>Progress</span>
                          <span className="text-[#00D9FF]">{m.progress}%</span>
                        </div>
                        <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#00D9FF] to-[#168BFF] rounded-full"
                            style={{ width: `${m.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {colMissions.length === 0 && (
                    <div className="py-12 text-center text-xs font-mono text-[#8295A7]">
                      No missions in this stage.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List / Timeline / Grid fallback */
        <div className="p-4 rounded-2xl bg-[#0B1E2E]/90 border border-[#00D9FF]/20 space-y-3">
          {missions.map(m => (
            <div
              key={m.id}
              onClick={() => {
                setSelectedMission(m);
                voiceService.playSfx('click');
              }}
              className="p-4 rounded-xl bg-[#071522] border border-white/5 hover:border-[#00D9FF]/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-[#00D9FF] font-bold">{m.code}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${getPriorityColor(m.priority)}`}>
                    {m.priority}
                  </span>
                  <span className="text-[11px] font-mono text-[#8295A7]">Deadline: {m.deadline}</span>
                </div>
                <h4 className="text-sm font-semibold text-[#F2F7FA] font-display">{m.title}</h4>
              </div>

              <div className="w-full md:w-48">
                <div className="flex justify-between text-[10px] font-mono text-[#8295A7] mb-1">
                  <span>Completion</span>
                  <span className="text-[#00D9FF]">{m.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00D9FF] to-[#168BFF] rounded-full"
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Mission Inspector & Milestones */}
      {selectedMission && (
        <div className="p-6 rounded-2xl bg-[#071522] border border-[#00D9FF]/25 shadow-[0_0_30px_rgba(0,217,255,0.06)] space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-[#00D9FF] font-bold">{selectedMission.code}</span>
                <span className="text-xs text-[#8295A7] font-mono">· Initiated {selectedMission.startDate}</span>
              </div>
              <h3 className="text-lg font-bold text-[#F2F7FA] font-display mt-0.5">
                {selectedMission.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#8295A7]">Assigned:</span>
              {selectedMission.assignedAgents.map(agId => {
                const ag = agents.find(a => a.id === agId);
                return (
                  <span key={agId} className="px-2 py-0.5 rounded bg-[#0B1E2E] border border-white/10 text-white">
                    {ag?.name || agId}
                  </span>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono text-[#00D9FF] uppercase tracking-wider mb-2">
              MISSION MILESTONES ({selectedMission.milestones.filter(ms => ms.completed).length} / {selectedMission.milestones.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedMission.milestones.map(ms => (
                <div
                  key={ms.id}
                  onClick={() => handleToggleMilestone(selectedMission.id, ms.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                    ms.completed
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-[#F2F7FA]'
                      : 'bg-[#05090D] border-white/10 text-[#8295A7] hover:border-white/20'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${ms.completed ? 'text-emerald-400' : 'text-neutral-600'}`} />
                  <span className="text-xs font-sans truncate">{ms.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Launch Mission Modal */}
      <Modal
        isOpen={isNewMissionModalOpen}
        onClose={() => setIsNewMissionModalOpen(false)}
        title="Launch Strategic Mission"
        subtitle="Queued into autonomous agent portfolio"
      >
        <form onSubmit={handleCreateMission} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-[#8295A7] mb-1">MISSION CODE</label>
              <input
                type="text"
                required
                value={formCode}
                onChange={e => setFormCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#05090D] border border-white/10 text-xs font-mono text-white focus:border-[#00D9FF] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#8295A7] mb-1">PRIORITY</label>
              <select
                value={formPriority}
                onChange={e => setFormPriority(e.target.value as MissionItem['priority'])}
                className="w-full px-3 py-2 rounded-lg bg-[#05090D] border border-white/10 text-xs font-mono text-white focus:border-[#00D9FF] focus:outline-none"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8295A7] mb-1">MISSION TITLE</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              placeholder="e.g. Planetary Mesh Rebalancing"
              className="w-full px-3 py-2 rounded-lg bg-[#05090D] border border-white/10 text-sm text-white focus:border-[#00D9FF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8295A7] mb-1">DESCRIPTION</label>
            <textarea
              rows={3}
              value={formDesc}
              onChange={e => setFormDesc(e.target.value)}
              placeholder="Strategic targets and directives..."
              className="w-full px-3 py-2 rounded-lg bg-[#05090D] border border-white/10 text-xs text-white focus:border-[#00D9FF] focus:outline-none"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsNewMissionModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-mono text-[#8295A7] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#00D9FF] to-[#168BFF] text-black font-semibold text-xs font-mono tracking-wide hover:opacity-90"
            >
              Launch Operation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
