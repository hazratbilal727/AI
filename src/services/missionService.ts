/**
 * STONIC AI - Mission Control Service
 */

import { MissionItem } from '../types';
import { initialMissions } from '../data/mockData';
import { StorageService } from './storage';

class MissionService {
  private missions: MissionItem[];
  private listeners: ((missions: MissionItem[]) => void)[] = [];

  constructor() {
    this.missions = StorageService.getItem<MissionItem[]>('missions', initialMissions);
  }

  getMissions(): MissionItem[] {
    return [...this.missions];
  }

  getMissionById(id: string): MissionItem | undefined {
    return this.missions.find(m => m.id === id);
  }

  addMission(item: Omit<MissionItem, 'id' | 'progress'>): MissionItem {
    const newMission: MissionItem = {
      ...item,
      id: `ms-${Date.now()}`,
      progress: item.status === 'completed' ? 100 : 10
    };
    this.missions = [newMission, ...this.missions];
    this.save();
    return newMission;
  }

  updateMission(id: string, updates: Partial<MissionItem>): MissionItem | null {
    const idx = this.missions.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.missions[idx] = { ...this.missions[idx], ...updates };
    this.save();
    return this.missions[idx];
  }

  toggleMilestone(missionId: string, milestoneId: string): void {
    const mission = this.missions.find(m => m.id === missionId);
    if (!mission) return;

    const updatedMilestones = mission.milestones.map(ms =>
      ms.id === milestoneId ? { ...ms, completed: !ms.completed } : ms
    );
    const completedCount = updatedMilestones.filter(ms => ms.completed).length;
    const progress = Math.round((completedCount / updatedMilestones.length) * 100);

    this.updateMission(missionId, {
      milestones: updatedMilestones,
      progress,
      status: progress === 100 ? 'completed' : mission.status
    });
  }

  deleteMission(id: string): boolean {
    const prev = this.missions.length;
    this.missions = this.missions.filter(m => m.id !== id);
    if (this.missions.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  subscribe(listener: (missions: MissionItem[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private save(): void {
    StorageService.setItem('missions', this.missions);
    this.listeners.forEach(fn => fn([...this.missions]));
  }
}

export const missionService = new MissionService();
