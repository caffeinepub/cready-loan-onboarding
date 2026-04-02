import { AnimatePresence, motion, useAnimationFrame } from "motion/react";
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
  {
    title: "Identity Verified ✓",
    sub: "Accessing secure credit records...",
    color: "from-indigo-500 to-violet-600",
  },
  {
    title: "Analysis Complete 🎯",
    sub: "We've found a great offer for you!",
    color: "from-emerald-500 to-teal-600",
  },
];

// Neural network nodes
const NODES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: (i * 61 + 7) % 100,
  y: (i * 43 + 13) % 100,
  size: 2 + (i % 3),
  delay: i * 0.2,
  dur: 3 + (i % 4),
}));

const CONNECTIONS = [
  [0, 3],
  [1, 4],
  [2, 5],
  [3, 7],
  [4, 8],
  [5, 9],
  [6, 10],
  [7, 11],
  [8, 12],
  [9, 13],
  [10, 14],
  [11, 15],
  [0, 6],
  [1, 7],
  [3, 9],
  [5, 11],
  [12, 16],
  [13, 17],
];

// DNA Helix path generator
function HelixPath({ side }: { side: 1 | -1 }) {
  const points = Array.from({ length: 20 }, (_, i) => {
    const t = (i / 19) * Math.PI * 4;
    const x = 50 + side * 30 * Math.cos(t);
    const y = i * (200 / 19);
    return `${x},${y}`;
  });
  return points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt}`;
    const prev = points[i - 1].split(",");
    const cur = pt.split(",");
    const mx = (Number(prev[0]) + Number(cur[0])) / 2;
    const my = (Number(prev[1]) + Number(cur[1])) / 2;
    return `${acc} Q ${prev[0]},${prev[1]} ${mx},${my}`;
  }, "");
}

function DNAHelix() {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-24 h-52 opacity-30 hidden md:block">
      <svg aria-hidden="true" viewBox="0 0 100 200" className="w-full h-full">
        <defs>
          <linearGradient id="helix-grad-1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="50%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="helix-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
        </defs>
        <motion.path
          d={HelixPath({ side: 1 })}
          fill="none"
          stroke="url(#helix-grad-1)"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ pathLength: [0, 1] }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
        <motion.path
          d={HelixPath({ side: -1 })}
          fill="none"
          stroke="url(#helix-grad-2)"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ pathLength: [0, 1] }}
          transition={{
            duration: 2.5,
            delay: 0.3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
        {Array.from({ length: 8 }, (_, i) => {
          const t = (i / 7) * Math.PI * 4;
          const x1 = 50 + 30 * Math.cos(t);
          const x2 = 50 - 30 * Math.cos(t);
          const y = i * (200 / 7);
          return (
            <motion.line
              // biome-ignore lint/suspicious/noArrayIndexKey: static sequence
              key={i}
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke="#00D4FF"
              strokeWidth="1"
              strokeOpacity="0.5"
              animate={{ strokeOpacity: [0.2, 0.7, 0.2] }}
              transition={{
                duration: 1.5,
                delay: i * 0.2,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}

function NeuralNetwork() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.15]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="neural-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#00D4FF" />
        </linearGradient>
      </defs>
      {CONNECTIONS.map(([a, b], idx) => {
        const na = NODES[a];
        const nb = NODES[b];
        if (!na || !nb) return null;
        return (
          <motion.line
            // biome-ignore lint/suspicious/noArrayIndexKey: static sequence
            key={idx}
            x1={`${na.x}%`}
            y1={`${na.y}%`}
            x2={`${nb.x}%`}
            y2={`${nb.y}%`}
            stroke="url(#neural-grad)"
            strokeWidth="0.5"
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{
              duration: 2 + (idx % 3),
              delay: idx * 0.15,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1,
            }}
          />
        );
      })}
      {NODES.map((node) => (
        <motion.circle
          key={`node-${node.id}`}
          cx={`${node.x}%`}
          cy={`${node.y}%`}
          r={node.size}
          fill="rgba(99,102,241,0.8)"
          animate={{
            opacity: [0.3, 1, 0.3],
            r: [node.size, node.size * 1.5, node.size],
          }}
          transition={{
            duration: node.dur,
            delay: node.delay,
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      ))}
    </svg>
  );
}

function DataStream() {
  const lines = [
    "01001011 FF A3 0x4F",
    "CIBIL_V2.1.0",
    "0xDEADBEEF",
    "SCORE: 777",
    "0b11010110",
    "AES-256-GCM",
    "FF 3C 9A 12",
    "AUTH:OK",
    "0x4F2A1B",
    "BUREAU: EQUIFAX",
    "01110100",
    "RSA-4096",
  ];

  return (
    <div className="absolute right-2 top-0 bottom-0 w-20 overflow-hidden opacity-40 hidden lg:flex flex-col select-none">
      <motion.div
        animate={{ y: ["-50%", "0%"] }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="flex flex-col gap-3 py-4"
      >
        {[...lines, ...lines].map((line, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static sequence
            key={i}
            className="text-[9px] font-mono text-indigo-400/50 whitespace-nowrap"
          >
            {line}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-[2px] pointer-events-none z-20"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(0,212,255,0.8), rgba(79,70,229,0.6), transparent)",
        boxShadow: "0 0 20px rgba(0,212,255,0.6), 0 0 40px rgba(0,212,255,0.2)",
      }}
      animate={{ top: ["0%", "100%"] }}
      transition={{
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
        repeatDelay: 0.5,
      }}
    />
  );
}

function GlitchText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setGlitch(true);
    const timeout = setTimeout(() => setGlitch(false), 200);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 40);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [text]);

  return (
    <span
      className="font-mono text-xs tracking-[0.25em] uppercase"
      style={{
        color: glitch ? "#00D4FF" : "rgba(148,163,184,0.8)",
        textShadow: glitch ? "0 0 10px #00D4FF, 2px 0 #FF0066" : "none",
        transition: "all 0.1s",
      }}
    >
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
        className="inline-block w-1 h-3 bg-cyan-400 ml-0.5 align-middle"
      />
    </span>
  );
}

function OdometerDigit({ digit }: { digit: string; prev?: string }) {
  const isNum = !Number.isNaN(Number(digit));
  if (!isNum)
    return <span className="text-6xl font-black text-slate-800">{digit}</span>;

  return (
    <div className="relative overflow-hidden h-16 w-10 inline-flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={digit}
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute text-5xl md:text-6xl font-black"
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #a5b4fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function ArcProgress({ pct }: { pct: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ * 0.75;
  const offset = circ * 0.125;

  return (
    <div className="relative w-32 h-32 mx-auto mb-4">
      <svg
        aria-hidden="true"
        viewBox="0 0 120 120"
        className="w-full h-full -rotate-[135deg]"
      >
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="url(#arc-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          strokeDashoffset={offset}
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${dash} ${circ - dash}` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="50%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={pct}
          initial={{ scale: 1.3, color: "#00D4FF" }}
          animate={{ scale: 1, color: "#ffffff" }}
          className="text-2xl font-black"
        >
          {pct}%
        </motion.span>
        <span className="text-[9px] text-slate-500 tracking-widest">
          COMPLETE
        </span>
      </div>
    </div>
  );
}

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

  const countStr = String(lenderCount).padStart(2, "0");

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Neural network */}
      <NeuralNetwork />

      {/* Ambient glows */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
        }}
      />

      {/* DNA Helix */}
      <DNAHelix />

      {/* Data Stream */}
      <DataStream />

      {/* Step Indicator */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <StepIndicator
          currentStep={3}
          className="[&>div>div]:bg-indigo-100 [&>span]:text-slate-500"
        />
      </div>

      <div className="flex-1 flex items-center justify-center relative overflow-hidden px-4 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-[460px] max-w-[92vw] text-center"
          style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(226,232,240,0.8)",
            borderRadius: "24px",
            boxShadow:
              "0 0 0 1px rgba(79,70,229,0.08) inset, 0 32px 80px rgba(99,102,241,0.08), 0 8px 32px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {/* Scan line */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none z-20">
            <ScanLine />
          </div>

          {/* Top glow bar */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, #4F46E5, #00D4FF, #10B981, transparent)",
            }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          />

          <div className="p-8">
            {/* Lender odometer */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <div className="flex items-end justify-center gap-1 mb-1">
                <span className="text-slate-500 text-sm font-mono mb-2">
                  LENDERS MATCHED
                </span>
              </div>
              <div className="flex items-center justify-center gap-0.5">
                {countStr.split("").map((digit, i) => (
                  <OdometerDigit
                    // biome-ignore lint/suspicious/noArrayIndexKey: 2-digit display
                    key={`od${i}`}
                    digit={digit}
                  />
                ))}
                <span
                  className="text-3xl font-black ml-2 mb-1"
                  style={{
                    background: "linear-gradient(135deg, #00D4FF, #10B981)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  🎯
                </span>
              </div>
              <motion.div
                className="text-xs font-mono tracking-widest text-center mt-1"
                animate={{
                  color: ["#4F46E5", "#0891b2", "#059669", "#4F46E5"],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                LENDERS SCANNING YOUR PROFILE...
              </motion.div>
            </motion.div>

            {/* Arc progress */}
            <ArcProgress pct={current.pct} />

            {/* Title + CIBIL tooltip */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <h2
                className="text-xl md:text-2xl font-black leading-tight"
                style={{
                  background:
                    "linear-gradient(135deg, #1e293b 0%, #4F46E5 40%, #0891b2 70%, #059669 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Analyzing Your Financial DNA
              </h2>
              <div className="relative" ref={tooltipRef}>
                <button
                  type="button"
                  data-ocid="analyzing.cibil.tooltip"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onFocus={() => setShowTooltip(true)}
                  onBlur={() => setShowTooltip(false)}
                  onClick={() => setShowTooltip((v) => !v)}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs hover:scale-110 transition-transform"
                  style={{
                    background: "rgba(0,212,255,0.15)",
                    border: "1px solid rgba(0,212,255,0.4)",
                    color: "#00D4FF",
                  }}
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
                        CIBIL scores range 300–900. A score of 750+ is
                        considered excellent and unlocks the best loan rates.
                      </p>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <p className="text-slate-500 text-xs mb-4">{subtitle}</p>

            {/* Glitch stage text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={stage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6 h-5 flex items-center justify-center"
              >
                <GlitchText text={current.msg} />
              </motion.div>
            </AnimatePresence>

            {/* Segmented stage dots */}
            <div className="flex items-center gap-1.5 justify-center mb-6">
              {stages.map((_s, i) => (
                <motion.div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static stage list
                  key={`s${i}`}
                  className="h-1.5 rounded-full"
                  animate={{
                    width: i === stage ? 24 : 8,
                    background:
                      i <= stage
                        ? ["#4F46E5", "#00D4FF", "#10B981"][i % 3]
                        : "rgba(99,102,241,0.1)",
                    boxShadow:
                      i === stage
                        ? `0 0 8px ${["#4F46E5", "#00D4FF", "#10B981"][i % 3]}`
                        : "none",
                  }}
                  transition={{ duration: 0.4 }}
                />
              ))}
            </div>

            {/* Security chip */}
            <motion.div
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-full mx-auto w-fit"
              style={{
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
              animate={{
                borderColor: [
                  "rgba(16,185,129,0.2)",
                  "rgba(0,212,255,0.4)",
                  "rgba(16,185,129,0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              />
              <span className="text-[10px] font-bold tracking-widest text-emerald-600">
                BANK-GRADE 256-BIT ENCRYPTION ACTIVE
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Holographic toast chips */}
      <AnimatePresence>
        {toast !== null && (
          <motion.div
            initial={{ opacity: 0, x: 60, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-8 right-8 z-50 min-w-[240px] max-w-[280px]"
          >
            <div
              className="relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.98)",
                border: "1px solid rgba(226,232,240,0.8)",
                borderRadius: "16px",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(79,70,229,0.08) inset",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)",
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 1,
                }}
              />
              <div
                className={`h-0.5 bg-gradient-to-r ${toasts[toast].color} rounded-t-2xl`}
              />
              <div className="px-5 py-3.5">
                <div className="flex items-center gap-2 mb-1">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-emerald-400"
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                  <p className="font-bold text-sm text-slate-800">
                    {toasts[toast].title}
                  </p>
                </div>
                <p className="text-xs text-slate-400 ml-4">
                  {toasts[toast].sub}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
