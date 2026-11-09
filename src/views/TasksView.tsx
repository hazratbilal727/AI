import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  AlertCircle,
  Filter,
  Bot
} from 'lucide-react';
import { TaskItem, AgentItem } from '../types';
import { taskService } from '../services/taskService';
import { agentService } from '../services/agentService';
import { voiceService } from '../services/voiceService';
import { Modal } from '../components/common/Modal';
import { useToast } from '../components/common/Toast';

export const TasksView: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>(taskService.getTasks());
  const [agents] = useState<AgentItem[]>(agentService.getAgents());
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formAgentId, setFormAgentId] = useState(agents[0]?.id || '');
  const [formPriority, setFormPriority] = useState<TaskItem['priority']>('medium');

  const { showToast } = useToast();

  useEffect(() => {
    return taskService.subscribe(setTasks);
  }, []);

  const filteredTasks = tasks.filter(
    t => statusFilter === 'all' || t.status === statusFilter
  );

  const openNewTaskModal = () => {
    setEditingTask(null);
    setFormTitle('');
    setFormDesc('');
    setFormAgentId(agents[0]?.id || '');
    setFormPriority('medium');
    setIsModalOpen(true);
    voiceService.playSfx('click');
  };

  const openEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDesc(task.description);
    setFormAgentId(task.assignedAgentId);
    setFormPriority(task.priority);
    setIsModalOpen(true);
    voiceService.playSfx('click');
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingTask) {
      taskService.updateTask(editingTask.id, {
        title: formTitle.trim(),
        description: formDesc.trim(),
        assignedAgentId: formAgentId,
        priority: formPriority
      });
      showToast('Task Updated', `Updated "${formTitle}"`, 'success');
    } else {
      taskService.addTask({
        title: formTitle.trim(),
        description: formDesc.trim(),
        assignedAgentId: formAgentId,
        priority: formPriority,
        status: 'active'
      });
      showToast('Task Queued', `Dispatched "${formTitle}" to agent pipeline`, 'success');
    }

    voiceService.playSfx('complete');
    setIsModalOpen(false);
  };

  const handleToggle = (id: string) => {
    voiceService.playSfx('activate');
    const updated = taskService.toggleTaskStatus(id);
    if (updated) {
      showToast('Task State Changed', `Status is now ${updated.status.toUpperCase()}`, 'info');
    }
  };

  const handleDelete = (id: string, title: string) => {
    voiceService.playSfx('alert');
    taskService.deleteTask(id);
    showToast('Task Deleted', `Removed "${title}" from task log`, 'warning');
  };

  const getPriorityBadge = (priority: TaskItem['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'high':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'medium':
        return 'text-[#00D9FF] bg-[#00D9FF]/10 border-[#00D9FF]/30';
      default:
        return 'text-[#8295A7] bg-white/5 border-white/10';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 stonic-grid-bg">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-xl bg-[#071522] border border-[#00D9FF]/20">
        <div>
          <div className="flex items-center gap-2.5">
            <CheckSquare className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-bold tracking-wide text-[#F2F7FA] font-display">
              Autonomous Task Dispatcher
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {tasks.filter(t => t.status === 'active').length} ACTIVE TASKS
            </span>
          </div>
          <p className="text-xs text-[#8295A7] mt-1 font-mono">
            Orchestrate background operations with live incremental progress simulations and priority queues.
          </p>
        </div>

        <button
          onClick={openNewTaskModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#00D9FF] to-[#168BFF] text-black font-semibold text-xs tracking-wide hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(0,217,255,0.25)]"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B1927]/80 border border-[#00D9FF]/15">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#8295A7]" />
          <span className="text-xs font-mono text-[#8295A7]">Filter Queue:</span>
          {(['all', 'active', 'pending', 'completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => {
                setStatusFilter(tab);
                voiceService.playSfx('click');
              }}
              className={`px-3 py-1 rounded-md text-xs font-mono capitalize transition-colors ${
                statusFilter === tab
                  ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40'
                  : 'text-[#8295A7] hover:text-[#F2F7FA] hover:bg-white/5'
              }`}
            >
              {tab} ({tab === 'all' ? tasks.length : tasks.filter(t => t.status === tab).length})
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Table / Card List */}
      <div className="space-y-3.5">
        {filteredTasks.map(task => {
          const assignedAgent = agents.find(a => a.id === task.assignedAgentId);
          return (
            <div
              key={task.id}
              className="p-4 rounded-xl bg-[#071522]/90 border border-[#00D9FF]/15 hover:border-[#00D9FF]/35 transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              {/* Left Column: Title, Description, Agent */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getPriorityBadge(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                      task.status === 'completed'
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                        : task.status === 'active'
                        ? 'text-[#00D9FF] bg-[#00D9FF]/10 border-[#00D9FF]/30'
                        : 'text-[#8295A7] bg-white/5 border-white/10'
                    }`}
                  >
                    {task.status}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-[#8295A7]">
                    <Bot className="w-3.5 h-3.5 text-[#00D9FF]" />
                    <span>{assignedAgent?.name || 'Unassigned'}</span>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-[#F2F7FA] font-display truncate">
                  {task.title}
                </h3>
                <p className="text-xs text-[#8295A7] mt-0.5 font-sans line-clamp-2">
                  {task.description}
                </p>
              </div>

              {/* Center: Progress Bar */}
              <div className="w-full md:w-56 shrink-0">
                <div className="flex justify-between text-xs font-mono text-[#8295A7] mb-1">
                  <span>Execution Progress</span>
                  <span className="text-[#00D9FF] font-semibold">{task.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      task.status === 'completed'
                        ? 'bg-emerald-400'
                        : 'bg-gradient-to-r from-[#00D9FF] to-[#168BFF]'
                    }`}
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggle(task.id)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                    task.status === 'completed'
                      ? 'bg-white/5 text-[#8295A7] border-white/10 hover:text-white'
                      : 'bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/30 hover:bg-[#00D9FF]/20'
                  }`}
                  title="Cycle status: Pending -> Active -> Completed"
                >
                  {task.status === 'completed'
                    ? 'Reopen'
                    : task.status === 'active'
                    ? 'Mark Done'
                    : 'Start Task'}
                </button>
                <button
                  onClick={() => openEditModal(task)}
                  className="p-2 rounded-lg bg-[#05090D] border border-white/10 hover:border-[#00D9FF]/40 text-[#8295A7] hover:text-[#00D9FF] transition-colors"
                  title="Edit Task"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(task.id, task.title)}
                  className="p-2 rounded-lg bg-[#05090D] border border-white/10 hover:border-red-500/40 text-[#8295A7] hover:text-red-400 transition-colors"
                  title="Delete Task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="py-12 text-center text-[#8295A7] font-mono text-xs">
            No tasks match your current filter. Click &quot;Create New Task&quot; to queue an operation.
          </div>
        )}
      </div>

      {/* Add / Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task Directive' : 'Dispatch New Task'}
        subtitle="Queued into autonomous agent pipeline"
      >
        <form onSubmit={handleSaveTask} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#8295A7] mb-1.5">TASK TITLE</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              placeholder="e.g. Audit Enclave Encryption Keys"
              className="w-full px-3.5 py-2.5 bg-[#05090D] border border-white/10 rounded-lg text-sm text-[#F2F7FA] placeholder-[#8295A7] focus:border-[#00D9FF] focus:outline-none font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8295A7] mb-1.5">
              DESCRIPTION &amp; PARAMETERS
            </label>
            <textarea
              rows={3}
              value={formDesc}
              onChange={e => setFormDesc(e.target.value)}
              placeholder="Operational details and goals for the assigned agent..."
              className="w-full px-3.5 py-2.5 bg-[#05090D] border border-white/10 rounded-lg text-sm text-[#F2F7FA] placeholder-[#8295A7] focus:border-[#00D9FF] focus:outline-none font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#8295A7] mb-1.5">
                ASSIGN AGENT
              </label>
              <select
                value={formAgentId}
                onChange={e => setFormAgentId(e.target.value)}
                className="w-full px-3 py-2 bg-[#05090D] border border-white/10 rounded-lg text-xs font-mono text-[#F2F7FA] focus:border-[#00D9FF] focus:outline-none"
              >
                {agents.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8295A7] mb-1.5">PRIORITY</label>
              <select
                value={formPriority}
                onChange={e => setFormPriority(e.target.value as TaskItem['priority'])}
                className="w-full px-3 py-2 bg-[#05090D] border border-white/10 rounded-lg text-xs font-mono text-[#F2F7FA] focus:border-[#00D9FF] focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-mono text-[#8295A7] hover:text-[#F2F7FA] hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#00D9FF] to-[#168BFF] text-black font-semibold text-xs font-mono tracking-wide hover:opacity-90 transition-opacity"
            >
              Queue Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
