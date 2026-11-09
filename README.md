# STONIC AI – Futuristic Desktop Assistant UI Simulator

A professional, high-performance, and futuristic **STONIC AI Desktop Assistant Simulator** inspired by the official STONIC AI application ([stonicai.com](https://stonicai.com/)).

Built with React 19, TypeScript, Tailwind CSS, Motion, Three.js, Lucide icons, and the Web Audio API.

---

## 🌌 Overview

STONIC AI reproduces a JARVIS-inspired cybernetic desktop command center designed for developers, systems architects, and power users. It functions completely client-side with persistent browser storage and an abstracted service architecture ready for backend/AI provider integration.

### Primary Color System
- **Primary Background**: Deep Black (`#05090D`)
- **Secondary Background**: Dark Navy (`#071522`)
- **Panel Surfaces**: Deep Midnight Slate (`#0B1927`)
- **Primary Cyber Accent**: Electric Cyan (`#00D9FF`)
- **Secondary Cyber Accent**: Neon Blue (`#168BFF`)
- **Primary Text**: Crisp Platinum (`#F2F7FA`)
- **Secondary Text**: Muted Steel Slate (`#8295A7`)

---

## 🚀 All 13 Major Workspaces

1. **Dashboard (Command Core)**:
   - Central animated STONIC AI Orbital Core with concentric rotating rings, particle streams, and status-reactive animations (READY, LISTENING, THINKING, SPEAKING).
   - Real-time subsystem telemetry, active audio waveform spectrum, and task dispatch summaries.
2. **AI Assistant (Chat Console)**:
   - Full-featured chat console with typing indicators, code snippet rendering, copy-to-clipboard, response regeneration, and speech playback.
3. **AI Core**:
   - Diagnostic workspace with interactive sliders for core frequency, harmonic damping, and sensory acoustic thresholds.
4. **Memory (Vault-08)**:
   - Long-term memory enclave with CRUD capabilities, search filtering, priority rankings, and local browser persistence.
5. **Skills**:
   - Capability management toggling neural code synthesizer, web investigator, system sentinel, and file stream enclaves.
6. **Character (Personality Synthesizer)**:
   - Personality selector featuring JARVIS Protocol, Sage Mentor, Tactical Vanguard, and Collaborative Partner with instant voice greeting previews.
7. **Agents**:
   - Fleet manager for autonomous agents (Sentinel-4, Cyber-X, Aero-1, Prism-7) with pause/execute controls and task counters.
8. **Tasks**:
   - Background execution manager with live incremental progress simulations, priority filters, and custom task creation modals.
9. **World Monitor**:
   - Interactive 3D Three.js WebGL globe with rotation controls, atmospheric glow, satellite orbit trajectories, 8 global latency test nodes, and a 2D Mercator cyber projection toggle.
10. **Visual Hub**:
    - Procedural SVG holographic blueprint studio with prompt synthesis, aspect ratio controls, and full-screen inspection.
11. **Voice Assistant**:
    - Full-screen voice cockpit featuring pulsing microphone trigger, 36-band animated audio waveform, and procedural Web Audio SFX.
12. **Stonic Remote**:
    - Companion device management with procedural pairing QR code and connection simulator.
13. **Settings**:
    - Configuration for identity tags, theme color accents, procedural SFX, speech synthesis, and local cache controls.

---

## 🛠️ Service Architecture (Ready for Backend Integration)

All data and business logic are separated from UI components into dedicated service layers:

- `src/services/assistantService.ts`: Chat flows, cognitive state machines, and response simulation.
- `src/services/memoryService.ts`: Persistent memory indexing and queries.
- `src/services/agentService.ts`: Agent state management.
- `src/services/taskService.ts`: Task scheduling and progress simulation.
- `src/services/worldMonitorService.ts`: Global telemetry and node latency testing.
- `src/services/voiceService.ts`: Procedural Web Audio SFX and SpeechSynthesis.
- `src/services/settingsService.ts`: Identity and interface configuration.
- `src/services/storage.ts`: Local storage wrapper with graceful fallback.

To connect a live backend or external LLM API, simply replace the mock generators in `assistantService.ts` and `taskService.ts` with API fetch requests.

---

## 📦 Getting Started

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
```
