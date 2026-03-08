import type { LucideIcon } from "lucide-react";

// ─── Sidebar navigation (template) ──────────────────────────────────────────
export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// ─── Screen definition for frame-based demo formats ─────────────────────────
export interface DemoScreen {
  id: string;
  label: string;
  icon?: LucideIcon;
  href: string;
}

// ─── Conversion element variant types ───────────────────────────────────────
export type ConversionVariant = "sidebar" | "inline" | "floating" | "banner";

// ─── Challenge visualization types ──────────────────────────────────────────
export type VisualizationType =
  | "flow"
  | "before-after"
  | "metrics"
  | "architecture"
  | "risk-matrix"
  | "timeline"
  | "dual-kpi"
  | "tech-stack"
  | "decision-flow";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  visualizationType: VisualizationType;
  outcome?: string;
}

// ─── Proposal types ──────────────────────────────────────────────────────────
export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  approach: { title: string; description: string }[];
  skillCategories: { name: string; skills: string[] }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  relevance?: string;
  outcome?: string;
  liveUrl?: string;
}

// ─── Singularity Platform — Domain Types ─────────────────────────────────────
// Authoritative source for all domain-specific interfaces.
// Downstream builders import directly from this file.

// ─── Enumerations & Union Types ──────────────────────────────────────────────

export type NodeStatus =
  | "Synchronized"
  | "Desynchronized"
  | "Transmitting"
  | "Quarantined"
  | "Collapsed";

export type CipherDepth =
  | "AES-128"
  | "AES-256"
  | "RSA-4096"
  | "Quantum-Kyber";

export type ArtifactStatus =
  | "Sealed"
  | "Unsealed"
  | "Archived"
  | "Purged";

export type AccessEventType =
  | "Read"
  | "Write"
  | "Unseal"
  | "Seal"
  | "Breach Attempt"
  | "Revoke";

export type AccessEventStatus =
  | "Success"
  | "Blocked"
  | "Expired Token";

export type ClusterStatus =
  | "Converging"
  | "Stable"
  | "Degraded"
  | "Fractured";

export type ConvergenceEventSeverity =
  | "info"
  | "warning"
  | "critical";

export type ConvergenceEventType =
  | "NodeSyncPulse"
  | "CoherenceDrop"
  | "BreachDetected"
  | "ClusterConverged"
  | "ArtifactSealed"
  | "ArtifactPurged"
  | "SessionAnomaly"
  | "ManifoldShift"
  | "ArchitectOverride";

export type UserRole =
  | "Architect"
  | "Sentinel"
  | "Vault Admin"
  | "Engineer"
  | "Analyst"
  | "Observer"
  | "Technician";

// ─── Core Domain Entities ────────────────────────────────────────────────────

/** A compute node registered within the Singularity mesh network */
export interface SingularityNode {
  id: string;                   // e.g. "AETHER-7"
  name: string;
  status: NodeStatus;
  clusterId: string;            // references NeuralCluster.id
  /** Coherence score 0-1; below 0.3 triggers Desynchronized alert */
  coherenceScore: number;
  lastPulseAt: string;          // ISO datetime
  deployedAt: string;           // ISO datetime
  architectId: string;          // references SystemUser.id
  /** Render latency in milliseconds; >25ms is degraded */
  renderLatencyMs: number;
  region: string;
  firmwareVersion: string;
}

/** An encrypted artifact stored in the Vault */
export interface VaultArtifact {
  id: string;                   // e.g. "ART-7741"
  /** Full filename including extension (.vault, .enc, .sealed) */
  name: string;
  cipherDepth: CipherDepth;
  status: ArtifactStatus;
  expiresAt: string | null;     // null = no expiry policy
  accessCount: number;
  lastAccessedAt: string | null;
  ownerId: string;              // references SystemUser.id
  policy: string;
  sizeKb: number;
  createdAt: string;
}

/** A single audited event against a Vault artifact */
export interface VaultAccessEvent {
  id: string;                   // e.g. "EVT-9043"
  artifactId: string;           // references VaultArtifact.id
  userId: string;               // references SystemUser.id
  eventType: AccessEventType;
  timestamp: string;
  ipAddress: string;
  status: AccessEventStatus;
  sessionId: string;            // references UserSession.id
  /** Present only when status is "Blocked" or "Expired Token" */
  blockReason?: string;
}

/** A named cluster of Singularity nodes sharing coherence state */
export interface NeuralCluster {
  id: string;                   // e.g. "CLUSTER-ALPHA"
  name: string;
  nodeCount: number;
  coherenceAvg: number;
  /** Convergence progress 0-1 toward full mesh synchronization */
  convergenceIndex: number;
  status: ClusterStatus;
  region: string;
  lastSyncAt: string;
}

/** A system-level event emitted by the Singularity mesh */
export interface ConvergenceEvent {
  id: string;                   // e.g. "CEV-0441"
  type: ConvergenceEventType;
  timestamp: string;
  description: string;
  severity: ConvergenceEventSeverity;
  relatedNodeId: string | null;
  relatedArtifactId: string | null;
  resolvedAt: string | null;
}

/** An authenticated operator within the Singularity platform */
export interface SystemUser {
  id: string;                   // e.g. "USR-1042"
  name: string;
  role: UserRole;
  org: string;
  avatarInitials: string;
  activeSessionId: string | null;
}

/** An active or completed user session within the Singularity manifold */
export interface UserSession {
  id: string;                   // e.g. "SES-8821"
  userId: string;               // references SystemUser.id
  startedAt: string;
  endedAt: string | null;       // null = still active
  durationMinutes: number | null;
  /** Resonance alignment score 0-100; depth of manifold engagement */
  resonanceScore: number;
  /** Rendered manifold particles during the session */
  manifoldParticleCount: number;
  /** Frame coherence rate 0-1; below 0.8 = degraded rendering */
  framesCoherence: number;
  nodeAccessCount: number;
  artifactsTouched: number;
}

// ─── Dashboard KPIs ──────────────────────────────────────────────────────────

export interface DashboardStats {
  activeNodes: number;
  activeNodesChange: number;
  networkCoherence: number;
  networkCoherenceChange: number;
  vaultArtifactsSealed: number;
  vaultArtifactsSealedChange: number;
  breachAttempts24h: number;
  breachAttempts24hChange: number;
  convergenceIndex: number;
  convergenceIndexChange: number;
  renderLatencyMs: number;
  renderLatencyChange: number;
  sessionDepthAvg: number;
  sessionDepthChange: number;
  resonanceScore: number;
  resonanceScoreChange: number;
}

// ─── Chart Data Shapes ───────────────────────────────────────────────────────

export interface ConvergenceDataPoint {
  month: string;
  convergenceIndex: number;
  targetIndex: number;
}

export interface VaultAccessDataPoint {
  month: string;
  reads: number;
  writes: number;
  breachAttempts: number;
}

export interface NodeStatusDataPoint {
  status: NodeStatus;
  count: number;
  fill: string;
}

export interface SessionResonanceDataPoint {
  week: string;
  avgResonance: number;
  sessionCount: number;
}
