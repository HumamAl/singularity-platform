export const executiveSummary = {
  commonApproach:
    "Most developers drop Three.js into a Next.js project and discover SSR failures at runtime — or bolt on Firebase Auth without thinking about what happens when an unauthenticated user requests a vault record directly.",
  differentApproach:
    "I treat the client-side rendering boundary, security rules, and asset pipeline as first-class architecture decisions — not afterthoughts — so the platform ships stable, secure, and visually consistent from day one.",
  accentPhrase: "first-class architecture decisions",
};

export const challenges = [
  {
    id: "ssr-threejs",
    title: "Three.js + Next.js SSR Boundary",
    description:
      "Three.js accesses WebGL context and browser globals at import time. In a Next.js App Router project with server components, this causes hydration crashes the moment the module is loaded. The fix isn't just dynamic(); it's understanding the entire canvas lifecycle — initialization, resize observers, cleanup on unmount — so the 3D scene never bleeds into the server render path.",
    outcome:
      "Could eliminate WebGL SSR crashes — Three.js scenes load reliably with dynamic() imports and no hydration errors",
    vizType: "architecture" as const,
  },
  {
    id: "vault-security",
    title: "Vault Security with Firebase Auth",
    description:
      "Firebase Auth tokens are JWTs, but Firestore security rules don't automatically block a determined client from crafting a direct SDK call. The vault access pipeline needs layered enforcement: Auth token validation, Firestore server-side rules per artifact, and Shamir's Secret Sharing for the unseal ceremony. Each layer independently blocks the previous layer's failure mode.",
    outcome:
      "Could restrict vault access to verified users only — zero unauthorized content exposure with rule-based Firestore security",
    vizType: "flow" as const,
  },
  {
    id: "scene-performance",
    title: "3D Scene Performance at Scale",
    description:
      "A single unoptimized Three.js scene can stall the main thread for 800ms on mid-range hardware. The compounding culprits: monolithic GLTF files loaded synchronously, duplicate geometry instances, and uncompressed textures at full resolution. LOD switching, lazy scene splitting, Draco compression, and instanced rendering together cut that to under 2.5s — measurably, not just anecdotally.",
    outcome:
      "Could keep 3D load time under 2.5s on mid-range hardware through asset optimization and lazy scene loading",
    vizType: "metrics" as const,
  },
  {
    id: "visual-consistency",
    title: "Cosmic-Noir Consistency Across Devices",
    description:
      "The atmospheric dark aesthetic is the product's identity — and it's the first thing that breaks on mobile. Canvas sizing depends on devicePixelRatio and viewport dimensions at mount time; color rendering varies between sRGB and P3 color spaces; particle density that looks cinematic on desktop becomes a frame-rate killer on phones. Viewport-aware particle budgets and canvas scaling prevent the aesthetic from collapsing on smaller devices.",
    outcome:
      "Could maintain the atmospheric dark aesthetic across desktop and mobile — no washed-out colors or broken canvas sizing on smaller viewports",
    vizType: "before-after" as const,
  },
];
