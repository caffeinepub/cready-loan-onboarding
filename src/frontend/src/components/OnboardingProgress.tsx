import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../App";

const steps = [
  "Registration",
  "Verify Mobile",
  "Credit Check",
  "View Offers",
  "Complete",
];

interface Props {
  currentStep: 1 | 2 | 3 | 4 | 5;
}

export default function OnboardingProgress({ currentStep }: Props) {
  const { isReturningUser } = useApp();
  const navigate = useNavigate();
  const pct = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div
      data-ocid="onboarding.progress.panel"
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm"
    >
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
          Step {currentStep} of {steps.length}
        </span>
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
          />
        </div>
        <span className="text-xs font-medium text-indigo-600 whitespace-nowrap">
          {steps[currentStep - 1]}
        </span>
        {isReturningUser && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            type="button"
            data-ocid="onboarding.skip.button"
            onClick={() => navigate("/dashboard")}
            className="text-xs text-slate-400 hover:text-indigo-600 underline whitespace-nowrap min-h-[44px] px-2 transition-colors"
          >
            Skip
          </motion.button>
        )}
      </div>
    </div>
  );
}
