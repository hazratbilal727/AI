import React, { useState, useEffect } from 'react';
import { AppSection } from './types';
import { TopHeader } from './components/layout/TopHeader';
import { Sidebar } from './components/layout/Sidebar';
import { StatusBar } from './components/layout/StatusBar';
import { ToastProvider } from './components/common/Toast';
import { CommandPalette } from './components/common/CommandPalette';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { LauncherOverlay } from './views/LauncherOverlay';

// Views
import { DashboardView } from './views/DashboardView';
import { CommandCenterView } from './views/CommandCenterView';
import { ControlRoomView } from './views/ControlRoomView';
import { AgentLabView } from './views/AgentLabView';
import { AutomationStudioView } from './views/AutomationStudioView';
import { MissionControlView } from './views/MissionControlView';
import { KnowledgeVaultView } from './views/KnowledgeVaultView';
import { ResearchLabView } from './views/ResearchLabView';
import { CodeLabView } from './views/CodeLabView';
import { SystemMonitorView } from './views/SystemMonitorView';
import { DigitalWorkspaceView } from './views/DigitalWorkspaceView';
import { MediaStudioView } from './views/MediaStudioView';
import { SecurityCenterView } from './views/SecurityCenterView';
import { SimulationLabView } from './views/SimulationLabView';
import { PersonalizationView } from './views/PersonalizationView';

// Existing Views
import { ChatView } from './views/ChatView';
import { AiCoreView } from './views/AiCoreView';
import { MemoryView } from './views/MemoryView';
import { SkillsView } from './views/SkillsView';
import { CharacterView } from './views/CharacterView';
import { AgentsView } from './views/AgentsView';
import { TasksView } from './views/TasksView';
import { WorldMonitorView } from './views/WorldMonitorView';
import { VisualHubView } from './views/VisualHubView';
import { VoiceView } from './views/VoiceView';
import { RemoteView } from './views/RemoteView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  const [currentSection, setCurrentSection] = useState<AppSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Modals & Overlays
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderActiveView = () => {
    switch (currentSection) {
      // Primary 3-column Laptop Dashboard matching photo
      case 'dashboard':
        return <DashboardView onNavigate={setCurrentSection} />;

      // New Sci-Fi Workspaces
      case 'command-center':
        return <CommandCenterView onNavigate={setCurrentSection} />;
      case 'control-room':
        return <ControlRoomView />;
      case 'agent-lab':
        return <AgentLabView />;
      case 'automation-studio':
        return <AutomationStudioView />;
      case 'mission-control':
        return <MissionControlView />;
      case 'knowledge-vault':
        return <KnowledgeVaultView />;
      case 'research-lab':
        return <ResearchLabView />;
      case 'code-lab':
        return <CodeLabView />;
      case 'system-monitor':
        return <SystemMonitorView />;
      case 'digital-workspace':
        return <DigitalWorkspaceView />;
      case 'media-studio':
        return <MediaStudioView />;
      case 'security-center':
        return <SecurityCenterView />;
      case 'simulation-lab':
        return <SimulationLabView />;
      case 'personalization':
        return <PersonalizationView />;

      // Preserved Core Views
      case 'assistant':
        return <ChatView />;
      case 'core':
        return <AiCoreView />;
      case 'memory':
        return <MemoryView />;
      case 'skills':
        return <SkillsView />;
      case 'character':
        return <CharacterView />;
      case 'agents':
        return <AgentsView />;
      case 'tasks':
        return <TasksView />;
      case 'world-monitor':
        return <WorldMonitorView />;
      case 'visual-hub':
        return <VisualHubView />;
      case 'voice':
        return <VoiceView />;
      case 'remote':
      case 'remote-uplink':
        return <RemoteView />;
      case 'settings':
        return <SettingsView />;

      default:
        return <DashboardView onNavigate={setCurrentSection} />;
    }
  };

  return (
    <ToastProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#05090D] text-[#F2F7FA] font-sans">
        {/* 1. Top Header */}
        <TopHeader
          currentSection={currentSection}
          onNavigate={setCurrentSection}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => setIsNotifOpen(true)}
          onOpenLauncher={() => setIsLauncherOpen(true)}
        />

        {/* 2. Middle Central Command Center (Sidebar + Active Workspace) */}
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar
            currentSection={currentSection}
            onNavigate={setCurrentSection}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-[#05090D] p-3 md:p-4 custom-scrollbar">
            {renderActiveView()}
          </main>
        </div>

        {/* 3. Bottom Status Bar */}
        <StatusBar
          onQuickWake={() => setCurrentSection('voice')}
        />

        {/* 4. Global Command Palette (Ctrl+K) */}
        <CommandPalette
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onNavigate={setCurrentSection}
        />

        {/* 5. Centralized Notification Drawer */}
        <NotificationDrawer
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
          onNavigate={setCurrentSection}
        />

        {/* 6. Application Launcher Overlay */}
        <LauncherOverlay
          isOpen={isLauncherOpen}
          onClose={() => setIsLauncherOpen(false)}
          onNavigate={setCurrentSection}
          currentSection={currentSection}
        />
      </div>
    </ToastProvider>
  );
}
