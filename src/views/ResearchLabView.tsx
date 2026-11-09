import React, { useState } from 'react';
import {
  Globe,
  Search,
  Sparkles,
  FileText,
  Download,
  Share2,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Layers
} from 'lucide-react';
import { ResearchReport } from '../types';
import { initialResearchReports } from '../data/mockData';
import { StorageService } from '../services/storage';
import { voiceService } from '../services/voiceService';
import { useToast } from '../components/common/Toast';

export const ResearchLabView: React.FC = () => {
  const [reports, setReports] = useState<ResearchReport[]>(() =>
    StorageService.getItem<ResearchReport[]>('research_reports', initialResearchReports)
  );
  const [selectedReport, setSelectedReport] = useState<ResearchReport>(reports[0]);
  const [researchTopic, setResearchTopic] = useState('');
  const [researchMode, setResearchMode] = useState<ResearchReport['mode']>('technical');
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const { showToast } = useToast();

  const handleStartResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchTopic.trim()) return;

    voiceService.playSfx('pulse');
    setIsSynthesizing(true);
    showToast('Research Dispatched', `Aero-1 scouting sources for "${researchTopic}"...`, 'info');

    // Simulate multi-hop synthesis
    await new Promise(r => setTimeout(r, 1200));

    const newReport: ResearchReport = {
      id: `rr-${Date.now()}`,
      topic: researchTopic.trim(),
      mode: researchMode,
      status: 'completed',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      summary: `Deep-synthesis assessment of "${researchTopic}". Cross-referenced multi-modal parameters and performance trade-offs.`,
      findings: [
        `Optimal convergence achieved under mode [${researchMode.toUpperCase()}]. Zero latency drift observed.`,
        `Cross-referenced across simulated technical whitepaper indices with 98.4% relevance.`,
        `Identified 3 key architectural levers for high-velocity deployment.`
      ],
      sources: [
        { title: `Simulated Synthesis Archive: ${researchTopic.slice(0, 24)}`, url: 'https://stonicai.com/research', relevance: 0.96 },
        { title: 'Autonomous Multi-Hop Reasoning Protocols', url: 'https://arxiv.org/abs/2604.8812', relevance: 0.91 }
      ]
    };

    const updated = [newReport, ...reports];
    setReports(updated);
    StorageService.setItem('research_reports', updated);
    setSelectedReport(newReport);
    setIsSynthesizing(false);
    voiceService.playSfx('complete');
    showToast('Report Ready', 'Simulated findings structured and archived', 'success');
  };

  const handleExport = () => {
    voiceService.playSfx('click');
    const content = `# STONIC AI Research Report\n**Topic:** ${selectedReport.topic}\n**Mode:** ${selectedReport.mode}\n**Date:** ${selectedReport.createdAt}\n\n## Summary\n${selectedReport.summary}\n\n## Findings\n${selectedReport.findings.map(f => `- ${f}`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stonic_research_${selectedReport.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported Markdown', 'Report downloaded to local machine', 'success');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 stonic-grid-bg">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#071522] via-[#0B1E2E] to-[#071522] border border-[#00D9FF]/20 shadow-[0_0_30px_rgba(0,217,255,0.06)]">
        <div>
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-bold tracking-wide text-[#F2F7FA] font-display">
              AI Research Laboratory
            </h1>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
              SIMULATED RESEARCH SUITE
            </span>
          </div>
          <p className="text-xs text-[#8295A7] mt-1 font-mono">
            Formulate research directives, select evaluation modes, and synthesize structured intelligence reports.
          </p>
        </div>
      </div>

      {/* Main Grid: Prompt Form & Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Research Form & Reports List (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Form */}
          <div className="p-5 rounded-2xl bg-[#0B1E2E]/90 border border-[#00D9FF]/20">
            <h3 className="text-xs font-mono text-[#00D9FF] uppercase tracking-wider mb-3">
              NEW RESEARCH DIRECTIVE
            </h3>
            <form onSubmit={handleStartResearch} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#8295A7] mb-1">TOPIC / INQUIRY</label>
                <input
                  type="text"
                  required
                  value={researchTopic}
                  onChange={e => setResearchTopic(e.target.value)}
                  placeholder="e.g. Photonic quantum interconnects in LEO..."
                  className="w-full px-3 py-2 rounded-lg bg-[#05090D] border border-white/10 text-xs text-white focus:border-[#00D9FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8295A7] mb-1">RESEARCH MODE</label>
                <select
                  value={researchMode}
                  onChange={e => setResearchMode(e.target.value as ResearchReport['mode'])}
                  className="w-full px-3 py-2 rounded-lg bg-[#05090D] border border-white/10 text-xs font-mono text-white focus:border-[#00D9FF] focus:outline-none"
                >
                  <option value="technical">Technical Research (Architecture &amp; Specs)</option>
                  <option value="comparative">Comparative Analysis (Benchmark Trade-offs)</option>
                  <option value="academic">Academic Research (Peer Review Syntheses)</option>
                  <option value="market">Market Intelligence (Trends &amp; Ecosystem)</option>
                  <option value="competitive">Competitive Intelligence</option>
                  <option value="general">General Synthesis</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSynthesizing || !researchTopic.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#168BFF] text-black font-semibold text-xs font-mono tracking-wide hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSynthesizing ? 'Scouting & Synthesizing...' : 'Execute Research'}</span>
              </button>
            </form>
          </div>

          {/* Archived Reports */}
          <div className="p-5 rounded-2xl bg-[#0B1E2E]/90 border border-[#00D9FF]/20 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#8295A7]">
              <span>SYNTHESIZED REPORTS ({reports.length})</span>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {reports.map(rep => (
                <div
                  key={rep.id}
                  onClick={() => {
                    setSelectedReport(rep);
                    voiceService.playSfx('click');
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedReport?.id === rep.id
                      ? 'bg-[#00D9FF]/15 border-[#00D9FF]/40 text-[#F2F7FA]'
                      : 'bg-[#071522] border-white/5 hover:border-white/20 text-[#8295A7]'
                  }`}
                >
                  <div className="text-[10px] font-mono text-[#00D9FF] uppercase mb-0.5">
                    {rep.mode} · {rep.createdAt}
                  </div>
                  <h4 className="text-xs font-semibold text-[#F2F7FA] font-display truncate">
                    {rep.topic}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Selected Report Inspector (7 cols) */}
        {selectedReport && (
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#071522] border border-[#00D9FF]/25 shadow-[0_0_35px_rgba(0,217,255,0.06)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div>
                  <div className="text-[10px] font-mono text-[#00D9FF] uppercase tracking-wider">
                    {selectedReport.mode} MODE // {selectedReport.createdAt}
                  </div>
                  <h3 className="text-base font-bold text-[#F2F7FA] font-display mt-0.5">
                    {selectedReport.topic}
                  </h3>
                </div>

                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] hover:bg-[#00D9FF]/20 text-xs font-mono"
                  title="Export Markdown"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export MD</span>
                </button>
              </div>

              {/* Summary */}
              <div className="mb-4">
                <h4 className="text-xs font-mono text-[#8295A7] uppercase tracking-wider mb-1.5">
                  EXECUTIVE SUMMARY
                </h4>
                <p className="text-xs text-neutral-200 font-sans leading-relaxed p-3 rounded-xl bg-[#05090D] border border-white/5">
                  {selectedReport.summary}
                </p>
              </div>

              {/* Findings */}
              <div className="mb-4">
                <h4 className="text-xs font-mono text-[#8295A7] uppercase tracking-wider mb-1.5">
                  CORE FINDINGS
                </h4>
                <div className="space-y-2">
                  {selectedReport.findings.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs font-sans text-neutral-300">
                      <span className="text-[#00D9FF] font-bold">›</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sources */}
              <div>
                <h4 className="text-xs font-mono text-[#8295A7] uppercase tracking-wider mb-1.5">
                  INDEXED RELEVANCE SOURCES
                </h4>
                <div className="space-y-1.5">
                  {selectedReport.sources.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#05090D] border border-white/5 text-xs font-mono">
                      <span className="text-neutral-300 truncate pr-2">{s.title}</span>
                      <span className="text-[#00D9FF] shrink-0 font-semibold">{Math.round(s.relevance * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-[10px] font-mono text-[#8295A7] flex justify-between">
              <span>DISCLAIMER: SIMULATED RESEARCH ENGINE</span>
              <span className="text-emerald-400">REPORT COMPILED SUCCESSFULLY</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
