import { useState, useRef, useEffect } from 'react';
import { InterviewStage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { speechToText, blobToBase64 } from '../services/geminiService';

interface InterviewSimulationProps {
  stage: InterviewStage;
  onEndSimulation: () => void;
  evaluateAnswer: (
    question: string,
    answer: string,
    audioData?: string,
    mimeType?: string
  ) => Promise<{ text: string; audio: string; } | null>;
}

export default function InterviewSimulation({ stage, onEndSimulation, evaluateAnswer }: InterviewSimulationProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackAudio, setFeedbackAudio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const currentQuestion = stage.questions[currentQuestionIndex];
  const totalQuestions = stage.questions.length;

  const startRecording = async () => {
    if (mediaRecorderRef.current) {
      return;
    }
    setAudioUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Could not start recording. Please ensure you have given microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    // Request microphone permissions when the component mounts
    navigator.mediaDevices.getUserMedia({ audio: true })
      .catch(err => {
        console.error("Could not access microphone:", err);
      });
  }, []);

  const handleAnswerSubmit = async () => {
    if (!audioUrl) return;

    setIsLoading(true);
    setFeedback(null);
    setFeedbackAudio(null);

    const audioBlob = await fetch(audioUrl).then(r => r.blob());
    const [transcript, base64Audio] = await Promise.all([
      speechToText(audioBlob),
      blobToBase64(audioBlob)
    ]);

    if (transcript) {
      try {
        const result = await evaluateAnswer(currentQuestion.question, transcript, base64Audio, audioBlob.type);
        if (result) {
          setFeedback(result.text);
          if (result.audio) {
            setFeedbackAudio(`data:audio/mp3;base64,${result.audio}`);
          }
        } else {
          setFeedback("I'm sorry, I couldn't generate detailed feedback for this answer, but you did a great job practicing! Feel free to try again or move to the next question.");
        }
      } catch (err) {
        console.error("Evaluation error:", err);
        setFeedback("There was a small hiccup getting your feedback. Don't worry, the most important part is that you practiced! You can record again or continue to the next question.");
      }
    } else {
      alert("Could not transcribe audio. Please try again.");
    }

    setIsLoading(false);
  };

  const handleRecordAgain = () => {
    setFeedback(null);
    setAudioUrl(null);
    setFeedbackAudio(null);
    setIsRecording(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < stage.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      handleRecordAgain();
    } else {
      onEndSimulation();
    }
  };

  // Progress calculations
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto p-4" id="sim-container">
      {/* Progress Bar (Visual and Percentage Indicator) */}
      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 mb-6 overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
        />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
        
        {/* Stage details */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{stage.stageName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Interactive Interview Simulator
            </p>
          </div>
          <span className="text-sm bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold px-3 py-1 rounded-full uppercase">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
        </div>

        {/* Question heading */}
        <h2 className="text-2xl font-extrabold mb-6 text-gray-900 dark:text-white leading-tight">
          "{currentQuestion.question}"
        </h2>
        
        {/* Interactive recording staging frame */}
        <div className="flex flex-col items-center justify-center h-48 bg-gray-50 dark:bg-gray-950 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-8 text-center">
          {!isRecording && !audioUrl && (
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-300 font-semibold text-sm">
                Ready to speak your response?
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Click the record button, speak normally, and click stop when you are done.
              </p>
            </div>
          )}
          {isRecording && (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 bg-red-500 rounded-full animate-ping absolute" />
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold relative z-10 text-sm">
                  🎙️
                </div>
              </div>
              <p className="text-red-500 font-bold text-sm tracking-wide">Recording spoken audio...</p>
            </div>
          )}
          {audioUrl && !isLoading && (
            <div className="w-full space-y-4">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Review Your Recording
              </p>
              <audio controls src={audioUrl} className="w-full" />
            </div>
          )}
          {isLoading && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold">
                AI transcribing and evaluating your delivery...
              </p>
            </div>
          )}
        </div>

        {/* Control Button Options */}
        <div className="flex flex-col gap-4">
          {!feedback ? (
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-8 py-3.5 rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow flex items-center gap-2 text-sm ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
                disabled={isLoading}
              >
                {isRecording ? (
                  <><span>⏹</span> Stop Recording</>
                ) : (
                  <><span>🎤</span> {audioUrl ? 'Record Again' : 'Record Answer'}</>
                )}
              </button>
              
              {audioUrl && !isRecording && (
                <button 
                  onClick={handleAnswerSubmit}
                  disabled={isLoading}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-8 rounded-xl transition duration-150 shadow-sm flex items-center gap-2 text-sm"
                >
                  {isLoading ? 'Processing...' : <><span>✨</span> Submit for Feedback</>}
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button 
                onClick={handleRecordAgain}
                className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-bold py-4 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2"
              >
                <span>🔄</span> Practice Again
              </button>
              <button 
                onClick={handleNextQuestion}
                className="flex-1 bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-indigo-700 transition shadow flex items-center justify-center gap-2"
              >
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <>Next Question <span>→</span></>
                ) : (
                  <>Finish Stage <span>🏁</span></>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Feedback results panel */}
        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mt-8 bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100/60 dark:border-indigo-900/40 rounded-2xl p-6 space-y-6"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🎓</span>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Coach Feedback</h3>
              </div>

              {/* Text Speech feedback player */}
              {feedbackAudio && (
                <div className="bg-white dark:bg-gray-950 p-4 border border-indigo-50/50 dark:border-indigo-900/20 rounded-xl space-y-2 shadow-sm">
                  <span className="text-xs font-bold text-indigo-600 select-none uppercase tracking-widest flex items-center gap-1">
                    <span>🔊</span> Spoken Coach Response
                  </span>
                  <audio controls src={feedbackAudio} className="w-full" />
                </div>
              )}

              {/* Markdown analysis content */}
              <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                <ReactMarkdown>{feedback}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* End simulation link */}
        <div className="text-center mt-8">
          <button onClick={onEndSimulation} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-medium transition duration-150 decoration-wavy underline">
            Exit simulation & return to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
