import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CONFETTI_COLORS = [
  "#7c5cff",
  "#00D4FF",
  "#10B981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#a855f7",
  "#3b82f6",
];
const SHAPES = ["square", "circle", "rect"] as const;

function Confetti() {
  const pieces = Array.from({ length: 110 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: (i % 15) * 0.07,
    duration: 2.2 + (i % 5) * 0.3,
    size: 5 + (i % 6) * 2,
    shape: SHAPES[i % 3],
    angle: (i / 110) * Math.PI * 2,
    spread: 80 + (i % 5) * 40,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {pieces.map((p, i) => {
        const tx = Math.cos(p.angle) * p.spread;
        const ty = Math.sin(p.angle) * p.spread - 80;
        const width = p.shape === "rect" ? p.size * 2.5 : p.size;
        const height = p.shape === "rect" ? p.size * 0.5 : p.size;
        const borderRadius =
          p.shape === "circle" ? "50%" : p.shape === "rect" ? "2px" : "2px";
        return (
          <motion.div
            key={p.id}
            className="absolute"
            style={{
              left: "50%",
              top: "45%",
              width,
              height,
              background: p.color,
              borderRadius,
              marginLeft: -width / 2,
            }}
            animate={{
              x: [0, tx, tx + (Math.random() > 0.5 ? 40 : -40)],
              y: [0, ty, ty + 300],
              rotate: [0, 270 + (i % 180), 540 + (i % 360)],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: [0.17, 0.67, 0.83, 0.67],
              times: [0, 0.2, 0.8, 1],
            }}
          />
        );
      })}
    </div>
  );
}

function TypewriterText({
  text,
  delay = 0,
  onComplete,
}: { text: string; delay?: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 60);
    return () => clearInterval(interval);
  }, [started, text, onComplete]);

  return (
    <span className="font-mono">
      {displayed}
      {displayed.length < text.length && started && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
          className="inline-block w-0.5 h-4 bg-indigo-400 ml-0.5 align-middle"
        />
      )}
    </span>
  );
}

function CountUpStat({
  target,
  label,
  symbol = "",
  delay = 0,
}: { target: number; label: string; symbol?: string; delay?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      let i = 0;
      const steps = 40;
      const interval = setInterval(() => {
        i++;
        setCount(Math.round((i / steps) * target));
        if (i >= steps) clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(startTimer);
  }, [target, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
      className="text-center px-5 py-3 rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="text-2xl font-black"
        style={{
          background: "linear-gradient(135deg, #a5b4fc, #00D4FF, #10B981)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {symbol}
        {count}
      </div>
      <div className="text-[10px] text-slate-400 tracking-wider uppercase mt-1">
        {label}
      </div>
    </motion.div>
  );
}

function RippleEffect() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`ripple-${i}`}
          className="absolute rounded-full border border-indigo-400/30"
          initial={{ width: 80, height: 80, opacity: 0.8 }}
          animate={{ width: 300, height: 300, opacity: 0 }}
          transition={{
            duration: 1.5,
            delay: i * 0.3,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 1,
          }}
        />
      ))}
    </div>
  );
}

function OrbitingDots() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={`orbit-${i}`}
          className="absolute w-2.5 h-2.5 rounded-full"
          style={{
            background: [
              "#4F46E5",
              "#00D4FF",
              "#10B981",
              "#a855f7",
              "#f59e0b",
              "#ec4899",
            ][i],
            boxShadow: `0 0 8px ${["#4F46E5", "#00D4FF", "#10B981", "#a855f7", "#f59e0b", "#ec4899"][i]}`,
          }}
          animate={{
            rotate: [0 + i * 60, 360 + i * 60],
            x: Math.cos((i / 6) * Math.PI * 2) * 72,
            y: Math.sin((i / 6) * Math.PI * 2) * 72,
          }}
          transition={{
            rotate: {
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
            x: {
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
            y: {
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
          }}
          initial={{
            x: Math.cos((i / 6) * Math.PI * 2) * 72,
            y: Math.sin((i / 6) * Math.PI * 2) * 72,
          }}
        />
      ))}
    </div>
  );
}

const trackingId = "LN-98234-X";

export default function Step7ThankYou() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0); // 0=dark, 1=ripple, 2=checkmark+orbit, 3=pulse
  const [showStats, setShowStats] = useState(false);
  const [showTrackingId, setShowTrackingId] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 500); // ripple
    const t2 = setTimeout(() => setStage(2), 1000); // checkmark
    const t3 = setTimeout(() => setStage(3), 1600); // pulse
    const t4 = setTimeout(() => setShowContent(true), 1200);
    const t5 = setTimeout(() => setShowTrackingId(true), 1800);
    const t6 = setTimeout(() => setShowStats(true), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(trackingId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-violet-50">
      <Confetti />

      {/* Aurora shimmer top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(99,102,241,0.15) 0%, rgba(167,139,250,0.08) 50%, transparent 100%)",
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 pointer-events-none z-1"
        style={{
          background:
            "linear-gradient(90deg, #4F46E5, #00D4FF, #10B981, #a855f7, #ec4899, #4F46E5)",
        }}
        animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Aurora blobs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.3, 0.18] }}
        transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY }}
        className="absolute top-1/4 left-1/4 w-[700px] h-[500px] bg-indigo-200 rounded-full blur-[140px] opacity-40"
      />
      <motion.div
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[450px] bg-violet-200 rounded-full blur-[130px] opacity-35"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.18, 0.1] }}
        transition={{ duration: 11, repeat: Number.POSITIVE_INFINITY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[350px] bg-teal-200 rounded-full blur-[120px] opacity-25"
      />

      {/* Center content */}
      <div className="relative z-10 text-center max-w-lg px-4 w-full">
        {/* Hero animation stages */}
        <div className="relative flex justify-center mb-8 h-36">
          {/* Stage 1: Ripple shockwave */}
          <AnimatePresence>{stage >= 1 && <RippleEffect />}</AnimatePresence>

          {/* Stage 2+: Checkmark circle */}
          <AnimatePresence>
            {stage >= 2 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 18,
                  delay: 0.1,
                }}
                className="relative flex items-center justify-center w-28 h-28"
              >
                {/* Orbiting dots */}
                {stage >= 2 && <OrbitingDots />}

                {/* Pulse glow */}
                {stage >= 3 && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(79,70,229,0.4) 0%, transparent 70%)",
                    }}
                    animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{
                      duration: 2.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                )}

                <motion.div
                  className="w-24 h-24 rounded-full flex items-center justify-center relative"
                  style={{
                    background: "linear-gradient(135deg, #4F46E5, #7c3aed)",
                    boxShadow:
                      "0 0 40px rgba(79,70,229,0.3), 0 12px 32px rgba(79,70,229,0.2)",
                  }}
                >
                  <svg
                    aria-hidden="true"
                    className="w-12 h-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <motion.path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 0.7,
                        delay: 0.2,
                        ease: "easeOut",
                      }}
                    />
                  </svg>

                  {/* Outer ring pulse */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-indigo-400"
                    animate={{ scale: [1, 1.5, 1.8], opacity: [0.6, 0.2, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0.5,
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div className="inline-flex items-center gap-2 border border-indigo-200 bg-indigo-50 backdrop-blur-sm rounded-full px-4 py-1.5 text-indigo-500 text-xs tracking-widest mb-5">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
                APPLICATION RECEIVED
              </motion.div>

              <h1 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight mb-3">
                Thank You! Your Application{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #a5b4fc 0%, #00D4FF 50%, #10B981 100%)",
                  }}
                >
                  Has Been Submitted.
                </span>
              </h1>

              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Our team is reviewing your application. Track updates and
                continue your loan journey in our mobile app.
              </p>

              {/* Tracking ID with typewriter */}
              <AnimatePresence>
                {showTrackingId && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative inline-flex items-center gap-3 rounded-2xl px-5 py-3 mb-6"
                    style={{
                      background: "rgba(255,255,255,0.92)",
                      border: "1px solid rgba(199,210,254,0.8)",
                      backdropFilter: "blur(12px)",
                      boxShadow: "0 4px 24px rgba(99,102,241,0.12)",
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(79,70,229,0.08), transparent)",
                      }}
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 2,
                      }}
                    />
                    <div className="flex flex-col items-start relative z-10">
                      <span className="text-[9px] font-bold tracking-[0.2em] text-indigo-400 uppercase">
                        Tracking ID
                      </span>
                      <span
                        className="text-indigo-700 font-black text-base mt-0.5"
                        style={{ letterSpacing: "0.1em" }}
                      >
                        <TypewriterText text={trackingId} delay={0} />
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="relative z-10 ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: copied
                          ? "rgba(16,185,129,0.2)"
                          : "rgba(79,70,229,0.25)",
                        border: copied
                          ? "1px solid rgba(16,185,129,0.4)"
                          : "1px solid rgba(79,70,229,0.4)",
                        color: copied ? "#10B981" : "#a5b4fc",
                      }}
                    >
                      {copied ? "✓ Copied!" : "COPY"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stats count-up chips */}
              <AnimatePresence>
                {showStats && (
                  <div className="flex gap-3 justify-center mb-8 flex-wrap">
                    <CountUpStat
                      target={24}
                      label="Lenders Reviewed"
                      delay={0}
                    />
                    <CountUpStat
                      target={3}
                      label="Best Offers Found"
                      delay={0.2}
                    />
                    <CountUpStat
                      target={5}
                      label="Max Eligible (L)"
                      symbol="₹"
                      delay={0.4}
                    />
                  </div>
                )}
              </AnimatePresence>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <motion.button
                  type="button"
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 30px rgba(79,70,229,0.5)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 font-black px-8 py-4 rounded-2xl text-sm text-white w-full sm:w-auto"
                  style={{
                    background:
                      "linear-gradient(135deg, #4F46E5, #7c3aed, #9333ea)",
                    boxShadow: "0 4px 24px rgba(79,70,229,0.4)",
                  }}
                >
                  <span>📱</span> Download the App
                </motion.button>
                <motion.button
                  type="button"
                  data-ocid="thankyou.dashboard_button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-2xl text-sm border transition-all w-full sm:w-auto"
                  style={{
                    border: "1px solid rgba(99,102,241,0.2)",
                    color: "rgba(79,70,229,0.85)",
                    background: "rgba(99,102,241,0.06)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  Continue to Dashboard →
                </motion.button>
              </div>

              {/* Bottom support text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-slate-600 text-xs mb-4"
              >
                Questions? Call{" "}
                <span className="text-slate-500 font-semibold">
                  1800-123-LOAN
                </span>{" "}
                (Free)
              </motion.p>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={() => navigate("/register")}
                className="text-slate-600 hover:text-slate-400 text-xs transition-colors min-h-[44px] px-2"
              >
                Start a new application
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reward Badge — below content */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
              className="mt-6 mx-auto max-w-xs"
            >
              <div
                className="relative overflow-hidden rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  border: "1px solid rgba(245,158,11,0.3)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 4px 20px rgba(245,158,11,0.1)",
                }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 30%, rgba(245,158,11,0.08) 50%, transparent 70%)",
                  }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 2,
                  }}
                />
                <div className="relative flex items-start gap-3">
                  <div className="text-3xl">🏆</div>
                  <div className="flex-1 text-left">
                    <p className="text-slate-800 font-black text-sm">
                      🎁 Refer &amp; Earn!
                    </p>
                    <p className="text-amber-700/70 text-xs mt-1 leading-relaxed">
                      Refer friends to Cready and unlock up to ₹1000 Amazon
                      vouchers!
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        type="button"
                        className="text-xs font-bold px-4 py-1.5 rounded-full transition-all"
                        style={{
                          background:
                            "linear-gradient(135deg, #f59e0b, #d97706)",
                          color: "white",
                          boxShadow: "0 2px 12px rgba(245,158,11,0.35)",
                        }}
                      >
                        Share 🔗
                      </button>
                      <span className="text-xs text-amber-500/60">
                        Badge #47,821
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
