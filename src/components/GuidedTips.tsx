import { useState } from 'react';
import { FocusTip, InterviewStage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface GuidedTipsProps {
  tips: FocusTip[];
  stage: InterviewStage;
  elevatorPitch?: string;
  onComplete: () => void;
}

type StepType = 'focus_tips' | 'pitch_practice' | 'recruiter' | 'pointers' | 'star';

export default function GuidedTips({ tips, stage, elevatorPitch, onComplete }: GuidedTipsProps) {
  const [currentStep, setCurrentStep] = useState<StepType>('focus_tips');
  
  // Focus Tips inner steps
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [tipSubStep, setTipSubStep] = useState<'expansion' | 'practice' | 'reward'>('expansion');
  
  // States for interactive exercises
  const [exerciseText, setExerciseText] = useState('');
  const [breathingCount, setBreathingCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);

  const currentTip = tips[currentTipIndex];

  // Breathing simulation loop
  const triggerBreathe = () => {
    setIsBreathing(true);
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setBreathingCount((prev) => (prev >= 4 ? 1 : prev + 1));
      if (count >= 12) {
        clearInterval(interval);
        setIsBreathing(false);
        setBreathingCount(0);
      }
    }, 1000);
  };

  const currentStageName = stage.stageName;

  const handleNextTipSubStep = () => {
    if (tipSubStep === 'expansion') {
      setTipSubStep('practice');
    } else if (tipSubStep === 'practice') {
      setTipSubStep('reward');
    } else {
      // Completed current focus tip
      if (currentTipIndex < tips.length - 1) {
        setCurrentTipIndex(currentTipIndex + 1);
        setTipSubStep('expansion');
        setExerciseText('');
      } else {
        // Move to elevator pitch
        if (elevatorPitch) {
          setCurrentStep('pitch_practice');
        } else {
          setCurrentStep('recruiter');
        }
      }
    }
  };

  const handleNextStep = () => {
    if (currentStep === 'pitch_practice') {
      setCurrentStep('recruiter');
    } else if (currentStep === 'recruiter') {
      setCurrentStep('pointers');
    } else if (currentStep === 'pointers') {
      if (stage.starExample) {
        setCurrentStep('star');
      } else {
        onComplete();
      }
    } else if (currentStep === 'star') {
      onComplete();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4" id="guided-tips-container">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-md relative overflow-hidden">
        
        {/* Progress header */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Warm-up Phase
          </span>
          <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            {currentStep === 'focus_tips' && `Focus Exercise: ${currentTipIndex + 1}/${tips.length}`}
            {currentStep === 'pitch_practice' && 'Elevator Pitch Practice'}
            {currentStep === 'recruiter' && "Recruiter's Perspective"}
            {currentStep === 'pointers' && 'Actionable Pointers'}
            {currentStep === 'star' && 'STAR Method Example'}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Focus ADHD Tips */}
          {currentStep === 'focus_tips' && currentTip && (
            <motion.div
              key={`tip-${currentTipIndex}-${tipSubStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
                  ADHD Focus & Anxiety Shield
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-snug">
                  {currentTip.title}
                </h2>
              </div>

              {tipSubStep === 'expansion' && (
                <div className="space-y-6">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                    {currentTip.expansion}
                  </p>
                  <div className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl p-4 border border-dashed border-indigo-100 dark:border-indigo-900">
                    <p className="text-xs text-indigo-800 dark:text-indigo-300 font-medium flex items-center gap-1.5">
                      💡 **Insight:** Taking just 30 seconds to center yourself lowers anxiety spike rates by over 50%.
                    </p>
                  </div>
                  <button
                    onClick={handleNextTipSubStep}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-2xl shadow-sm hover:shadow transition duration-150 flex items-center justify-center gap-2"
                  >
                    Let's Practice This! ⚡
                  </button>
                </div>
              )}

              {tipSubStep === 'practice' && (
                <div className="space-y-6">
                  <div className="bg-teal-50/40 dark:bg-teal-950/20 p-5 rounded-2xl border border-teal-100/60 dark:border-teal-900/40">
                    <span className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase block mb-1">
                      Exercise:
                    </span>
                    <p className="text-gray-700 dark:text-gray-200 font-medium text-base mb-4">
                      {currentTip.practiceExercise}
                    </p>

                    {/* Interactive breathing simulator */}
                    {currentTip.title.toLowerCase().includes('breathe') || currentTip.title.toLowerCase().includes('breathing') ? (
                      <div className="flex flex-col items-center justify-center p-4 space-y-4">
                        <motion.div
                          animate={isBreathing ? {
                            scale: [1, 1.4, 1.4, 1],
                          } : { scale: 1 }}
                          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                          className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${isBreathing ? 'bg-teal-500' : 'bg-indigo-500'}`}
                        >
                          {breathingCount === 0 ? 'Go' : breathingCount <= 2 ? 'In' : 'Out'}
                        </motion.div>
                        <button
                          onClick={triggerBreathe}
                          disabled={isBreathing}
                          className="px-4 py-1.5 bg-gray-200 dark:bg-gray-800 text-xs font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                        >
                          {isBreathing ? 'Breathing cycle...' : 'Start 12s Breath Cycle'}
                        </button>
                      </div>
                    ) : (
                      // Sandbox writing widget
                      <div className="space-y-2">
                        <textarea
                          placeholder="Type your focus anchor here, or write a calming statement..."
                          value={exerciseText}
                          onChange={(e) => setExerciseText(e.target.value)}
                          className="w-full h-24 p-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
                        />
                        <span className="text-xs text-gray-400 block text-right">
                          Focusing text counts: {exerciseText.length} characters
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleNextTipSubStep}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-5 rounded-2xl transition duration-150 shadow-sm flex items-center justify-center gap-2"
                  >
                    Done & Collect Reward 🎁
                  </button>
                </div>
              )}

              {tipSubStep === 'reward' && (
                <div className="text-center space-y-6 py-6">
                  <motion.div
                    initial={{ scale: 0.5, rotate: -15 }}
                    animate={{ scale: [1, 1.1, 1], rotate: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl"
                  >
                    🏆
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-teal-600 dark:text-teal-400">
                      Exercise Completed!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 italic px-4">
                      "{currentTip.reward}"
                    </p>
                  </div>
                  <button
                    onClick={handleNextTipSubStep}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-2xl transition duration-150"
                  >
                    {currentTipIndex < tips.length - 1 ? 'Go to Next Exercise →' : 'Move to Pitch Practice →'}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: Elevator Pitch Practice */}
          {currentStep === 'pitch_practice' && elevatorPitch && (
            <motion.div
              key="pitch_practice_step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                  Personal Elevator Pitch
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  Say it with confidence!
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Your pitch is structured in **Past-Present-Future**. Try reading this aloud with a steady, conversational pace:
              </p>
              <div className="p-5 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 rounded-2xl italic text-gray-700 dark:text-gray-200 text-base leading-relaxed">
                "{elevatorPitch}"
              </div>
              <button
                onClick={handleNextStep}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-2xl transition duration-150"
              >
                Done! Read Recruiter Guidelines →
              </button>
            </motion.div>
          )}

          {/* STEP 3: Recruiter Expectations */}
          {currentStep === 'recruiter' && (
            <motion.div
              key="recruiter_step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                  {currentStageName} Preparation
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  What the Recruiter Wants to Hear
                </h2>
              </div>
              <div className="p-5 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900 rounded-2xl text-gray-700 dark:text-gray-200 space-y-4">
                <div className="flex items-start gap-2.5">
                  <span className="text-xl">🎯</span>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {stage.recruiterExpectations || "They want to evaluate your core competency, culture fit, and hear concrete examples of projects that show accountability, task completion, and collaboration structure."}
                  </div>
                </div>
              </div>
              <button
                onClick={handleNextStep}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-2xl transition duration-150"
              >
                Let's See Practice Pointers →
              </button>
            </motion.div>
          )}

          {/* STEP 4: Practice Pointers */}
          {currentStep === 'pointers' && (
            <motion.div
              key="pointers_step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                  Communication & Behavioral Strategy
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  Actionable Practice Pointers
                </h2>
              </div>
              <div className="space-y-3">
                {stage.practicePointers?.map((pointer, i) => (
                  <div key={i} className="flex gap-3 items-start p-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl">
                    <span className="text-indigo-500 font-bold text-lg">{i + 1}.</span>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">
                      {pointer}
                    </p>
                  </div>
                )) || (
                  <p className="text-sm text-gray-500 italic">No stage pointers generated. Just speak honestly and structure your responses with STAR method!</p>
                )}
              </div>
              <button
                onClick={handleNextStep}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-2xl transition duration-150"
              >
                See Tailored STAR Example →
              </button>
            </motion.div>
          )}

          {/* STEP 5: STAR Method Example */}
          {currentStep === 'star' && stage.starExample && (
            <motion.div
              key="star_step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
                  Tailored Answer Blueprint
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  TA STAR Method Blueprint
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Here is a concrete example of answering behavioral questions using your actual CV assets:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider block">Situation (S)</span>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{stage.starExample.situation}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider block">Task (T)</span>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{stage.starExample.task}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl space-y-1 md:col-span-2">
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider block">Action (A)</span>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{stage.starExample.action}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl space-y-1 md:col-span-2">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">Result (R)</span>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{stage.starExample.result}</p>
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-3.5 px-5 rounded-2xl transition duration-150 shadow-sm shadow-teal-100 dark:shadow-none flex items-center justify-center gap-2 text-base"
              >
                Let's Start the Simulated Practice! 🚀
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
