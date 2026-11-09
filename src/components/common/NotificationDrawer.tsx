import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  Shield,
  Bot,
  CheckSquare,
  Cpu,
  Workflow,
  ArrowRight
} from 'lucide-react';
import { AppNotification, AppSection } from '../../types';
import { notificationService } from '../../services/notificationService';
import { voiceService } from '../../services/voiceService';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: AppSection) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(notificationService.getNotifications());
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    return notificationService.subscribe(setNotifications);
  }, []);

  if (!isOpen) return null;

  const filtered = notifications.filter(
    n => filter === 'all' || n.type === filter
  );

  const handleMarkAll = () => {
    voiceService.playSfx('click');
    notificationService.markAllAsRead();
  };

  const handleClear = () => {
    voiceService.playSfx('alert');
    notificationService.clearAll();
  };

  const handleClickItem = (n: AppNotification) => {
    voiceService.playSfx('click');
    notificationService.markAsRead(n.id);
    if (n.actionSection) {
      onNavigate(n.actionSection);
      onClose();
    }
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'security':
        return <Shield className="w-4 h-4 text-red-400" />;
      case 'agent':
        return <Bot className="w-4 h-4 text-indigo-400" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-emerald-400" />;
      case 'workflow':
        return <Workflow className="w-4 h-4 text-amber-400" />;
      default:
        return <Cpu className="w-4 h-4 text-[#00D9FF]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md h-full bg-[#071522] border-l border-[#00D9FF]/30 shadow-[0_0_50px_rgba(0,217,255,0.15)] flex flex-col z-10">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#00D9FF]/20 bg-[#0B1927] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-[#00D9FF]" />
            <h3 className="text-sm font-bold text-[#F2F7FA] font-display">
              Notification &amp; Activity Center
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/30">
              {notifications.filter(n => !n.read).length} UNREAD
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-[#8295A7] hover:text-[#00D9FF] hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1 overflow-x-auto">
            {['all', 'system', 'task', 'security', 'agent'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-2.5 py-1 rounded capitalize transition-colors ${
                  filter === tab
                    ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40'
                    : 'text-[#8295A7] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAll}
              className="p-1 text-[#8295A7] hover:text-emerald-400"
              title="Mark all read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={handleClear}
              className="p-1 text-[#8295A7] hover:text-red-400"
              title="Clear notifications"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => handleClickItem(item)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                item.read
                  ? 'bg-[#05090D]/60 border-white/5 opacity-75'
                  : 'bg-[#0B1927] border-[#00D9FF]/30 shadow-[0_0_15px_rgba(0,217,255,0.08)]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#071522] border border-white/10 shrink-0">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-[#00D9FF] uppercase">{item.type}</span>
                    <span className="text-[#8295A7]">{item.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-[#F2F7FA] font-display">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#8295A7] mt-0.5 font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-16 text-center text-xs font-mono text-[#8295A7]">
              No notifications in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
