import { useState, useEffect } from 'react';
import { InterviewPlan, InterviewStage } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import InterviewPrep from './components/InterviewPrep';
import GuidedTips from './components/GuidedTips';
import InterviewSimulation from './components/InterviewSimulation';
import { CATEGORIES_DB, CategoryData } from './data/categoriesDb';

type AppState = 'input' | 'loading' | 'results' | 'guided_tips' | 'simulating';

const LOADING_TIPS = [
  "Take a long, slow deep breath in... and let it out. You are doing great.",
  "Interview prep is a superpower. Breaking it into small steps reduces cognitive load.",
  "Your ADHD is an asset here: rapid connection forming, empathy, and high creativity are excellent in interview settings.",
  "Anxiety is just energy looking for a positive direction. Channel it into your practice! Ready when you are.",
  "Did you know? Taking a 5-second silence before answering behavioral questions is standard for outstanding candidates."
];

export default function App() {
  const [appState, setAppState] = useState<AppState>('input');
  const [customJobTitle, setCustomJobTitle] = useState('');
  const [customJobDesc, setCustomJobDesc] = useState('');
  const [customCompanyName, setCustomCompanyName] = useState('');
  const [interviewPlan, setInterviewPlan] = useState<InterviewPlan | null>(null);
  const [currentStage, setCurrentStage] = useState<InterviewStage | null>(null);
  const [loadingTipIndex, setLoadingTipIndex] = useState(0);

  // Rotate loading tips every 3 seconds to reduce hyper-focus on stress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (appState === 'loading') {
      interval = setInterval(() => {
        setLoadingTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [appState]);

  const handleSelectCategory = (category: CategoryData) => {
    setAppState('loading');
    setLoadingTipIndex(0);
    
    // Simulate short, calming focus buffer load (ADHD-friendly transition)
    setTimeout(() => {
      setInterviewPlan(category.plan);
      setAppState('results');
    }, 1500);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customJobTitle.trim()) {
      alert("Please specify a Job Title to start.");
      return;
    }

    setAppState('loading');
    setLoadingTipIndex(0);

    // Simulate short compile buffer
    setTimeout(() => {
      const targetTitle = customJobTitle;
      const targetCompany = customCompanyName || "Target Corporation";
      
      // Let's fabricate a brilliant, structurally perfect, fully offline local plan!
      const fallbackPlan: InterviewPlan = {
        jobTitle: targetTitle,
        companyName: targetCompany,
        elevatorPitch: `I am an ambitious ${targetTitle} professional who excels at finding creative solutions to complicated roadblocks. In my previous roles, I prioritized direct ownership, thorough communication pipelines, and fast adaptation. In the future, I look forward to bringing high focus and professional excellence to support ${targetCompany}'s team milestones.`,
        adhdFocusTips: [
          {
            title: "3-Step Deep Abdominal Release",
            expansion: "Deep breathing sends a direct neurological safety signal to your amygdala, preventing blank-outs and freeze spikes.",
            practiceExercise: "Take slow, deep breaths, expanding your stomach out. Focus on the physical touch sensations.",
            reward: "Nervous adrenaline lowered. Mind in calm, strategic focus state."
          },
          {
            title: "The 3Career-Highlights Anchoring",
            expansion: "Avoid feeling overwhelmed by writing down 3 core events from your career on paper right now to clear mental queue spaces.",
            practiceExercise: "Doodle or write 3 keywords of events you enjoyed solving previously.",
            reward: "Your mental RAM is clean and ready for fluid retrieval."
          }
        ],
        stages: [
          {
            stageId: 'custom_screen',
            stageName: 'Screening Dialogue',
            description: 'Fit conversation covering background milestones, communication styles, and general career direction.',
            recruiterExpectations: 'They seek standard project timelines, crisp behavioral delivery, and positive professional answers.',
            practicePointers: [
              'Deliver clean stories using the STAR method format.',
              'Pause 5 seconds before speaking to structure your sentences.'
            ],
            starExample: {
              situation: 'We faced a sudden workflow shift right during our primary sprint deadline.',
              task: 'I had to ensure our team transitioned cleanly with zero impact on deliverables.',
              action: 'I spent a rapid focus session planning the transition, drafted a bite-sized cheat sheet, and onboarded my peers.',
              result: 'This standardized the workspace instantly, completing our project on schedule with excellent output.'
            },
            questions: [
              {
                id: 'custom_q1',
                question: `Why are you a great fit for this ${targetTitle} opportunity at ${targetCompany}?`,
                hint: "Directly tie your past achievements and your analytical mindset to the core demands of the job responsibilities.",
                modelAnswer: `I have tracking proof of delivering high-quality outputs under tight deadlines. In my work history, I spent constant energy optimizing complex pipelines and standardizing guides for junior staff. Bringing these skills to support ${targetCompany}'s goals is the perfect next evolutionary milestone for my career.`
              },
              {
                id: 'custom_q2',
                question: "Tell me about a challenging professional dispute you had to resolve collaboratively.",
                hint: "Remain constructive and respectful. Detail how you listened to them first, found standard compromises, and focused strictly on deliverables.",
                modelAnswer: "I worked with a peer who preferred different tool setups. Instead of escalating, I held a quick focus sync to understand their priorities. We compromised by adopting standard common indexes, which saved us hours of friction and produced flawless results."
              }
            ]
          }
        ]
      };

      setInterviewPlan(fallbackPlan);
      setAppState('results');
    }, 1500);
  };

  const handleStartStage = (stage: InterviewStage) => {
    setCurrentStage(stage);
    if (interviewPlan?.adhdFocusTips && interviewPlan.adhdFocusTips.length > 0) {
      setAppState('guided_tips');
    } else {
      setAppState('simulating');
    }
  };

  const handleEndSimulation = () => {
    setAppState('results');
    setCurrentStage(null);
  };

  const handleReset = () => {
    setAppState('input');
    setCustomJobTitle('');
    setCustomJobDesc('');
    setCustomCompanyName('');
    setInterviewPlan(null);
    setCurrentStage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200 py-12 px-4 flex flex-col justify-start items-center">
      
      {/* Calm background bubbles */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-200/10 dark:bg-indigo-950/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-200/5 dark:bg-teal-950/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="w-full max-w-4xl" id="app-root-card">
        <AnimatePresence mode="wait">
          
          {/* STATE 1: Category Picker & Custom Field Inputs */}
          {appState === 'input' && (
            <motion.div
              key="input_form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <span className="text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  ADHD-friendly calibration
                </span>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  ⚡ Interview <span className="text-indigo-600 dark:text-indigo-400">Calibration</span>
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
                  A calming, structured practice space built for neurodiverse candidates. We break interview prep into bitesize interactive exercises to beat task freeze.
                </p>
              </div>

              {/* Master Categorized Directory */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📂</span>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Select a Predefined Target Practice Track
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {CATEGORIES_DB.map((category) => (
                    <motion.div
                      key={category.id}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleSelectCategory(category)}
                      className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/55 p-6 rounded-2xl shadow-sm hover:shadow cursor-pointer transition flex flex-col justify-between space-y-3 relative group overflow-hidden"
                    >
                      <div className="absolute bottom-0 right-0 text-7xl opacity-5 select-none font-extrabold pointer-events-none">
                        {category.icon}
                      </div>
                      <div className="space-y-1.5 flex-1 relative z-10">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{category.icon}</span>
                          <h3 className="font-extrabold text-base text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {category.name}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                          {category.shortDescription}
                        </p>
                      </div>
                      <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 pt-1">
                        Start track now <span>→</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Custom Target Track Section */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-800 p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                  <span className="text-lg">🛠️</span>
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">Or Build a Custom Practice Session</h3>
                    <p className="text-xs text-gray-400">Target a specific custom role by completing standard details.</p>
                  </div>
                </div>

                <form onSubmit={handleCustomSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest" htmlFor="custom-title">
                        Target Job Title *
                      </label>
                      <input
                        id="custom-title"
                        type="text"
                        required
                        placeholder="e.g. DevOps Engineer, Lead Designer"
                        value={customJobTitle}
                        onChange={(e) => setCustomJobTitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest" htmlFor="custom-company">
                        Target Company
                      </label>
                      <input
                        id="custom-company"
                        type="text"
                        placeholder="e.g. ScaleGrid, TechVibe"
                        value={customCompanyName}
                        onChange={(e) => setCustomCompanyName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest" htmlFor="custom-desc">
                      Pasted Role Description (Optional)
                    </label>
                    <textarea
                      id="custom-desc"
                      placeholder="Paste main keywords or JD responsibilities checklist here..."
                      value={customJobDesc}
                      onChange={(e) => setCustomJobDesc(e.target.value)}
                      className="w-full h-24 px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs text-gray-700 dark:text-gray-300"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-sm transition-all duration-150 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                  >
                    Build Custom Session ⚡
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* STATE 2: Loading Focus Tips */}
          {appState === 'loading' && (
            <motion.div
              key="loading_screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-8 py-16 text-center"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span className="absolute text-xl">🧘‍♀️</span>
              </div>
              
              <div className="max-w-md space-y-3">
                <h2 className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300">Calming Focus Tip</h2>
                <div className="px-6 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm italic text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-semibold min-h-[5rem] flex items-center justify-center">
                  "{LOADING_TIPS[loadingTipIndex]}"
                </div>
                <p className="text-xs text-gray-400">
                  Assembling offline track structures and cognitive calibration buffers...
                </p>
              </div>
            </motion.div>
          )}

          {/* STATE 3: Dashboard Plan */}
          {appState === 'results' && interviewPlan && (
            <motion.div
              key="results_screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <InterviewPrep
                plan={interviewPlan}
                onStartStage={handleStartStage}
                onReset={handleReset}
              />
            </motion.div>
          )}

          {/* STATE 4: Guided Tips Flow */}
          {appState === 'guided_tips' && currentStage && interviewPlan && (
            <motion.div
              key="guided_tips_screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GuidedTips
                tips={interviewPlan.adhdFocusTips}
                stage={currentStage}
                elevatorPitch={interviewPlan.elevatorPitch}
                onComplete={() => setAppState('simulating')}
              />
            </motion.div>
          )}

          {/* STATE 5: Simulation Playground */}
          {appState === 'simulating' && currentStage && (
            <motion.div
              key="simulating_screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <InterviewSimulation
                stage={currentStage}
                onEndSimulation={handleEndSimulation}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
