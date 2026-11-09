/**
 * STONIC AI - World Monitor Service
 */

import { HotspotLocation, NewsItem } from '../types';
import { initialHotspots, initialNews } from '../data/mockData';
import { StorageService } from './storage';

class WorldMonitorService {
  private hotspots: HotspotLocation[];
  private news: NewsItem[];
  private listeners: (() => void)[] = [];

  constructor() {
    this.hotspots = StorageService.getItem<HotspotLocation[]>('hotspots', initialHotspots);
    this.news = StorageService.getItem<NewsItem[]>('news', initialNews);
  }

  getHotspots(): HotspotLocation[] {
    return [...this.hotspots];
  }

  getNews(): NewsItem[] {
    return [...this.news];
  }

  pingNode(id: string): number {
    const idx = this.hotspots.findIndex(h => h.id === id);
    if (idx === -1) return 0;
    const jitter = Math.floor(Math.random() * 8) - 4;
    const newLatency = Math.max(5, this.hotspots[idx].latencyMs + jitter);
    this.hotspots[idx] = {
      ...this.hotspots[idx],
      latencyMs: newLatency,
      status: newLatency > 70 ? 'degraded' : 'online'
    };
    StorageService.setItem('hotspots', this.hotspots);
    this.notify();
    return newLatency;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(fn => fn());
  }
}

export const worldMonitorService = new WorldMonitorService();
