import React, { useState } from 'react';
import {
  UserCheck,
  Sparkles,
  Sliders,
  Volume2,
  CheckCircle2,
  Plus,
  Shield,
  MessageSquare
} from 'lucide-react';
import { CharacterProfile } from '../types';
import { initialCharacters } from '../data/mockData';
import { StorageService } from '../services/storage';
import { voiceService } from '../services/voiceService';
import { useToast } from '../components/common/Toast';

export const CharacterView: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterProfile[]>(() =>
    StorageService.getItem<CharacterProfile[]>('characters', initialCharacters)
  );
  const activeChar = characters.find(c => c.active) || characters[0];
  const { showToast } = useToast();

  const selectCharacter = (id: string) => {
    voiceService.playSfx('activate');
    setCharacters(prev => {
      const updated = prev.map(c => ({
        ...c,
        active: c.id === id
      }));
      StorageService.setItem('characters', updated);
      const chosen = updated.find(c => c.id === id);
      showToast('Persona Switched', `Active personality is now ${chosen?.name}`, 'success');
      return updated;
    });
  };

  const handleTestGreeting = (char: CharacterProfile) => {
    let greeting = `Good evening, Usman. I am the ${char.name}. All systems are standing by for your command.`;
    if (char.id === 'char-mentor') {
      greeting = `Welcome back, Usman. Let us carefully examine our technical architecture and plan the next phase methodically.`;
    } else if (char.id === 'char-vanguard') {
      greeting = `Systems locked and ready, Usman. Give the word and we deploy.`;
    } else if (char.id === 'char-companion') {
      greeting = `Hey Usman! Great to see you. What exciting projects are we building together tonight?`;
    }
    voiceService.speak(greeting);
    showToast('Voice Preview Active', `Synthesizing greeting for ${char.name}`, 'info');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 stonic-grid-bg">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-xl bg-[#071522] border border-[#00D9FF]/20">
        <div>
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-bold tracking-wide text-[#F2F7FA] font-display">
              AI Character &amp; Personality Synthesizer
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
              ACTIVE: {activeChar.name.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-[#8295A7] mt-1 font-mono">
            Customize cognitive tone, conversational cadence, formality level, and voice synthesis pitch.
          </p>
        </div>
      </div>

      {/* Profiles Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {characters.map(char => (
          <div
            key={char.id}
            className={`p-5 rounded-xl border transition-all duration-200 flex flex-col justify-between cursor-pointer group ${
              char.active
                ? 'bg-[#0B1927] border-[#00D9FF]/50 shadow-[0_0_25px_rgba(0,217,255,0.15)] ring-1 ring-[#00D9FF]/30'
                : 'bg-[#071522]/80 border-white/10 hover:border-white/20'
            }`}
            onClick={() => selectCharacter(char.id)}
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#00D9FF]">
                  PERSONALITY CORE
                </span>
                {char.active && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    SELECTED
                  </span>
                )}
              </div>

              {/* Title & Tagline */}
              <h3 className="text-base font-semibold text-[#F2F7FA] font-display mb-1 group-hover:text-[#00D9FF] transition-colors">
                {char.name}
              </h3>
              <p className="text-xs text-[#00D9FF]/80 font-mono italic mb-3">
                &ldquo;{char.tagline}&rdquo;
              </p>

              {/* Description */}
              <p className="text-xs text-[#8295A7] font-sans leading-relaxed mb-4">
                {char.description}
              </p>

              {/* Metric Sliders preview */}
              <div className="space-y-2 pt-2 border-t border-white/5 text-[11px] font-mono text-[#8295A7]">
                <div className="flex justify-between">
                  <span>Formality</span>
                  <span className="text-[#F2F7FA]">{char.formality}%</span>
                </div>
                <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00D9FF] rounded-full"
                    style={{ width: `${char.formality}%` }}
                  />
                </div>

                <div className="flex justify-between pt-1">
                  <span>Warmth</span>
                  <span className="text-[#F2F7FA]">{char.warmth}%</span>
                </div>
                <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#168BFF] rounded-full"
                    style={{ width: `${char.warmth}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Test Voice Button */}
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  handleTestGreeting(char);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#05090D] border border-white/10 hover:border-[#00D9FF]/40 text-xs font-mono text-[#F2F7FA] hover:text-[#00D9FF] transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span>Test Voice Greeting</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
