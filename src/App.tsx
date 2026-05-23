import { useState, useEffect } from 'react';
import { InterviewPlan, InterviewStage } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import InterviewPrep from './components/InterviewPrep';
import GuidedTips from './components/GuidedTips';
import InterviewSimulation from './components/InterviewSimulation';
import { analyzeJobDescription, evaluateAnswer, blobToBase64 } from './services/geminiService';

type AppState = 'input' | 'loading' | 'results' | 'guided_tips' | 'simulating' | 'error';

const LOADING_TIPS = [
  "Take a long, slow deep breath in... and let it out. You are doing great.",
  "Interview prep is a superpower. Breaking it into small steps reduces cognitive load.",
  "Your ADHD is an asset here: rapid connection forming, empathy, and high creativity are excellent in interview settings.",
  "Anxiety is just energy looking for a positive direction. Channel it into your practice! Ready when you are.",
  "Did you know? Taking a 5-second silence before answering behavioral questions is standard for outstanding candidates."
];

export default function App() {
  const [appState, setAppState] = useState<AppState>('input');
  const [jobDescription, setJobDescription] = useState('');
  const [cvText, setCvText] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [interviewPlan, setInterviewPlan] = useState<InterviewPlan | null>(null);
  const [currentStage, setCurrentStage] = useState<InterviewStage | null>(null);
  const [loadingTipIndex, setLoadingTipIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Rotate loading tips every 4 seconds to reduce hyper-focus on stress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (appState === 'loading') {
      interval = setInterval(() => {
        setLoadingTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [appState]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      alert("Please provide a Job Description to start.");
      return;
    }

    setAppState('loading');
    setError(null);
    setLoadingTipIndex(0);

    try {
      let cvData: any = cvText;
      if (cvFile) {
        console.log('Reading file...');
        const base64 = await blobToBase64(cvFile);
        cvData = { mimeType: cvFile.type, data: base64 };
      }

      const plan = await analyzeJobDescription(jobDescription, cvData);
      if (plan && plan.stages && plan.stages.length > 0) {
        setInterviewPlan(plan);
        setAppState('results');
      } else {
        setError('The model could not parse a valid structured interview plan. Please refine your inputs and try again.');
        setAppState('error');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred while compiling your prep plan. Please verify process logs and retry.');
      setAppState('error');
    }
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
    setJobDescription('');
    setCvText('');
    setCvFile(null);
    setInterviewPlan(null);
    setCurrentStage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-200 py-12 px-4 flex flex-col justify-start items-center">
      
      {/* Decorative calm background bubbles */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-200/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Main Card Wrapper */}
      <div className="w-full max-w-4xl" id="app-root-card">
        <AnimatePresence mode="wait">
          
          {/* STATE 1: Form Input */}
          {appState === 'input' && (
            <motion.div
              key="input_form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  ADHD-friendly coaching
                </span>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                  ⚡ Interview <span className="text-indigo-600">Calibration</span>
                </h1>
                <p className="text-base text-gray-500 max-w-xl mx-auto">
                  A calming, structured practice playground built for neurodiverse candidates. We break interview prep into bitesize exercises to beat freeze responses.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
                
                {/* Job Description Row */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 hover:text-indigo-600 transition" htmlFor="job-description">
                    🎯 Paste Job Description *
                  </label>
                  <p className="text-xs text-gray-400">
                    Paste the target JD or company responsibilities checklist. We tailor all questions to this spec.
                  </p>
                  <textarea
                    id="job-description"
                    className="w-full h-40 p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed"
                    placeholder="We require a Senior Product Marketer with 5+ years experience who loves collaboration, cross-functional communication, and can handle campaign calendars..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    required
                  />
                </div>

                {/* CV Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  
                  {/* Option A: Paste text CV */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700" htmlFor="cv-text">
                      📝 Option A: Paste CV Text
                    </label>
                    <textarea
                      id="cv-text"
                      className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs text-gray-600"
                      placeholder="Name: Alex Parker... Worked as a Product Manager at Google..."
                      value={cvText}
                      disabled={!!cvFile}
                      onChange={(e) => setCvText(e.target.value)}
                    />
                  </div>

                  {/* Option B: Upload file */}
                  <div className="space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="block text-sm font-bold text-gray-700 mb-1">
                        📎 Option B: Upload CV file
                      </span>
                      <p className="text-xs text-gray-400 mb-4">
                        Upload your resume in PDF/TXT/Word format (we process it directly on Gemini).
                      </p>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-200 hover:border-indigo-400/60 rounded-xl p-4 text-center cursor-pointer hover:bg-indigo-50/50 transition">
                      <input
                        type="file"
                        id="cv-file"
                        className="hidden"
                        accept=".pdf,.txt,.doc,.docx"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="cv-file" className="cursor-pointer">
                        {cvFile ? (
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-teal-600 block">✓ CV Uploaded</span>
                            <span className="text-[10px] text-gray-500 block truncate max-w-xs mx-auto">{cvFile.name}</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <span className="text-2xl block">📁</span>
                            <span className="text-xs text-gray-500 block hover:underline">Click to browse your resume</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                </div>

                {/* Submit Action */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 px-6 rounded-2xl shadow-md hover:shadow-lg hover:shadow-indigo-100 transition duration-150 flex items-center justify-center gap-2 text-base"
                    id="analyze-submit-button"
                  >
                    Build My ADHD Calibration Plan ⚡
                  </button>
                </div>

              </form>
            </motion.div>
          )}

          {/* STATE 2: Loading State */}
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
                <h2 className="text-xl font-extrabold text-indigo-700">Calming Focus Tip</h2>
                <div className="px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm italic text-sm text-gray-600 leading-relaxed font-semibold min-h-[5rem] flex items-center justify-center">
                  "{LOADING_TIPS[loadingTipIndex]}"
                </div>
                <p className="text-xs text-gray-400">
                  Compiling complete interview calibration checklist using Gemini...
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
                evaluateAnswer={evaluateAnswer}
              />
            </motion.div>
          )}

          {/* STATE 6: Error Screen */}
          {appState === 'error' && error && (
            <motion.div
              key="error_screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 space-y-6 max-w-md mx-auto"
            >
              <span className="text-5xl block">⚠️</span>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-red-600">Calibration Issue</h2>
                <p className="text-sm text-gray-500">
                  {error}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition"
              >
                Restart calibration list
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
