export const BRAND = {
  navy: '#070b14',
  card: '#0f1629',
  elevated: '#162036',
  signal: '#3b82f6',
  signalLight: '#60a5fa',
  signalGlow: 'rgba(59, 130, 246, 0.15)',
  vision: '#7D41B9',
  visionLight: '#9b5fd4',
  visionGlow: 'rgba(125, 65, 185, 0.15)',
  success: '#34d399',
  danger: '#f87171',
  text: '#f1f5f9',
  textSec: '#94a3b8',
  textMuted: '#64748b',
} as const;

export const EASE = {
  outExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOutQuart: [0.77, 0, 0.175, 1] as [number, number, number, number],
  outBack: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  smooth: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

export const DUR = {
  fast: 0.2,
  base: 0.4,
  slow: 0.7,
  reveal: 1.2,
};

export const SERVICES = [
  {
    id: 'seo',
    title: 'Search Engine Optimisation',
    tagline: 'Rank where your customers look.',
    body: 'Technical SEO audits, on-page optimisation, schema markup, and content strategy engineered to move the needle on the metrics that convert — not vanity traffic.',
  },
  {
    id: 'website',
    title: 'Website Design',
    tagline: 'Sites that feel alive.',
    body: 'Bespoke front-ends with craftsmanship you can feel. Motion, 3D, and polish on par with Apple, Linear, and Vercel — delivered in weeks, not quarters.',
  },
  {
    id: 'pipeline',
    title: 'Automated Pipeline',
    tagline: 'Data moving while you sleep.',
    body: 'Scheduled scrapes, multi-API enrichment, Postgres-backed vector search, and failure observability. 80-second daily runs with 6-minute incident response.',
  },
  {
    id: 'receptionist',
    title: 'AI Receptionist',
    tagline: 'The first impression, automated.',
    body: 'Voice and chat agents that qualify leads, book meetings, and hand off to humans only when it matters. Always on, never off-brand.',
  },
  {
    id: 'bespoke',
    title: 'Bespoke Software',
    tagline: 'Built for the way you actually work.',
    body: 'Internal tools, dashboards, and platforms engineered to your process — not to a template. Supabase + Vercel + Next.js, with the institutional patterns to ship it right.',
  },
  {
    id: 'agents',
    title: 'Custom AI Agents',
    tagline: 'Claude 4, your workflows, your data.',
    body: 'Task-specific agents with tool use, memory, and guardrails. Deployed to Slack, email, web, or your CLI. We build the orchestration so you just read the output.',
  },
] as const;

export const VALUES = [
  { word: 'Helpful', body: 'We do the hard thinking so you don\u2019t have to. The answer is always clearer than the problem.' },
  { word: 'Handy', body: 'Things actually ship. Nothing stays in planning for longer than it takes to build it.' },
  { word: 'Honest', body: 'Real numbers, real timelines, real trade-offs. No agency theatre \u2014 just the work.' },
] as const;

export const CASES = [
  {
    id: 'nugroup',
    client: 'Nu Group',
    sector: 'Waste Intelligence',
    tagline: 'Live KPIs for 20+ UK waste streams.',
    metric: '27-issue security audit',
    metricSub: 'hardened before production',
    color: BRAND.signal,
  },
  {
    id: 'hillway',
    client: 'Hillway',
    sector: 'Insolvency Lead Gen',
    tagline: '80-second daily enrichment pipeline.',
    metric: '6-minute incident response',
    metricSub: 'end-to-end observability',
    color: BRAND.vision,
  },
] as const;
