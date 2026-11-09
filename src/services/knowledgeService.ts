/**
 * STONIC AI - Knowledge Vault Service
 */

import { KnowledgeDocument, KnowledgeNode } from '../types';
import { initialKnowledgeDocs, initialKnowledgeGraph } from '../data/mockData';
import { StorageService } from './storage';

class KnowledgeService {
  private documents: KnowledgeDocument[];
  private graphNodes: KnowledgeNode[];
  private listeners: (() => void)[] = [];

  constructor() {
    this.documents = StorageService.getItem<KnowledgeDocument[]>('knowledge_docs', initialKnowledgeDocs);
    this.graphNodes = StorageService.getItem<KnowledgeNode[]>('knowledge_graph_nodes', initialKnowledgeGraph.nodes);
  }

  getDocuments(): KnowledgeDocument[] {
    return [...this.documents];
  }

  getGraphNodes(): KnowledgeNode[] {
    return [...this.graphNodes];
  }

  addDocument(doc: Omit<KnowledgeDocument, 'id' | 'createdAt' | 'updatedAt'>): KnowledgeDocument {
    const today = new Date().toISOString().split('T')[0];
    const newDoc: KnowledgeDocument = {
      ...doc,
      id: `kd-${Date.now()}`,
      createdAt: today,
      updatedAt: today
    };
    this.documents = [newDoc, ...this.documents];

    // Auto add node to knowledge graph
    const newNode: KnowledgeNode = {
      id: `gn-${newDoc.id}`,
      label: newDoc.title.slice(0, 16),
      type: 'doc',
      connections: ['gn-core'],
      radius: 16
    };
    this.graphNodes = [...this.graphNodes, newNode];

    this.save();
    return newDoc;
  }

  updateDocument(id: string, updates: Partial<KnowledgeDocument>): KnowledgeDocument | null {
    const idx = this.documents.findIndex(d => d.id === id);
    if (idx === -1) return null;
    this.documents[idx] = {
      ...this.documents[idx],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    this.save();
    return this.documents[idx];
  }

  deleteDocument(id: string): boolean {
    const prev = this.documents.length;
    this.documents = this.documents.filter(d => d.id !== id);
    this.graphNodes = this.graphNodes.filter(n => n.id !== `gn-${id}`);
    if (this.documents.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private save(): void {
    StorageService.setItem('knowledge_docs', this.documents);
    StorageService.setItem('knowledge_graph_nodes', this.graphNodes);
    this.listeners.forEach(fn => fn());
  }
}

export const knowledgeService = new KnowledgeService();
