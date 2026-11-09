/**
 * STONIC AI - Task Management Service
 */

import { TaskItem } from '../types';
import { initialTasks } from '../data/mockData';
import { StorageService } from './storage';

class TaskService {
  private tasks: TaskItem[];
  private listeners: ((tasks: TaskItem[]) => void)[] = [];
  private progressInterval: number | null = null;

  constructor() {
    this.tasks = StorageService.getItem<TaskItem[]>('tasks', initialTasks);
    this.startProgressSimulation();
  }

  getTasks(): TaskItem[] {
    return [...this.tasks];
  }

  addTask(data: Omit<TaskItem, 'id' | 'createdAt' | 'progress'>): TaskItem {
    const newTask: TaskItem = {
      ...data,
      id: `task-${Date.now()}`,
      progress: data.status === 'completed' ? 100 : 0,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    this.tasks = [newTask, ...this.tasks];
    this.save();
    return newTask;
  }

  updateTask(id: string, updates: Partial<TaskItem>): TaskItem | null {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.tasks[idx] = { ...this.tasks[idx], ...updates };
    this.save();
    return this.tasks[idx];
  }

  deleteTask(id: string): boolean {
    const prev = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);
    if (this.tasks.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  toggleTaskStatus(id: string): TaskItem | null {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return null;

    let nextStatus: TaskItem['status'] = 'pending';
    let nextProgress = task.progress;
    let completedAt = task.completedAt;

    if (task.status === 'pending') {
      nextStatus = 'active';
      nextProgress = Math.max(10, task.progress);
    } else if (task.status === 'active') {
      nextStatus = 'completed';
      nextProgress = 100;
      completedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } else {
      nextStatus = 'pending';
      nextProgress = 0;
      completedAt = undefined;
    }

    return this.updateTask(id, {
      status: nextStatus,
      progress: nextProgress,
      completedAt
    });
  }

  private startProgressSimulation(): void {
    if (typeof window === 'undefined') return;
    if (this.progressInterval) return;

    this.progressInterval = window.setInterval(() => {
      let changed = false;
      this.tasks = this.tasks.map(t => {
        if (t.status === 'active' && t.progress < 100) {
          const increment = Math.floor(Math.random() * 3) + 1;
          const nextProg = Math.min(100, t.progress + increment);
          changed = true;
          if (nextProg === 100) {
            return {
              ...t,
              progress: 100,
              status: 'completed',
              completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            };
          }
          return { ...t, progress: nextProg };
        }
        return t;
      });

      if (changed) {
        this.save();
      }
    }, 4000);
  }

  subscribe(listener: (tasks: TaskItem[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private save(): void {
    StorageService.setItem('tasks', this.tasks);
    this.listeners.forEach(fn => fn([...this.tasks]));
  }
}

export const taskService = new TaskService();
