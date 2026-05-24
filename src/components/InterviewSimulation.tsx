import { useState, useRef, useEffect } from 'react';
import { InterviewStage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface InterviewSimulationProps {
  stage: InterviewStage;
  onEndSimulation: () => void;
}

export default function InterviewSimulation({ stage, onEndSimulation }: InterviewSimulationProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // Custom text-based staging in addition to audio for premium choices
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Self-Evaluation Checkbox States (Essential for ADHD Focus & metacat)
  const [checkedS, setCheckedS] = useState(false);
  const [checkedT, setCheckedT] = useState(false);
  const [checkedA, setCheckedA] = useState(false);
  const [checkedR, setCheckedR] = useState(false);
  const [checkedPace, setCheckedPace] = useState(false);
  const [checkedFillers, setCheckedFillers] = useState(false);

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
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Could not start recording. Please ensure you have granted microphone permissions in your browser.");
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

  // Set initial microphone checks quietly
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .catch(err => {
        console.warn("Microphone access is available but user will be prompted on click:", err);
      });
  }, []);

  const handleDoneAnswering = () => {
    setIsSubmitted(true);
  };

  const resetCheckedStates = () => {
    setCheckedS(false);
    setCheckedT(false);
    setCheckedA(false);
    setCheckedR(false);
    setCheckedPace(false);
    setCheckedFillers(false);
    setAudioUrl(null);
    setWrittenAnswer('');
    setIsSubmitted(false);
    setIsRecording(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < stage.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetCheckedStates();
    } else {
      onEndSimulation();
    }
  };

  // Score Math
  const activeChecksCount = [checkedS, checkedT, checkedA, checkedR, checkedPace, checkedFillers].filter(Boolean).length;
  const scorePercent = Math.round((activeChecksCount / 6) * 100);

  // Positive reinforcement tags
  const getReinforcmentLabel = () => {
    if (scorePercent === 0) return 'Practice complete, evaluate below!';
    if (scorePercent <= 33) return 'Solid start, trace the details!';
    if (scorePercent <= 66) return 'Excellent layout, solid pacing!';
    if (scorePercent <= 99) return 'Fantastic! Extremely professional!';
    return '🌟 Flawless STAR Response Matrix!';
  };

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
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Offline Self-Evaluation Calibration
            </p>
          </div>
          <span className="text-sm bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold px-3 py-1 rounded-full uppercase">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
         </div>

        {/* Question heading */}
        <div className="space-y-2 mb-6">
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
            Core Inquiry
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">
            "{currentQuestion.question}"
          </h2>
          {currentQuestion.hint && !isSubmitted && (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-950 p-3 rounded-xl border border-dotted border-gray-200 dark:border-gray-800">
              💡 **Hint:** {currentQuestion.hint}
            </p>
          )}
        </div>
        
        {/* Step A: Live Interactive answering frame */}
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="answering_state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-950 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-center space-y-4">
                {/* Visual state headers */}
                {!isRecording && !audioUrl && (
                  <div className="space-y-1.5">
                    <p className="text-gray-700 dark:text-gray-200 font-bold text-sm">
                      Ready to practice your response out loud?
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      We recommend speaking out loud to simulate the real vocal adrenaline and practice steady breathing.
                    </p>
                  </div>
                )}

                {isRecording && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-red-500/30 rounded-full animate-ping absolute" />
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold relative z-10 text-lg">
                        🎤
                      </div>
                    </div>
                    <p className="text-red-500 font-extrabold text-sm tracking-wide">Recording active... Speak calmly!</p>
                  </div>
                )}

                {audioUrl && !isRecording && (
                  <div className="w-full space-y-3">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                      Listen back to monitor pacing and fillers:
                    </p>
                    <audio id="audio-playback" controls src={audioUrl} className="w-full" />
                  </div>
                )}

                {/* Optional typed notes space for neurodivergent candidates to scribble structure */}
                <div className="w-full space-y-1 pt-3 border-t border-gray-200/50 dark:border-gray-800/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      📝 Jot down structural notes (Optional)
                    </span>
                    {writtenAnswer && (
                      <button 
                        onClick={() => setWrittenAnswer('')}
                        className="text-[10px] text-gray-400 hover:text-red-500 underline"
                      >
                        Clear notes
                      </button>
                    )}
                  </div>
                  <textarea
                    placeholder="Scribble context words or STAR keywords here to anchor your train of thought while practicing out loud..."
                    value={writtenAnswer}
                    onChange={(e) => setWrittenAnswer(e.target.value)}
                    className="w-full h-20 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-850 rounded-xl text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center items-center">
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`px-6 py-3 rounded-xl font-bold text-sm cursor-pointer shadow-sm transition-all duration-150 flex items-center gap-2 ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {isRecording ? (
                    <><span>⏹</span> Stop Recording</>
                  ) : (
                    <>{audioUrl ? '🔄 Record Again' : '🎙️ Record Answer'}</>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDoneAnswering}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-3 px-8 rounded-xl text-sm transition shadow-sm flex items-center gap-1.5"
                >
                  <span>✨</span> I'm Done Answering
                </button>
              </div>
            </motion.div>
          ) : (
            /* Step B: Self-Evaluation Dashboard & Blueprint overlays */
            <motion.div
              key="evaluation_state"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Optional audio playback header */}
              {audioUrl && (
                <div className="p-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Playback your practice run:</span>
                  <audio src={audioUrl} controls className="w-full" />
                </div>
              )}

              {/* Interactive Checklist Box */}
              <div className="border border-indigo-100 dark:border-indigo-900 bg-indigo-50/20 dark:bg-indigo-950/10 p-6 rounded-2xl space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-indigo-100/50 dark:border-indigo-900/50">
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-indigo-900 dark:text-indigo-200 text-base">Self-Evaluation Calibration Matrix</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Reflect on your spoken response objectively and click to check items completed.</p>
                  </div>
                  {/* Confidence Gauge */}
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-indigo-700 dark:text-indigo-400">{scorePercent}% Confidence</div>
                    <div className="text-[10px] text-gray-400 font-semibold">{getReinforcmentLabel()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* S */}
                  <label className="flex items-start gap-3 p-3 bg-white dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-850 cursor-pointer select-none hover:shadow-sm transition">
                    <input
                      type="checkbox"
                      checked={checkedS}
                      onChange={(e) => setCheckedS(e.target.checked)}
                      className="mt-1 accent-teal-600 h-4 w-4 rounded"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-widest block">Situation (S)</span>
                      <span className="text-[11px] text-gray-500 block leading-relaxed">I set up the background context and initial technical problem clearly.</span>
                    </div>
                  </label>

                  {/* T */}
                  <label className="flex items-start gap-3 p-3 bg-white dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-850 cursor-pointer select-none hover:shadow-sm transition">
                    <input
                      type="checkbox"
                      checked={checkedT}
                      onChange={(e) => setCheckedT(e.target.checked)}
                      className="mt-1 accent-teal-600 h-4 w-4 rounded"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-widest block">Task (T)</span>
                      <span className="text-[11px] text-gray-500 block leading-relaxed">I clarified my exact personal responsibility/goal.</span>
                    </div>
                  </label>

                  {/* A */}
                  <label className="flex items-start gap-3 p-3 bg-white dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-850 cursor-pointer select-none hover:shadow-sm transition">
                    <input
                      type="checkbox"
                      checked={checkedA}
                      onChange={(e) => setCheckedA(e.target.checked)}
                      className="mt-1 accent-teal-600 h-4 w-4 rounded"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-widest block">Action (A)</span>
                      <span className="text-[11px] text-gray-500 block leading-relaxed">I highlighted my specific actions (not general team efforts).</span>
                    </div>
                  </label>

                  {/* R */}
                  <label className="flex items-start gap-3 p-3 bg-white dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-850 cursor-pointer select-none hover:shadow-sm transition">
                    <input
                      type="checkbox"
                      checked={checkedR}
                      onChange={(e) => setCheckedR(e.target.checked)}
                      className="mt-1 accent-teal-600 h-4 w-4 rounded"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-widest block">Result (R)</span>
                      <span className="text-[11px] text-gray-500 block leading-relaxed">I gave a concrete, positive outcome (with numeric data if possible).</span>
                    </div>
                  </label>

                  {/* Pace */}
                  <label className="flex items-start gap-3 p-3 bg-white dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-850 cursor-pointer select-none hover:shadow-sm transition">
                    <input
                      type="checkbox"
                      checked={checkedPace}
                      onChange={(e) => setCheckedPace(e.target.checked)}
                      className="mt-1 accent-teal-600 h-4 w-4 rounded"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-widest block">Calm Pacing</span>
                      <span className="text-[11px] text-gray-500 block leading-relaxed">I took slow, calm breaths and did not speak too rapidly.</span>
                    </div>
                  </label>

                  {/* Fillers */}
                  <label className="flex items-start gap-3 p-3 bg-white dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-850 cursor-pointer select-none hover:shadow-sm transition">
                    <input
                      type="checkbox"
                      checked={checkedFillers}
                      onChange={(e) => setCheckedFillers(e.target.checked)}
                      className="mt-1 accent-teal-600 h-4 w-4 rounded"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-widest block">Filter Controls</span>
                      <span className="text-[11px] text-gray-500 block leading-relaxed">I minimized fillers (um, uh, like) and leveraged clean pauses.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Expert Coach Model Answer Blueprint (Incredible educational overlay!) */}
              {currentQuestion.modelAnswer && (
                <div className="bg-emerald-50/10 dark:bg-emerald-950/5 border border-emerald-100/65 dark:border-emerald-900/40 p-6 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏆</span>
                    <h4 className="font-extrabold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest text-xs">
                      Coach's Exemplary Model Answer
                    </h4>
                  </div>
                  <blockquote className="text-sm text-gray-700 dark:text-gray-300 italic border-l-4 border-emerald-500 pl-4 py-1 leading-relaxed whitespace-pre-line">
                    "{currentQuestion.modelAnswer}"
                  </blockquote>
                  <p className="text-[11px] text-gray-400">
                    💡 **Pointers for study:** Notice how this model answer directly frames constraints, emphasizes action, and focuses on results in a structured sequence under 90 seconds.
                  </p>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button 
                  type="button"
                  onClick={resetCheckedStates}
                  className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-150 flex items-center justify-center gap-2 text-sm"
                >
                  <span>🔄</span> Retry This Question
                </button>
                <button 
                  type="button"
                  onClick={handleNextQuestion}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition duration-150 shadow flex items-center justify-center gap-2 text-sm"
                >
                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <>Next Question <span>→</span></>
                  ) : (
                    <>Finish Stage <span>🏁</span></>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* End simulation link */}
        <div className="text-center mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button 
            onClick={onEndSimulation} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-semibold transition duration-150 underline decoration-dashed"
          >
            Exit simulation & return to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
