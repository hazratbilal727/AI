import React from 'react';
import { CameraCard } from '../components/dashboard/CameraCard';
import { TodayHeadlinesCard } from '../components/dashboard/TodayHeadlinesCard';
import { ConvergenceMatrix } from '../components/dashboard/ConvergenceMatrix';
import { VisualIntelligenceHubCard } from '../components/dashboard/VisualIntelligenceHubCard';
import { SystemTranscriptionPanel } from '../components/dashboard/SystemTranscriptionPanel';
import { AppSection } from '../types';

interface DashboardViewProps {
  onNavigate: (section: AppSection) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#05090D] stonic-grid-bg">
      {/* 3-Column STONIC Desktop Home Page Grid matching reference screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full min-h-[calc(100vh-8rem)] items-stretch">
        {/* Column 1: Left HUD (Camera Feed & Today Headlines) - 3 cols */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          {/* Top: Camera Card */}
          <CameraCard />

          {/* Bottom: Today Headlines */}
          <TodayHeadlinesCard />
        </div>

        {/* Column 2: Center Workspace (Convergence Matrix & Visual Hub) - 5 cols */}
        <div className="lg:col-span-5 flex flex-col gap-5 justify-between">
          {/* Top: AI Convergence Matrix & System Access Globe */}
          <ConvergenceMatrix
            onOpenMemory={() => onNavigate('memory')}
            onOpenHistory={() => onNavigate('assistant')}
            onOpenApps={() => onNavigate('skills')}
          />

          {/* Bottom: Visual Intelligence Hub */}
          <VisualIntelligenceHubCard
            onOpenFullHub={() => onNavigate('visual-hub')}
          />
        </div>

        {/* Column 3: Right HUD (SYSTEM_TRANSCRIPTION) - 4 cols */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <SystemTranscriptionPanel />
        </div>
      </div>
    </div>
  );
};
