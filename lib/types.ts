export type TargetTab = 'slack' | 'email' | 'jira' | 'cli' | 'doc';

export type Tone = 'engineering' | 'executive' | 'casual' | 'customer';

export type Verbosity = 'compact' | 'standard' | 'detailed';

export interface SlackArtifact {
  channel: string;
  summary: string;
  formattedText: string;
  tags: string[];
  actionItems: string[];
}

export interface EmailArtifact {
  subject: string;
  recipientRole: string;
  greeting: string;
  body: string[];
  callToAction: string;
  signoff: string;
}

export interface JiraArtifact {
  title: string;
  type: 'Bug' | 'Feature' | 'Task' | 'Incident';
  priority: 'P0 - Blocker' | 'P1 - High' | 'P2 - Medium' | 'P3 - Low';
  component: string;
  description: string;
  acceptanceCriteria: string[];
  stepsToReproduceOrImplement: string[];
}

export interface CliArtifact {
  title: string;
  commands: string[];
  explanation: string;
  environment: 'bash' | 'zsh' | 'docker' | 'k8s';
  safeMode: boolean;
}

export interface DocArtifact {
  title: string;
  category: string;
  markdownContent: string;
}

export interface TargetArtifacts {
  slack: SlackArtifact;
  email: EmailArtifact;
  jira: JiraArtifact;
  cli: CliArtifact;
  doc: DocArtifact;
}

export interface TelemetryData {
  audioDurationSeconds: number;
  spokenWordCount: number;
  synthesizedWordCount: number;
  rawSpeakingWpm: number;
  effectiveWpm: number;
  speedMultiplier: number;
  secondsSavedVsTyping: number;
  fillerWordsRemoved: number;
}

export interface DictationResult {
  rawTranscript: string;
  cleanTranscript: string;
  audioDurationSeconds: number;
  fillerCount: number;
  detectedLanguage: string;
}

export interface DemoPreset {
  id: string;
  name: string;
  tag: string;
  spokenShorthand: string;
  audioDuration: number;
  language: string;
  description: string;
}
