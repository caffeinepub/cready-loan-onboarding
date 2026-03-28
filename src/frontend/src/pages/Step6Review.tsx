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
  icon: string;
  category: string;
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
      className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="grid-r"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 60 0 L 0 0 0 60"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
        </pattern>
        <pattern
          id="grid-large-r"
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
      <rect width="100%" height="100%" fill="url(#grid-r)" />
      <rect width="100%" height="100%" fill="url(#grid-large-r)" />
    </svg>
  );
}

function CreditCard3D() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      setTilt({ x: dy * -12, y: dx * 12 });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    window.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="w-64 h-40 relative cursor-pointer mx-auto"
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Card body */}
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a5f 100%)",
          border: "1px solid rgba(165,180,252,0.2)",
          boxShadow:
            "0 20px 60px rgba(79,70,229,0.4), 0 0 0 1px rgba(255,255,255,0.08) inset",
        }}
      >
        {/* Holographic shimmer */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, transparent 20%, rgba(165,180,252,0.12) 40%, rgba(0,212,255,0.08) 60%, transparent 80%)",
          }}
          animate={{ x: ["-80%", "80%"] }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />

        {/* Chip */}
        <div
          className="absolute top-5 left-5 w-9 h-7 rounded-md"
          style={{
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            boxShadow: "0 2px 8px rgba(245,158,11,0.5)",
          }}
        >
          <div className="absolute inset-1 rounded grid grid-cols-2 gap-0.5">
            {["a", "b", "c", "d"].map((k) => (
              <div key={k} className="rounded-sm bg-amber-600/40" />
            ))}
          </div>
        </div>

        {/* Network logo */}
        <div className="absolute top-5 right-5 flex gap-[-4px]">
          <div className="w-6 h-6 rounded-full bg-red-500/80 -mr-2" />
          <div className="w-6 h-6 rounded-full bg-amber-400/80" />
        </div>

        {/* Score badge */}
        <div className="absolute top-5 right-16">
          <div
            className="px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider"
            style={{
              background: "rgba(16,185,129,0.2)",
              border: "1px solid rgba(16,185,129,0.4)",
              color: "#10B981",
            }}
          >
            777
          </div>
        </div>

        {/* Initials */}
        <div className="absolute bottom-10 left-5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm"
            style={{ background: "linear-gradient(135deg, #4F46E5, #7c3aed)" }}
          >
            BB
          </div>
        </div>

        {/* PAN masked */}
        <div className="absolute bottom-5 left-5 right-5">
          <div className="text-[10px] text-slate-400 font-mono tracking-[0.2em]">
            ABCDE ••••• 1234F
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-white text-xs font-bold tracking-wider">
              BHARAT BHUSHAN
            </span>
            <span className="text-slate-400 text-[9px]">CREADY</span>
          </div>
        </div>

        {/* Glow circles */}
        <div
          className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-30"
          style={{ background: "#4F46E5" }}
        />
        <div
          className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full blur-2xl opacity-20"
          style={{ background: "#00D4FF" }}
        />
      </div>
    </div>
  );
}

function ScoreArc() {
  const score = 777;
  const max = 900;
  const min = 300;
  const pct = (score - min) / (max - min);
  const r = 40;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ * 0.7;

  return (
    <div className="relative w-28 h-28 mx-auto mt-6">
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="w-full h-full -rotate-[126deg]"
      >
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="5"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="url(#score-arc-grad)"
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${dash} ${circ - dash}` }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="score-arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          className="text-2xl font-black text-white"
        >
          {score}
        </motion.span>
        <span
          className="text-[8px] font-bold tracking-wider"
          style={{ color: "#10B981" }}
        >
          EXCELLENT
        </span>
      </div>
    </div>
  );
}

const PARTICLES_R = Array.from({ length: 18 }, (_, i) => ({
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
      icon: "🆔",
      category: "Identity",
    },
    {
      label: "DATE OF BIRTH",
      value: "01/01/1990",
      type: "date-display",
      accent: "from-violet-400 to-purple-500",
      icon: "📅",
      category: "Personal",
    },
    {
      label: "EMAIL ADDRESS",
      value: email || "john.doe@example.com",
      accent: "from-purple-400 to-fuchsia-500",
      icon: "📧",
      category: "Contact",
    },
    {
      label: "PINCODE",
      value: "400001",
      accent: "from-teal-400 to-cyan-500",
      icon: "📍",
      category: "Location",
    },
    {
      label: "RECENT ADDRESS",
      value: "123, Premium Heights, Worli, Mumbai - 400018",
      accent: "from-cyan-400 to-teal-500",
      icon: "🏠",
      category: "Location",
    },
    {
      label: "TOTAL MONTHLY INCOME",
      value: "85000",
      prefix: "₹",
      accent: "from-emerald-400 to-teal-500",
      icon: "💰",
      category: "Financial",
    },
  ]);
  const [editing, setEditing] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [particleBurst, setParticleBurst] = useState(false);
  const [revealedFields, setRevealedFields] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (editing !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  // Stagger field reveal
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally runs once on mount
  useEffect(() => {
    fields.forEach((_, i) => {
      setTimeout(
        () => {
          setRevealedFields((prev) => new Set([...prev, i]));
        },
        300 + i * 150,
      );
    });
  }, [fields.length]);

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
    setParticleBurst(true);
    setSubmitted(true);
    setTimeout(() => navigate("/success"), 700);
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #060c1a 0%, #0a0f2e 40%, #0d1635 70%, #060e1a 100%)",
      }}
    >
      {/* Vivid orbs */}
      <GradientOrb
        style={{
          width: 700,
          height: 700,
          top: "-25%",
          left: "-15%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 65%)",
        }}
        animate={{ scale: [1, 1.25, 1], x: [0, 60, 0], y: [0, 30, 0] }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <GradientOrb
        style={{
          width: 600,
          height: 600,
          bottom: "-20%",
          right: "-15%",
          background:
            "radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 65%)",
        }}
        animate={{ scale: [1, 1.2, 1], x: [0, -40, 0], y: [0, -50, 0] }}
        transition={{
          duration: 9,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <GradientOrb
        style={{
          width: 450,
          height: 450,
          top: "35%",
          right: "10%",
          background:
            "radial-gradient(circle, rgba(0,212,255,0.2) 0%, transparent 65%)",
        }}
        animate={{ scale: [1, 1.35, 1], x: [0, 25, 0], y: [0, -35, 0] }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      <GridBackground />

      {/* Floating particles */}
      {PARTICLES_R.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "rgba(165,180,252,0.5)",
          }}
          animate={{ y: [0, -25, 0], opacity: [0.1, 0.5, 0.1] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      ))}

      {/* Particle burst on submit */}
      <AnimatePresence>
        {particleBurst && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 24 }, (_, i) => {
              const angle = (i / 24) * Math.PI * 2;
              return (
                <motion.div
                  // biome-ignore lint/suspicious/noArrayIndexKey: burst particles
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: "50%",
                    top: "80%",
                    background: [
                      "#4F46E5",
                      "#7c3aed",
                      "#00D4FF",
                      "#10B981",
                      "#a855f7",
                    ][i % 5],
                  }}
                  animate={{
                    x: Math.cos(angle) * 200,
                    y: Math.sin(angle) * 200,
                    opacity: [1, 0],
                    scale: [1, 0],
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div
        className="relative z-10 flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button
          type="button"
          data-ocid="review.back.button"
          onClick={() => window.history.back()}
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
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-emerald-400 relative z-10"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          />
          <span className="text-emerald-400 text-xs font-bold tracking-widest relative z-10">
            BUREAU VERIFIED
          </span>
        </div>
      </div>

      {/* Main layout */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-4"
            style={{
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.3)",
              color: "#a5b4fc",
            }}
            animate={{
              borderColor: [
                "rgba(99,102,241,0.3)",
                "rgba(0,212,255,0.4)",
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

          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
            <span className="text-white">Review your </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #00D4FF 100%)",
              }}
            >
              details.
            </span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
            Securely fetched from the credit bureau. Review and confirm before
            we match you with the best offers.
          </p>
        </motion.div>

        {/* Split panel */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left panel — 3D card + score */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:w-[38%] w-full"
          >
            <div
              className="rounded-3xl p-6"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
              }}
            >
              <p className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-4 text-center">
                YOUR CREDIT CARD
              </p>
              <CreditCard3D />
              <ScoreArc />
              <div className="mt-4 text-center">
                <p className="text-[10px] text-slate-500 tracking-widest uppercase">
                  Credit Profile
                </p>
                <div className="flex items-center justify-center gap-3 mt-3">
                  {[
                    { label: "Score", val: "777", color: "#10B981" },
                    { label: "Rank", val: "Top 8%", color: "#00D4FF" },
                    { label: "Age", val: "6yr", color: "#a5b4fc" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div
                        className="text-sm font-black"
                        style={{ color: stat.color }}
                      >
                        {stat.val}
                      </div>
                      <div className="text-[9px] text-slate-600 tracking-wider uppercase">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right panel — fields */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:w-[62%] w-full"
          >
            <div
              className="rounded-3xl p-5 md:p-7"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
              }}
            >
              <motion.div
                className="h-px w-full mb-5 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(0,212,255,0.5), transparent)",
                }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              />

              <div className="space-y-2.5">
                {fields.map((f, i) => (
                  <AnimatePresence key={f.label}>
                    {revealedFields.has(i) && (
                      <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        data-ocid={`review.field.${i + 1}`}
                        className="relative"
                      >
                        <div className="flex items-center gap-1.5 mb-1.5 ml-1">
                          <span className="text-xs">{f.icon}</span>
                          <p
                            className="text-[9px] font-bold tracking-[0.2em] uppercase"
                            style={{ color: "rgba(165,180,252,0.6)" }}
                          >
                            {f.label}
                          </p>
                          <span
                            className="ml-1 text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider"
                            style={{
                              background: "rgba(99,102,241,0.12)",
                              color: "rgba(165,180,252,0.5)",
                            }}
                          >
                            {f.category}
                          </span>
                        </div>
                        <motion.div
                          className="relative flex items-center rounded-xl overflow-hidden group"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                          }}
                          animate={
                            editing === i
                              ? {
                                  boxShadow:
                                    "0 0 0 1.5px rgba(99,102,241,0.6), 0 4px 20px rgba(99,102,241,0.15)",
                                  background: "rgba(255,255,255,0.06)",
                                }
                              : {}
                          }
                          whileHover={
                            editing !== i
                              ? {
                                  boxShadow:
                                    "0 0 0 1px rgba(99,102,241,0.3), 0 2px 12px rgba(99,102,241,0.08)",
                                  background: "rgba(255,255,255,0.05)",
                                }
                              : {}
                          }
                        >
                          <div
                            className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b ${f.accent} rounded-l-xl`}
                          />

                          {/* Scanning shimmer */}
                          {!revealedFields.has(i) || editing === i ? null : (
                            <motion.div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                background:
                                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.025) 50%, transparent 100%)",
                              }}
                              animate={{ x: ["-100%", "200%"] }}
                              transition={{
                                duration: 3,
                                delay: i * 0.4,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatDelay: 5,
                              }}
                            />
                          )}

                          <div className="flex-1 flex items-center px-4 py-3.5">
                            {f.prefix && (
                              <span
                                className={`text-base font-black mr-1 bg-gradient-to-r ${f.accent} bg-clip-text text-transparent`}
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
                                className="flex-1 text-sm font-semibold"
                                style={{ color: "rgba(226,232,240,0.95)" }}
                              >
                                {formatFieldValue(f)}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            data-ocid={`review.field.edit_button.${i + 1}`}
                            onClick={() => setEditing(i)}
                            className="flex items-center justify-center w-9 h-9 mr-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
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
                    )}
                  </AnimatePresence>
                ))}
              </div>

              <motion.div
                className="h-px w-full mt-5 mb-5 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(16,185,129,0.4), rgba(99,102,241,0.4), transparent)",
                }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 1.5,
                }}
              />

              {/* Submit button with magnetic effect */}
              <motion.button
                data-ocid="review.submit_button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow:
                    "0 0 50px rgba(99,102,241,0.6), 0 8px 40px rgba(99,102,241,0.35)",
                  y: -2,
                }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={submitted}
                className="w-full py-4 rounded-2xl font-black text-base text-white relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)",
                  boxShadow: "0 4px 30px rgba(99,102,241,0.4)",
                }}
              >
                <motion.span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                  }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 2,
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
                      Submitting...
                    </motion.span>
                  ) : (
                    <>
                      Confirm &amp; Submit Application
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
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
            </div>
          </motion.div>
        </div>

        {/* Security row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-center gap-4 mt-6 flex-wrap"
        >
          {[
            { icon: "🛡️", label: "RBI Compliant" },
            { icon: "🔒", label: "256-bit Encrypted" },
            { icon: "✅", label: "Bureau Verified" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              animate={{
                borderColor: [
                  "rgba(255,255,255,0.08)",
                  "rgba(99,102,241,0.2)",
                  "rgba(255,255,255,0.08)",
                ],
              }}
              transition={{
                duration: 3,
                delay: i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              <span className="text-xs">{item.icon}</span>
              <span
                className="text-[11px] font-semibold tracking-wider"
                style={{ color: "rgba(148,163,184,0.6)" }}
              >
                {item.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
