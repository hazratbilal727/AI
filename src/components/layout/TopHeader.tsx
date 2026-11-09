import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  User,
  Settings as SettingsIcon,
  Layers,
  Search,
  Bell,
  LayoutGrid
} from 'lucide-react';
import { AppSection } from '../../types';
import { settingsService } from '../../services/settingsService';
import { voiceService } from '../../services/voiceService';
import { notificationService } from '../../services/notificationService';

interface TopHeaderProps {
  currentSection: AppSection;
  onNavigate: (section: AppSection) => void;
  onToggleSidebar?: () => void;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  onOpenLauncher?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentSection,
  onNavigate,
  onToggleSidebar,
  onOpenSearch,
  onOpenNotifications,
  onOpenLauncher
}) => {
  const [settings, setSettings] = useState(settingsService.getSettings());
  const [unreadCount, setUnreadCount] = useState(notificationService.getUnreadCount());

  React.useEffect(() => {
    const unsubSettings = settingsService.subscribe(setSettings);
    const unsubNotifs = notificationService.subscribe(notifs => {
      setUnreadCount(notifs.filter(n => !n.read).length);
    });
    return () => {
      unsubSettings();
      unsubNotifs();
    };
  }, []);

  const toggleSound = () => {
    const updated = settingsService.updateSettings({ soundEffects: !settings.soundEffects });
    if (updated.soundEffects) {
      voiceService.playSfx('click');
    }
  };

  const toggleGlow = () => {
    settingsService.updateSettings({ visualGlow: !settings.visualGlow });
    voiceService.playSfx('click');
  };

  // Primary top navigation tabs matching the reference screenshot:
  // Intelligence | Notes | Tasks | Contacts
  const primaryTabs: { id: AppSection; label: string }[] = [
    { id: 'dashboard', label: 'Intelligence' },
    { id: 'memory', label: 'Notes' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'character', label: 'Contacts' }
  ];

  return (
    <header className="h-14 px-5 border-b border-[#00D9FF]/15 bg-[#05090D] flex items-center justify-between gap-4 z-30 shrink-0 select-none">
      {/* Zone 1: STONIC Branding matching screenshot */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg hover:bg-white/5 text-[#8295A7] hover:text-[#00D9FF] transition-colors"
          title="Toggle Navigation Sidebar"
        >
          <Layers className="w-4 h-4" />
        </button>

        <div
          onClick={() => onNavigate('dashboard')}
          className="cursor-pointer flex items-center gap-2.5"
        >
          <div className="w-6 h-6 rounded-md bg-[#00D9FF] flex items-center justify-center text-black font-black text-xs shadow-[0_0_10px_rgba(0,217,255,0.4)]">
            ST
          </div>
          <div>
            <div className="text-[9px] font-mono text-[#8295A7] tracking-wider -mb-0.5 uppercase">
              Stonic Desktop
            </div>
            <div className="text-sm font-bold tracking-widest text-[#F2F7FA] font-display">
              STONIC
            </div>
          </div>
        </div>

        {/* Global Launcher button */}
        <button
          onClick={onOpenLauncher}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#071522] border border-cyan-500/20 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 text-xs font-mono transition-all ml-2"
          title="Open Application Launcher"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
          <span>Launcher</span>
        </button>
      </div>

      {/* Zone 2: Authentic Top Center Tabs (Intelligence | Notes | Tasks | Contacts) */}
      <nav className="flex items-center gap-1.5 p-1 rounded-full bg-[#071522] border border-[#00D9FF]/20">
        {primaryTabs.map(tab => {
          const isActive = currentSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                voiceService.playSfx('click');
                onNavigate(tab.id);
              }}
              className={`px-4 py-1 rounded-full text-xs font-mono transition-all duration-200 ${
                isActive
                  ? 'bg-[#00D9FF] text-black font-semibold shadow-[0_0_15px_rgba(0,217,255,0.4)]'
                  : 'text-[#8295A7] hover:text-[#F2F7FA] hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Global Search, Notifications, Audio, Glow & Profile */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Global Search / Command Palette (Ctrl+K) */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#071522] border border-cyan-500/20 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-all text-xs font-mono"
          title="Search / Command Palette (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden lg:inline text-[11px]">Command Palette</span>
          <kbd className="hidden lg:inline-block px-1.5 py-0.2 rounded bg-black/40 border border-cyan-500/30 text-[9px] text-cyan-400 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Centralized Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 rounded-lg bg-[#071522] border border-cyan-500/20 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition-all"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-cyan-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 text-black text-[9px] font-bold font-mono flex items-center justify-center shadow-[0_0_8px_rgba(0,217,255,0.8)]">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          className={`p-1.5 rounded-lg border transition-colors ${
            settings.soundEffects
              ? 'bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/30'
              : 'bg-[#0B1927] text-[#8295A7] border-white/5 hover:text-[#F2F7FA]'
          }`}
          title={settings.soundEffects ? 'Sound Effects Enabled' : 'Sound Effects Muted'}
        >
          {settings.soundEffects ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Cyber Glow Toggle */}
        <button
          onClick={toggleGlow}
          className={`p-1.5 rounded-lg border transition-colors ${
            settings.visualGlow
              ? 'bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/30'
              : 'bg-[#0B1927] text-[#8295A7] border-white/5 hover:text-[#F2F7FA]'
          }`}
          title="Toggle Cyber Glow"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>

        {/* Settings Shortcut */}
        <button
          onClick={() => {
            onNavigate('settings');
            voiceService.playSfx('click');
          }}
          className="p-1.5 rounded-lg bg-[#0B1927] border border-white/10 text-[#8295A7] hover:text-[#00D9FF] hover:border-[#00D9FF]/40 transition-colors"
          title="System Settings"
        >
          <SettingsIcon className="w-3.5 h-3.5" />
        </button>

        {/* User Pill */}
        <div
          onClick={() => {
            onNavigate('character');
            voiceService.playSfx('click');
          }}
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-lg bg-[#071522] border border-[#00D9FF]/20 hover:border-[#00D9FF]/50 transition-colors cursor-pointer"
        >
          <div className="w-5 h-5 rounded bg-[#00D9FF]/20 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF]">
            <User className="w-3 h-3" />
          </div>
          <span className="text-xs font-semibold text-[#F2F7FA] font-display hidden sm:inline">
            {settings.userName}
          </span>
        </div>
      </div>
    </header>
  );
};
