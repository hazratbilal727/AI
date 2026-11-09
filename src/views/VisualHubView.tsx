import React, { useState } from 'react';
import {
  Eye,
  Sparkles,
  Layers,
  Download,
  Maximize2,
  Trash2,
  Ratio,
  Code,
  Compass,
  Play
} from 'lucide-react';
import { VisualProject } from '../types';
import { initialVisualProjects } from '../data/mockData';
import { StorageService } from '../services/storage';
import { voiceService } from '../services/voiceService';
import { Modal } from '../components/common/Modal';
import { useToast } from '../components/common/Toast';

export const VisualHubView: React.FC = () => {
  const [projects, setProjects] = useState<VisualProject[]>(() =>
    StorageService.getItem<VisualProject[]>('visual_projects', initialVisualProjects)
  );
  const [activePrompt, setActivePrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VisualProject['category']>('blueprint');
  const [selectedRatio, setSelectedRatio] = useState<VisualProject['aspectRatio']>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeProject, setActiveProject] = useState<VisualProject>(projects[0]);
  const [fullscreenModal, setFullscreenModal] = useState<VisualProject | null>(null);

  const { showToast } = useToast();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePrompt.trim()) return;

    setIsGenerating(true);
    voiceService.playSfx('pulse');
    showToast('Synthesizing Blueprint', 'Rendering vector geometry in visual sandbox...', 'info');

    // Simulate procedural generation time
    await new Promise(r => setTimeout(r, 1200));

    const newProject: VisualProject = {
      id: `vis-${Date.now()}`,
      title: activePrompt.slice(0, 36) + (activePrompt.length > 36 ? '...' : ''),
      prompt: activePrompt,
      category: selectedCategory,
      aspectRatio: selectedRatio,
      thumbnailUrl: '',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      dimensions: selectedRatio === '16:9' ? '3840 x 2160' : selectedRatio === '4:3' ? '2048 x 1536' : '1920 x 1920'
    };

    const updated = [newProject, ...projects];
    setProjects(updated);
    StorageService.setItem('visual_projects', updated);
    setActiveProject(newProject);
    setIsGenerating(false);
    voiceService.playSfx('complete');
    showToast('Hologram Rendered', 'Blueprint added to visual archives', 'success');
  };

  const handleDelete = (id: string) => {
    voiceService.playSfx('alert');
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    StorageService.setItem('visual_projects', updated);
    if (activeProject.id === id && updated.length > 0) {
      setActiveProject(updated[0]);
    }
    showToast('Project Removed', 'Archived blueprint cleared from storage', 'warning');
  };

  // Procedural SVG Canvas Renderer based on category
  const renderVisualCanvas = (project: VisualProject) => {
    return (
      <div className="w-full h-full relative flex items-center justify-center p-8 bg-[#05090D] overflow-hidden select-none">
        {/* Ambient cyber grid */}
        <div className="absolute inset-0 stonic-grid-bg opacity-40 pointer-events-none" />
        <div className="absolute inset-0 stonic-radial-gradient pointer-events-none" />

        {/* Procedural Vector Artwork */}
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full max-h-[440px] drop-shadow-[0_0_20px_rgba(0,217,255,0.35)]"
        >
          <defs>
            <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#168BFF" stopOpacity="0.3" />
            </linearGradient>
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#00D9FF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#05090D" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer framing HUD brackets */}
          <path d="M 40,80 L 40,40 L 80,40" fill="none" stroke="#00D9FF" strokeWidth="2" />
          <path d="M 760,80 L 760,40 L 720,40" fill="none" stroke="#00D9FF" strokeWidth="2" />
          <path d="M 40,420 L 40,460 L 80,460" fill="none" stroke="#00D9FF" strokeWidth="2" />
          <path d="M 760,420 L 760,460 L 720,460" fill="none" stroke="#00D9FF" strokeWidth="2" />

          {/* Central Holographic Rings and Geometry */}
          <circle cx="400" cy="250" r="160" fill="none" stroke="rgba(0, 217, 255, 0.2)" strokeWidth="1.5" strokeDasharray="8 8" />
          <circle cx="400" cy="250" r="120" fill="none" stroke="rgba(22, 139, 255, 0.4)" strokeWidth="2" />
          <circle cx="400" cy="250" r="80" fill="none" stroke="#00D9FF" strokeWidth="2.5" />
          <circle cx="400" cy="250" r="45" fill="url(#coreGlow)" />

          {/* Radiating crosshairs */}
          <line x1="160" y1="250" x2="640" y2="250" stroke="rgba(0, 217, 255, 0.25)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="400" y1="70" x2="400" y2="430" stroke="rgba(0, 217, 255, 0.25)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Polygon / Blueprint Nodes */}
          <polygon
            points="400,190 450,220 450,280 400,310 350,280 350,220"
            fill="rgba(0, 217, 255, 0.1)"
            stroke="#00D9FF"
            strokeWidth="2"
          />

          {/* Floating Data Annotations */}
          <text x="70" y="70" fill="#8295A7" fontSize="12" fontFamily="monospace">
            STONIC_VISUAL_MATRIX // {project.category.toUpperCase()}
          </text>
          <text x="70" y="440" fill="#00D9FF" fontSize="11" fontFamily="monospace">
            DIM: {project.dimensions} · RATIO: {project.aspectRatio}
          </text>
          <text x="600" y="70" fill="#8295A7" fontSize="11" fontFamily="monospace">
            CONFIDENCE: 99.4%
          </text>
          <text x="560" y="440" fill="#8295A7" fontSize="11" fontFamily="monospace">
            STATUS: VECTOR_LOCKED
          </text>
        </svg>

        {/* Floating Title Tag */}
        <div className="absolute bottom-4 left-6 z-10 max-w-lg bg-[#071522]/90 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-md">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#00D9FF]">
            {project.category}
          </div>
          <div className="text-xs font-medium text-[#F2F7FA] font-display truncate">
            {project.title}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 stonic-grid-bg">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-xl bg-[#071522] border border-[#00D9FF]/20">
        <div>
          <div className="flex items-center gap-2.5">
            <Eye className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-bold tracking-wide text-[#F2F7FA] font-display">
              Visual Hub &amp; Hologram Studio
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
              VECTOR SYNTHESIZER
            </span>
          </div>
          <p className="text-xs text-[#8295A7] mt-1 font-mono">
            Simulate 3D blueprints, tactical UI schematics, and holographic telemetry projections.
          </p>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Interactive Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col rounded-xl bg-[#071522] border border-[#00D9FF]/25 shadow-[0_0_35px_rgba(0,217,255,0.08)] overflow-hidden min-h-[460px]">
          {/* Canvas Header */}
          <div className="px-5 py-3 border-b border-[#00D9FF]/15 bg-[#0B1927] flex items-center justify-between text-xs font-mono text-[#8295A7]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00D9FF]" />
              <span className="text-[#F2F7FA] font-semibold">{activeProject.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFullscreenModal(activeProject)}
                className="p-1.5 rounded hover:bg-white/5 text-[#8295A7] hover:text-[#00D9FF] transition-colors"
                title="Fullscreen Preview"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SVG Canvas Stage */}
          <div className="flex-1 relative min-h-[380px]">
            {renderVisualCanvas(activeProject)}
          </div>
        </div>

        {/* Right: Prompt Input & Generator Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-xl bg-[#0B1927]/90 border border-[#00D9FF]/20 shadow-[0_0_20px_rgba(0,217,255,0.06)]">
            <h3 className="text-sm font-semibold text-[#F2F7FA] font-display mb-3">
              Synthesize New Blueprint
            </h3>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#8295A7] mb-1.5">
                  VISUAL DIRECTIVE PROMPT
                </label>
                <textarea
                  rows={3}
                  required
                  value={activePrompt}
                  onChange={e => setActivePrompt(e.target.value)}
                  placeholder="e.g. Concentric orbital reactor with isometric telemetry lines..."
                  className="w-full px-3.5 py-2.5 bg-[#05090D] border border-white/10 rounded-lg text-xs text-[#F2F7FA] placeholder-[#8295A7] focus:border-[#00D9FF] focus:outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#8295A7] mb-1.5">
                    CATEGORY
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value as VisualProject['category'])}
                    className="w-full px-2.5 py-2 bg-[#05090D] border border-white/10 rounded-lg text-xs font-mono text-[#F2F7FA] focus:border-[#00D9FF] focus:outline-none"
                  >
                    <option value="blueprint">Blueprint</option>
                    <option value="hologram">Hologram</option>
                    <option value="concept">Concept</option>
                    <option value="interface">Interface</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8295A7] mb-1.5">
                    ASPECT RATIO
                  </label>
                  <select
                    value={selectedRatio}
                    onChange={e => setSelectedRatio(e.target.value as VisualProject['aspectRatio'])}
                    className="w-full px-2.5 py-2 bg-[#05090D] border border-white/10 rounded-lg text-xs font-mono text-[#F2F7FA] focus:border-[#00D9FF] focus:outline-none"
                  >
                    <option value="16:9">16:9 Cinema</option>
                    <option value="4:3">4:3 Studio</option>
                    <option value="1:1">1:1 Square</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating || !activePrompt.trim()}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#00D9FF] to-[#168BFF] text-black font-semibold text-xs font-mono tracking-wide hover:opacity-90 transition-opacity disabled:opacity-40 shadow-[0_0_15px_rgba(0,217,255,0.25)] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Synthesizing...' : 'Generate Blueprint'}</span>
              </button>
            </form>
          </div>

          {/* Archived Visual Projects List */}
          <div className="p-5 rounded-xl bg-[#0B1927]/90 border border-[#00D9FF]/20 flex flex-col">
            <h3 className="text-sm font-semibold text-[#F2F7FA] font-display mb-3">
              Archived Blueprints ({projects.length})
            </h3>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {projects.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    setActiveProject(p);
                    voiceService.playSfx('click');
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    activeProject.id === p.id
                      ? 'bg-[#00D9FF]/15 border-[#00D9FF]/50 text-[#F2F7FA]'
                      : 'bg-[#071522] border-white/5 hover:border-white/20 text-[#8295A7]'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-[10px] font-mono text-[#00D9FF] uppercase">
                      {p.category} · {p.aspectRatio}
                    </div>
                    <div className="text-xs font-medium text-[#F2F7FA] font-display truncate">
                      {p.title}
                    </div>
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(p.id);
                    }}
                    className="p-1 text-[#8295A7] hover:text-red-400 transition-colors shrink-0"
                    title="Delete Blueprint"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {fullscreenModal && (
        <Modal
          isOpen={true}
          onClose={() => setFullscreenModal(null)}
          title={fullscreenModal.title}
          subtitle={`Category: ${fullscreenModal.category.toUpperCase()} · ${fullscreenModal.dimensions}`}
          maxWidth="max-w-4xl"
        >
          <div className="h-[460px] rounded-lg border border-[#00D9FF]/20 overflow-hidden">
            {renderVisualCanvas(fullscreenModal)}
          </div>
        </Modal>
      )}
    </div>
  );
};
