/**
 * STONIC AI - Security Operations Service
 */

import { SecurityIncident } from '../types';
import { initialSecurityIncidents } from '../data/mockData';
import { StorageService } from './storage';

class SecurityService {
  private incidents: SecurityIncident[];
  private listeners: (() => void)[] = [];

  constructor() {
    this.incidents = StorageService.getItem<SecurityIncident[]>('security_incidents', initialSecurityIncidents);
  }

  getIncidents(): SecurityIncident[] {
    return [...this.incidents];
  }

  mitigateIncident(id: string): void {
    this.incidents = this.incidents.map(inc =>
      inc.id === id ? { ...inc, status: 'mitigated' } : inc
    );
    this.save();
  }

  triggerSimulatedDrill(type: SecurityIncident['type']): SecurityIncident {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    let title = 'Unusual Network Packet Burst Detected';
    let desc = 'Rapid spike of 45,000 packets/sec directed at telemetry gateway socket.';
    let sev: SecurityIncident['severity'] = 'medium';

    if (type === 'auth_failure') {
      title = 'Repeated Companion Handshake Failure';
      desc = 'Multiple consecutive invalid tokens detected from IP 10.0.4.88.';
      sev = 'high';
    } else if (type === 'malware_signature') {
      title = 'Heuristic Process Signature Warning';
      desc = 'Attempted memory injection into encrypted thread space blocked.';
      sev = 'critical';
    }

    const newInc: SecurityIncident = {
      id: `sec-${Date.now()}`,
      title,
      type,
      severity: sev,
      originIp: `198.51.100.${Math.floor(Math.random() * 200) + 10}`,
      status: 'active',
      timestamp: timeStr,
      description: desc,
      mitigationSteps: ['Active IP quarantine rule applied', 'Elevated enclave signature threshold']
    };

    this.incidents = [newInc, ...this.incidents];
    this.save();
    return newInc;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private save(): void {
    StorageService.setItem('security_incidents', this.incidents);
    this.listeners.forEach(fn => fn());
  }
}

export const securityService = new SecurityService();
