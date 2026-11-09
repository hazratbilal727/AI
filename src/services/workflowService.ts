/**
 * STONIC AI - Automation Workflow Service
 */

import { WorkflowItem, WorkflowNode, WorkflowEdge } from '../types';
import { initialWorkflows } from '../data/mockData';
import { StorageService } from './storage';

class WorkflowService {
  private workflows: WorkflowItem[];
  private listeners: ((workflows: WorkflowItem[]) => void)[] = [];

  constructor() {
    this.workflows = StorageService.getItem<WorkflowItem[]>('workflows', initialWorkflows);
  }

  getWorkflows(): WorkflowItem[] {
    return [...this.workflows];
  }

  getWorkflowById(id: string): WorkflowItem | undefined {
    return this.workflows.find(w => w.id === id);
  }

  saveWorkflow(workflow: WorkflowItem): void {
    const idx = this.workflows.findIndex(w => w.id === workflow.id);
    if (idx === -1) {
      this.workflows = [workflow, ...this.workflows];
    } else {
      this.workflows[idx] = workflow;
    }
    this.save();
  }

  duplicateWorkflow(id: string): WorkflowItem | null {
    const original = this.workflows.find(w => w.id === id);
    if (!original) return null;

    const copy: WorkflowItem = {
      ...original,
      id: `wf-${Date.now()}`,
      title: `${original.title} (Clone)`,
      executionCount: 0,
      lastRun: undefined,
      status: 'draft'
    };
    this.workflows = [copy, ...this.workflows];
    this.save();
    return copy;
  }

  deleteWorkflow(id: string): boolean {
    const prev = this.workflows.length;
    this.workflows = this.workflows.filter(w => w.id !== id);
    if (this.workflows.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  // Simulate stepping through workflow execution
  async runSimulation(
    workflowId: string,
    onStepNode?: (nodeId: string, status: 'running' | 'success') => void
  ): Promise<void> {
    const wf = this.workflows.find(w => w.id === workflowId);
    if (!wf || wf.nodes.length === 0) return;

    for (const node of wf.nodes) {
      onStepNode?.(node.id, 'running');
      await new Promise(res => setTimeout(res, 450));
      onStepNode?.(node.id, 'success');
      await new Promise(res => setTimeout(res, 150));
    }

    const idx = this.workflows.findIndex(w => w.id === workflowId);
    if (idx !== -1) {
      this.workflows[idx] = {
        ...this.workflows[idx],
        executionCount: this.workflows[idx].executionCount + 1,
        lastRun: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' Today'
      };
      this.save();
    }
  }

  subscribe(listener: (workflows: WorkflowItem[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private save(): void {
    StorageService.setItem('workflows', this.workflows);
    this.listeners.forEach(fn => fn([...this.workflows]));
  }
}

export const workflowService = new WorkflowService();
