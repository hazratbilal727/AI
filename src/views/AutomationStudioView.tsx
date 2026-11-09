import React, { useState } from 'react';
import {
  Workflow,
  Play,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Layers,
  Sparkles,
  Bell,
  CheckCircle2,
  Sliders,
  Clock,
  ArrowRight,
  Shield
} from 'lucide-react';
import { WorkflowItem, WorkflowNode } from '../types';
import { workflowService } from '../services/workflowService';
import { voiceService } from '../services/voiceService';
import { Modal } from '../components/common/Modal';
import { useToast } from '../components/common/Toast';

export const AutomationStudioView: React.FC = () => {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(workflowService.getWorkflows());
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowItem>(workflows[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState(false);
  const [newNodeType, setNewNodeType] = useState<WorkflowNode['type']>('action');
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [newNodeSublabel, setNewNodeSublabel] = useState('');

  const { showToast } = useToast();

  const handleRunSimulation = async () => {
    if (!activeWorkflow || isSimulating) return;

    voiceService.playSfx('pulse');
    setIsSimulating(true);
    showToast('Executing Workflow Simulation', `Stepping through "${activeWorkflow.title}"...`, 'info');

    await workflowService.runSimulation(activeWorkflow.id, (nodeId, status) => {
      setActiveNodeId(nodeId);
      if (status === 'running') {
        voiceService.playSfx('click');
      } else {
        voiceService.playSfx('complete');
      }
    });

    setIsSimulating(false);
    setActiveNodeId(null);
    setWorkflows(workflowService.getWorkflows());
    showToast('Workflow Execution Complete', 'All nodes executed with 0 error flags', 'success');
  };

  const handleDuplicate = () => {
    voiceService.playSfx('click');
    const copy = workflowService.duplicateWorkflow(activeWorkflow.id);
    if (copy) {
      setWorkflows(workflowService.getWorkflows());
      setActiveWorkflow(copy);
      showToast('Workflow Cloned', `Created copy: ${copy.title}`, 'info');
    }
  };

  const handleDelete = () => {
    if (workflows.length <= 1) return;
    voiceService.playSfx('alert');
    workflowService.deleteWorkflow(activeWorkflow.id);
    const updated = workflowService.getWorkflows();
    setWorkflows(updated);
    setActiveWorkflow(updated[0]);
    showToast('Workflow Removed', 'Deleted workflow blueprint', 'warning');
  };

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeLabel.trim()) return;

    const nextX = (activeWorkflow.nodes.length + 1) * 160;
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: newNodeType,
      label: newNodeLabel.trim(),
      sublabel: newNodeSublabel.trim() || 'Custom Action',
      x: nextX,
      y: 120
    };

    const updatedNodes = [...activeWorkflow.nodes, newNode];
    const prevNode = activeWorkflow.nodes[activeWorkflow.nodes.length - 1];
    const updatedEdges = prevNode
      ? [...activeWorkflow.edges, { id: `e-${Date.now()}`, source: prevNode.id, target: newNode.id }]
      : activeWorkflow.edges;

    const updatedWf: WorkflowItem = {
      ...activeWorkflow,
      nodes: updatedNodes,
      edges: updatedEdges
    };

    workflowService.saveWorkflow(updatedWf);
    setActiveWorkflow(updatedWf);
    setWorkflows(workflowService.getWorkflows());
    setIsAddNodeModalOpen(false);
    setNewNodeLabel('');
    voiceService.playSfx('complete');
    showToast('Node Appended', `Added ${newNodeLabel} to workflow canvas`, 'success');
  };

  const getNodeColor = (type: WorkflowNode['type']) => {
    switch (type) {
      case 'start': return 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400';
      case 'trigger': return 'border-cyan-400/50 bg-cyan-500/10 text-[#00D9FF]';
      case 'condition': return 'border-amber-500/50 bg-amber-500/10 text-amber-400';
      case 'ai': return 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300';
      case 'notify': return 'border-rose-500/50 bg-rose-500/10 text-rose-300';
      case 'end': return 'border-neutral-500/50 bg-neutral-500/10 text-neutral-300';
      default: return 'border-[#00D9FF]/40 bg-[#071522] text-[#00D9FF]';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 stonic-grid-bg">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#071522] via-[#0B1E2E] to-[#071522] border border-[#00D9FF]/20 shadow-[0_0_30px_rgba(0,217,255,0.06)]">
        <div>
          <div className="flex items-center gap-2.5">
            <Workflow className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-bold tracking-wide text-[#F2F7FA] font-display">
              Automation Studio &amp; Workflow Engine
            </h1>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
              SIMULATED PIPELINE
            </span>
          </div>
          <p className="text-xs text-[#8295A7] mt-1 font-mono">
            Assemble node-based autonomous logic pipelines, conditional branches, and simulated execution runs.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#168BFF] text-black font-semibold text-xs tracking-wide hover:opacity-90 disabled:opacity-40 transition-opacity shadow-[0_0_15px_rgba(0,217,255,0.25)]"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>{isSimulating ? 'Executing Simulation...' : 'Run Simulation'}</span>
          </button>

          <button
            onClick={() => setIsAddNodeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0B1927] border border-white/10 hover:border-[#00D9FF]/40 text-xs font-mono text-[#F2F7FA] hover:text-[#00D9FF] transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>Add Node</span>
          </button>
        </div>
      </div>

      {/* Workflow Selector & Controls */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B1E2E]/80 border border-[#00D9FF]/15">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-mono text-[#8295A7] shrink-0">Workflows:</span>
          {workflows.map(wf => (
            <button
              key={wf.id}
              onClick={() => {
                setActiveWorkflow(wf);
                voiceService.playSfx('click');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                activeWorkflow.id === wf.id
                  ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40'
                  : 'text-[#8295A7] hover:text-white hover:bg-white/5'
              }`}
            >
              {wf.title}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleDuplicate}
            className="p-1.5 rounded-lg text-[#8295A7] hover:text-[#00D9FF] hover:bg-white/5"
            title="Duplicate Workflow"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            disabled={workflows.length <= 1}
            className="p-1.5 rounded-lg text-[#8295A7] hover:text-red-400 hover:bg-white/5 disabled:opacity-30"
            title="Delete Workflow"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Node-Based Canvas */}
      <div className="p-6 rounded-2xl bg-[#071522] border border-[#00D9FF]/20 shadow-[0_0_35px_rgba(0,217,255,0.06)] min-h-[440px] flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 stonic-grid-bg opacity-30 pointer-events-none" />

        {/* Canvas Header */}
        <div className="flex items-center justify-between text-xs font-mono text-[#8295A7] z-10 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00D9FF]" />
            <span className="text-white font-semibold">{activeWorkflow.title}</span>
            <span>·</span>
            <span>{activeWorkflow.description}</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Runs: <strong className="text-[#00D9FF]">{activeWorkflow.executionCount}</strong></span>
            <span>Last: <strong className="text-white">{activeWorkflow.lastRun || 'Never'}</strong></span>
          </div>
        </div>

        {/* Nodes Flow Stage */}
        <div className="my-auto py-8 overflow-x-auto z-10">
          <div className="flex items-center gap-4 min-w-max px-4">
            {activeWorkflow.nodes.map((node, idx) => {
              const isExecutingThis = activeNodeId === node.id;
              return (
                <React.Fragment key={node.id}>
                  {/* Node Box */}
                  <div
                    className={`p-4 rounded-xl border transition-all duration-300 w-48 shadow-lg ${getNodeColor(
                      node.type
                    )} ${
                      isExecutingThis
                        ? 'ring-2 ring-[#00D9FF] scale-105 shadow-[0_0_25px_rgba(0,217,255,0.4)]'
                        : ''
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider opacity-75 mb-1">
                      {node.type} NODE
                    </div>
                    <div className="text-sm font-semibold text-white font-display mb-1 truncate">
                      {node.label}
                    </div>
                    <div className="text-[11px] font-mono opacity-80 truncate">
                      {node.sublabel}
                    </div>

                    {isExecutingThis && (
                      <div className="mt-2 text-[9px] font-mono text-[#00D9FF] flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />
                        <span>PROCESSING...</span>
                      </div>
                    )}
                  </div>

                  {/* Connecting Arrow */}
                  {idx < activeWorkflow.nodes.length - 1 && (
                    <div className="flex items-center text-[#00D9FF]/60 shrink-0">
                      <div className="w-8 h-0.5 bg-[#00D9FF]/40" />
                      <ArrowRight className="w-4 h-4 -ml-1 text-[#00D9FF]" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Canvas Footer */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#8295A7] z-10">
          <span>PIPELINE: DETERMINISTIC FINITE AUTOMATON</span>
          <span className="text-[#00D9FF]">SIMULATION ENGINE STANDBY</span>
        </div>
      </div>

      {/* Add Node Modal */}
      <Modal
        isOpen={isAddNodeModalOpen}
        onClose={() => setIsAddNodeModalOpen(false)}
        title="Add Workflow Node"
        subtitle="Appends an operational step to the current pipeline"
      >
        <form onSubmit={handleAddNode} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#8295A7] mb-1">NODE TYPE</label>
            <select
              value={newNodeType}
              onChange={e => setNewNodeType(e.target.value as WorkflowNode['type'])}
              className="w-full px-3 py-2 rounded-lg bg-[#05090D] border border-white/10 text-xs font-mono text-white focus:border-[#00D9FF] focus:outline-none"
            >
              <option value="action">Action Node (Execute function)</option>
              <option value="trigger">Trigger Node (Event listener)</option>
              <option value="condition">Condition Node (If/Else gate)</option>
              <option value="ai">AI Processing Node (Synthesizer)</option>
              <option value="notify">Notification Node (Send alert)</option>
              <option value="delay">Delay Node (Wait interval)</option>
              <option value="end">End Node (Terminate flow)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8295A7] mb-1">NODE LABEL</label>
            <input
              type="text"
              required
              value={newNodeLabel}
              onChange={e => setNewNodeLabel(e.target.value)}
              placeholder="e.g. Scrape Latency Logs"
              className="w-full px-3 py-2 rounded-lg bg-[#05090D] border border-white/10 text-sm text-white focus:border-[#00D9FF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8295A7] mb-1">SUBLABEL / CONFIG</label>
            <input
              type="text"
              value={newNodeSublabel}
              onChange={e => setNewNodeSublabel(e.target.value)}
              placeholder="e.g. Rate threshold < 10ms"
              className="w-full px-3 py-2 rounded-lg bg-[#05090D] border border-white/10 text-xs text-white focus:border-[#00D9FF] focus:outline-none"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsAddNodeModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-mono text-[#8295A7] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#00D9FF] to-[#168BFF] text-black font-semibold text-xs font-mono tracking-wide hover:opacity-90"
            >
              Append Node
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
