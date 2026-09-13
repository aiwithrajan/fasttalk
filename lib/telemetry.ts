import { TelemetryData } from './types';

/**
 * Calculates high-precision typing & speech telemetry:
 * - Average keyboard typing speed: ~40 words per minute (WPM).
 * - Fast typist: ~70 WPM.
 * - Raw human speaking rate: ~140 WPM.
 * - FastTalk effective WPM: (synthesized output word count / audio duration in minutes).
 */
export function calculateTelemetry(
  spokenText: string,
  synthesizedTextCount: number,
  durationSeconds: number,
  fillerWordsRemovedCount: number = 0
): TelemetryData {
  const duration = Math.max(durationSeconds, 1.0); // minimum 1s to prevent div by zero
  const durationMinutes = duration / 60;

  const spokenWords = spokenText.trim().split(/\s+/).filter(Boolean).length;
  const rawSpeakingWpm = Math.round(spokenWords / durationMinutes);

  // Effective WPM is how much usable, structured, production-grade text was produced
  const effectiveWpm = Math.round(synthesizedTextCount / durationMinutes);

  // Speed multiplier compared to average typing speed (40 WPM)
  const AVERAGE_TYPING_WPM = 40;
  const speedMultiplier = Number((effectiveWpm / AVERAGE_TYPING_WPM).toFixed(1));

  // Seconds it would have taken to manually type the synthesized text at 40 WPM
  const manualTypingTimeSeconds = (synthesizedTextCount / AVERAGE_TYPING_WPM) * 60;
  const secondsSaved = Math.max(0, Math.round(manualTypingTimeSeconds - duration));

  return {
    audioDurationSeconds: Number(duration.toFixed(1)),
    spokenWordCount: spokenWords,
    synthesizedWordCount: synthesizedTextCount,
    rawSpeakingWpm,
    effectiveWpm,
    speedMultiplier: Math.max(speedMultiplier, 1.0),
    secondsSavedVsTyping: secondsSaved,
    fillerWordsRemoved: fillerWordsRemovedCount
  };
}

export function countTotalWordsInArtifacts(artifacts: {
  slack?: { formattedText?: string; actionItems?: string[] };
  email?: { body?: string[]; subject?: string };
  jira?: { description?: string; acceptanceCriteria?: string[] };
  cli?: { commands?: string[]; explanation?: string };
  doc?: { markdownContent?: string };
}): number {
  let text = '';
  if (artifacts.slack) {
    text += (artifacts.slack.formattedText || '') + ' ' + (artifacts.slack.actionItems?.join(' ') || '');
  }
  if (artifacts.email) {
    text += (artifacts.email.subject || '') + ' ' + (artifacts.email.body?.join(' ') || '');
  }
  if (artifacts.jira) {
    text += (artifacts.jira.description || '') + ' ' + (artifacts.jira.acceptanceCriteria?.join(' ') || '');
  }
  if (artifacts.cli) {
    text += (artifacts.cli.commands?.join(' ') || '') + ' ' + (artifacts.cli.explanation || '');
  }
  if (artifacts.doc) {
    text += artifacts.doc.markdownContent || '';
  }
  return text.trim().split(/\s+/).filter(Boolean).length;
}
