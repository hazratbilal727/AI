import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Terminal,
  Activity
} from 'lucide-react';
import { AudioWaveform } from '../components/common/AudioWaveform';
import { voiceService } from '../services/voiceService';
import { assistantService } from '../services/assistantService';
import { useToast } from '../components/common/Toast';

export const VoiceView: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('Say "Hey Stonic" or select a simulated command below');
  const [voiceLogs, setVoiceLogs] = useState<{ id: string; time: string; text: string; role: 'user' | 'assistant' }[]>([
    {
      id: 'log-1',
      time: '19:15:00',
      text: 'Voice cockpit initialized in procedural simulation mode.',
      role: 'assistant'
    }
  ]);

  const { showToast } = useToast();

  useEffect(() => {
    return voiceService.subscribe(st => {
      setIsListening(st.isListening);
      setIsSpeaking(st.isSpeaking);
    });
  }, []);

  const startListening = () => {
    voiceService.playSfx('activate');
    voiceService.setListening(true);
    assistantService.setState('LISTENING');
    setTranscript('Listening for vocal frequencies...');
    showToast('Voice Cockpit Active', 'Awaiting spoken input', 'info');
  };

  const stopListening = () => {
    voiceService.playSfx('click');
    voiceService.setListening(false);
    assistantService.setState('READY');
    setTranscript('Standby. Tap the microphone to speak.');
  };

  const handleSimulateVoiceCommand = (command: string) => {
    voiceService.playSfx('activate');
    voiceService.setListening(true);
    assistantService.setState('LISTENING');
    setTranscript(`User: "${command}"`);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setVoiceLogs(prev => [
      { id: `log-${Date.now()}-u`, time: now, text: command, role: 'user' },
      ...prev
    ]);

    // Simulated speech processing delay
    setTimeout(() => {
      voiceService.setListening(false);
      assistantService.setState('THINKING');

      setTimeout(() => {
        let reply = `Directing system resources for "${command}". All checks nominal.`;
        if (command.includes('status')) {
          reply = 'Good evening, Usman. All 7 cognitive sub-systems and orbital rings are operating with zero error flags.';
        } else if (command.includes('nightly')) {
          reply = 'Nightly autonomous workflow dispatched. Sentinel-4 has commenced node auditing.';
        } else if (command.includes('memory')) {
          reply = 'Active memory enclave Vault-08 contains 6 verified anchors.';
        }

        assistantService.setState('SPEAKING');
        setTranscript(`STONIC AI: "${reply}"`);
        voiceService.speak(reply, () => {
          assistantService.setState('READY');
        });

        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setVoiceLogs(prev => [
          { id: `log-${Date.now()}-a`, time: replyTime, text: reply, role: 'assistant' },
          ...prev
        ]);
      }, 900);
    }, 1200);
  };

  const stopSpeaking = () => {
    voiceService.stopSpeaking();
    assistantService.setState('READY');
    showToast('Audio Synthesis Halted', 'Speech output cancelled', 'info');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 stonic-grid-bg">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-xl bg-[#071522] border border-[#00D9FF]/20">
        <div>
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-bold tracking-wide text-[#F2F7FA] font-display">
              Voice Assistant Simulator
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              PROCEDURAL SPEECH ENGINE
            </span>
          </div>
          <p className="text-xs text-[#8295A7] mt-1 font-mono">
            Interactive voice interface with dual-band acoustic spectrum and Web Speech synthesis.
          </p>
        </div>
      </div>

      {/* Main Cockpit Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Central Voice Stage (8 cols) */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-8 rounded-xl bg-[#071522] border border-[#00D9FF]/25 shadow-[0_0_35px_rgba(0,217,255,0.08)] relative overflow-hidden min-h-[460px]">
          <div className="absolute inset-0 stonic-radial-gradient pointer-events-none" />

          {/* Top Status */}
          <div className="w-full flex items-center justify-between z-10 text-xs font-mono text-[#8295A7] mb-8">
            <span className="text-[#00D9FF]">CARRIER: 48.0 KHZ ZERO-LATENCY</span>
            <span className="text-neutral-400 font-semibold">
              {isSpeaking ? 'SPEAKING SYNTHESIS' : isListening ? 'LISTENING FLUX' : 'STANDBY READY'}
            </span>
          </div>

          {/* Central Pulsing Mic Sphere */}
          <div className="relative my-auto flex flex-col items-center">
            {/* Outer animated rings */}
            <div
              className={`absolute -inset-10 rounded-full border border-[#00D9FF]/30 transition-all duration-700 pointer-events-none ${
                isListening || isSpeaking ? 'scale-125 opacity-100 animate-ping' : 'scale-100 opacity-20'
              }`}
            />
            <div
              className={`absolute -inset-5 rounded-full border border-[#00D9FF]/50 transition-all duration-500 pointer-events-none ${
                isListening || isSpeaking ? 'scale-110 opacity-80' : 'scale-90 opacity-20'
              }`}
            />

            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-28 h-28 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 shadow-[0_0_35px_rgba(0,217,255,0.25)] ${
                isListening
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 scale-105'
                  : isSpeaking
                  ? 'bg-[#00D9FF]/20 border-[#00D9FF] text-[#00D9FF] scale-105'
                  : 'bg-[#0B1927] border-[#00D9FF]/40 text-[#00D9FF] hover:border-[#00D9FF] hover:scale-102'
              }`}
              title={isListening ? 'Click to stop listening' : 'Click to start voice'}
            >
              {isListening ? (
                <Mic className="w-10 h-10 animate-pulse text-emerald-400" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>

            {/* Transcript Bubble */}
            <div className="mt-8 max-w-md px-5 py-3 rounded-xl bg-[#0B1927]/90 border border-[#00D9FF]/25 backdrop-blur-md text-center z-10">
              <p className="text-sm font-sans text-[#F2F7FA] font-medium">{transcript}</p>
            </div>
          </div>

          {/* Audio Waveform Visualization Bar */}
          <div className="w-full max-w-lg mt-8 pt-4 border-t border-white/5 z-10">
            <AudioWaveform
              active={isListening || isSpeaking}
              barsCount={36}
              height={56}
              color={isListening ? '#10B981' : '#00D9FF'}
            />
          </div>

          {isSpeaking && (
            <div className="mt-4 z-10">
              <button
                onClick={stopSpeaking}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono hover:bg-red-500/20 transition-colors"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Halt Speech Synthesis</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Quick Voice Test Directives & Activity History (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-xl bg-[#0B1927]/90 border border-[#00D9FF]/20 shadow-[0_0_20px_rgba(0,217,255,0.06)]">
            <h3 className="text-sm font-semibold text-[#F2F7FA] font-display mb-3">
              Simulated Voice Commands
            </h3>
            <p className="text-xs text-[#8295A7] font-mono mb-4">
              Click any vocal directive to simulate the full voice processing cycle:
            </p>

            <div className="space-y-2">
              {[
                'Hey Stonic, check system health and status',
                'Hey Stonic, prepare nightly autonomous workflow',
                'Hey Stonic, inspect active memory registers',
                'Hey Stonic, verify global satellite hotspot latency'
              ].map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSimulateVoiceCommand(cmd)}
                  className="w-full text-left p-2.5 rounded-lg bg-[#071522] border border-white/5 hover:border-[#00D9FF]/40 text-xs text-[#F2F7FA] hover:text-[#00D9FF] transition-colors flex items-center justify-between group"
                >
                  <span className="truncate pr-2 font-sans">&quot;{cmd}&quot;</span>
                  <Play className="w-3.5 h-3.5 text-[#00D9FF] shrink-0 opacity-60 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>

          {/* Voice Session Activity Logs */}
          <div className="p-5 rounded-xl bg-[#0B1927]/90 border border-[#00D9FF]/20 flex flex-col">
            <h3 className="text-sm font-semibold text-[#F2F7FA] font-display mb-3">
              Voice Session Log
            </h3>
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {voiceLogs.map(log => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg bg-[#071522] border border-white/5 text-xs font-mono"
                >
                  <div className="flex justify-between text-[10px] text-[#8295A7] mb-1">
                    <span className={log.role === 'user' ? 'text-[#168BFF]' : 'text-[#00D9FF]'}>
                      {log.role === 'user' ? 'USER VOICE' : 'SYNTHESIS'}
                    </span>
                    <span>{log.time}</span>
                  </div>
                  <p className="text-[#F2F7FA] font-sans leading-relaxed text-[11px]">
                    {log.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
