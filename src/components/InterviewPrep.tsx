import { InterviewPlan, InterviewStage } from '../types';
import { motion } from 'framer-motion';

interface InterviewPrepProps {
  plan: InterviewPlan;
  onStartStage: (stage: InterviewStage) => void;
  onReset: () => void;
}

export default function InterviewPrep({ plan, onStartStage, onReset }: InterviewPrepProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8" id="prep-dashboard">
      {/* Header */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium text-xs rounded-full uppercase tracking-wider"
        >
          Preparation Dashboard
        </motion.div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white" id="prep-title">
          Practicing for <span className="text-indigo-600 dark:text-indigo-400">{plan.jobTitle}</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Target Company: <strong className="text-gray-700 dark:text-gray-200">{plan.companyName}</strong>
        </p>
      </div>

      {/* Elevator Pitch Box */}
      {plan.elevatorPitch && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4"
          id="elevator-pitch-card"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-xl">🎙️</span> Your Tailored Elevator Pitch
            </h2>
            <span className="text-xs px-2.5 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold rounded-full uppercase">
              Past - Present - Future
            </span>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed italic bg-gray-50/50 dark:bg-gray-950/40 p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
            "{plan.elevatorPitch}"
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            💡 **Tip:** Practice this out loud in front of a mirror or record a test session. Keep your breathing steady!
          </p>
        </motion.div>
      )}

      {/* Interview Stages Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2" id="stages-heading">
          📂 Simulated Interview Stages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plan.stages.map((stage, index) => (
            <motion.div
              key={stage.stageId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 2) }}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 relative overflow-hidden group"
              id={`stage-card-${stage.stageId}`}
            >
              {/* Highlight accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600" />
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                    Stage {index + 1}
                  </span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded font-mono text-gray-500">
                    {stage.questions.length} Questions
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {stage.stageName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                  {stage.description}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onStartStage(stage)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-150 text-sm shadow-sm flex items-center justify-center gap-2"
                  id={`start-button-${stage.stageId}`}
                >
                  Start Phase 🚀
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center pt-4">
        <button
          onClick={onReset}
          className="text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition duration-150 underline decoration-dashed"
        >
          ← Start over with new JD & CV
        </button>
      </div>
    </div>
  );
}
