import { DemoPreset } from './types';

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'devops-incident',
    name: '🚨 Prod Outage Incident',
    tag: 'DevOps & SRE',
    spokenShorthand: "uh yo Alex prod database high latency, um read replicas maxing out connection pool like 98%, need to scale to four nodes and flush redis cache before morning traffic, check datadog alert, priority critical.",
    audioDuration: 4.6,
    language: 'en',
    description: '4.6s voice burst -> Incident triage, Slack alert, P0 Jira ticket, and AWS CLI scale commands.'
  },
  {
    id: 'feature-launch',
    name: '⚡ Feature Spec: Magic Auth',
    tag: 'Product & Eng',
    spokenShorthand: "hey team so uh let's ship passwordless magic links with passkey fallback, JWT expiry fifteen minutes, add rate limiting on resend email button, block disposable domains, sync with Sarah for design.",
    audioDuration: 5.2,
    language: 'en',
    description: '5.2s voice burst -> Full architecture spec, sprint task breakdown, and team standup note.'
  },
  {
    id: 'client-escalation',
    name: '💼 Enterprise SLA Renegotiation',
    tag: 'Executive & Sales',
    spokenShorthand: "draft note to Marcus at Stripe, apologize for delay on SOC 2 Type II report, promise audit packet by Thursday 3 PM PST, offer fifty percent credit on October billing for the inconvenience, keep it professional.",
    audioDuration: 4.8,
    language: 'en',
    description: '4.8s voice burst -> C-level email, internal account note, and billing adjustment action items.'
  },
  {
    id: 'multilingual-dispatch',
    name: '🌐 Multilingual Global Sync',
    tag: 'Global Ops (Hinglish/Spanish)',
    spokenShorthand: "Sunil please check staging build immediately, frontend docker container crash ho gaya memory leak ki wajah se, restart the cluster and send logs to dev channel, jaldi karo.",
    audioDuration: 4.2,
    language: 'en-hi',
    description: 'Demonstrating AssemblyAI 18-language comprehension and code-switching clean synthesis.'
  }
];
