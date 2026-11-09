import React, { useState } from 'react';
import {
  Sliders,
  User,
  Volume2,
  Sparkles,
  Shield,
  RotateCcw,
  CheckCircle2,
  Trash2,
  Palette
} from 'lucide-react';
import { SystemSettings } from '../types';
import { settingsService } from '../services/settingsService';
import { voiceService } from '../services/voiceService';
import { useToast } from '../components/common/Toast';

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>(settingsService.getSettings());
  const { showToast } = useToast();

  const handleUpdate = (partial: Partial<SystemSettings>) => {
    voiceService.playSfx('click');
    const updated = settingsService.updateSettings(partial);
    setSettings(updated);
    showToast('Preferences Saved', 'Updated local configuration', 'success');
  };

  const handleReset = () => {
    voiceService.playSfx('alert');
    const reset = settingsService.resetToDefaults();
    setSettings(reset);
    showToast('Factory Reset', 'Restored default settings', 'warning');
  };

  const handleClearAllStorage = () => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to clear all local STONIC AI session data and memories?')) {
      voiceService.playSfx('alert');
      localStorage.clear();
      showToast('Enclave Flushed', 'Reloading environment...', 'warning');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 stonic-grid-bg">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-xl bg-[#071522] border border-[#00D9FF]/20">
        <div>
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-[#00D9FF]" />
            <h1 className="text-xl font-bold tracking-wide text-[#F2F7FA] font-display">
              System Settings &amp; Governance
            </h1>
          </div>
          <p className="text-xs text-[#8295A7] mt-1 font-mono">
            Configure identity tags, acoustic synthesis parameters, and zero-trust privacy bounds.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0B1927] border border-white/10 hover:border-[#00D9FF]/40 text-xs font-mono text-[#8295A7] hover:text-[#00D9FF] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identity & Profile Settings */}
        <div className="p-5 rounded-xl bg-[#0B1927]/90 border border-[#00D9FF]/20 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#F2F7FA] font-display">
            <User className="w-4 h-4 text-[#00D9FF]" />
            <span>Identity &amp; Call Signs</span>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8295A7] mb-1.5">USER NAME</label>
            <input
              type="text"
              value={settings.userName}
              onChange={e => handleUpdate({ userName: e.target.value })}
              className="w-full px-3.5 py-2 bg-[#05090D] border border-white/10 rounded-lg text-sm text-[#F2F7FA] focus:border-[#00D9FF] focus:outline-none font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8295A7] mb-1.5">
              ASSISTANT CALL SIGN
            </label>
            <input
              type="text"
              value={settings.assistantName}
              onChange={e => handleUpdate({ assistantName: e.target.value })}
              className="w-full px-3.5 py-2 bg-[#05090D] border border-white/10 rounded-lg text-sm text-[#F2F7FA] focus:border-[#00D9FF] focus:outline-none font-sans"
            />
          </div>
        </div>

        {/* Audio & Sensory Settings */}
        <div className="p-5 rounded-xl bg-[#0B1927]/90 border border-[#00D9FF]/20 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#F2F7FA] font-display">
            <Volume2 className="w-4 h-4 text-[#00D9FF]" />
            <span>Acoustic Synthesis &amp; SFX</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <div>
              <div className="text-xs font-medium text-[#F2F7FA] font-display">
                Procedural Sound Effects
              </div>
              <div className="text-[11px] font-mono text-[#8295A7]">
                Synthesizer clicks, activation hums, and alert beeps
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEffects}
              onChange={e => handleUpdate({ soundEffects: e.target.checked })}
              className="w-4 h-4 accent-[#00D9FF] rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <div>
              <div className="text-xs font-medium text-[#F2F7FA] font-display">
                Speech Synthesis Output
              </div>
              <div className="text-[11px] font-mono text-[#8295A7]">
                Vocalize assistant replies using SpeechSynthesis
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.voiceOutput}
              onChange={e => handleUpdate({ voiceOutput: e.target.checked })}
              className="w-4 h-4 accent-[#00D9FF] rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Appearance & Cyber Accents */}
        <div className="p-5 rounded-xl bg-[#0B1927]/90 border border-[#00D9FF]/20 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#F2F7FA] font-display">
            <Palette className="w-4 h-4 text-[#00D9FF]" />
            <span>Visual Theme &amp; Accents</span>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8295A7] mb-2">
              PRIMARY CYBER ACCENT
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'cyan' as const, label: 'Electric Cyan', color: '#00D9FF' },
                { id: 'neon-blue' as const, label: 'Neon Blue', color: '#168BFF' },
                { id: 'emerald' as const, label: 'Cyber Green', color: '#10B981' },
                { id: 'amber' as const, label: 'Amber Gold', color: '#F59E0B' }
              ].map(th => (
                <button
                  key={th.id}
                  onClick={() => handleUpdate({ accentColor: th.id })}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    settings.accentColor === th.id
                      ? 'border-[#00D9FF] bg-[#00D9FF]/10'
                      : 'border-white/10 bg-[#05090D] hover:border-white/20'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full mx-auto mb-1.5 shadow-sm"
                    style={{ backgroundColor: th.color }}
                  />
                  <div className="text-[10px] font-mono text-[#F2F7FA] truncate">{th.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <div>
              <div className="text-xs font-medium text-[#F2F7FA] font-display">
                Atmospheric Cyber Glow
              </div>
              <div className="text-[11px] font-mono text-[#8295A7]">
                Cyan outer glows and glassmorphic blurs
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.visualGlow}
              onChange={e => handleUpdate({ visualGlow: e.target.checked })}
              className="w-4 h-4 accent-[#00D9FF] rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Privacy & Enclave Operations */}
        <div className="p-5 rounded-xl bg-[#0B1927]/90 border border-[#00D9FF]/20 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#F2F7FA] font-display">
            <Shield className="w-4 h-4 text-[#00D9FF]" />
            <span>Zero-Trust Privacy &amp; Local Enclave</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#05090D] border border-white/5 space-y-2 text-xs font-mono text-[#8295A7]">
            <div className="flex justify-between">
              <span>STORAGE BACKEND:</span>
              <span className="text-emerald-400">Browser Local Enclave</span>
            </div>
            <div className="flex justify-between">
              <span>REMOTE TELEMETRY:</span>
              <span className="text-[#00D9FF]">DISABLED (100% Client-side)</span>
            </div>
          </div>

          <button
            onClick={handleClearAllStorage}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-mono transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Flush Local Enclave Cache</span>
          </button>
        </div>
      </div>
    </div>
  );
};
