/**
 * STONIC AI - Settings Service
 */

import { SystemSettings } from '../types';
import { initialSettings } from '../data/mockData';
import { StorageService } from './storage';

class SettingsService {
  private settings: SystemSettings;
  private listeners: ((settings: SystemSettings) => void)[] = [];

  constructor() {
    this.settings = StorageService.getItem<SystemSettings>('settings', initialSettings);
  }

  getSettings(): SystemSettings {
    return { ...this.settings };
  }

  updateSettings(partial: Partial<SystemSettings>): SystemSettings {
    this.settings = { ...this.settings, ...partial };
    StorageService.setItem('settings', this.settings);
    this.notify();
    return this.settings;
  }

  resetToDefaults(): SystemSettings {
    this.settings = { ...initialSettings };
    StorageService.setItem('settings', this.settings);
    this.notify();
    return this.settings;
  }

  subscribe(listener: (settings: SystemSettings) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(fn => fn(this.settings));
  }
}

export const settingsService = new SettingsService();
