import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Cpu,
  Bot,
  Activity,
  Shield,
  Layers,
  ChevronRight,
  Sparkles,
  Command,
  ArrowRight
} from 'lucide-react';
import { AppSection, AssistantState } from '../types';
import { OrbitalCore } from '../components/ai-core/OrbitalCore';
import { assistantService } from '../services/assistantService';
import { agentService } from '../services/agentService';
import { taskService } from '../services/taskService';
import { voiceService } from '../services/voiceService';
import { useToast } from '../components/common/Toast';

interface CommandCenterViewProps {
  onNavigate: (section: AppSection) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({ onNavigate }) => {
  const [coreState, setCoreState] = useState<AssistantState>(assistantService.getState());
  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<
    { id: string; cmd: string; output: string; time: string; status: 'success' | 'executing' | 'error' }[]
  >([
    {
      id: 'cmd-init',
      cmd: 'system status',
      output: 'STONIC AI Core v4.2 PRO initialized. 8 Agents registered, 7 Cognitive circuits online, Latency: 12ms nominal.',
      time: '19:15:02',
      status: 'success'
    }
  ]);

  const agents = agentService.getAgents();
  const tasks = taskService.getTasks();
  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    return assistantService.subscribe((_, st) => setCoreState(st));
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commandHistory]);

  const executeCommand = async (inputCmd: string) => {
    const raw = inputCmd.trim();
    if (!raw) return;

    setCommandInput('');
    voiceService.playSfx('pulse');

    const cmdTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const logId = `cmd-${Date.now()}`;

    // Add entry in executing state
    setCommandHistory(prev => [
      ...prev,
      { id: logId, cmd: raw, output: 'Executing directive...', time: cmdTime, status: 'executing' }
    ]);

    assistantService.setState('THINKING');

    await new Promise(r => setTimeout(r, 600));

    const lower = raw.toLowerCase();
    let reply = `Directive "${raw}" processed. Return code: 0 (NOMINAL).`;
    let targetSection: AppSection | null = null;

    if (lower === 'system status' || lower === 'status') {
      reply = `All systems online. Neural Load: 18.4%, Memory Enclave: 6 registers active, IPC Ping: 0.82ms.`;
    } else if (lower.includes('show active agents') || lower.includes('agents')) {
      reply = `Active agents: ${agents.map(a => `${a.name} [${a.status}]`).join(', ')}.`;
      targetSection = 'agent-lab';
    } else if (lower.includes('show running tasks') || lower.includes('tasks')) {
      reply = `Current tasks queue: ${tasks.filter(t => t.status === 'active').length} active, ${tasks.filter(t => t.status === 'pending').length} pending.`;
      targetSection = 'tasks';
    } else if (lower.includes('open memory') || lower.includes('memory')) {
      reply = `Opening Vault-08 local memory enclave...`;
      targetSection = 'memory';
    } else if (lower.includes('activate voice') || lower.includes('voice')) {
      reply = `Voice cockpit engaged. Audio synthesis set to 48kHz.`;
      targetSection = 'voice';
    } else if (lower.includes('open world monitor') || lower.includes('world') || lower.includes('globe')) {
      reply = `World Monitor satellite array initialized.`;
      targetSection = 'world-monitor';
    } else if (lower.includes('clear')) {
      setCommandHistory([]);
      assistantService.setState('READY');
      showToast('Console Log Cleared', 'Terminal buffer flushed', 'info');
      return;
    } else if (lower.includes('help')) {
      reply = `Available commands: 'system status', 'show active agents', 'show running tasks', 'open memory', 'activate voice mode', 'open world monitor', 'clear'.`;
    }

    setCommandHistory(prev =>
      prev.map(item => (item.id === logId ? { ...item, output: reply, status: 'success' } : item))
    );

    voiceService.playSfx('complete');
    assistantService.setState('READY');

    if (targetSection) {
      setTimeout(() => onNavigate(targetSection!), 1200);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 stonic-grid-bg">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#071522] via-[#0B1E2E] to-[#071522] border border-[#00D9FF]/20 shadow-[0_0_30px_rgba(0,217,255,0.06)]">
        <div>
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-bold tracking-wide text-[#F2F7FA] font-display">
              AI Command Center
            </h1>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
              EXECUTIVE CONSOLE
            </span>
          </div>
          <p className="text-xs text-[#8295A7] mt-1 font-mono">
            Execute direct procedural commands, inspect telemetry queues, and supervise autonomous agent loops.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => executeCommand('system status')}
            className="px-3 py-1.5 rounded-lg bg-[#0B1927] border border-white/10 hover:border-[#00D9FF]/40 text-xs font-mono text-[#8295A7] hover:text-[#00D9FF] transition-colors"
          >
            system status
          </button>
          <button
            onClick={() => executeCommand('show active agents')}
            className="px-3 py-1.5 rounded-lg bg-[#0B1927] border border-white/10 hover:border-[#00D9FF]/40 text-xs font-mono text-[#8295A7] hover:text-[#00D9FF] transition-colors"
          >
            show agents
          </button>
        </div>
      </div>

      {/* Main Grid: Central Core & Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: AI Core & Status Overview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-between p-6 rounded-2xl bg-[#071522] border border-[#00D9FF]/25 shadow-[0_0_30px_rgba(0,217,255,0.06)] relative overflow-hidden min-h-[460px]">
          <div className="absolute inset-0 stonic-radial-gradient pointer-events-none" />

          <div className="w-full flex items-center justify-between z-10 text-xs font-mono text-[#8295A7] mb-2">
            <span className="text-[#00D9FF]">GLOBAL ASSISTANT STATUS</span>
            <span className="text-white font-semibold">{coreState}</span>
          </div>

          <div className="my-auto py-2">
            <OrbitalCore
              state={coreState}
              size={320}
              interactive={true}
              onCoreClick={() => {
                voiceService.playSfx('pulse');
                assistantService.setState(coreState === 'READY' ? 'LISTENING' : 'READY');
              }}
            />
          </div>

          {/* Subsystem Quick Stats */}
          <div className="w-full grid grid-cols-3 gap-2 z-10 pt-4 border-t border-white/5 text-center text-xs font-mono">
            <div className="p-2 rounded bg-[#05090D] border border-white/5">
              <div className="text-[10px] text-[#8295A7]">AGENTS</div>
              <div className="text-sm font-semibold text-[#00D9FF]">8 Active</div>
            </div>
            <div className="p-2 rounded bg-[#05090D] border border-white/5">
              <div className="text-[10px] text-[#8295A7]">MISSIONS</div>
              <div className="text-sm font-semibold text-emerald-400">4 Tracked</div>
            </div>
            <div className="p-2 rounded bg-[#05090D] border border-white/5">
              <div className="text-[10px] text-[#8295A7]">LATENCY</div>
              <div className="text-sm font-semibold text-white">0.82 ms</div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Command Console (7 cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl bg-[#0B1E2E]/90 border border-[#00D9FF]/25 shadow-[0_0_30px_rgba(0,217,255,0.06)] overflow-hidden min-h-[460px]">
          {/* Console Header */}
          <div className="px-5 py-3.5 border-b border-[#00D9FF]/15 bg-[#05090D] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF]">
              <Command className="w-4 h-4" />
              <span className="font-semibold tracking-wider">COMMAND_LINE_INTERPRETER // STONIC_SH</span>
            </div>

            <button
              onClick={() => setCommandHistory([])}
              className="text-[10px] font-mono text-[#8295A7] hover:text-red-400 transition-colors"
            >
              Clear Log
            </button>
          </div>

          {/* Terminal Logs Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs stonic-grid-bg min-h-[300px]">
            {commandHistory.map(entry => (
              <div key={entry.id} className="p-3 rounded-lg bg-[#05090D]/90 border border-white/5">
                <div className="flex items-center justify-between text-[10px] text-[#8295A7] mb-1">
                  <span className="text-[#00D9FF]">usr@stonic-desktop:~$ {entry.cmd}</span>
                  <span className="tabular-nums">{entry.time}</span>
                </div>
                <div className="text-neutral-200 leading-relaxed font-sans text-xs">
                  {entry.output}
                </div>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Quick Directive Suggestions */}
          <div className="px-4 py-2 bg-[#05090D]/80 border-t border-white/5 flex items-center gap-2 overflow-x-auto text-[11px] font-mono text-[#8295A7]">
            <span className="shrink-0 text-[#00D9FF]">Presets:</span>
            {[
              'system status',
              'show active agents',
              'show running tasks',
              'open memory',
              'open world monitor',
              'activate voice mode'
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => executeCommand(p)}
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-[#00D9FF]/15 hover:text-[#00D9FF] transition-colors whitespace-nowrap"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Command Prompt Input */}
          <div className="p-3 bg-[#05090D] border-t border-[#00D9FF]/20">
            <form
              onSubmit={e => {
                e.preventDefault();
                executeCommand(commandInput);
              }}
              className="flex items-center gap-2"
            >
              <span className="text-[#00D9FF] font-mono text-sm pl-2">{'>'}</span>
              <input
                type="text"
                value={commandInput}
                onChange={e => setCommandInput(e.target.value)}
                placeholder="Enter command (e.g. 'system status', 'show active agents', 'open memory')..."
                className="flex-1 bg-transparent px-2 py-1.5 text-xs text-[#F2F7FA] placeholder-[#8295A7] font-mono focus:outline-none"
              />
              <button
                type="submit"
                disabled={!commandInput.trim()}
                className="px-4 py-1.5 rounded-lg bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-black font-semibold text-xs font-mono transition-opacity disabled:opacity-40"
              >
                Execute
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
