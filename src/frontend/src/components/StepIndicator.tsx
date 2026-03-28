import { motion } from "motion/react";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
  className?: string;
}

export default function StepIndicator({
  currentStep,
  className = "",
}: StepIndicatorProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-1.5">
        {([1, 2, 3] as const).map((step) => (
          <motion.div
            key={step}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: step * 0.08, duration: 0.3 }}
            className={`rounded-full transition-all duration-300 ${
              step < currentStep
                ? "w-5 h-2 bg-indigo-400"
                : step === currentStep
                  ? "w-8 h-2 bg-gradient-to-r from-indigo-500 to-violet-500"
                  : "w-2 h-2 bg-slate-200 border border-slate-300"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-400 tracking-wide">
        Step {currentStep} of 3
      </span>
    </div>
  );
}
