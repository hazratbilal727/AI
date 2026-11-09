import React, { useState } from 'react';
import { 
  Palette, Sliders, Volume2, Sparkles, Clock, Shield, 
  Check, RotateCcw, Monitor, Sun, Moon
} from 'lucide-react';
import { settingsService } from '../services/settingsService';
import { UserSettings } from '../types';
import { playSound } from '../services/voiceService';

const themePresets = [
  { id: 'cyan', name: 'Cyber Cyan', accent: 'cyan' as const, primary: '#00D9FF', border: 'border-cyan-500' },
  { id: 'neon-blue', name: 'Obsidian Electric', accent: 'neon-blue' as const, primary: '#168BFF', border: 'border-blue-500' },
  { id: 'emerald', name: 'Matrix Green', accent: 'emerald' as const, primary: '#10B981', border: 'border-emerald-500' },
  { id: 'amber', name: 'Obsidian Gold', accent: 'amber' as const, primary: '#F59E0B', border: 'border-amber-500' }
];

export const PersonalizationView: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(settingsService.getSettings());
  const [selectedPreset, setSelectedPreset] = useState<string>('cyan');
  const [savedBanner, setSavedBanner] = useState(false);

  const update = (partial: Partial<UserSettings>) => {
    playSound('click');
    const updated = settingsService.updateSettings(partial);
    setSettings(updated);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2000);
  };

  const handlePresetSelect = (preset: typeof themePresets[0]) => {
    setSelectedPreset(preset.id);
    update({ accentColor: preset.accent });
    playSound('complete');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#0B1927]/90 border border-cyan-500/30 rounded-xl p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-[0_0_20px_rgba(0,217,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Palette className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-wider text-white">PERSONALIZATION & INTERFACE CONTROL</h1>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
              Theme Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Customize visual themes, glowing atmosphere, sound profiles, and response modalities to your mission preferences.
          </p>
        </div>

        {savedBanner && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            Preferences Saved
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Theme Presets & Accents */}
        <div className="lg:col-span-6 space-y-4">
          {/* Presets */}
          <div className="bg-[#0B1927]/90 border border-cyan-500/20 rounded-xl p-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Futuristic Color Profiles
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {themePresets.map(preset => {
                const isSelected = selectedPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? `${preset.border} bg-white/5 shadow-[0_0_15px_rgba(0,217,255,0.2)]`
                        : 'border-slate-800 bg-[#071522] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-white">{preset.name}</span>
                      <div 
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: preset.primary }}
                      />
                    </div>
                    <div className="mt-3 flex gap-1">
                      <div className="h-1.5 w-6 rounded-full" style={{ backgroundColor: preset.primary }} />
                      <div className="h-1.5 w-6 rounded-full bg-slate-700" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Customizer & Glow */}
          <div className="bg-[#0B1927]/90 border border-cyan-500/20 rounded-xl p-4 space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Atmospheric Glow & Illumination
            </h2>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>Cyan Glow Radiance</span>
                  <span className="text-cyan-400">{settings.glowIntensity ?? 80}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.glowIntensity ?? 80}
                  onChange={e => update({ glowIntensity: Number(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#071522] border border-cyan-500/10">
                <div>
                  <div className="text-xs font-semibold text-white">Ambient Particle Mesh</div>
                  <div className="text-[10px] text-slate-400">Floating orbital dust in viewport background</div>
                </div>
                <button
                  onClick={() => update({ ambientParticles: !settings.ambientParticles })}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    settings.ambientParticles 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {settings.ambientParticles ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Audio, Clock & Persona */}
        <div className="lg:col-span-6 space-y-4">
          {/* Audio Feedback */}
          <div className="bg-[#0B1927]/90 border border-cyan-500/20 rounded-xl p-4 space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              Acoustic & Procedural Sound FX
            </h2>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#071522] border border-cyan-500/10">
              <div>
                <div className="text-xs font-semibold text-white">Procedural Synthesizer Audio</div>
                <div className="text-[10px] text-slate-400">Synthetic clicks, hums, and pulse tones on interactions</div>
              </div>
              <button
                onClick={() => update({ soundEffects: !settings.soundEffects })}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                  settings.soundEffects 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {settings.soundEffects ? 'Active' : 'Muted'}
              </button>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>Sound Effect Volume</span>
                <span className="text-cyan-400">{Math.round((settings.soundVolume ?? 0.8) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.soundVolume ?? 0.8}
                onChange={e => update({ soundVolume: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Clock & Persona Style */}
          <div className="bg-[#0B1927]/90 border border-cyan-500/20 rounded-xl p-4 space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Chronometer & Cognitive Cadence
            </h2>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase">Clock Display Standard</label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {[
                  { id: '24h', label: '24-Hour Military' },
                  { id: '12h', label: '12-Hour Standard' },
                  { id: 'utc', label: 'UTC Universal' }
                ].map(clk => (
                  <button
                    key={clk.id}
                    onClick={() => update({ clockFormat: clk.id as any })}
                    className={`p-2.5 rounded-lg border text-xs font-mono transition-colors ${
                      (settings.clockFormat ?? '24h') === clk.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-[#071522] border-cyan-500/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {clk.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase">Assistant Persona Delivery</label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {[
                  { id: 'technical', label: 'Technical Concise' },
                  { id: 'conversational', label: 'Conversational' },
                  { id: 'protocol', label: 'Protocol Strict' }
                ].map(persona => (
                  <button
                    key={persona.id}
                    onClick={() => update({ persona: persona.id as any })}
                    className={`p-2.5 rounded-lg border text-xs font-mono transition-colors ${
                      (settings.persona ?? 'technical') === persona.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-[#071522] border-cyan-500/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {persona.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
