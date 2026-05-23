import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini client on server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  // API Endpoints
  app.post('/api/gemini/analyze', async (req, res) => {
    try {
      const { jobDescription, cvData } = req.body;
      if (!jobDescription) {
        res.status(400).json({ error: 'Job description is required.' });
        return;
      }

      console.log('Analyzing job description and CV with Gemini 3.5...' );

      // Construct prompt
      const systemInstruction = `You are an expert interview coach specializing in helping candidates with ADHD and anxiety.
      Analyze the provided Job Description and optional CV, then return a fully structured Interview Plan in JSON format matching the schema exactly.
      Provide:
      1. Real company name and job title (detect from JD, or fallback to sensible ones).
      2. 3 actionable ADHD-friendly Focus Tips to help them calm down and focus (mindfulness, interactive play, specific breathing exercises with concrete rewarding exercises).
      3. A complete 3-stage Interview Plan (Phone Screen, Hiring Manager / Technical, Final Round).
      4. For each stage, generate 2 realistic behavioral questions based on the candidate's CV and the job description, recruiter expectations ("what they actually want to hear"), 3 practice pointers for performance/anxiety, and a complete STAR example answer.
      5. A perfect 60-second Elevator Pitch using the Past-Present-Future structure, tailored to the CV and JD.`;

      const promptParts: any[] = [
        { text: `Job Description: ${jobDescription}` }
      ];

      if (cvData) {
        if (typeof cvData === 'object' && cvData.data && cvData.mimeType) {
          promptParts.push({
            inlineData: {
              data: cvData.data,
              mimeType: cvData.mimeType
            }
          });
        } else {
          promptParts.push({ text: `Candidate CV: ${cvData}` });
        }
      }

      promptParts.push({ text: "Please generate the InterviewPlan JSON." });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: promptParts,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              jobTitle: { type: Type.STRING },
              companyName: { type: Type.STRING },
              adhdFocusTips: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    expansion: { type: Type.STRING },
                    practiceExercise: { type: Type.STRING },
                    reward: { type: Type.STRING }
                  },
                  required: ["title", "expansion", "practiceExercise", "reward"]
                }
              },
              stages: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stageId: { type: Type.STRING },
                    stageName: { type: Type.STRING },
                    description: { type: Type.STRING },
                    questions: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          question: { type: Type.STRING },
                          category: { type: Type.STRING },
                          hint: { type: Type.STRING }
                        },
                        required: ["id", "question"]
                      }
                    },
                    recruiterExpectations: { type: Type.STRING },
                    practicePointers: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    starExample: {
                      type: Type.OBJECT,
                      properties: {
                        situation: { type: Type.STRING },
                        task: { type: Type.STRING },
                        action: { type: Type.STRING },
                        result: { type: Type.STRING }
                      },
                      required: ["situation", "task", "action", "result"]
                    }
                  },
                  required: ["stageId", "stageName", "description", "questions"]
                }
              },
              elevatorPitch: { type: Type.STRING }
            },
            required: ["jobTitle", "companyName", "adhdFocusTips", "stages", "elevatorPitch"]
          }
        }
      });

      const planJson = JSON.parse(response.text || '{}');
      res.json(planJson);
    } catch (error) {
      console.error('Error analyzing job description with Gemini:', error);
      res.status(500).json({ error: 'Failed to analyze job description.' });
    }
  });

  app.post('/api/gemini/speech-to-text', async (req, res) => {
    try {
      const { audioData, mimeType } = req.body;
      if (!audioData) {
        res.status(400).json({ error: 'Missing audio data.' });
        return;
      }

      console.log('Transcribing audio with Gemini...');
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          {
            inlineData: {
              data: audioData,
              mimeType: mimeType || 'audio/webm'
            }
          },
          {
            text: 'Please accurately transcribe this spoken interview answer into direct, clean transcript text. DO NOT add filler comments, notes, or intros. Only output the transcript.'
          }
        ]
      });

      res.json({ transcript: response.text || '' });
    } catch (error) {
      console.error('Error transcribing audio:', error);
      res.status(500).json({ error: 'Failed to transcribe audio' });
    }
  });

  app.post('/api/gemini/evaluate', async (req, res) => {
    try {
      const { question, answer, audioData, mimeType } = req.body;
      if (!question || !answer) {
        res.status(400).json({ error: 'Question and answer are required.' });
        return;
      }

      console.log('Evaluating answer with Gemini...');

      const evaluationPrompt = `
        As an expert interview coach specializing in helping individuals with ADHD and anxiety, please evaluate the following answer to an interview question.

        Question: "${question}"
        Transcript of Answer: "${answer}"

        ${audioData ? "I have also provided the audio recording of the answer. Please analyze the delivery, including tone, pace, and any excessive filler words (like 'um', 'uh', 'like'), while being mindful of ADHD-related communication patterns (e.g., fast talking or tangential thinking). Provide encouraging advice on how to improve both content and delivery." : ""}

        Provide feedback that is:
        1.  **Constructive and Gentle:** Start with encouragement. Frame suggestions positively.
        2.  **Actionable:** Offer specific, clear steps for improvement in both content and delivery.
        3.  **Structured:** Use bullet points or numbered lists for clarity.
        4.  **Mindful of Anxiety:** Avoid harsh or overly critical language. Focus on building confidence.

        Feedback should be concise, structured with Markdown, and highly engaging.
      `;

      const contents: any[] = [{ text: evaluationPrompt }];
      if (audioData) {
        contents.push({
          inlineData: {
            data: audioData,
            mimeType: mimeType || 'audio/webm'
          }
        });
      }

      // 1. Get Written Feedback (using gemini-3.5-flash)
      const textResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
      });
      const textFeedback = textResponse.text || "Good job practicing! Try to outline your situation, talk about the core actions, and list a positive outcome.";

      // 2. Generate Audio Feedback (TTS)
      let audioFeedback = '';
      try {
        const ttsResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-tts-preview',
          contents: [{ parts: [{ text: `Read this interview feedback warmly and encouragingly: ${textFeedback.replace(/[*#]/g, '')}` }] }],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
            },
          },
        });
        audioFeedback = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || '';
      } catch (ttsError) {
        console.error('Error generating audio feedback in backend:', ttsError);
      }

      res.json({ text: textFeedback, audio: audioFeedback });
    } catch (error) {
      console.error('Error evaluating answer:', error);
      res.status(500).json({ error: 'Failed to evaluate answer' });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production serve dist folder
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server launched securely on http://0.0.0.0:${PORT}`);
  });
}

startServer();
