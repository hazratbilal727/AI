/**
 * STONIC AI - Memory Service
 */

import { MemoryItem } from '../types';
import { initialMemories } from '../data/mockData';
import { StorageService } from './storage';

class MemoryService {
  private memories: MemoryItem[];
  private listeners: ((memories: MemoryItem[]) => void)[] = [];

  constructor() {
    this.memories = StorageService.getItem<MemoryItem[]>('memories', initialMemories);
  }

  getMemories(): MemoryItem[] {
    return [...this.memories];
  }

  getMemoryById(id: string): MemoryItem | undefined {
    return this.memories.find(m => m.id === id);
  }

  addMemory(item: Omit<MemoryItem, 'id' | 'createdAt' | 'lastAccessed'>): MemoryItem {
    const newMemory: MemoryItem = {
      ...item,
      id: `mem-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastAccessed: 'Just now'
    };
    this.memories = [newMemory, ...this.memories];
    this.save();
    return newMemory;
  }

  updateMemory(id: string, updates: Partial<Omit<MemoryItem, 'id' | 'createdAt'>>): MemoryItem | null {
    const idx = this.memories.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.memories[idx] = {
      ...this.memories[idx],
      ...updates,
      lastAccessed: 'Just now'
    };
    this.save();
    return this.memories[idx];
  }

  deleteMemory(id: string): boolean {
    const initialLen = this.memories.length;
    this.memories = this.memories.filter(m => m.id !== id);
    if (this.memories.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  searchMemories(query: string, category?: string): MemoryItem[] {
    const cleanQuery = query.toLowerCase().trim();
    return this.memories.filter(m => {
      const matchesCategory = !category || category === 'all' || m.category === category;
      const matchesQuery = !cleanQuery || 
        m.key.toLowerCase().includes(cleanQuery) || 
        m.value.toLowerCase().includes(cleanQuery);
      return matchesCategory && matchesQuery;
    });
  }

  subscribe(listener: (memories: MemoryItem[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private save(): void {
    StorageService.setItem('memories', this.memories);
    this.listeners.forEach(fn => fn([...this.memories]));
  }
}

export const memoryService = new MemoryService();
