import React, { useState } from 'react';
import { Newspaper, ExternalLink, RefreshCw, ChevronRight } from 'lucide-react';
import { NewsItem } from '../../types';
import { worldMonitorService } from '../../services/worldMonitorService';
import { voiceService } from '../../services/voiceService';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export const TodayHeadlinesCard: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>(worldMonitorService.getNews());
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const { showToast } = useToast();

  const handleRefresh = () => {
    voiceService.playSfx('click');
    setNews([...worldMonitorService.getNews()]);
    showToast('Headlines Synced', 'Global intelligence wire updated', 'info');
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#0B1E2E]/80 to-[#071522]/90 border border-[#00D9FF]/20 p-5 flex flex-col justify-between overflow-hidden shadow-[0_0_25px_rgba(0,217,255,0.05)]">
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00D9FF]/40" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00D9FF]/40" />

      {/* Header matching screenshot: "Today Headlines" */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#00D9FF]/15">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-[#00D9FF]" />
          <h3 className="text-sm font-semibold text-[#F2F7FA] font-display tracking-wide">
            Today Headlines
          </h3>
        </div>

        <button
          onClick={handleRefresh}
          className="p-1 rounded text-[#8295A7] hover:text-[#00D9FF] transition-colors"
          title="Refresh headlines"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Headlines List */}
      <div className="space-y-3">
        {news.slice(0, 3).map(item => (
          <div
            key={item.id}
            onClick={() => {
              voiceService.playSfx('click');
              setSelectedNews(item);
            }}
            className="p-2.5 rounded-xl bg-[#05090D]/80 border border-white/5 hover:border-[#00D9FF]/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[10px] font-mono mb-1">
              <span className="text-[#00D9FF] uppercase">{item.source}</span>
              <span className="text-[#8295A7]">{item.timeAgo}</span>
            </div>
            <h4 className="text-xs font-medium text-[#F2F7FA] font-display line-clamp-2 group-hover:text-[#00D9FF] transition-colors">
              {item.title}
            </h4>
          </div>
        ))}
      </div>

      <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#8295A7]">
        <span>SOURCE: GLOBAL WIRE</span>
        <span className="text-[#00D9FF]">3 ALERTS ACTIVE</span>
      </div>

      {/* Read Article Modal */}
      {selectedNews && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedNews(null)}
          title={selectedNews.title}
          subtitle={`Source: ${selectedNews.source} · ${selectedNews.timeAgo}`}
        >
          <div className="space-y-4">
            <p className="text-sm text-[#F2F7FA] font-sans leading-relaxed">
              {selectedNews.summary}
            </p>
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-4 py-2 rounded-lg bg-[#00D9FF]/20 text-[#00D9FF] text-xs font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
