import { NextRequest, NextResponse } from 'next/server';
import { synthesizeArtifacts } from '@/lib/synthesis';
import { calculateTelemetry, countTotalWordsInArtifacts } from '@/lib/telemetry';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      cleanTranscript,
      rawTranscript = '',
      audioDuration = 4.0,
      fillerCount = 0,
      tone = 'engineering',
      verbosity = 'standard',
      targetLanguage = 'en',
      refinementInstruction,
      previousArtifacts
    } = body;

    if (!cleanTranscript || typeof cleanTranscript !== 'string') {
      return NextResponse.json(
        { error: 'cleanTranscript is required' },
        { status: 400 }
      );
    }

    // 1. Synthesize 5 artifacts
    const artifacts = await synthesizeArtifacts({
      cleanTranscript,
      tone,
      verbosity,
      targetLanguage,
      refinementInstruction,
      previousArtifacts
    });

    // 2. Count total synthesized words across generated targets
    const synthesizedWordCount = countTotalWordsInArtifacts(artifacts);

    // 3. Calculate WPM telemetry
    const telemetry = calculateTelemetry(
      cleanTranscript,
      synthesizedWordCount,
      audioDuration,
      fillerCount
    );

    return NextResponse.json({
      artifacts,
      telemetry
    });
  } catch (error: any) {
    console.error('Synthesize API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to synthesize artifacts' },
      { status: 500 }
    );
  }
}
