/**
 * STONIC AI - Notification Service
 */

import { AppNotification, AppSection } from '../types';
import { initialNotifications } from '../data/mockData';
import { StorageService } from './storage';

class NotificationService {
  private notifications: AppNotification[];
  private listeners: ((notifications: AppNotification[]) => void)[] = [];

  constructor() {
    this.notifications = StorageService.getItem<AppNotification[]>('notifications', initialNotifications);
  }

  getNotifications(): AppNotification[] {
    return [...this.notifications];
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  addNotification(item: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification {
    const newNotif: AppNotification = {
      ...item,
      id: `notif-${Date.now()}`,
      read: false,
      timestamp: 'Just now'
    };
    this.notifications = [newNotif, ...this.notifications];
    this.save();
    return newNotif;
  }

  markAsRead(id: string): void {
    this.notifications = this.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.save();
  }

  markAllAsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.save();
  }

  clearAll(): void {
    this.notifications = [];
    this.save();
  }

  subscribe(listener: (notifications: AppNotification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private save(): void {
    StorageService.setItem('notifications', this.notifications);
    this.listeners.forEach(fn => fn([...this.notifications]));
  }
}

export const notificationService = new NotificationService();
