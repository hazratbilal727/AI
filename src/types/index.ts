/**
 * STONIC AI - Type Definitions & Domain Models
 */

export type AppSection =
  // CORE
  | 'dashboard'
  | 'command-center'
  | 'control-room'
  | 'assistant'
  | 'core'
  // INTELLIGENCE
  | 'world-monitor'
  | 'research-lab'
  | 'knowledge-vault'
  | 'visual-hub'
  // AUTOMATION
  | 'agents'
  | 'agent-lab'
  | 'automation-studio'
  | 'mission-control'
  | 'tasks'
  // WORKSPACE
  | 'workspace'
  | 'digital-workspace'
  | 'code-lab'
  | 'media-studio'
  // SYSTEM & EXPERIMENTAL
  | 'system-monitor'
  | 'security-center'
  | 'simulation-lab'
  | 'voice'
  | 'remote'
  | 'remote-uplink'
  | 'memory'
  | 'skills'
  | 'character'
  // CONFIGURATION & LAUNCHER
  | 'personalization'
  | 'settings'
  | 'launcher';

export type AssistantState =
  | 'READY'
  | 'LISTENING'
  | 'THINKING'
  | 'SPEAKING'
  | 'STANDBY'
  | 'PROCESSING'
  | 'EXECUTING'
  | 'RESPONDING'
  | 'ERROR';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  type?: 'general' | 'code' | 'system' | 'greeting' | 'task';
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export interface MemoryItem {
  id: string;
  category: 'preference' | 'system' | 'project' | 'personal' | 'credential';
  key: string;
  value: string;
  importance: 'low' | 'medium' | 'high';
  createdAt: string;
  lastAccessed: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'system' | 'productivity' | 'research' | 'files' | 'automation';
  description: string;
  enabled: boolean;
  version: string;
  parametersCount: number;
  iconName: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  tagline: string;
  description: string;
  avatarSeed: string;
  warmth: number; // 0 to 100
  formality: number; // 0 to 100
  proactivity: number; // 0 to 100
  creativity: number; // 0 to 100
  voicePitch: number;
  voiceSpeed: number;
  active: boolean;
}

export interface AgentItem {
  id: string;
  name: string;
  role: string;
  avatarIcon: string;
  status: 'idle' | 'executing' | 'standby' | 'paused';
  currentTask?: string;
  taskCount: number;
  efficiency: number; // %
  capabilities: string[];
  personality?: string;
  instructions?: string;
  isCustom?: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  assignedAgentId: string;
  status: 'pending' | 'active' | 'completed';
  progress: number; // 0 to 100
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  completedAt?: string;
}

// ----------------- EXTENDED DOMAIN MODELS -----------------

export interface MissionItem {
  id: string;
  code: string;
  title: string;
  description: string;
  status: 'active' | 'pending' | 'completed' | 'hold';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  assignedAgents: string[];
  progress: number;
  startDate: string;
  deadline: string;
  tags: string[];
  milestones: { id: string; title: string; completed: boolean }[];
}

export interface WorkflowNode {
  id: string;
  type: 'start' | 'trigger' | 'condition' | 'action' | 'ai' | 'delay' | 'notify' | 'end';
  label: string;
  sublabel: string;
  x: number;
  y: number;
  config?: Record<string, string | number | boolean>;
  status?: 'idle' | 'running' | 'success' | 'failed';
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface WorkflowItem {
  id: string;
  title: string;
  description: string;
  category: 'system' | 'research' | 'notification' | 'task' | 'agent';
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  lastRun?: string;
  status: 'active' | 'paused' | 'draft';
  executionCount: number;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'notes' | 'project' | 'research' | 'bookmark' | 'credential';
  tags: string[];
  content: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'topic' | 'memory' | 'agent' | 'doc' | 'project';
  connections: string[];
  radius?: number;
}

export interface ResearchReport {
  id: string;
  topic: string;
  mode: 'general' | 'technical' | 'market' | 'academic' | 'comparative' | 'competitive';
  status: 'draft' | 'synthesizing' | 'completed';
  findings: string[];
  summary: string;
  sources: { title: string; url: string; relevance: number }[];
  createdAt: string;
}

export interface CodeFile {
  id: string;
  name: string;
  language: 'typescript' | 'javascript' | 'python' | 'html' | 'css' | 'react';
  content: string;
  size?: string;
}

export interface SystemProcess {
  pid: number;
  name: string;
  cpu: number;
  memoryMb: number;
  memory?: number;
  status: 'running' | 'sleeping' | 'suspended';
  threads: number;
}

export interface SystemMetrics {
  cpuUsage: number;
  ramUsageMb: number;
  ramUsage?: number;
  ramTotalMb: number;
  gpuUsage: number;
  storageUsedGb: number;
  storageTotalGb: number;
  networkUpKbps: number;
  networkUp?: number;
  networkDownKbps: number;
  networkDown?: number;
  temperatureC: number;
  temperature?: number;
  uptimeSeconds: number;
  uptime?: string;
  processCount: number;
}

export interface SecurityIncident {
  id: string;
  title: string;
  type: 'auth_failure' | 'packet_burst' | 'anomaly_probe' | 'malware_signature' | 'enclave_alert';
  severity: 'critical' | 'high' | 'medium' | 'low';
  originIp: string;
  target?: string;
  status: 'active' | 'mitigated' | 'investigating';
  timestamp: string;
  description: string;
  mitigationSteps: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  type: 'system' | 'agent' | 'task' | 'security' | 'workflow';
  read: boolean;
  timestamp: string;
  actionSection?: AppSection;
}

export interface MediaAsset {
  id: string;
  title: string;
  type: 'image' | 'audio' | 'video';
  format?: string;
  sizeMb?: number;
  size?: string;
  resolution?: string;
  createdAt: string;
  aspectRatio?: string;
  url?: string;
}

export interface HotspotLocation {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  type: 'server' | 'satellite' | 'anomaly' | 'relay';
  status: 'online' | 'degraded' | 'syncing';
  latencyMs: number;
  details: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: 'tech' | 'cyber' | 'ai' | 'space';
  summary: string;
  severity: 'normal' | 'priority' | 'critical';
}

export interface VisualProject {
  id: string;
  title: string;
  prompt: string;
  category: 'hologram' | 'blueprint' | 'concept' | 'interface';
  aspectRatio: '16:9' | '4:3' | '1:1' | '9:16';
  thumbnailUrl: string;
  createdAt: string;
  dimensions: string;
}

export interface RemoteDevice {
  id: string;
  name: string;
  type: 'mobile' | 'tablet' | 'desktop';
  ipAddress: string;
  status: 'connected' | 'disconnected' | 'pairing';
  lastSeen: string;
  batteryLevel?: number;
}

export interface SystemSettings {
  userName: string;
  assistantName: string;
  soundEffects: boolean;
  voiceOutput: boolean;
  visualGlow: boolean;
  ambientParticles: boolean;
  hapticFeedback: boolean;
  autoSaveMemory: boolean;
  telemetryLogging: boolean;
  accentColor: 'cyan' | 'neon-blue' | 'emerald' | 'amber';
  themePreset?: 'cyber-cyan' | 'obsidian-gold' | 'matrix-green' | 'deep-electric';
  clockFormat?: '24h' | '12h' | 'utc';
  animationSpeed?: 'normal' | 'reduced' | 'fast';
  dashboardLayout?: 'authentic' | 'telemetry-grid';
  glowIntensity?: number;
  soundVolume?: number;
  persona?: 'technical' | 'conversational' | 'protocol';
}

export type UserSettings = SystemSettings;

