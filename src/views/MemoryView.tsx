import React, { useState, useEffect } from 'react';
import {
  Brain,
  Search,
  Plus,
  Trash2,
  Edit2,
  Shield,
  Clock,
  Key,
  Filter,
  Check
} from 'lucide-react';
import { MemoryItem } from '../types';
import { memoryService } from '../services/memoryService';
import { voiceService } from '../services/voiceService';
import { Modal } from '../components/common/Modal';
import { useToast } from '../components/common/Toast';

export const MemoryView: React.FC = () => {
  const [memories, setMemories] = useState<MemoryItem[]>(memoryService.getMemories());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<MemoryItem | null>(null);

  // Form states
  const [formKey, setFormKey] = useState('');
  const [formValue, setFormValue] = useState('');
  const [formCategory, setFormCategory] = useState<MemoryItem['category']>('preference');
  const [formImportance, setFormImportance] = useState<MemoryItem['importance']>('medium');

  const { showToast } = useToast();

  useEffect(() => {
    return memoryService.subscribe(setMemories);
  }, []);

  const filteredMemories = memoryService.searchMemories(searchQuery, selectedCategory);

  const openAddModal = () => {
    setEditingMemory(null);
    setFormKey('');
    setFormValue('');
    setFormCategory('preference');
    setFormImportance('medium');
    setIsModalOpen(true);
    voiceService.playSfx('click');
  };

  const openEditModal = (mem: MemoryItem) => {
    setEditingMemory(mem);
    setFormKey(mem.key);
    setFormValue(mem.value);
    setFormCategory(mem.category);
    setFormImportance(mem.importance);
    setIsModalOpen(true);
    voiceService.playSfx('click');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formKey.trim() || !formValue.trim()) return;

    if (editingMemory) {
      memoryService.updateMemory(editingMemory.id, {
        key: formKey.trim(),
        value: formValue.trim(),
        category: formCategory,
        importance: formImportance
      });
      showToast('Memory Anchor Updated', `Updated "${formKey}"`, 'success');
    } else {
      memoryService.addMemory({
        key: formKey.trim(),
        value: formValue.trim(),
        category: formCategory,
        importance: formImportance
      });
      showToast('Memory Anchor Saved', `Stored "${formKey}" in Vault-08`, 'success');
    }

    voiceService.playSfx('complete');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, keyName: string) => {
    voiceService.playSfx('alert');
    memoryService.deleteMemory(id);
    showToast('Memory Deleted', `Removed "${keyName}" from enclave`, 'warning');
  };

  const categories = [
    { id: 'all', label: 'All Registers' },
    { id: 'preference', label: 'Preferences' },
    { id: 'project', label: 'Projects' },
    { id: 'personal', label: 'Personal' },
    { id: 'system', label: 'System' },
    { id: 'credential', label: 'Credentials' }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 stonic-grid-bg">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-xl bg-[#071522] border border-[#00D9FF]/20">
        <div>
          <div className="flex items-center gap-2.5">
            <Brain className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-bold tracking-wide text-[#F2F7FA] font-display">
              Cognitive Memory Enclave
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              VAULT-08 ENCRYPTED
            </span>
          </div>
          <p className="text-xs text-[#8295A7] mt-1 font-mono">
            Persistent long-term memories, user context, and project directives indexed for instant recall.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#00D9FF] to-[#168BFF] text-black font-semibold text-xs tracking-wide hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(0,217,255,0.25)]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Memory Register</span>
        </button>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0B1927]/80 border border-[#00D9FF]/15 backdrop-blur-md">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8295A7]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search memory registers by key or value..."
            className="w-full pl-9 pr-4 py-2 bg-[#05090D] border border-white/10 focus:border-[#00D9FF]/40 rounded-lg text-xs text-[#F2F7FA] placeholder-[#8295A7] focus:outline-none font-mono"
          />
        </div>

        {/* Category Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                voiceService.playSfx('click');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40'
                  : 'text-[#8295A7] hover:text-[#F2F7FA] hover:bg-white/5 border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMemories.map(mem => (
          <div
            key={mem.id}
            className="p-4 rounded-xl bg-[#071522]/90 border border-[#00D9FF]/15 hover:border-[#00D9FF]/40 transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              {/* Header: Category & Importance */}
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-[#00D9FF] uppercase tracking-wider text-[10px]">
                  {mem.category}
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    mem.importance === 'high'
                      ? 'text-red-400 bg-red-500/10 border-red-500/30'
                      : mem.importance === 'medium'
                      ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                      : 'text-neutral-400 bg-white/5 border-white/10'
                  }`}
                >
                  {mem.importance} priority
                </span>
              </div>

              {/* Key Title */}
              <h3 className="text-sm font-semibold text-[#F2F7FA] font-display mb-1.5">
                {mem.key}
              </h3>

              {/* Stored Value */}
              <p className="text-xs text-[#8295A7] font-sans leading-relaxed line-clamp-3">
                {mem.value}
              </p>
            </div>

            {/* Footer: Date & Actions */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#8295A7]">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#00D9FF]" />
                {mem.lastAccessed}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(mem)}
                  className="p-1 rounded text-[#8295A7] hover:text-[#00D9FF] hover:bg-[#00D9FF]/10 transition-colors"
                  title="Edit Memory"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(mem.id, mem.key)}
                  className="p-1 rounded text-[#8295A7] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete Memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredMemories.length === 0 && (
          <div className="col-span-full py-12 text-center text-[#8295A7] font-mono text-xs">
            No memory registers match your criteria. Click &quot;Add Memory Register&quot; to index a new preference.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMemory ? 'Edit Memory Register' : 'Add Memory Register'}
        subtitle="Saved to encrypted local browser enclave"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#8295A7] mb-1.5">
              REGISTER KEY (NAME)
            </label>
            <input
              type="text"
              required
              value={formKey}
              onChange={e => setFormKey(e.target.value)}
              placeholder="e.g. Preferred Programming Paradigm"
              className="w-full px-3.5 py-2.5 bg-[#05090D] border border-white/10 rounded-lg text-sm text-[#F2F7FA] placeholder-[#8295A7] focus:border-[#00D9FF] focus:outline-none font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8295A7] mb-1.5">
              MEMORY VALUE / CONTENT
            </label>
            <textarea
              required
              rows={3}
              value={formValue}
              onChange={e => setFormValue(e.target.value)}
              placeholder="e.g. Always write strict TypeScript with zero any and modern React 19 functional hooks."
              className="w-full px-3.5 py-2.5 bg-[#05090D] border border-white/10 rounded-lg text-sm text-[#F2F7FA] placeholder-[#8295A7] focus:border-[#00D9FF] focus:outline-none font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#8295A7] mb-1.5">
                CATEGORY
              </label>
              <select
                value={formCategory}
                onChange={e => setFormCategory(e.target.value as MemoryItem['category'])}
                className="w-full px-3 py-2 bg-[#05090D] border border-white/10 rounded-lg text-xs font-mono text-[#F2F7FA] focus:border-[#00D9FF] focus:outline-none"
              >
                <option value="preference">Preference</option>
                <option value="project">Project</option>
                <option value="personal">Personal</option>
                <option value="system">System</option>
                <option value="credential">Credential</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8295A7] mb-1.5">
                IMPORTANCE
              </label>
              <select
                value={formImportance}
                onChange={e => setFormImportance(e.target.value as MemoryItem['importance'])}
                className="w-full px-3 py-2 bg-[#05090D] border border-white/10 rounded-lg text-xs font-mono text-[#F2F7FA] focus:border-[#00D9FF] focus:outline-none"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
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
              Save Register
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
