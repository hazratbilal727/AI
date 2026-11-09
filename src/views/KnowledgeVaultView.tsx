import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Search,
  Plus,
  Trash2,
  Edit2,
  Tag,
  Share2,
  Filter,
  Layers,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { KnowledgeDocument, KnowledgeNode } from '../types';
import { knowledgeService } from '../services/knowledgeService';
import { voiceService } from '../services/voiceService';
import { Modal } from '../components/common/Modal';
import { useToast } from '../components/common/Toast';

export const KnowledgeVaultView: React.FC = () => {
  const [docs, setDocs] = useState<KnowledgeDocument[]>(knowledgeService.getDocuments());
  const [graphNodes, setGraphNodes] = useState<KnowledgeNode[]>(knowledgeService.getGraphNodes());
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(docs[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCat, setFormCat] = useState<KnowledgeDocument['category']>('notes');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formTags, setFormTags] = useState('Core, Architecture');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    return knowledgeService.subscribe(() => {
      const d = knowledgeService.getDocuments();
      setDocs(d);
      setGraphNodes(knowledgeService.getGraphNodes());
      if (selectedDoc && !d.some(item => item.id === selectedDoc.id)) {
        setSelectedDoc(d[0] || null);
      }
    });
  }, [selectedDoc]);

  // Interactive 2D Knowledge Graph Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    // Node positioning layout
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const positionedNodes = graphNodes.map((n, idx) => {
      const angle = (idx / Math.max(1, graphNodes.length)) * Math.PI * 2;
      const dist = n.id === 'gn-core' ? 0 : 85 + (idx % 3) * 25;
      return {
        ...n,
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        baseAngle: angle,
        dist
      };
    });

    const render = () => {
      t += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      positionedNodes.forEach(node => {
        node.connections.forEach(targetId => {
          const target = positionedNodes.find(pn => pn.id === targetId);
          if (target) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = 'rgba(0, 217, 255, 0.2)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      positionedNodes.forEach(node => {
        const pulse = Math.sin(t * 2 + node.dist) * 2;
        const r = (node.radius || 16) + pulse;

        // Node glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = node.id === 'gn-core' ? 'rgba(0, 217, 255, 0.25)' : 'rgba(22, 139, 255, 0.15)';
        ctx.fill();

        // Node solid center
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = node.id === 'gn-core' ? '#00D9FF' : '#0B1E2E';
        ctx.strokeStyle = '#00D9FF';
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        // Label
        ctx.fillStyle = '#F2F7FA';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + r + 12);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [graphNodes]);

  const filteredDocs = docs.filter(d => {
    const matchesCat = categoryFilter === 'all' || d.category === categoryFilter;
    const matchesQuery = !searchQuery ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const tagsArr = formTags.split(',').map(s => s.trim()).filter(Boolean);
    const newD = knowledgeService.addDocument({
      title: formTitle.trim(),
      category: formCat,
      summary: formSummary.trim(),
      content: formContent.trim(),
      tags: tagsArr
    });

    voiceService.playSfx('complete');
    setIsAddModalOpen(false);
    setSelectedDoc(newD);
    showToast('Document Anchored', `Added "${newD.title}" to Knowledge Vault`, 'success');
  };

  const handleDelete = (id: string, title: string) => {
    voiceService.playSfx('alert');
    knowledgeService.deleteDocument(id);
    showToast('Document Removed', `Deleted "${title}" from vault`, 'warning');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 stonic-grid-bg">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#071522] via-[#0B1E2E] to-[#071522] border border-[#00D9FF]/20 shadow-[0_0_30px_rgba(0,217,255,0.06)]">
        <div>
          <div className="flex items-center gap-2.5">
            <Brain className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-bold tracking-wide text-[#F2F7FA] font-display">
              Knowledge Vault &amp; Neural Graph
            </h1>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
              VAULT-08 EXTENSION
            </span>
          </div>
          <p className="text-xs text-[#8295A7] mt-1 font-mono">
            Structured knowledge base linking memories, technical blueprints, project specs, and topological graph relations.
          </p>
        </div>

        <button
          onClick={() => {
            voiceService.playSfx('click');
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#168BFF] text-black font-semibold text-xs tracking-wide hover:opacity-90 shadow-[0_0_15px_rgba(0,217,255,0.25)]"
        >
          <Plus className="w-4 h-4" />
          <span>New Document</span>
        </button>
      </div>

      {/* Main Grid: Document Explorer & Knowledge Graph Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Document Explorer List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search & Categories */}
          <div className="p-3.5 rounded-xl bg-[#0B1E2E]/80 border border-[#00D9FF]/15 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8295A7] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search knowledge documents or tags..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#05090D] border border-white/10 text-xs text-white placeholder-[#8295A7] focus:border-[#00D9FF] focus:outline-none font-mono"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
              {['all', 'project', 'research', 'notes', 'credential'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                    categoryFilter === cat
                      ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40'
                      : 'text-[#8295A7] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Documents Cards */}
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredDocs.map(doc => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoc(doc);
                    voiceService.playSfx('click');
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#0B1E2E] border-[#00D9FF]/50 shadow-[0_0_20px_rgba(0,217,255,0.12)]'
                      : 'bg-[#071522]/90 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-[#00D9FF] uppercase">{doc.category}</span>
                    <span className="text-[#8295A7]">{doc.updatedAt}</span>
                  </div>

                  <h4 className="text-xs font-semibold text-[#F2F7FA] font-display mb-1 truncate">
                    {doc.title}
                  </h4>
                  <p className="text-[11px] text-[#8295A7] font-sans line-clamp-2 mb-2">
                    {doc.summary}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map((tag, i) => (
                      <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-[#8295A7] border border-white/5">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Knowledge Graph Canvas & Document Reader (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Interactive Knowledge Graph */}
          <div className="p-4 rounded-2xl bg-[#071522] border border-[#00D9FF]/20 shadow-[0_0_30px_rgba(0,217,255,0.06)] relative overflow-hidden flex flex-col justify-between min-h-[260px]">
            <div className="flex items-center justify-between z-10 text-xs font-mono text-[#8295A7] mb-2">
              <span className="text-[#00D9FF] flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                TOPOLOGICAL KNOWLEDGE GRAPH
              </span>
              <span>{graphNodes.length} Linked Nodes</span>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <canvas ref={canvasRef} width={500} height={200} className="w-full max-h-[200px]" />
            </div>
          </div>

          {/* Selected Document Full Reader */}
          {selectedDoc && (
            <div className="p-5 rounded-2xl bg-[#0B1E2E]/90 border border-[#00D9FF]/20 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono text-[#00D9FF] uppercase tracking-wider">
                      {selectedDoc.category} // {selectedDoc.updatedAt}
                    </span>
                    <h3 className="text-base font-bold text-[#F2F7FA] font-display mt-0.5">
                      {selectedDoc.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleDelete(selectedDoc.id, selectedDoc.title)}
                    className="p-1.5 rounded-lg text-[#8295A7] hover:text-red-400 hover:bg-white/5"
                    title="Delete Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-neutral-200 font-sans leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto pr-1">
                  {selectedDoc.content}
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#8295A7]">
                <span>TAGS: {selectedDoc.tags.join(', ')}</span>
                <span className="text-emerald-400">ENCLAVE SECURED</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Document Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Index Knowledge Document"
        subtitle="Added to local Vault-08 Knowledge Graph"
      >
        <form onSubmit={handleSaveDoc} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#8295A7] mb-1">DOCUMENT TITLE</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              placeholder="e.g. Memory Ring Allocation Protocols"
              className="w-full px-3 py-2 rounded-lg bg-[#05090D] border border-white/10 text-sm text-white focus:border-[#00D9FF] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-[#8295A7] mb-1">CATEGORY</label>
              <select
                value={formCat}
                onChange={e => setFormCat(e.target.value as KnowledgeDocument['category'])}
                className="w-full px-3 py-2 rounded-lg bg-[#05090D] border border-white/10 text-xs font-mono text-white focus:border-[#00D9FF] focus:outline-none"
              >
                <option value="notes">Technical Notes</option>
                <option value="project">Project Specs</option>
                <option value="research">Research Document</option>
                <option value="bookmark">Bookmark / Reference</option>
                <option value="credential">Credential Vault</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8295A7] mb-1">TAGS (COMMA-SEPARATED)</label>
              <input
                type="text"
                value={formTags}
                onChange={e => setFormTags(e.target.value)}
                placeholder="e.g. Core, AST, Neural"
                className="w-full px-3 py-2 rounded-lg bg-[#05090D] border border-white/10 text-xs text-white focus:border-[#00D9FF] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8295A7] mb-1">BRIEF SUMMARY</label>
            <input
              type="text"
              required
              value={formSummary}
              onChange={e => setFormSummary(e.target.value)}
              placeholder="One-line summary for rapid indexing..."
              className="w-full px-3 py-2 rounded-lg bg-[#05090D] border border-white/10 text-xs text-white focus:border-[#00D9FF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8295A7] mb-1">FULL CONTENT (MARKDOWN)</label>
            <textarea
              rows={4}
              required
              value={formContent}
              onChange={e => setFormContent(e.target.value)}
              placeholder="# Specifications and findings..."
              className="w-full px-3 py-2 rounded-lg bg-[#05090D] border border-white/10 text-xs text-white focus:border-[#00D9FF] focus:outline-none font-mono"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-mono text-[#8295A7] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#00D9FF] to-[#168BFF] text-black font-semibold text-xs font-mono tracking-wide hover:opacity-90"
            >
              Index Document
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
