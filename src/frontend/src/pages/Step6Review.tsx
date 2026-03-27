import { AnimatePresence, motion } from "motion/react";
import type { TargetAndTransition, Transition } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../App";

interface Field {
  label: string;
  value: string;
  type?: string;
  prefix?: string;
  accent: string;
}

function Particle({
  x,
  y,
  size,
  delay,
  duration,
}: { x: number; y: number; size: number; delay: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: "rgba(255,255,255,0.6)",
      }}
      animate={{ y: [0, -30, 0], opacity: [0.1, 0.6, 0.1], scale: [1, 1.3, 1] }}
      transition={{
        duration,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  );
}

function GradientOrb({
  style,
  animate: anim,
  transition,
}: {
  style: React.CSSProperties;
  animate: TargetAndTransition;
  transition: Transition;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none blur-3xl"
      style={style}
      animate={anim}
      transition={transition}
    />
  );
}

function GridBackground() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path
            d="M 60 0 L 0 0 0 60"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
        </pattern>
        <pattern
          id="grid-large"
          width="240"
          height="240"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 240 0 L 0 0 0 240"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <rect width="100%" height="100%" fill="url(#grid-large)" />
    </svg>
  );
}

const CIRCUIT_DOTS = [
  { key: "a", cx: 80, cy: 120 },
  { key: "b", cx: 200, cy: 120 },
  { key: "c", cx: 200, cy: 300 },
];

function CircuitPaths() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.07]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="M 0 200 L 80 200 L 80 120 L 200 120 L 200 300 L 340 300"
        fill="none"
        stroke="url(#circuit-grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 2,
        }}
      />
      <motion.path
        d="M 50 600 L 50 520 L 180 520 L 180 440"
        fill="none"
        stroke="url(#circuit-grad)"
        strokeWidth="1"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 2.5,
          delay: 0.5,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 3,
        }}
      />
      {CIRCUIT_DOTS.map((dot, i) => (
        <motion.circle
          key={dot.key}
          cx={dot.cx}
          cy={dot.cy}
          r="3"
          fill="#6366f1"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{
            duration: 1,
            delay: i * 0.7 + 1,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 3,
          }}
        />
      ))}
      <defs>
        <linearGradient id="circuit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: (i * 37 + 11) % 100,
  y: (i * 53 + 7) % 100,
  size: (i % 3) + 1.5,
  delay: (i * 0.4) % 4,
  duration: 4 + (i % 4),
}));

export default function Step6Review() {
  const navigate = useNavigate();
  const { email } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fields, setFields] = useState<Field[]>([
    {
      label: "PAN NUMBER",
      value: "ABCDE1234F",
      accent: "from-indigo-400 to-violet-500",
    },
    {
      label: "DATE OF BIRTH",
      value: "01/01/1990",
      type: "date-display",
      accent: "from-violet-400 to-purple-500",
    },
    {
      label: "EMAIL ADDRESS",
      value: email || "john.doe@example.com",
      accent: "from-purple-400 to-fuchsia-500",
    },
    { label: "PINCODE", value: "400001", accent: "from-teal-400 to-cyan-500" },
    {
      label: "RECENT ADDRESS",
      value: "123, Premium Heights, Worli, Mumbai - 400018",
      accent: "from-cyan-400 to-teal-500",
    },
    {
      label: "TOTAL MONTHLY INCOME",
      value: "85000",
      prefix: "₹",
      accent: "from-emerald-400 to-teal-500",
    },
  ]);
  const [editing, setEditing] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      card.style.transform = `perspective(1200px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg) translateZ(0)`;
    };
    const onLeave = () => {
      card.style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg)";
    };
    window.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  function update(i: number, val: string) {
    setFields((f) =>
      f.map((field, idx) => (idx === i ? { ...field, value: val } : field)),
    );
  }

  function formatFieldValue(field: Field) {
    if (field.prefix === "₹") {
      const num = Number.parseInt(field.value.replace(/,/g, ""), 10);
      if (!Number.isNaN(num)) return num.toLocaleString("en-IN");
    }
    return field.value;
  }

  function handleSubmit() {
    setSubmitted(true);
    setTimeout(() => navigate("/success"), 600);
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #060c1a 0%, #0a0f2e 40%, #0d1635 70%, #060e1a 100%)",
      }}
    >
      <GradientOrb
        style={{
          width: 600,
          height: 600,
          top: "-20%",
          left: "-10%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <GradientOrb
        style={{
          width: 500,
          height: 500,
          bottom: "-15%",
          right: "-10%",
          background:
            "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.15, 1], x: [0, -30, 0], y: [0, -40, 0] }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <GradientOrb
        style={{
          width: 400,
          height: 400,
          top: "40%",
          right: "15%",
          background:
            "radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.3, 1], x: [0, 20, 0], y: [0, -30, 0] }}
        transition={{
          duration: 14,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 4,
        }}
      />
      <GradientOrb
        style={{
          width: 300,
          height: 300,
          top: "20%",
          right: "30%",
          background:
            "radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <GridBackground />
      <CircuitPaths />

      {PARTICLES.map((p) => (
        <Particle
          key={p.id}
          x={p.x}
          y={p.y}
          size={p.size}
          delay={p.delay}
          duration={p.duration}
        />
      ))}

      {/* Top bar */}
      <div
        className="relative z-10 flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button
          type="button"
          data-ocid="review.back.button"
          onClick={() => navigate("/offers")}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors group"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full group-hover:bg-white/10 transition-colors">
            <svg
              aria-hidden="true"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </span>
          Back
        </button>

        <div
          className="relative flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.25)",
          }}
        >
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: "rgba(16,185,129,0.12)" }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.02, 0.95] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.svg
            aria-hidden="true"
            className="w-3.5 h-3.5 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            animate={{
              filter: [
                "drop-shadow(0 0 2px #10b981)",
                "drop-shadow(0 0 6px #10b981)",
                "drop-shadow(0 0 2px #10b981)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              stroke="#10b981"
              strokeWidth={2}
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="#10b981"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
          <span className="text-emerald-400 text-xs font-bold tracking-widest relative z-10">
            BUREAU VERIFIED
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-4"
            style={{
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.3)",
              color: "#a5b4fc",
            }}
            animate={{
              borderColor: [
                "rgba(99,102,241,0.3)",
                "rgba(168,85,247,0.5)",
                "rgba(99,102,241,0.3)",
              ],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-indigo-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
            STEP 6 OF 7 — REVIEW
          </motion.div>

          <h1 className="text-5xl font-black mb-3 leading-tight">
            <span className="text-white">Review your </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%)",
              }}
            >
              details.
            </span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
            Securely fetched from the credit bureau. Review and confirm your
            information before we match you with the best offers.
          </p>
        </motion.div>

        {/* Glassmorphism card */}
        <div
          ref={cardRef}
          className="rounded-3xl p-6 md:p-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04) inset",
            transition: "transform 0.15s ease",
          }}
        >
          <motion.div
            className="h-px w-full mb-6 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(168,85,247,0.5), transparent)",
            }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          />

          <div className="space-y-3">
            {fields.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                data-ocid={`review.field.${i + 1}`}
              >
                <p
                  className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1.5 ml-1"
                  style={{ color: "rgba(165,180,252,0.7)" }}
                >
                  {f.label}
                </p>
                <motion.div
                  className="relative flex items-center rounded-xl overflow-hidden group"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  whileHover={{
                    boxShadow:
                      "0 0 0 1px rgba(99,102,241,0.4), 0 4px 20px rgba(99,102,241,0.1)",
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b ${f.accent} rounded-l-xl`}
                  />

                  {editing !== i && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.02) 50%, transparent 100%)",
                      }}
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 3,
                        delay: i * 0.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 4,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  <div className="flex-1 flex items-center px-5 py-3.5">
                    {f.prefix && (
                      <span
                        className={`text-base font-bold mr-1 bg-gradient-to-r ${f.accent} bg-clip-text text-transparent`}
                      >
                        {f.prefix}
                      </span>
                    )}
                    {editing === i ? (
                      <input
                        ref={inputRef}
                        data-ocid={`review.field.input.${i + 1}`}
                        className="flex-1 text-sm text-white outline-none bg-transparent placeholder-slate-600"
                        value={f.value}
                        onChange={(e) => update(i, e.target.value)}
                        onBlur={() => setEditing(null)}
                      />
                    ) : (
                      <span
                        className="flex-1 text-sm font-medium"
                        style={{ color: "rgba(226,232,240,0.9)" }}
                      >
                        {formatFieldValue(f)}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    data-ocid={`review.field.edit_button.${i + 1}`}
                    onClick={() => setEditing(i)}
                    className="flex items-center justify-center w-9 h-9 mr-2 rounded-lg transition-all opacity-40 group-hover:opacity-100"
                    style={{ color: "rgba(165,180,252,0.8)" }}
                  >
                    <svg
                      aria-hidden="true"
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                      />
                      <path
                        d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="h-px w-full mt-6 mb-6 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(20,184,166,0.4), rgba(99,102,241,0.4), transparent)",
            }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: 1.5,
            }}
          />

          <AnimatePresence>
            <motion.button
              data-ocid="review.submit_button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 0 40px rgba(99,102,241,0.5), 0 8px 32px rgba(99,102,241,0.3)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={submitted}
              className="w-full py-4 rounded-2xl font-black text-base text-white relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)",
                boxShadow: "0 4px 24px rgba(99,102,241,0.35)",
              }}
            >
              <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 3,
                }}
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {submitted ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Processing...
                  </motion.span>
                ) : (
                  <>
                    Confirm &amp; Submit
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      →
                    </motion.span>
                  </>
                )}
              </span>
            </motion.button>
          </AnimatePresence>
        </div>

        {/* Security row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-center gap-3 mt-6 flex-wrap"
        >
          <motion.svg
            aria-hidden="true"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            animate={{
              filter: [
                "drop-shadow(0 0 2px rgba(99,102,241,0.4))",
                "drop-shadow(0 0 8px rgba(99,102,241,0.8))",
                "drop-shadow(0 0 2px rgba(99,102,241,0.4))",
              ],
            }}
            transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              stroke="#818cf8"
              strokeWidth={1.5}
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="#818cf8"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
          {["256-bit encrypted", "BUREAU VERIFIED", "RBI Compliant"].map(
            (label, i) => (
              <span key={label} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-slate-600">•</span>}
                <span
                  className="text-[11px] font-semibold tracking-wider"
                  style={{ color: "rgba(148,163,184,0.6)" }}
                >
                  {label}
                </span>
              </span>
            ),
          )}
        </motion.div>
      </div>
    </div>
  );
}
