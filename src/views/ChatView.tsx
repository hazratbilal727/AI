import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Trash2,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  Cpu,
  User,
  Sparkles,
  Code2,
  Volume2
} from 'lucide-react';
import { ChatMessage, AssistantState } from '../types';
import { assistantService } from '../services/assistantService';
import { voiceService } from '../services/voiceService';
import { useToast } from '../components/common/Toast';

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(assistantService.getMessages());
  const [assistantState, setAssistantState] = useState<AssistantState>(assistantService.getState());
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    return assistantService.subscribe((msgs, st) => {
      setMessages(msgs);
      setAssistantState(st);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, assistantState]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text || assistantState === 'THINKING') return;

    setInput('');
    await assistantService.sendMessage(text);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleClear = () => {
    voiceService.playSfx('alert');
    assistantService.clearMessages();
    showToast('Conversation cleared', 'Session logs flushed from local buffer', 'info');
  };

  const handleRegenerate = async () => {
    voiceService.playSfx('pulse');
    await assistantService.regenerateLast();
    showToast('Response regenerated', 'New cognitive assessment generated', 'info');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    voiceService.playSfx('click');
    showToast('Copied to clipboard', 'Message text copied', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakMessage = (text: string) => {
    voiceService.speak(text);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem-2.5rem)] bg-[#05090D] overflow-hidden">
      {/* Top Chat Action Bar */}
      <div className="px-6 py-3.5 border-b border-[#00D9FF]/15 bg-[#071522]/80 backdrop-blur-md flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#F2F7FA] font-display tracking-wide">
              AI Assistant Console
            </h2>
            <p className="text-[11px] font-mono text-[#8295A7]">
              STONIC Cognitive Interface · JARVIS Persona
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            disabled={messages.length <= 1 || assistantState === 'THINKING'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1927] border border-white/10 hover:border-[#00D9FF]/40 text-xs font-mono text-[#8295A7] hover:text-[#00D9FF] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Regenerate last response"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Regenerate</span>
          </button>

          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1927] border border-white/10 hover:border-red-500/40 text-xs font-mono text-[#8295A7] hover:text-red-400 transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 stonic-grid-bg">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3.5 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                  isUser
                    ? 'bg-[#168BFF]/20 border border-[#168BFF]/40 text-[#168BFF]'
                    : 'bg-[#00D9FF]/20 border border-[#00D9FF]/40 text-[#00D9FF]'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
              </div>

              {/* Message Content Container */}
              <div
                className={`rounded-xl p-4 border transition-all ${
                  isUser
                    ? 'bg-[#071522] border-[#168BFF]/30 text-[#F2F7FA]'
                    : 'bg-[#0B1927] border-[#00D9FF]/25 shadow-[0_0_20px_rgba(0,217,255,0.05)] text-[#F2F7FA]'
                }`}
              >
                {/* Message Header (Sender & Timestamp) */}
                <div className="flex items-center justify-between gap-4 mb-1.5 text-[11px] font-mono text-[#8295A7]">
                  <span className="font-semibold text-white">
                    {isUser ? 'Usman' : 'STONIC AI'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums">{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleSpeakMessage(msg.text)}
                        className="text-[#8295A7] hover:text-[#00D9FF] transition-colors"
                        title="Read aloud"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="text-[#8295A7] hover:text-[#00D9FF] transition-colors"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Text Body */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-[#F2F7FA]">
                  {msg.text}
                </div>

                {/* Code Snippet if present */}
                {msg.codeSnippet && (
                  <div className="mt-3 rounded-lg bg-[#05090D] border border-white/10 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-black/40 border-b border-white/5 text-[10px] font-mono text-[#8295A7]">
                      <div className="flex items-center gap-1.5">
                        <Code2 className="w-3 h-3 text-[#00D9FF]" />
                        <span>{msg.codeSnippet.language}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(`${msg.id}-code`, msg.codeSnippet!.code)}
                        className="hover:text-white"
                      >
                        Copy Code
                      </button>
                    </div>
                    <pre className="p-3 text-xs font-mono text-[#38BDF8] overflow-x-auto leading-relaxed">
                      <code>{msg.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Thinking Indicator */}
        {assistantState === 'THINKING' && (
          <div className="flex gap-3.5 max-w-lg mr-auto">
            <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/20 border border-[#00D9FF]/40 text-[#00D9FF] flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4 animate-spin" />
            </div>
            <div className="rounded-xl px-4 py-3 bg-[#0B1927] border border-[#00D9FF]/30 flex items-center gap-2 text-xs font-mono text-[#00D9FF]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Analyzing matrix parameters &amp; synthesizing response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="px-6 py-2 bg-[#071522]/60 border-t border-white/5 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-mono text-[#8295A7] shrink-0">Quick Queries:</span>
        {[
          'Check system health and status',
          'Write a TypeScript telemetry packet interface',
          'Summarize active memory registers',
          'Assign Sentinel-4 to audit IPC sockets'
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleQuickPrompt(prompt)}
            className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#0B1927] hover:bg-[#00D9FF]/10 text-[#8295A7] hover:text-[#00D9FF] border border-white/5 hover:border-[#00D9FF]/30 transition-colors whitespace-nowrap shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Input Bar */}
      <div className="p-4 bg-[#071522] border-t border-[#00D9FF]/15">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your directive or inquiry (e.g. 'Show me orbital kinematics' or 'Check system status')..."
            className="flex-1 bg-[#05090D] border border-white/10 focus:border-[#00D9FF]/50 rounded-xl px-4 py-3 text-sm text-[#F2F7FA] placeholder-[#8295A7] focus:outline-none transition-colors font-sans shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || assistantState === 'THINKING'}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#168BFF] text-black font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,217,255,0.3)] shrink-0"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
