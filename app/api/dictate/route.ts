import { NextRequest, NextResponse } from 'next/server';
import { transcribeWithAssemblyAI, stripFillerWords } from '@/lib/assemblyai';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    const userApiKey = req.headers.get('x-assemblyai-key') || undefined;

    let transcript = '';
    let duration = 4.0;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const audioFile = formData.get('audio') as File | null;
      const durationField = formData.get('duration');
      if (durationField) {
        duration = parseFloat(durationField.toString());
      }

      if (audioFile) {
        const buffer = await audioFile.arrayBuffer();
        const result = await transcribeWithAssemblyAI(buffer, userApiKey, duration);
        return NextResponse.json(result);
      }
    } else {
      const body = await req.json();
      transcript = body.text || '';
      duration = body.duration || 4.0;
    }

    // If text was passed directly (e.g. from Web Speech API or test preset)
    const { cleanText, removedCount } = stripFillerWords(transcript);

    return NextResponse.json({
      rawTranscript: transcript,
      cleanTranscript: cleanText,
      audioDurationSeconds: duration,
      fillerCount: removedCount,
      detectedLanguage: 'en'
    });
  } catch (error: any) {
    console.error('Dictation API route error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process dictation' },
      { status: 500 }
    );
  }
}
