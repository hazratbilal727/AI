import React, { useState } from 'react';
import { 
  Play, RotateCcw, Copy, Check, Terminal, FileCode, FolderTree, 
  Sparkles, CheckCircle2, ChevronRight, Layers, Bug, Zap, Cpu
} from 'lucide-react';
import { initialCodeFiles } from '../data/mockData';
import { CodeFile } from '../types';
import { playSound } from '../services/voiceService';

export const CodeLabView: React.FC = () => {
  const [files, setFiles] = useState<CodeFile[]>(initialCodeFiles);
  const [activeFileId, setActiveFileId] = useState<string>(files[0].id);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '> STONIC Code Sandbox v3.4 initialized [ES2024 / Py3.12 Runtime]',
    '> Virtual memory isolated: 512MB heap allocated',
    '> Ready for execution. Press [Run Code] to compile in-memory simulator.'
  ]);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const handleCodeChange = (newCode: string) => {
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: newCode } : f));
  };

  const handleRun = () => {
    playSound('pulse');
    setIsRunning(true);
    setTerminalOutput(prev => [
      ...prev,
      `\n[${new Date().toLocaleTimeString()}] > Compiling ${activeFile.name} (${activeFile.language})...`,
      `> AST validation complete. 0 syntactic errors detected.`
    ]);

    setTimeout(() => {
      let result = '';
      if (activeFile.language === 'typescript' || activeFile.language === 'javascript') {
        result = `> Output: [Simulated STONIC runtime]\n> Vector transform matrix computed [64x64 float32]\n> Convergence efficiency: 99.84%\n> Benchmark: 1.42ms execution time`;
      } else if (activeFile.language === 'python') {
        result = `> Output: [Python 3.12 Sandboxed]\n> Telemetry packet received: { temp: 42.1C, cpu_load: 0.18, status: 'NOMINAL' }\n> Anomaly index: 0.002 (NORMAL)\n> Signal noise filtered via Kalman filter.`;
      } else {
        result = `> Output: Component rendered successfully into Virtual DOM canvas container.`;
      }

      setTerminalOutput(prev => [...prev, result, `> Process terminated with exit code 0.`]);
      setIsRunning(false);
      playSound('complete');
    }, 700);
  };

  const handleReset = () => {
    playSound('click');
    const initial = initialCodeFiles.find(f => f.id === activeFileId);
    if (initial) {
      setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: initial.content } : f));
      setTerminalOutput(prev => [...prev, `> Reset ${activeFile.name} to repository master snapshot.`]);
    }
  };

  const handleCopy = () => {
    playSound('click');
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormat = () => {
    playSound('click');
    // Simulated format
    setTerminalOutput(prev => [...prev, `> Formatted ${activeFile.name} using Prettier Cyber Engine.`]);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#0B1927]/90 border border-cyan-500/30 rounded-xl p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-[0_0_20px_rgba(0,217,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FileCode className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-wider text-white">CODE LAB SIMULATOR</h1>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
              Multi-Language IDE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Develop algorithmic routines, sensory filters, and agent logic directly in an in-memory execution container.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleFormat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#071522] border border-cyan-500/20 text-slate-300 hover:text-cyan-300 text-xs font-mono transition-all"
            title="Format Code"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Format
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#071522] border border-cyan-500/20 text-slate-300 hover:text-cyan-300 text-xs font-mono transition-all"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#071522] border border-cyan-500/20 text-slate-300 hover:text-cyan-300 text-xs font-mono transition-all"
            title="Reset to snapshot"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold text-xs tracking-wider uppercase hover:shadow-[0_0_15px_rgba(0,217,255,0.4)] disabled:opacity-50 transition-all font-mono"
          >
            <Play className={`w-3.5 h-3.5 fill-black ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Executing...' : 'Run Code'}
          </button>
        </div>
      </div>

      {/* Editor & File Tree Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: File Explorer */}
        <div className="lg:col-span-3 bg-[#0B1927]/80 border border-cyan-500/20 rounded-xl p-3 flex flex-col h-[640px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider">
              <FolderTree className="w-3.5 h-3.5" />
              <span>Workspace Files</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">{files.length} active</span>
          </div>

          <div className="space-y-1 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {files.map(f => {
              const isActive = f.id === activeFileId;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    playSound('click');
                    setActiveFileId(f.id);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg transition-all flex items-center justify-between border ${
                    isActive
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(0,217,255,0.15)]'
                      : 'bg-[#071522]/60 border-cyan-500/10 text-slate-400 hover:text-slate-200 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <div className="truncate">
                      <div className="text-xs font-mono truncate">{f.name}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{f.language} • {f.size}</div>
                    </div>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Runtime spec */}
          <div className="pt-3 border-t border-cyan-500/20 text-[11px] font-mono space-y-1.5 text-slate-400">
            <div className="flex justify-between">
              <span>SANDBOX:</span>
              <span className="text-green-400">SECURE V8</span>
            </div>
            <div className="flex justify-between">
              <span>LATENCY:</span>
              <span className="text-cyan-300">0.8 ms</span>
            </div>
            <div className="flex justify-between">
              <span>STDOUT:</span>
              <span className="text-slate-300">STREAMING</span>
            </div>
          </div>
        </div>

        {/* Right: Code Editor & Terminal */}
        <div className="lg:col-span-9 flex flex-col gap-4">
          {/* Code Editor Window */}
          <div className="bg-[#071522] border border-cyan-500/30 rounded-xl overflow-hidden shadow-lg flex flex-col h-[380px]">
            {/* Editor tab bar */}
            <div className="bg-[#0B1927] border-b border-cyan-500/20 px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs font-mono text-cyan-300 ml-2">{activeFile.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  {activeFile.language}
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                UTF-8 • CRLF • TypeScript 5.8
              </div>
            </div>

            {/* Code TextArea */}
            <div className="flex-1 relative font-mono text-xs flex">
              {/* Line numbers column */}
              <div className="w-10 bg-[#061019] border-r border-cyan-500/10 text-slate-600 select-none py-3 text-right pr-2 text-[11px] font-mono leading-5">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                value={activeFile.content}
                onChange={e => handleCodeChange(e.target.value)}
                className="flex-1 p-3 bg-transparent text-cyan-100 font-mono text-xs leading-5 resize-none focus:outline-none custom-scrollbar selection:bg-cyan-500/30"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Terminal Output */}
          <div className="bg-[#05090D] border border-cyan-500/30 rounded-xl p-3 flex flex-col h-[244px] shadow-inner font-mono">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
              <div className="flex items-center gap-2 text-xs text-cyan-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>TERMINAL OUTPUT / LOGS</span>
              </div>
              <button
                onClick={() => setTerminalOutput(['> Terminal cleared.'])}
                className="text-[10px] text-slate-500 hover:text-cyan-400 transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 text-xs text-slate-300 pr-1 custom-scrollbar">
              {terminalOutput.map((line, idx) => (
                <div 
                  key={idx} 
                  className={
                    line.includes('Error') 
                      ? 'text-red-400' 
                      : line.includes('Compiling') 
                      ? 'text-yellow-400' 
                      : line.includes('Output:') 
                      ? 'text-cyan-300 font-semibold' 
                      : line.startsWith('>') 
                      ? 'text-cyan-500/90' 
                      : 'text-slate-400'
                  }
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
