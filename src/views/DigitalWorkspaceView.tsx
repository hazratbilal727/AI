import React, { useState, useEffect } from 'react';
import { 
  Briefcase, CheckSquare, Calendar, Clock, Plus, Trash2, 
  Search, Edit3, Tag, Bell, CheckCircle2, ChevronLeft, ChevronRight, Bookmark
} from 'lucide-react';
import { playSound } from '../services/voiceService';
import { loadState, saveState } from '../services/storage';

interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  updatedAt: string;
}

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  day: number;
  time: string;
  category: 'mission' | 'review' | 'system' | 'personal';
}

const initialNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Orbital Telemetry Invariance',
    content: 'Ensure all attitude drift calculations account for secondary solar flare interference. Set harmonic coefficient to 1.482.',
    tag: 'AEROSPACE',
    updatedAt: 'Today, 14:20'
  },
  {
    id: 'note-2',
    title: 'Agent Swarm Coordination Protocol',
    content: 'Sentinel-01 acts as triage router. High latency nodes (>150ms) must failover to local edge cache.',
    tag: 'AGENTS',
    updatedAt: 'Yesterday'
  },
  {
    id: 'note-3',
    title: 'Daily Synchronizer Checklist',
    content: 'Review automated backups at 04:00 UTC. Verify cryptographic hashes on knowledge vault snapshots.',
    tag: 'OPERATIONS',
    updatedAt: '2 days ago'
  }
];

const initialTodos: TodoItem[] = [
  { id: 'todo-1', text: 'Calibrate convergence matrix laser tracks', completed: true, priority: 'high', dueDate: 'Today' },
  { id: 'todo-2', text: 'Simulate neural network backpropagation drill', completed: false, priority: 'high', dueDate: 'Today' },
  { id: 'todo-3', text: 'Audit Knowledge Vault-08 document permissions', completed: false, priority: 'medium', dueDate: 'Tomorrow' },
  { id: 'todo-4', text: 'Optimize vector database embeddings memory heap', completed: false, priority: 'low', dueDate: 'Friday' }
];

const initialEvents: CalendarEvent[] = [
  { id: 'ev-1', title: 'System Diagnostics & Health Check', day: 8, time: '09:00 - 10:00', category: 'system' },
  { id: 'ev-2', title: 'Swarm Autonomous Mission Launch', day: 8, time: '14:30 - 15:45', category: 'mission' },
  { id: 'ev-3', title: 'Research Report Synthesis: Lyra AI', day: 12, time: '11:00 - 12:30', category: 'review' },
  { id: 'ev-4', title: 'SOC Security Protocol Audit', day: 16, time: '16:00 - 17:30', category: 'system' }
];

export const DigitalWorkspaceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notes' | 'todos' | 'calendar' | 'planner'>('notes');
  
  // State
  const [notes, setNotes] = useState<Note[]>(() => loadState('stonic_ws_notes', initialNotes));
  const [todos, setTodos] = useState<TodoItem[]>(() => loadState('stonic_ws_todos', initialTodos));
  const [events, setEvents] = useState<CalendarEvent[]>(() => loadState('stonic_ws_events', initialEvents));
  const [searchQuery, setSearchQuery] = useState('');
  
  // Note Modal / editing
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTag, setNewNoteTag] = useState('GENERAL');

  // Todo Input
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Calendar selected day
  const [selectedDay, setSelectedDay] = useState<number>(8);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('10:00');

  useEffect(() => {
    saveState('stonic_ws_notes', notes);
  }, [notes]);

  useEffect(() => {
    saveState('stonic_ws_todos', todos);
  }, [todos]);

  useEffect(() => {
    saveState('stonic_ws_events', events);
  }, [events]);

  // Notes actions
  const handleSaveNote = () => {
    if (!newNoteTitle.trim()) return;
    playSound('activate');
    if (selectedNote) {
      setNotes(prev => prev.map(n => n.id === selectedNote.id ? {
        ...n,
        title: newNoteTitle,
        content: newNoteContent,
        tag: newNoteTag,
        updatedAt: 'Just now'
      } : n));
    } else {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        title: newNoteTitle,
        content: newNoteContent,
        tag: newNoteTag,
        updatedAt: 'Just now'
      };
      setNotes(prev => [newNote, ...prev]);
    }
    setIsEditingNote(false);
    setSelectedNote(null);
  };

  const handleDeleteNote = (id: string) => {
    playSound('alert');
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Todo actions
  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;
    playSound('complete');
    const item: TodoItem = {
      id: `todo-${Date.now()}`,
      text: newTodoText,
      completed: false,
      priority: newTodoPriority,
      dueDate: 'Today'
    };
    setTodos(prev => [item, ...prev]);
    setNewTodoText('');
  };

  const handleToggleTodo = (id: string) => {
    playSound('click');
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTodo = (id: string) => {
    playSound('alert');
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  // Calendar actions
  const handleAddEvent = () => {
    if (!newEventTitle.trim()) return;
    playSound('complete');
    const newEv: CalendarEvent = {
      id: `ev-${Date.now()}`,
      title: newEventTitle,
      day: selectedDay,
      time: newEventTime,
      category: 'system'
    };
    setEvents(prev => [...prev, newEv]);
    setNewEventTitle('');
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#0B1927]/90 border border-cyan-500/30 rounded-xl p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-[0_0_20px_rgba(0,217,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Briefcase className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-wider text-white">DIGITAL WORKSPACE</h1>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
              Productivity Hub
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Integrated tactical notes, prioritised task checklists, monthly calendar scheduling, and daily time-blocking.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-[#071522] border border-cyan-500/20 rounded-lg p-1 text-xs font-mono">
          <button
            onClick={() => { playSound('click'); setActiveTab('notes'); }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'notes' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tactical Notes
          </button>
          <button
            onClick={() => { playSound('click'); setActiveTab('todos'); }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'todos' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            To-Do Matrix
          </button>
          <button
            onClick={() => { playSound('click'); setActiveTab('calendar'); }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'calendar' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => { playSound('click'); setActiveTab('planner'); }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'planner' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Daily Planner
          </button>
        </div>
      </div>

      {/* TAB 1: NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tactical notes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#071522] border border-cyan-500/20 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <button
              onClick={() => {
                playSound('click');
                setSelectedNote(null);
                setNewNoteTitle('');
                setNewNoteContent('');
                setNewNoteTag('GENERAL');
                setIsEditingNote(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 text-black font-semibold text-xs font-mono uppercase hover:bg-cyan-400 transition-colors shadow-[0_0_12px_rgba(0,217,255,0.3)]"
            >
              <Plus className="w-4 h-4" />
              New Note
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredNotes.map(n => (
              <div 
                key={n.id} 
                className="bg-[#0B1927]/80 border border-cyan-500/20 rounded-xl p-4 flex flex-col justify-between hover:border-cyan-500/50 transition-all hover:shadow-[0_0_15px_rgba(0,217,255,0.1)] group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                      {n.tag}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{n.updatedAt}</span>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1.5 group-hover:text-cyan-300 transition-colors">
                    {n.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-4 leading-relaxed font-sans">
                    {n.content}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-cyan-500/10">
                  <button
                    onClick={() => {
                      playSound('click');
                      setSelectedNote(n);
                      setNewNoteTitle(n.title);
                      setNewNoteContent(n.content);
                      setNewNoteTag(n.tag);
                      setIsEditingNote(true);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-cyan-300 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(n.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TODOS */}
      {activeTab === 'todos' && (
        <div className="bg-[#0B1927]/90 border border-cyan-500/20 rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Enter task or directive..."
              value={newTodoText}
              onChange={e => setNewTodoText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddTodo()}
              className="flex-1 min-w-[240px] px-3 py-2 bg-[#071522] border border-cyan-500/30 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <select
              value={newTodoPriority}
              onChange={e => setNewTodoPriority(e.target.value as any)}
              className="px-3 py-2 bg-[#071522] border border-cyan-500/30 rounded-lg text-xs text-cyan-300 font-mono focus:outline-none"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <button
              onClick={handleAddTodo}
              className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold text-xs font-mono uppercase hover:bg-cyan-400 transition-colors"
            >
              Add Task
            </button>
          </div>

          <div className="space-y-2 mt-4">
            {todos.map(todo => (
              <div
                key={todo.id}
                onClick={() => handleToggleTodo(todo.id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                  todo.completed 
                    ? 'bg-[#071522]/40 border-cyan-500/10 opacity-60' 
                    : 'bg-[#071522] border-cyan-500/20 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    todo.completed ? 'bg-cyan-500 border-cyan-400' : 'border-slate-500'
                  }`}>
                    {todo.completed && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                  </div>
                  <span className={`text-xs ${todo.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {todo.text}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                    todo.priority === 'high' ? 'bg-red-950 text-red-400 border border-red-500/30' :
                    todo.priority === 'medium' ? 'bg-yellow-950 text-yellow-400 border border-yellow-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {todo.priority}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{todo.dueDate}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTodo(todo.id);
                    }}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Calendar Grid */}
          <div className="lg:col-span-8 bg-[#0B1927]/90 border border-cyan-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-mono uppercase tracking-wider text-white">NOVEMBER 2026 SCHEDULE</h2>
              </div>
              <div className="text-xs font-mono text-cyan-400">Standard Galactic Time (UTC)</div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs mb-2 text-slate-400">
              <div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div><div>SUN</div>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 30 }).map((_, i) => {
                const dayNum = i + 1;
                const isSelected = selectedDay === dayNum;
                const hasEvents = events.some(e => e.day === dayNum);
                return (
                  <button
                    key={dayNum}
                    onClick={() => {
                      playSound('click');
                      setSelectedDay(dayNum);
                    }}
                    className={`h-16 p-1.5 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_12px_rgba(0,217,255,0.3)]'
                        : 'bg-[#071522]/80 border-cyan-500/10 hover:border-cyan-500/30'
                    }`}
                  >
                    <span className={`text-xs font-mono font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-300'}`}>
                      {dayNum}
                    </span>
                    {hasEvents && (
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_rgba(0,217,255,0.9)]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day's Events & Quick Add */}
          <div className="lg:col-span-4 bg-[#0B1927]/90 border border-cyan-500/20 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-cyan-500/20">
                <span className="text-xs font-mono text-cyan-300 uppercase">
                  Directives for Day {selectedDay}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {events.filter(e => e.day === selectedDay).length} Scheduled
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                {events.filter(e => e.day === selectedDay).map(ev => (
                  <div key={ev.id} className="p-2.5 rounded bg-[#071522] border border-cyan-500/20 text-xs">
                    <div className="text-white font-medium">{ev.title}</div>
                    <div className="text-[10px] font-mono text-cyan-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ev.time}
                    </div>
                  </div>
                ))}
                {events.filter(e => e.day === selectedDay).length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-500 font-mono">
                    No scheduled operations for this day.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Add Event */}
            <div className="mt-4 pt-3 border-t border-cyan-500/20 space-y-2">
              <input
                type="text"
                placeholder="New event title..."
                value={newEventTitle}
                onChange={e => setNewEventTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#071522] border border-cyan-500/20 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Time (e.g. 14:00)"
                  value={newEventTime}
                  onChange={e => setNewEventTime(e.target.value)}
                  className="w-1/2 px-2.5 py-1.5 bg-[#071522] border border-cyan-500/20 rounded text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  onClick={handleAddEvent}
                  className="w-1/2 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs hover:bg-cyan-500/30 transition-colors"
                >
                  + Add Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DAILY PLANNER */}
      {activeTab === 'planner' && (
        <div className="bg-[#0B1927]/90 border border-cyan-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-500/20">
            <div>
              <h2 className="text-sm font-bold text-white font-mono uppercase">CHRONOLOGICAL DAILY TIME-BLOCKS</h2>
              <p className="text-xs text-slate-400">High-intensity focus windows configured for optimal cognitive throughput.</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30">
              OPTIMAL FLOW STATE
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { time: '08:00 - 09:00', title: 'System Boot & Telemetry Convergence Audit', status: 'COMPLETED', color: 'text-emerald-400' },
              { time: '09:00 - 11:30', title: 'Deep Work: Neural Network Architecture Refactoring', status: 'ACTIVE', color: 'text-cyan-300' },
              { time: '11:30 - 12:30', title: 'Mission Sync: Satellite Constellation Alpha Handoff', status: 'PENDING', color: 'text-slate-400' },
              { time: '13:30 - 15:00', title: 'Research Synthesis: Autonomous Swarm Consensus', status: 'PENDING', color: 'text-slate-400' },
              { time: '15:30 - 17:00', title: 'Security Hardening & SOC Red Team Drill', status: 'PENDING', color: 'text-slate-400' },
              { time: '17:00 - 18:00', title: 'Knowledge Vault Archival & Ledger Sync', status: 'PENDING', color: 'text-slate-400' }
            ].map((block, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#071522] border border-cyan-500/10">
                <div className="flex items-center gap-3">
                  <div className="text-xs font-mono text-cyan-400 font-bold w-28">{block.time}</div>
                  <div className="text-xs text-slate-200">{block.title}</div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${block.color} bg-black/40 border border-cyan-500/20`}>
                  {block.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Note Edit Modal */}
      {isEditingNote && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1927] border border-cyan-500/40 rounded-xl p-5 w-full max-w-lg shadow-[0_0_30px_rgba(0,217,255,0.2)]">
            <h3 className="text-sm font-bold text-white uppercase font-mono mb-3">
              {selectedNote ? 'Edit Tactical Note' : 'Create Tactical Note'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase">Title</label>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={e => setNewNoteTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#071522] border border-cyan-500/30 rounded text-xs text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Note title..."
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase">Category Tag</label>
                <input
                  type="text"
                  value={newNoteTag}
                  onChange={e => setNewNoteTag(e.target.value.toUpperCase())}
                  className="w-full mt-1 px-3 py-2 bg-[#071522] border border-cyan-500/30 rounded text-xs text-cyan-300 font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase">Content</label>
                <textarea
                  value={newNoteContent}
                  onChange={e => setNewNoteContent(e.target.value)}
                  rows={5}
                  className="w-full mt-1 px-3 py-2 bg-[#071522] border border-cyan-500/30 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-500 custom-scrollbar resize-none"
                  placeholder="Enter details..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-cyan-500/20">
              <button
                onClick={() => setIsEditingNote(false)}
                className="px-3 py-1.5 rounded text-xs font-mono text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-1.5 rounded bg-cyan-500 text-black font-semibold text-xs font-mono uppercase hover:bg-cyan-400"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
