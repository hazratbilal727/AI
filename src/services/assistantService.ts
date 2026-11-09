/**
 * STONIC AI - Assistant Service
 * Handles conversation flows, simulated cognitive responses, and assistant states.
 * Modular architecture ready for real LLM API connection.
 */

import { ChatMessage, AssistantState } from '../types';
import { initialChatMessages } from '../data/mockData';
import { StorageService } from './storage';
import { memoryService } from './memoryService';
import { voiceService } from './voiceService';

class AssistantService {
  private messages: ChatMessage[];
  private state: AssistantState = 'READY';
  private listeners: ((messages: ChatMessage[], state: AssistantState) => void)[] = [];

  constructor() {
    this.messages = StorageService.getItem<ChatMessage[]>('chat_messages', initialChatMessages);
  }

  getMessages(): ChatMessage[] {
    return [...this.messages];
  }

  getState(): AssistantState {
    return this.state;
  }

  setState(newState: AssistantState): void {
    this.state = newState;
    this.notify();
  }

  clearMessages(): void {
    this.messages = [
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'Session history cleared. STONIC AI Core is standing by for new instructions.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        type: 'system'
      }
    ];
    this.save();
  }

  async sendMessage(userText: string): Promise<ChatMessage> {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg-usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: timeString,
      type: 'general'
    };

    this.messages = [...this.messages, userMsg];
    this.setState('THINKING');
    this.save();

    voiceService.playSfx('pulse');

    // Simulate cognitive inference latency (700ms - 1400ms)
    await new Promise(resolve => setTimeout(resolve, 900));

    const response = this.generateSimulatedReply(userText);
    const assistantMsg: ChatMessage = {
      id: `msg-ast-${Date.now()}`,
      sender: 'assistant',
      text: response.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: response.type,
      codeSnippet: response.codeSnippet
    };

    this.messages = [...this.messages, assistantMsg];
    this.setState('SPEAKING');
    this.save();

    voiceService.playSfx('complete');

    // Auto return to READY after speaking
    setTimeout(() => {
      this.setState('READY');
    }, 2200);

    return assistantMsg;
  }

  async regenerateLast(): Promise<ChatMessage | null> {
    const lastUserIdx = [...this.messages].reverse().findIndex(m => m.sender === 'user');
    if (lastUserIdx === -1) return null;

    const actualIdx = this.messages.length - 1 - lastUserIdx;
    const userMsg = this.messages[actualIdx];

    // Remove following assistant message if present
    if (this.messages.length > actualIdx + 1 && this.messages[actualIdx + 1].sender === 'assistant') {
      this.messages.splice(actualIdx + 1, 1);
    }

    this.setState('THINKING');
    this.save();

    await new Promise(resolve => setTimeout(resolve, 800));

    const response = this.generateSimulatedReply(userMsg.text, true);
    const assistantMsg: ChatMessage = {
      id: `msg-ast-${Date.now()}`,
      sender: 'assistant',
      text: response.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: response.type,
      codeSnippet: response.codeSnippet
    };

    this.messages = [...this.messages, assistantMsg];
    this.setState('SPEAKING');
    this.save();

    setTimeout(() => {
      this.setState('READY');
    }, 2000);

    return assistantMsg;
  }

  private generateSimulatedReply(input: string, isRegeneration = false): {
    text: string;
    type: 'general' | 'code' | 'system' | 'greeting' | 'task';
    codeSnippet?: { language: string; code: string };
  } {
    const lower = input.toLowerCase().trim();
    const memories = memoryService.getMemories();
    const preferredName = memories.find(m => m.key.includes('Call Sign'))?.value || 'Usman';

    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('greetings')) {
      return {
        text: `Greetings, ${preferredName}. All core matrix pathways are fully calibrated. How may I direct the system resources for you this evening?`,
        type: 'greeting'
      };
    }

    if (lower.includes('code') || lower.includes('typescript') || lower.includes('function') || lower.includes('component') || lower.includes('react')) {
      return {
        text: `Synthesizing requested routine. Here is an optimized TypeScript implementation with memoized execution and zero allocation overhead:`,
        type: 'code',
        codeSnippet: {
          language: 'typescript',
          code: `/**
 * STONIC AI - Real-time Orbital Kinematics Calculator
 */
export function calculateOrbitalVectors(
  radius: number,
  angularVelocity: number,
  elapsedTime: number
): { x: number; y: number; z: number; tangentSpeed: number } {
  const theta = angularVelocity * elapsedTime;
  return {
    x: radius * Math.cos(theta),
    y: radius * Math.sin(theta) * 0.4, // Inclination factor
    z: radius * Math.sin(theta),
    tangentSpeed: radius * angularVelocity
  };
}`
        }
      };
    }

    if (lower.includes('status') || lower.includes('health') || lower.includes('diagnostics') || lower.includes('system')) {
      return {
        text: `System Telemetry Summary:\n• Neural Core: ONLINE (Load: 18.4%)\n• Memory Enclave: 6 active anchors retained\n• Active Autonomous Agents: 2 executing, 1 standby\n• Network Latency: Tokyo 12ms | Frankfurt 18ms | SF 9ms\n• Planetary Sensor Array: Synchronized`,
        type: 'system'
      };
    }

    if (lower.includes('memory') || lower.includes('remember')) {
      return {
        text: `Active memory registers confirmed. Currently indexing your preferences for: ${memories.slice(0, 3).map(m => m.key).join(', ')}. All state is safely synced to the browser enclave.`,
        type: 'general'
      };
    }

    if (lower.includes('task') || lower.includes('agent') || lower.includes('assign')) {
      return {
        text: `Task dispatch confirmed. Agent Sentinel-4 and Cyber-X have queued your operation into the concurrent execution pipeline with priority level HIGH.`,
        type: 'task'
      };
    }

    if (isRegeneration) {
      return {
        text: `Refined assessment: Based on your previous instruction, I have cross-checked the parameters against the core telemetry matrix. System conditions are optimal, and all safeguards remain engaged.`,
        type: 'general'
      };
    }

    return {
      text: `Understood, ${preferredName}. I have analyzed your query "${input}". All relevant sub-circuits have been notified and the operational parameters have been logged into the session buffer.`,
      type: 'general'
    };
  }

  subscribe(listener: (messages: ChatMessage[], state: AssistantState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private save(): void {
    StorageService.setItem('chat_messages', this.messages);
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach(fn => fn([...this.messages], this.state));
  }
}

export const assistantService = new AssistantService();
