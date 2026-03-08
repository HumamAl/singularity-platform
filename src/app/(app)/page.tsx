"use client";

import { useState, useCallback } from "react";
import { Globe, Shield, Archive, Activity } from "lucide-react";

import { ScreenNavigator } from "@/components/interactions/screen-navigator";
import { SingularityHubScreen } from "@/components/dashboard/screen-singularity-hub";
import { VaultAccessScreen } from "@/components/dashboard/screen-vault-access";
import { VaultContentScreen } from "@/components/dashboard/screen-vault-content";
import { SessionMonitorScreen } from "@/components/dashboard/screen-session-monitor";

import {
  dashboardStats,
  vaultArtifacts,
  vaultAccessEvents,
  userSessions,
  singularityNodes,
} from "@/data/mock-data";
import type { DemoScreen } from "@/lib/types";
import type { NodeStatus } from "@/lib/types";

// ── Screen definitions ───────────────────────────────────────────────────────
const SCREENS: DemoScreen[] = [
  { id: "hub",     label: "Singularity Hub",  icon: Globe,    href: "/" },
  { id: "vault",   label: "Vault Access",     icon: Shield,   href: "/" },
  { id: "content", label: "Vault Content",    icon: Archive,  href: "/" },
  { id: "monitor", label: "Session Monitor",  icon: Activity, href: "/" },
];

// Convert DemoScreen[] to the format ScreenNavigator expects (icon as ReactNode)
const NAV_SCREENS = SCREENS.map((s) => ({
  id: s.id,
  label: s.label,
  icon: s.icon ? <s.icon className="w-4 h-4" /> : undefined,
}));

// Prepare node data for Session Monitor (subset: 8 rows)
const SESSION_MONITOR_NODES = singularityNodes.slice(0, 8).map((n) => ({
  id: n.id,
  cluster: n.clusterId,
  status: n.status as NodeStatus,
  coherence: n.coherenceScore,
  lastPulse: n.lastPulseAt,
}));

// ── Main page ────────────────────────────────────────────────────────────────
export default function SingularityHubPage() {
  const [activeScreen, setActiveScreen] = useState("hub");

  const handleEnterVault = useCallback(() => {
    setActiveScreen("vault");
  }, []);

  const handleVaultUnlock = useCallback(() => {
    setActiveScreen("content");
  }, []);

  const renderScreen = () => {
    switch (activeScreen) {
      case "hub":
        return (
          <SingularityHubScreen
            stats={dashboardStats}
            onEnterVault={handleEnterVault}
          />
        );
      case "vault":
        return (
          <VaultAccessScreen
            onUnlock={handleVaultUnlock}
          />
        );
      case "content":
        return (
          <VaultContentScreen
            artifacts={vaultArtifacts}
            events={vaultAccessEvents}
          />
        );
      case "monitor":
        return (
          <SessionMonitorScreen
            sessions={userSessions}
            nodes={SESSION_MONITOR_NODES}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ScreenNavigator
      screens={NAV_SCREENS}
      activeScreen={activeScreen}
      onScreenChange={setActiveScreen}
      variant="top-tabs"
      transition="fade"
    >
      {renderScreen()}
    </ScreenNavigator>
  );
}
