import { InterviewPlan } from '../types';

export async function analyzeJobDescription(
  jobDescription: string,
  cvData: string | { mimeType: string; data: string }
): Promise<InterviewPlan | null> {
  try {
    const response = await fetch('/api/gemini/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobDescription, cvData }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Analyze Job Description api failed:', errorText);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error analyzing job description:', error);
    return null;
  }
}

export async function speechToText(audioBlob: Blob): Promise<string | null> {
  try {
    const base64 = await blobToBase64(audioBlob);
    const response = await fetch('/api/gemini/speech-to-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioData: base64, mimeType: audioBlob.type || 'audio/webm' }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.transcript;
  } catch (error) {
    console.error('Error in speech to text:', error);
    return null;
  }
}

export async function evaluateAnswer(
  question: string,
  answer: string,
  audioData?: string,
  mimeType?: string
): Promise<{ text: string; audio: string; } | null> {
  try {
    const response = await fetch('/api/gemini/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, answer, audioData, mimeType }),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return null;
  }
}

/**
 * Helper to convert Blob to Base64
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
