/**
 * STONIC AI - Realistic Mock Data Seed
 */

import {
  ChatMessage,
  MemoryItem,
  SkillItem,
  CharacterProfile,
  AgentItem,
  TaskItem,
  HotspotLocation,
  NewsItem,
  VisualProject,
  RemoteDevice,
  SystemSettings,
  MissionItem,
  WorkflowItem,
  KnowledgeDocument,
  KnowledgeNode,
  ResearchReport,
  CodeFile,
  SystemProcess,
  SystemMetrics,
  SecurityIncident,
  AppNotification,
  MediaAsset
} from '../types';

export const initialSettings: SystemSettings = {
  userName: 'Usman',
  assistantName: 'STONIC AI',
  soundEffects: true,
  voiceOutput: true,
  visualGlow: true,
  ambientParticles: true,
  hapticFeedback: true,
  autoSaveMemory: true,
  telemetryLogging: true,
  accentColor: 'cyan',
};

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: 'Good evening, Usman. STONIC AI Core is initialized at full nominal capability. All 7 cognitive sub-systems are synchronized and standing by for your directive.',
    timestamp: '19:15:02',
    type: 'greeting',
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'Check system health and prepare the automated workflow for tonight.',
    timestamp: '19:16:11',
    type: 'general',
  },
  {
    id: 'msg-3',
    sender: 'assistant',
    text: 'Diagnostics complete. Neural Core running at 14% capacity with zero latency jitter. Autonomous agents Sentinel-4 and Cyber-X have been dispatched to watch node telemetry and compile the nightly build manifest.',
    timestamp: '19:16:15',
    type: 'system',
  },
  {
    id: 'msg-4',
    sender: 'user',
    text: 'Can you show me the TypeScript type definition for our real-time telemetry stream?',
    timestamp: '19:18:40',
    type: 'code',
  },
  {
    id: 'msg-5',
    sender: 'assistant',
    text: 'Here is the typed interface for the real-time telemetry stream including timestamped quantum buffers and anomaly confidence scores:',
    timestamp: '19:18:43',
    type: 'code',
    codeSnippet: {
      language: 'typescript',
      code: `export interface TelemetryPacket {
  packetId: string;
  sourceNode: 'satellite-relay' | 'neural-mesh' | 'local-core';
  frequencyGhz: number;
  anomalyScore: number; // 0.0 to 1.0 (threshold: 0.85)
  buffer: Float32Array;
  metadata: {
    origin: string;
    synchronized: boolean;
    ttlMs: number;
  };
}`
    }
  }
];

export const initialMemories: MemoryItem[] = [
  {
    id: 'mem-1',
    category: 'personal',
    key: 'Preferred Call Sign',
    value: 'Usman (Lead Systems Architect)',
    importance: 'high',
    createdAt: '2026-10-15',
    lastAccessed: 'Just now'
  },
  {
    id: 'mem-2',
    category: 'preference',
    key: 'Command Center Theme',
    value: 'Deep Black with Electric Cyan HUD & Orbital Core Active',
    importance: 'high',
    createdAt: '2026-10-16',
    lastAccessed: 'Today'
  },
  {
    id: 'mem-3',
    category: 'project',
    key: 'Active Architecture Initiative',
    value: 'STONIC AI Autonomous Sub-agents & World Sensor Array v4.2',
    importance: 'high',
    createdAt: '2026-11-01',
    lastAccessed: 'Today'
  },
  {
    id: 'mem-4',
    category: 'system',
    key: 'Audio Synthesis Engine',
    value: 'JARVIS Analytical Tone, 1.0x Rate, 48kHz Procedural Synthesizer',
    importance: 'medium',
    createdAt: '2026-11-02',
    lastAccessed: 'Yesterday'
  },
  {
    id: 'mem-5',
    category: 'preference',
    key: 'Code Style Preference',
    value: 'Strict TypeScript, Functional React, Zero Unnecessary Dependencies',
    importance: 'medium',
    createdAt: '2026-11-04',
    lastAccessed: '3 days ago'
  },
  {
    id: 'mem-6',
    category: 'credential',
    key: 'Encrypted Workspace Enclave',
    value: 'Vault-08 (AES-GCM-256 local enclave isolated from WAN)',
    importance: 'high',
    createdAt: '2026-11-05',
    lastAccessed: 'Today'
  }
];

export const initialSkills: SkillItem[] = [
  {
    id: 'sk-1',
    name: 'Neural Code Synthesizer',
    category: 'automation',
    description: 'Generates, optimizes, and debugs full-stack TypeScript, Rust, and Python routines with static verification.',
    enabled: true,
    version: '3.4.1',
    parametersCount: 8,
    iconName: 'Code2'
  },
  {
    id: 'sk-2',
    name: 'Autonomous Web Investigator',
    category: 'research',
    description: 'Performs multi-hop web synthesis, source cross-referencing, and technical paper fact-checking.',
    enabled: true,
    version: '2.8.0',
    parametersCount: 5,
    iconName: 'Globe'
  },
  {
    id: 'sk-3',
    name: 'System Sentinel & Telemetry',
    category: 'system',
    description: 'Monitors memory allocation, CPU thread scheduling, local disk quotas, and node ping health.',
    enabled: true,
    version: '4.1.0',
    parametersCount: 12,
    iconName: 'Cpu'
  },
  {
    id: 'sk-4',
    name: 'File Stream Enclave',
    category: 'files',
    description: 'Processes documents, markdown blueprints, and JSON dataset exports with in-memory hashing.',
    enabled: true,
    version: '1.9.2',
    parametersCount: 4,
    iconName: 'FolderGit2'
  },
  {
    id: 'sk-5',
    name: 'Cognitive Voice Engine',
    category: 'productivity',
    description: 'Full-duplex procedural audio synthesis, phoneme modulation, and acoustic echo cancellation.',
    enabled: true,
    version: '2.2.0',
    parametersCount: 6,
    iconName: 'Mic'
  },
  {
    id: 'sk-6',
    name: 'Orbital Hotspot Mapper',
    category: 'research',
    description: 'Calculates satellite sub-solar points, ground station passes, and global relay latencies.',
    enabled: true,
    version: '1.5.0',
    parametersCount: 9,
    iconName: 'Radio'
  }
];

export const initialCharacters: CharacterProfile[] = [
  {
    id: 'char-jarvis',
    name: 'JARVIS Protocol',
    tagline: 'Sophisticated, composed, and analytically supreme',
    description: 'Inspired by iconic cinematic intelligence. Communicates with understated British elegance, measured dry wit, and absolute technical precision.',
    avatarSeed: 'jarvis',
    warmth: 65,
    formality: 85,
    proactivity: 90,
    creativity: 80,
    voicePitch: 0.95,
    voiceSpeed: 1.0,
    active: true
  },
  {
    id: 'char-mentor',
    name: 'The Sage Mentor',
    tagline: 'Deeply thoughtful, instructional, and patient',
    description: 'Focuses on deep conceptual clarity, first-principles reasoning, and methodical problem decomposition.',
    avatarSeed: 'mentor',
    warmth: 85,
    formality: 70,
    proactivity: 75,
    creativity: 85,
    voicePitch: 0.9,
    voiceSpeed: 0.92,
    active: false
  },
  {
    id: 'char-vanguard',
    name: 'Tactical Vanguard',
    tagline: 'High-speed, decisive, and execution-oriented',
    description: 'Concise, action-driven, zero fluff. Optimized for intense development sprints and emergency ops.',
    avatarSeed: 'vanguard',
    warmth: 40,
    formality: 90,
    proactivity: 98,
    creativity: 70,
    voicePitch: 1.05,
    voiceSpeed: 1.15,
    active: false
  },
  {
    id: 'char-companion',
    name: 'Collaborative Partner',
    tagline: 'Warm, intuitive, and highly communicative',
    description: 'Friendly and creative brainstorming partner who encourages iterative refinement and playful exploration.',
    avatarSeed: 'companion',
    warmth: 92,
    formality: 45,
    proactivity: 82,
    creativity: 95,
    voicePitch: 1.0,
    voiceSpeed: 1.02,
    active: false
  }
];

export const initialAgents: AgentItem[] = [
  {
    id: 'agent-sentinel',
    name: 'Sentinel-4',
    role: 'Infrastructure & Watchdog Sentinel',
    avatarIcon: 'ShieldAlert',
    status: 'executing',
    currentTask: 'Continuously verifying local IPC sockets and encrypted ring buffers',
    taskCount: 42,
    efficiency: 99.4,
    capabilities: ['Process Monitoring', 'Crash Recovery', 'Latency Profiling'],
    personality: 'Vigilant, defensive, deterministic',
    instructions: 'Monitor thread allocations and raise priority alerts on memory spikes.'
  },
  {
    id: 'agent-cyber',
    name: 'Cyber-X',
    role: 'Autonomous Code & Build Synthesizer',
    avatarIcon: 'Binary',
    status: 'executing',
    currentTask: 'Compiling module dependency graph and verifying type invariants',
    taskCount: 68,
    efficiency: 98.7,
    capabilities: ['TypeScript AST', 'Test Generation', 'Dead Code Elimination'],
    personality: 'Precise, modular, rigorous',
    instructions: 'Synthesize optimal TypeScript routines with zero allocations.'
  },
  {
    id: 'agent-aero',
    name: 'Aero-1',
    role: 'Global Information & Research Scout',
    avatarIcon: 'Compass',
    status: 'idle',
    taskCount: 29,
    efficiency: 97.2,
    capabilities: ['Deep Synthesis', 'Academic ArXiv Crawl', 'Cross-Validation'],
    personality: 'Curious, comprehensive, objective',
    instructions: 'Scout technical whitepapers and index latency benchmarks.'
  },
  {
    id: 'agent-prism',
    name: 'Prism-7',
    role: 'Holographic & Visual Architect',
    avatarIcon: 'Sparkles',
    status: 'standby',
    taskCount: 19,
    efficiency: 99.1,
    capabilities: ['HUD Layouts', 'Three.js Shaders', 'Vector Blueprints'],
    personality: 'Aesthetic, spatial, geometric',
    instructions: 'Construct isometric diagrams and holographic canvas visuals.'
  },
  {
    id: 'agent-scribe',
    name: 'Lexicon-9',
    role: 'Executive Writing & Synthesis Agent',
    avatarIcon: 'FileText',
    status: 'idle',
    taskCount: 34,
    efficiency: 98.2,
    capabilities: ['Technical Documentation', 'Executive Briefs', 'Spec Writing'],
    personality: 'Articulate, concise, persuasive',
    instructions: 'Draft concise architectural summaries and changelogs.'
  },
  {
    id: 'agent-analyst',
    name: 'Omni-Metrics',
    role: 'Quantitative Analysis & Telemetry Agent',
    avatarIcon: 'Activity',
    status: 'standby',
    taskCount: 51,
    efficiency: 99.0,
    capabilities: ['Statistical Profiling', 'Packet Variance', 'Anomaly Detection'],
    personality: 'Analytical, statistical, measured',
    instructions: 'Compute moving averages and detect latency regressions.'
  },
  {
    id: 'agent-prod',
    name: 'Velocity-Core',
    role: 'Workflow & Productivity Automator',
    avatarIcon: 'Zap',
    status: 'idle',
    taskCount: 62,
    efficiency: 97.8,
    capabilities: ['Task Routing', 'Queue Balancing', 'Context Switching'],
    personality: 'Speed-oriented, proactive, pragmatic',
    instructions: 'Optimize mission timelines and prevent task deadlocks.'
  },
  {
    id: 'agent-guardian',
    name: 'Aegis-Zero',
    role: 'Offensive Threat & Security Guardian',
    avatarIcon: 'Shield',
    status: 'executing',
    currentTask: 'Auditing SHA-256 local certificates and TLS socket invariants',
    taskCount: 77,
    efficiency: 99.9,
    capabilities: ['Zero-Trust Enclaves', 'Intrusion Detection', 'Cryptographic Signing'],
    personality: 'Unyielding, protective, zero-trust',
    instructions: 'Enforce local storage encryption and reject unauthorized RPC calls.'
  }
];

export const initialTasks: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Verify Neural Core Orbital Ring Clock Synchronization',
    description: 'Measure inter-ring phase drift across 60 FPS physics loop and calibrate damping factor to 0.88.',
    assignedAgentId: 'agent-sentinel',
    status: 'active',
    progress: 78,
    priority: 'urgent',
    createdAt: '19:00:10'
  },
  {
    id: 'task-2',
    title: 'Synthesize Multi-Channel Audio Waveform Buffer',
    description: 'Generate 64-band frequency spectrum array for real-time speech visualizer module.',
    assignedAgentId: 'agent-cyber',
    status: 'active',
    progress: 45,
    priority: 'high',
    createdAt: '19:12:30'
  },
  {
    id: 'task-3',
    title: 'Scan Global Planetary Hotspots for Relay Latency Jitter',
    description: 'Probe 8 worldwide edge datacenters (Tokyo, Frankfurt, London, Singapore, SF) for packet consistency.',
    assignedAgentId: 'agent-aero',
    status: 'completed',
    progress: 100,
    priority: 'medium',
    createdAt: '18:45:00',
    completedAt: '18:52:14'
  },
  {
    id: 'task-4',
    title: 'Generate Holographic Interface Geometry for Visual Hub',
    description: 'Construct 3D wireframe vertex buffers for next-gen command console preview.',
    assignedAgentId: 'agent-prism',
    status: 'pending',
    progress: 0,
    priority: 'medium',
    createdAt: '19:15:00'
  },
  {
    id: 'task-5',
    title: 'Archive Historical Chat Logs to Local Enclave Vault-08',
    description: 'Compress and cryptographically sign session conversations with SHA-256 authentication tag.',
    assignedAgentId: 'agent-sentinel',
    status: 'completed',
    progress: 100,
    priority: 'low',
    createdAt: '18:30:00',
    completedAt: '18:32:10'
  }
];

export const initialHotspots: HotspotLocation[] = [
  {
    id: 'hot-1',
    name: 'Tokyo Neural Hub',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
    type: 'server',
    status: 'online',
    latencyMs: 12,
    details: 'Primary Asia-Pacific edge gateway running high-throughput vector index.'
  },
  {
    id: 'hot-2',
    name: 'Frankfurt Core Relay',
    country: 'Germany',
    lat: 50.1109,
    lng: 8.6821,
    type: 'server',
    status: 'online',
    latencyMs: 18,
    details: 'European fiber exchange link maintaining 99.999% uptime consistency.'
  },
  {
    id: 'hot-3',
    name: 'San Francisco Grid',
    country: 'United States',
    lat: 37.7749,
    lng: -122.4194,
    type: 'server',
    status: 'online',
    latencyMs: 9,
    details: 'Silicon Valley research backbone with direct optic interconnect.'
  },
  {
    id: 'hot-4',
    name: 'London Gateway',
    country: 'United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    type: 'server',
    status: 'online',
    latencyMs: 15,
    details: 'North Atlantic transatlantic cable termination point.'
  },
  {
    id: 'hot-5',
    name: 'Singapore Deep Mesh',
    country: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    type: 'relay',
    status: 'online',
    latencyMs: 24,
    details: 'Equatorial sub-sea routing hub linking Southern Ocean arrays.'
  },
  {
    id: 'hot-6',
    name: 'Reykjavik Geothermal Node',
    country: 'Iceland',
    lat: 64.1466,
    lng: -21.9426,
    type: 'satellite',
    status: 'online',
    latencyMs: 31,
    details: 'Zero-carbon sub-arctic data repository and low-temp cluster.'
  },
  {
    id: 'hot-7',
    name: 'Sydney Orbital Receiver',
    country: 'Australia',
    lat: -33.8688,
    lng: 151.2093,
    type: 'satellite',
    status: 'online',
    latencyMs: 42,
    details: 'Southern Hemisphere Star-Link down-link array.'
  },
  {
    id: 'hot-8',
    name: 'São Paulo Exchange',
    country: 'Brazil',
    lat: -23.5505,
    lng: -46.6333,
    type: 'relay',
    status: 'degraded',
    latencyMs: 78,
    details: 'South America routing undergoing scheduled cable maintenance.'
  }
];

export const initialNews: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Orbital Quantum Communications Array Passes 100Gbps Free-Space Milestone',
    source: 'Global AeroNet',
    timeAgo: '14m ago',
    category: 'space',
    summary: 'Direct laser interconnect between low-earth orbit constellations achieves optical coherence over 4,500km distance without atmospheric degradation.',
    severity: 'priority'
  },
  {
    id: 'news-2',
    title: 'Autonomous Multi-Agent Swarms Coordinate Complex Distributed Compute Pipelines',
    source: 'Neural Systems Journal',
    timeAgo: '42m ago',
    category: 'ai',
    summary: 'Next-generation reasoning architectures demonstrate 340% increase in multi-step problem solving efficiency when assigned specialized watchdog roles.',
    severity: 'normal'
  },
  {
    id: 'news-3',
    title: 'Sub-Millisecond Edge Synthesizers Deployed Across Transatlantic Fiber Nodes',
    source: 'Cyber Infrastructure Weekly',
    timeAgo: '1h ago',
    category: 'tech',
    summary: 'New photonic switches reduce worldwide roundtrip synchronization packet jitter to under 800 nanoseconds.',
    severity: 'normal'
  },
  {
    id: 'news-4',
    title: 'Security Advisory: Automated Enclave Boundary Verifier Patched to v5.1',
    source: 'Security Sentinel',
    timeAgo: '3h ago',
    category: 'cyber',
    summary: 'Zero-trust verification protocols upgraded with lattice-based post-quantum signature schemes for all remote companion connections.',
    severity: 'priority'
  }
];

export const initialVisualProjects: VisualProject[] = [
  {
    id: 'vis-1',
    title: 'Holographic Orbital Reactor Blueprint',
    prompt: 'Concentric illuminated cybernetic rings with isometric dimensional lines, glowing cyan accents on deep obsidian glass background.',
    category: 'blueprint',
    aspectRatio: '16:9',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-11-08 17:30',
    dimensions: '3840 x 2160'
  },
  {
    id: 'vis-2',
    title: 'Autonomous Assistant Command HUD',
    prompt: 'Futuristic JARVIS style user interface with circular telemetry dials, high-precision typography and multi-spectral frequency meters.',
    category: 'interface',
    aspectRatio: '16:9',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-11-08 14:15',
    dimensions: '2560 x 1440'
  },
  {
    id: 'vis-3',
    title: 'Quantum Core Topological Lattice',
    prompt: 'Micro-scale crystalline quantum lattice glowing with neon electric blue luminescence, volumetric studio lighting and depth of field.',
    category: 'concept',
    aspectRatio: '4:3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-11-07 21:00',
    dimensions: '2048 x 1536'
  },
  {
    id: 'vis-4',
    title: 'Planetary Telemetry Projection',
    prompt: 'Spherical wireframe earth with illuminated satellite constellation vectors, geo-spatial nodes and atmospheric refraction shield.',
    category: 'hologram',
    aspectRatio: '1:1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-11-06 11:20',
    dimensions: '1920 x 1920'
  }
];

export const initialRemoteDevices: RemoteDevice[] = [
  {
    id: 'dev-1',
    name: "Usman's iPhone 16 Pro",
    type: 'mobile',
    ipAddress: '192.168.1.142',
    status: 'connected',
    lastSeen: 'Active now',
    batteryLevel: 88
  },
  {
    id: 'dev-2',
    name: 'Command Pad Pro 13"',
    type: 'tablet',
    ipAddress: '192.168.1.189',
    status: 'connected',
    lastSeen: 'Active now',
    batteryLevel: 94
  },
  {
    id: 'dev-3',
    name: 'Field Terminal X9',
    type: 'desktop',
    ipAddress: '10.0.4.12',
    status: 'disconnected',
    lastSeen: '3 hours ago',
    batteryLevel: 100
  }
];

export const initialMissions: MissionItem[] = [
  {
    id: 'ms-01',
    code: 'OP-CHRONOS',
    title: 'Orbital Ring Synchronization & Zero Phase Drift',
    description: 'Harmonize the 3 concentric quantum harmonic tracks at 4.82 GHz with sub-millisecond precision.',
    status: 'active',
    priority: 'urgent',
    assignedAgents: ['agent-sentinel', 'agent-cyber'],
    progress: 78,
    startDate: '2026-11-01',
    deadline: '2026-11-12',
    tags: ['Core', 'Orbital', 'Physics'],
    milestones: [
      { id: 'm1', title: 'Calibrate inter-ring angular velocity', completed: true },
      { id: 'm2', title: 'Verify damping threshold at 0.88', completed: true },
      { id: 'm3', title: 'Measure 60 FPS frame jitter', completed: false }
    ]
  },
  {
    id: 'ms-02',
    code: 'OP-SYNAPSE',
    title: 'Autonomous Swarm Collaboration Protocol v5',
    description: 'Implement distributed task handoff between Sentinel-4 and Cyber-X with encrypted IPC buffers.',
    status: 'active',
    priority: 'high',
    assignedAgents: ['agent-cyber', 'agent-prod'],
    progress: 45,
    startDate: '2026-11-04',
    deadline: '2026-11-18',
    tags: ['Agents', 'IPC', 'Automation'],
    milestones: [
      { id: 'm4', title: 'Define AST type invariants', completed: true },
      { id: 'm5', title: 'Implement lock-free circular ring buffer', completed: false },
      { id: 'm6', title: 'Run fault-injection test suite', completed: false }
    ]
  },
  {
    id: 'ms-03',
    code: 'OP-TERRA',
    title: 'Planetary Sensor Mesh Global Latency Calibration',
    description: 'Probe 8 worldwide satellite ground stations and rebalance routing tables for sub-20ms latency.',
    status: 'completed',
    priority: 'medium',
    assignedAgents: ['agent-aero', 'agent-analyst'],
    progress: 100,
    startDate: '2026-10-25',
    deadline: '2026-11-06',
    tags: ['World Monitor', 'Satellites', 'Network'],
    milestones: [
      { id: 'm7', title: 'Tokyo gateway optic handshake', completed: true },
      { id: 'm8', title: 'Frankfurt fiber jitter dampening', completed: true },
      { id: 'm9', title: 'São Paulo packet rerouting', completed: true }
    ]
  },
  {
    id: 'ms-04',
    code: 'OP-AEGIS',
    title: 'Zero-Trust Enclave Vault-08 Cryptographic Hardening',
    description: 'Migrate local memory registers to post-quantum lattice signature verification schemas.',
    status: 'pending',
    priority: 'high',
    assignedAgents: ['agent-guardian'],
    progress: 15,
    startDate: '2026-11-08',
    deadline: '2026-11-25',
    tags: ['Security', 'Cryptography', 'Enclave'],
    milestones: [
      { id: 'm10', title: 'Generate AES-GCM-256 seed tags', completed: true },
      { id: 'm11', title: 'Audit browser storage quotas', completed: false }
    ]
  }
];

export const initialWorkflows: WorkflowItem[] = [
  {
    id: 'wf-daily-report',
    title: 'Nightly System Diagnostic & Telemetry Sweep',
    description: 'Pings all 8 global nodes, checks neural load, and compiles memory summaries into Vault-08.',
    category: 'system',
    status: 'active',
    executionCount: 142,
    lastRun: '19:00:00 Today',
    nodes: [
      { id: 'n1', type: 'start', label: 'Start Trigger', sublabel: 'Schedule 00:00 UTC', x: 50, y: 120 },
      { id: 'n2', type: 'action', label: 'Ping Hotspots', sublabel: 'Probe 8 edge nodes', x: 250, y: 120 },
      { id: 'n3', type: 'condition', label: 'Latency Check', sublabel: 'All < 50ms?', x: 450, y: 120 },
      { id: 'n4', type: 'ai', label: 'Synthesize Report', sublabel: 'Cyber-X Engine', x: 650, y: 70 },
      { id: 'n5', type: 'notify', label: 'Desktop Alert', sublabel: 'Post to Notification Center', x: 850, y: 120 },
      { id: 'n6', type: 'end', label: 'End Operation', sublabel: 'Status Nominal', x: 1020, y: 120 }
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3' },
      { id: 'e3', source: 'n3', target: 'n4', label: 'Yes' },
      { id: 'e4', source: 'n4', target: 'n5' },
      { id: 'e5', source: 'n5', target: 'n6' }
    ]
  },
  {
    id: 'wf-code-audit',
    title: 'Autonomous Code Lint & Type Invariant Guard',
    description: 'Triggers on code generation to verify TypeScript strictness and memory allocations.',
    category: 'agent',
    status: 'active',
    executionCount: 88,
    lastRun: '19:15:20 Today',
    nodes: [
      { id: 'n10', type: 'trigger', label: 'File Change', sublabel: 'On code write', x: 50, y: 100 },
      { id: 'n11', type: 'action', label: 'AST Parse', sublabel: 'Scan syntax tree', x: 260, y: 100 },
      { id: 'n12', type: 'ai', label: 'Optimization Check', sublabel: 'Eliminate GC churn', x: 470, y: 100 },
      { id: 'n13', type: 'notify', label: 'HUD Status', sublabel: 'Update status bar', x: 680, y: 100 },
      { id: 'n14', type: 'end', label: 'Commit', sublabel: 'Ready for build', x: 880, y: 100 }
    ],
    edges: [
      { id: 'e10', source: 'n10', target: 'n11' },
      { id: 'e11', source: 'n11', target: 'n12' },
      { id: 'e12', source: 'n12', target: 'n13' },
      { id: 'e13', source: 'n13', target: 'n14' }
    ]
  }
];

export const initialKnowledgeDocs: KnowledgeDocument[] = [
  {
    id: 'kd-1',
    title: 'STONIC AI Core Architecture Specification v4.2',
    category: 'project',
    tags: ['Architecture', 'Core', 'Kinematics'],
    summary: 'Detailed mathematical blueprint for concentric orbital ring physics and 48kHz Web Audio synthesis.',
    content: `# STONIC AI Core Architecture Specification\n\n## 1. Orbital Ring Kinematics\nConcentric orbits are calculated via parameterized trigonometric offsets:\n- Primary Track: 150px outer boundary\n- Middle Track: 105px counter-rotating track\n- Inner Track: 78px coordinate indexing circle\n\n## 2. Memory Isolation\nVault-08 operates with zero-trust local isolation. No outbound telemetry is permitted.`,
    createdAt: '2026-10-18',
    updatedAt: '2026-11-06',
    pinned: true
  },
  {
    id: 'kd-2',
    title: 'Autonomous Swarm Coordination Model',
    category: 'research',
    tags: ['Swarm', 'Agents', 'Concurrency'],
    summary: 'Task distribution formulas and lock-free memory ring buffer protocols for concurrent agents.',
    content: `# Swarm Coordination Protocol\n\nAgents execute asynchronously and exchange task tokens through local event dispatchers. Sentinel-4 acts as the authoritative watchdog.`,
    createdAt: '2026-10-22',
    updatedAt: '2026-11-05'
  },
  {
    id: 'kd-3',
    title: 'Edge Sensor Latency Optimizations',
    category: 'notes',
    tags: ['Networking', 'Telemetry', 'Satellites'],
    summary: 'Guidelines for stabilizing transatlantic and transpacific optic connections under high jitter.',
    content: `# Edge Telemetry Guidelines\n\nRoundtrip ping thresholds:\n- Local IPC: < 1.0ms\n- Regional Edge: < 20ms\n- Transoceanic Satellite: < 80ms`,
    createdAt: '2026-10-29',
    updatedAt: '2026-11-07'
  }
];

export const initialKnowledgeGraph: { nodes: KnowledgeNode[] } = {
  nodes: [
    { id: 'gn-core', label: 'Orbital Core', type: 'topic', connections: ['gn-kinematics', 'gn-sentinel', 'gn-enclave'], radius: 24 },
    { id: 'gn-kinematics', label: 'Trig Kinematics', type: 'doc', connections: ['gn-core', 'gn-physics'], radius: 18 },
    { id: 'gn-physics', label: '60 FPS Physics', type: 'topic', connections: ['gn-kinematics'], radius: 14 },
    { id: 'gn-sentinel', label: 'Sentinel-4', type: 'agent', connections: ['gn-core', 'gn-cyber', 'gn-enclave'], radius: 20 },
    { id: 'gn-cyber', label: 'Cyber-X', type: 'agent', connections: ['gn-sentinel', 'gn-swarm'], radius: 20 },
    { id: 'gn-swarm', label: 'Agent Swarms', type: 'topic', connections: ['gn-cyber', 'gn-missions'], radius: 18 },
    { id: 'gn-missions', label: 'Mission Control', type: 'project', connections: ['gn-swarm'], radius: 18 },
    { id: 'gn-enclave', label: 'Vault-08 Enclave', type: 'memory', connections: ['gn-core', 'gn-sentinel', 'gn-creds'], radius: 22 },
    { id: 'gn-creds', label: 'Encrypted Creds', type: 'memory', connections: ['gn-enclave'], radius: 14 }
  ]
};

export const initialResearchReports: ResearchReport[] = [
  {
    id: 'rr-1',
    topic: 'Photonic Quantum Interconnects for Satellite Swarms',
    mode: 'technical',
    status: 'completed',
    createdAt: '2026-11-08 16:45',
    summary: 'Evaluated phase stability across free-space laser links between 550km LEO satellites and terrestrial optical down-links.',
    findings: [
      'Atmospheric wavefront distortion mitigated up to 94% using high-speed adaptive deformable mirrors.',
      'Data rate exceeds 100 Gbps free-space optical throughput with < 0.001% packet drop.',
      'Thermal gradient drift across satellite solar transitions requires dynamic piezoceramic compensation.'
    ],
    sources: [
      { title: 'Optical Space Communication Review 2026', url: 'https://arxiv.org/abs/2609.0418', relevance: 0.98 },
      { title: 'Photonic Phased Arrays in LEO Constellations', url: 'https://ieee-space.org/papers/8821', relevance: 0.92 }
    ]
  },
  {
    id: 'rr-2',
    topic: 'Lock-Free Memory Allocations in Real-Time WebGL HUDs',
    mode: 'comparative',
    status: 'completed',
    createdAt: '2026-11-07 11:20',
    summary: 'Comparison of pre-allocated static typed arrays vs dynamic garbage collection in 60 FPS Three.js rendering loops.',
    findings: [
      'Instantiating vector objects in per-frame tick causes 4.2ms GC pauses every 12 seconds.',
      'Pre-allocating module-scoped math helpers completely eliminates GC stalls.',
      'InstancedMesh reduces WebGL draw calls from 140 to 1 for particle systems.'
    ],
    sources: [
      { title: 'V8 Engine Memory Management Strategies', url: 'https://v8.dev/blog/gc-optimization', relevance: 0.95 }
    ]
  }
];

export const initialCodeFiles: CodeFile[] = [
  {
    id: 'cf-ts',
    name: 'orbitalKinematics.ts',
    language: 'typescript',
    content: `/**
 * STONIC AI - Real-time Orbital Kinematics Matrix
 */
export interface OrbitalVector {
  radius: number;
  theta: number;
  x: number;
  y: number;
  z: number;
  tangentSpeed: number;
}

export function computeOrbitalCoordinate(
  baseRadius: number,
  angularVelocity: number,
  timeMs: number
): OrbitalVector {
  const t = timeMs * 0.001;
  const theta = angularVelocity * t;
  return {
    radius: baseRadius,
    theta,
    x: baseRadius * Math.cos(theta),
    y: baseRadius * Math.sin(theta) * 0.35, // Tilt inclination
    z: baseRadius * Math.sin(theta),
    tangentSpeed: baseRadius * angularVelocity
  };
}`
  },
  {
    id: 'cf-react',
    name: 'ParticleCore.tsx',
    language: 'react',
    content: `import React, { useEffect, useRef } from 'react';

export const ParticleCore: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = requestAnimationFrame(function loop() {
      ctx.clearRect(0, 0, 300, 300);
      ctx.beginPath();
      ctx.arc(150, 150, 45, 0, Math.PI * 2);
      ctx.strokeStyle = '#00D9FF';
      ctx.stroke();
      animId = requestAnimationFrame(loop);
    });

    return () => cancelAnimationFrame(animId);
  }, [active]);

  return <canvas ref={canvasRef} width={300} height={300} />;
};`
  },
  {
    id: 'cf-python',
    name: 'telemetry_filter.py',
    language: 'python',
    content: `# STONIC AI Telemetry Jitter Filter
import math

class KalmanTelemetryFilter:
    def __init__(self, process_variance=1e-5, measurement_variance=1e-1):
        self.q = process_variance
        self.r = measurement_variance
        self.x = 0.0
        self.p = 1.0

    def update(self, measurement: float) -> float:
        # Prediction
        self.p = self.p + self.q
        # Kalman Gain
        k = self.p / (self.p + self.r)
        self.x = self.x + k * (measurement - self.x)
        self.p = (1 - k) * self.p
        return self.x`
  }
];

export const initialSystemMetrics: SystemMetrics = {
  cpuUsage: 18.4,
  ramUsageMb: 4128,
  ramTotalMb: 16384,
  gpuUsage: 24.2,
  storageUsedGb: 84.5,
  storageTotalGb: 512,
  networkUpKbps: 184,
  networkDownKbps: 942,
  temperatureC: 38.5,
  uptimeSeconds: 78420,
  processCount: 32
};

export const initialProcesses: SystemProcess[] = [
  { pid: 104, name: 'stonic-core.daemon', cpu: 6.4, memoryMb: 840, status: 'running', threads: 16 },
  { pid: 212, name: 'sentinel-watchdog', cpu: 2.1, memoryMb: 245, status: 'running', threads: 4 },
  { pid: 308, name: 'cyber-synthesizer', cpu: 4.8, memoryMb: 520, status: 'running', threads: 8 },
  { pid: 415, name: 'threejs-webgl-renderer', cpu: 3.9, memoryMb: 410, status: 'running', threads: 2 },
  { pid: 501, name: 'audio-procedural-synth', cpu: 0.8, memoryMb: 110, status: 'running', threads: 2 },
  { pid: 618, name: 'vault-08-enclave-guard', cpu: 0.4, memoryMb: 95, status: 'sleeping', threads: 1 }
];

export const initialSecurityIncidents: SecurityIncident[] = [
  {
    id: 'sec-1',
    title: 'Suspicious Port Scan Probe Detected',
    type: 'anomaly_probe',
    severity: 'medium',
    originIp: '198.51.100.44',
    status: 'mitigated',
    timestamp: '19:04:12',
    description: 'Rapid sequential SYN packet bursts detected across non-whitelisted ports 8080-8095.',
    mitigationSteps: ['Blacklisted origin CIDR', 'Enforced zero-trust local firewall drop rule']
  },
  {
    id: 'sec-2',
    title: 'Cryptographic Signature Verified on Enclave Vault-08',
    type: 'enclave_alert',
    severity: 'low',
    originIp: '127.0.0.1 (Local IPC)',
    status: 'mitigated',
    timestamp: '18:55:00',
    description: 'Periodic memory verification confirmed SHA-256 seal integrity across all 6 saved registers.',
    mitigationSteps: ['Logged hash match to audit buffer']
  },
  {
    id: 'sec-3',
    title: 'Simulated Authentication Spike Stress Test',
    type: 'auth_failure',
    severity: 'high',
    originIp: '192.168.1.189',
    status: 'active',
    timestamp: '19:12:40',
    description: '3 consecutive pairing token mismatches from companion device terminal.',
    mitigationSteps: ['Challenge token renewed', 'Imposed 30-second exponential handshake backoff']
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Neural Core Calibrated',
    description: 'Orbital tracks phase alignment steady at 0.002° drift factor.',
    type: 'system',
    read: false,
    timestamp: '10m ago',
    actionSection: 'core'
  },
  {
    id: 'notif-2',
    title: 'Mission OP-CHRONOS Milestone Done',
    description: 'Sentinel-4 completed ring angular velocity calibration.',
    type: 'task',
    read: false,
    timestamp: '25m ago',
    actionSection: 'mission-control'
  },
  {
    id: 'notif-3',
    title: 'Security Probe Blocked',
    description: 'Firewall dropped port scan probe from 198.51.100.44.',
    type: 'security',
    read: true,
    timestamp: '42m ago',
    actionSection: 'security-center'
  },
  {
    id: 'notif-4',
    title: 'Research Report Generated',
    description: 'Technical study on Photonic Quantum Interconnects compiled.',
    type: 'agent',
    read: true,
    timestamp: '1h ago',
    actionSection: 'research-lab'
  }
];

export const initialMediaAssets: MediaAsset[] = [
  {
    id: 'med-1',
    title: 'Orbital_Core_Hologram_v4.svg',
    type: 'image',
    format: 'SVG / Vector',
    sizeMb: 0.4,
    resolution: '3840 x 2160',
    createdAt: '2026-11-08',
    aspectRatio: '16:9'
  },
  {
    id: 'med-2',
    title: 'Procedural_Synthesizer_Hum_48k.wav',
    type: 'audio',
    format: 'PCM / 48kHz',
    sizeMb: 1.2,
    createdAt: '2026-11-07'
  },
  {
    id: 'med-3',
    title: 'Planetary_Satellite_Pass_Simulation.mp4',
    type: 'video',
    format: 'MP4 / H.265',
    sizeMb: 14.8,
    resolution: '1920 x 1080',
    createdAt: '2026-11-06',
    aspectRatio: '16:9'
  }
];

