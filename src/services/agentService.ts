/**
 * STONIC AI - Autonomous Agent Service
 */

import { AgentItem } from '../types';
import { initialAgents } from '../data/mockData';
import { StorageService } from './storage';

class AgentService {
  private agents: AgentItem[];
  private listeners: ((agents: AgentItem[]) => void)[] = [];

  constructor() {
    this.agents = StorageService.getItem<AgentItem[]>('agents', initialAgents);
  }

  getAgents(): AgentItem[] {
    return [...this.agents];
  }

  getAgentById(id: string): AgentItem | undefined {
    return this.agents.find(a => a.id === id);
  }

  updateAgentStatus(id: string, status: AgentItem['status'], currentTask?: string): AgentItem | null {
    const idx = this.agents.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.agents[idx] = {
      ...this.agents[idx],
      status,
      currentTask: currentTask !== undefined ? currentTask : this.agents[idx].currentTask
    };
    this.save();
    return this.agents[idx];
  }

  addAgent(agent: Omit<AgentItem, 'id' | 'taskCount' | 'efficiency'>): AgentItem {
    const newAgent: AgentItem = {
      ...agent,
      id: `agent-${Date.now()}`,
      taskCount: 0,
      efficiency: 99.0,
      isCustom: true
    };
    this.agents = [newAgent, ...this.agents];
    this.save();
    return newAgent;
  }

  updateAgent(id: string, updates: Partial<AgentItem>): AgentItem | null {
    const idx = this.agents.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.agents[idx] = { ...this.agents[idx], ...updates };
    this.save();
    return this.agents[idx];
  }

  duplicateAgent(id: string): AgentItem | null {
    const original = this.agents.find(a => a.id === id);
    if (!original) return null;
    const copy: AgentItem = {
      ...original,
      id: `agent-${Date.now()}`,
      name: `${original.name} (Clone)`,
      taskCount: 0,
      status: 'idle',
      isCustom: true
    };
    this.agents = [copy, ...this.agents];
    this.save();
    return copy;
  }

  deleteAgent(id: string): boolean {
    const prev = this.agents.length;
    this.agents = this.agents.filter(a => a.id !== id);
    if (this.agents.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  subscribe(listener: (agents: AgentItem[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private save(): void {
    StorageService.setItem('agents', this.agents);
    this.listeners.forEach(fn => fn([...this.agents]));
  }
}

export const agentService = new AgentService();
