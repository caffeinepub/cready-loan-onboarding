import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../App";
import StepIndicator from "../components/StepIndicator";

const stages = [
  { msg: "CONNECTING TO CREDIT BUREAUS...", icon: "🌐", pct: 15 },
  { msg: "VERIFYING IDENTITY...", icon: "🔐", pct: 35 },
  { msg: "FETCHING CREDIT REPORT...", icon: "📊", pct: 55 },
  { msg: "RUNNING AI RISK ASSESSMENT...", icon: "⚙️", pct: 76 },
  { msg: "FINALIZING YOUR PROFILE...", icon: "✨", pct: 90 },
  { msg: "COMPLETE", icon: "✅", pct: 100 },
];

const toasts = [
  { title: "Identity Verified", sub: "Accessing secure credit records..." },
  { title: "Analysis Complete", sub: "We've found a great offer for you!" },
];

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: `particle-${i}`,
  left: `${5 + ((i * 4.8) % 90)}%`,
  top: `${10 + ((i * 7.3) % 80)}%`,
  dur: 2 + (i % 3),
  delay: i * 0.15,
}));

export default function Step3Analyzing() {
  const navigate = useNavigate();
  const { employmentType } = useApp();
  const [stage, setStage] = useState(0);
  const [toast, setToast] = useState<number | null>(null);
  const [lenderCount, setLenderCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    stages.forEach((_, i) => {
      timers.push(setTimeout(() => setStage(i), i * 700));
    });
    timers.push(setTimeout(() => setToast(0), 800));
    timers.push(setTimeout(() => setToast(null), 2300));
    timers.push(setTimeout(() => setToast(1), 3000));
    timers.push(setTimeout(() => navigate("/dashboard"), 4500));
    return () => timers.forEach(clearTimeout);
  }, [navigate]);

  // Count-up lender matches over 3 seconds
  useEffect(() => {
    const target = 24;
    const duration = 3000;
    const stepTime = duration / target;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setLenderCount(count);
      if (count >= target) clearInterval(interval);
    }, stepTime);
    return () => clearInterval(interval);
  }, []);

  const current = stages[stage];
  const subtitle =
    employmentType === "self-employed"
      ? "Verifying ITR, GST & bureau data..."
      : "Checking your salary slip & bureau data...";

  return (
    <div className="min-h-screen flex flex-col bg-[#060612] overflow-x-hidden">
      {/* Step Indicator */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <StepIndicator
          currentStep={3}
          className="[&>div>div]:bg-white/30 [&>span]:text-white/60"
        />
      </div>
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-10 left-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-purple-600/15 rounded-full blur-[100px]" />

        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-1 h-1 bg-indigo-400/40 rounded-full"
            style={{ left: p.left, top: p.top }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{
              duration: p.dur,
              repeat: Number.POSITIVE_INFINITY,
              delay: p.delay,
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-[420px] max-w-[90vw] text-center shadow-2xl"
        >
          {/* Lender match counter */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 flex items-center justify-center gap-2"
          >
            <span className="text-lg">🎯</span>
            <span className="text-white font-bold text-base">
              <motion.span
                key={lenderCount}
                initial={{ scale: 1.3, color: "#818cf8" }}
                animate={{ scale: 1, color: "#ffffff" }}
              >
                {lenderCount}
              </motion.span>{" "}
              lenders matched
            </span>
          </motion.div>

          <div className="relative flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-indigo-900/60 flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  />
                  <path
                    d="M21 21l-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute top-0 right-[calc(50%-56px)] w-9 h-9 bg-slate-700 rounded-xl flex items-center justify-center border border-white/10"
            >
              <span className="text-sm">{current.icon}</span>
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-white text-2xl font-black leading-tight">
              Analyzing Your{" "}
              <span className="text-indigo-400">Financial DNA</span>
            </h2>
            {/* CIBIL tooltip */}
            <div className="relative" ref={tooltipRef}>
              <button
                type="button"
                data-ocid="analyzing.cibil.tooltip"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                onClick={() => setShowTooltip((v) => !v)}
                className="w-5 h-5 rounded-full bg-indigo-500/30 border border-indigo-400/50 text-indigo-300 text-xs flex items-center justify-center hover:bg-indigo-500/50 transition-colors"
                aria-label="What is CIBIL score?"
              >
                ?
              </button>
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-white text-gray-800 text-xs rounded-xl p-3 w-56 shadow-2xl z-50 border border-slate-100"
                  >
                    <p className="font-semibold text-indigo-600 mb-1">
                      What is CIBIL?
                    </p>
                    <p className="leading-relaxed">
                      CIBIL scores range 300–900. A score of 750+ is considered
                      excellent and unlocks the best loan rates.
                    </p>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <p className="text-slate-400 text-xs mb-2">{subtitle}</p>

          <AnimatePresence mode="wait">
            <motion.p
              key={stage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-slate-400 text-xs tracking-widest uppercase mt-2 mb-6"
            >
              {current.msg}
            </motion.p>
          </AnimatePresence>

          <div className="relative mb-2">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${current.pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-400 rounded-full relative"
              >
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-indigo-400"
                />
              </motion.div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mb-6">
            <span>SYSTEM INTEGRITY: OPTIMAL</span>
            <motion.span
              key={current.pct}
              initial={{ scale: 1.3, color: "#818cf8" }}
              animate={{ scale: 1, color: "#94a3b8" }}
              className="font-bold"
            >
              {current.pct}%
            </motion.span>
          </div>

          <div className="flex items-center justify-center gap-2 px-4 py-2 border border-white/10 rounded-full text-xs text-slate-400">
            <svg
              aria-hidden="true"
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                stroke="currentColor"
                strokeWidth={2}
              />
            </svg>
            BANK-GRADE 256-BIT ENCRYPTION ACTIVE
          </div>
        </motion.div>

        <AnimatePresence>
          {toast !== null && (
            <motion.div
              initial={{ opacity: 0, x: 40, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="fixed bottom-8 right-8 bg-white shadow-2xl rounded-2xl px-5 py-3 z-50 min-w-[220px]"
            >
              <p className="font-semibold text-sm text-gray-800">
                {toasts[toast].title}
              </p>
              <p className="text-xs text-gray-500">{toasts[toast].sub}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
