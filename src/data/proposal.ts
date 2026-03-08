export const proposalData = {
  hero: {
    name: "Humam",
    badge: "Built this demo for your project",
    valueProp:
      "I build immersive 3D platforms end-to-end — the WebGL environment, the encrypted Vault architecture, the real-time Firebase sync, and the Cosmic-Noir UI system holding it all together.",
    stats: [
      { value: "24+", label: "Projects Shipped" },
      { value: "< 48hr", label: "Demo Turnaround" },
      { value: "15+", label: "Industries" },
    ],
  },

  portfolioProjects: [
    {
      id: "sports-vision",
      name: "Sports Vision MVP",
      description:
        "Real-time AR-style scan UI with object detection overlays, confidence scoring, and spatial accuracy visualization — delivered as a browser-based MVP.",
      outcome:
        "AR-style scan UI with detection overlays, confidence scores, and accuracy visualization — delivered as a browser-based MVP",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Recharts"],
      url: null,
      relevance:
        "Closest match to 3D/immersive UI — cinematic scan overlays, real-time confidence displays, and complex animated states.",
    },
    {
      id: "wmf-agent",
      name: "WMF Agent Dashboard",
      description:
        "AI-powered customer service agent for Windsor Metal Finishing. Automated email classification, RFQ data extraction, and a human-in-the-loop approval workflow.",
      outcome:
        "Replaced a 4-hour manual quote review process with a 20-minute structured extraction and approval flow",
      tech: [
        "Next.js",
        "TypeScript",
        "Claude API",
        "n8n",
        "Microsoft Graph",
        "Tailwind CSS",
      ],
      url: "https://wmf-agent-dashboard.vercel.app",
      relevance:
        "Real-time pipeline with structured state machines — similar complexity to the Vault access event system.",
    },
    {
      id: "data-intelligence",
      name: "Data Intelligence Platform",
      description:
        "Unified analytics dashboard pulling data from multiple sources with interactive charts, filterable views, and insight generation.",
      outcome:
        "Unified analytics dashboard pulling data from multiple sources with interactive charts and filterable insights",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Recharts"],
      url: "https://data-intelligence-platform-sandy.vercel.app",
      relevance:
        "Multi-source data architecture and interactive visualization — foundation for the Convergence analytics layer.",
    },
    {
      id: "outerbloom",
      name: "Outerbloom — AI Social Coordination",
      description:
        "AI-driven matching pipeline connecting users, schedules, and venues with intelligent coordination and real-time state updates.",
      outcome:
        "AI-driven matching pipeline connecting users, schedules, and venues — reducing manual coordination overhead",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "AI pipeline"],
      url: "https://outerbloom.vercel.app",
      relevance:
        "Real-time graph-like state — nodes, connections, and sync events mirror the Singularity mesh architecture.",
    },
  ],

  approach: [
    {
      step: "01",
      title: "Prototype the 3D Environment",
      description:
        "Three.js scene setup first — manifold particles, node meshes, camera controls. Working 3D canvas in the browser before a single data model is defined. You'll see it move, not just hear about it.",
      timeline: "Week 1",
    },
    {
      step: "02",
      title: "Build the Vault Architecture",
      description:
        "Encrypted artifact storage with AES-256/RSA-4096 access policies, audit event streaming, and role-based Architect/Sentinel/Vault Admin hierarchy. Firebase security rules enforced server-side.",
      timeline: "Week 2–3",
    },
    {
      step: "03",
      title: "Integrate Firebase Real-Time Layer",
      description:
        "Node sync pulses, coherence score updates, breach attempt alerts — all pushed live via Firestore listeners. No polling. The manifold feels alive because the data underneath actually is.",
      timeline: "Week 3–4",
    },
    {
      step: "04",
      title: "Polish the Cosmic-Noir Aesthetic",
      description:
        "Teal glow states, violet Vault accents, Space Grotesk headings, JetBrains Mono IDs. Every screen consistent — not a mix of design decisions but a coherent visual system you can hand off.",
      timeline: "Week 5",
    },
    {
      step: "05",
      title: "Performance & Production Deploy",
      description:
        "Three.js bundle optimization (dynamic imports, geometry instancing), Firebase rule auditing, Vercel edge config. Production-ready code with TypeScript strict mode throughout.",
      timeline: "Week 6",
    },
  ],

  skills: [
    {
      name: "3D & Interactive",
      items: ["Three.js", "WebGL", "Canvas API", "React Three Fiber", "GSAP"],
    },
    {
      name: "Frontend",
      items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    },
    {
      name: "Backend & Real-Time",
      items: [
        "Node.js",
        "Firebase",
        "Firestore",
        "Firebase Auth",
        "REST APIs",
      ],
    },
    {
      name: "Deployment & Tooling",
      items: ["Vercel", "GitHub Actions", "TypeScript Strict", "ESLint"],
    },
  ],

  cta: {
    headline: "Ready to bring the Singularity manifold to life.",
    body: "The 3D environment, the Vault, the real-time mesh sync — I've thought through all of it. Six months of focused work, 30+ hours a week. Let's talk specifics.",
    action: "Reply on Upwork to start",
    availability: "Currently available for new projects",
  },
};
