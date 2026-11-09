import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  Volume2,
  Trash2,
  Copy,
  Check,
  Terminal,
  Radio
} from 'lucide-react';
import { ChatMessage } from '../../types';
import { assistantService } from '../../services/assistantService';
import { voiceService } from '../../services/voiceService';
import { useToast } from '../common/Toast';

export const SystemTranscriptionPanel: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(assistantService.getMessages());
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const unsub = assistantService.subscribe(msgs => setMessages(msgs));
    const unsubVoice = voiceService.subscribe(st => setIsListening(st.isListening));
    return () => {
      unsub();
      unsubVoice();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');
    await assistantService.sendMessage(text);
  };

  const handleMicToggle = () => {
    voiceService.playSfx('click');
    if (isListening) {
      voiceService.setListening(false);
      assistantService.setState('READY');
    } else {
      voiceService.setListening(true);
      assistantService.setState('LISTENING');
      showToast('Voice Stream Active', 'Listening for transcription...', 'info');

      // Simulate a voice directive
      setTimeout(() => {
        voiceService.setListening(false);
        assistantService.sendMessage('Main instructions par jaata hoon, please summarize the current workspace state.');
      }, 2000);
    }
  };

  const handleSpeak = (text: string) => {
    voiceService.speak(text);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    voiceService.playSfx('click');
    showToast('Copied to Clipboard', 'Text copied', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    voiceService.playSfx('alert');
    assistantService.clearMessages();
    showToast('Feed Cleared', 'Transcription buffer flushed', 'info');
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#0B1E2E]/90 to-[#071522]/95 border border-[#00D9FF]/20 flex flex-col h-full shadow-[0_0_30px_rgba(0,217,255,0.06)] overflow-hidden">
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00D9FF]/40" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00D9FF]/40" />

      {/* Header matching screenshot */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#00D9FF]/15 bg-[#05090D]/80 shrink-0">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-[#00D9FF]" />
          <h3 className="text-xs font-bold font-mono tracking-widest text-[#F2F7FA] uppercase">
            SYSTEM_TRANSCRIPTION
          </h3>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE
          </span>
        </div>

        <button
          onClick={handleClear}
          className="p-1 rounded text-[#8295A7] hover:text-red-400 hover:bg-white/5 transition-colors"
          title="Clear transcript"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Transcription Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 stonic-grid-bg min-h-[300px]">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`p-3 rounded-xl border text-xs leading-relaxed transition-all ${
                isUser
                  ? 'bg-[#071522] border-[#168BFF]/30 ml-4'
                  : 'bg-[#0B1927] border-[#00D9FF]/25 mr-2'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#8295A7] mb-1">
                <span className={isUser ? 'text-[#168BFF] font-semibold' : 'text-[#00D9FF] font-semibold'}>
                  {isUser ? 'USMAN' : 'STONIC_AI'}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="tabular-nums">{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      className="hover:text-[#00D9FF] transition-colors"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="hover:text-[#00D9FF] transition-colors"
                    title="Copy text"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-[#F2F7FA] font-sans leading-relaxed whitespace-pre-wrap">
                {msg.text}
              </p>

              {msg.codeSnippet && (
                <div className="mt-2 p-2 rounded bg-black/60 border border-white/10 font-mono text-[11px] text-[#38BDF8] overflow-x-auto">
                  <code>{msg.codeSnippet.code}</code>
                </div>
              )}
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Bar at Bottom matching screenshot */}
      <div className="p-3 bg-[#05090D]/90 border-t border-[#00D9FF]/15 shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleMicToggle}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                : 'bg-[#071522] text-[#8295A7] hover:text-[#00D9FF] border-white/10 hover:border-[#00D9FF]/30'
            }`}
            title="Toggle voice dictation"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type instructions or voice transcription query..."
            className="flex-1 bg-[#071522] border border-white/10 focus:border-[#00D9FF]/40 rounded-xl px-3.5 py-2 text-xs text-[#F2F7FA] placeholder-[#8295A7] focus:outline-none font-sans"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#168BFF] text-black font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0"
            title="Send directive"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
