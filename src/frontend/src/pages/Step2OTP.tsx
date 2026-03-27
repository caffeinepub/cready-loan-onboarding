import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const benefits = [
  {
    icon: "💳",
    title: "Check Credit Score",
    subtitle: "Get your free CIBIL score instantly",
    color: "from-teal-500 to-cyan-400",
    delay: 0.1,
  },
  {
    icon: "🎁",
    title: "Pre-qualified Offers",
    subtitle: "Loans matched to your profile",
    color: "from-violet-500 to-purple-400",
    delay: 0.22,
  },
  {
    icon: "📈",
    title: "Loan Amount Eligibility",
    subtitle: "Know exactly how much you can borrow",
    color: "from-emerald-500 to-green-400",
    delay: 0.34,
  },
  {
    icon: "📱",
    title: "100% Digital Process",
    subtitle: "Zero paperwork, instant approval",
    color: "from-orange-500 to-amber-400",
    delay: 0.46,
  },
];

const stats = [
  { value: "10L+", label: "Users" },
  { value: "₹500Cr+", label: "Disbursed" },
  { value: "4.8★", label: "Rating" },
];

export default function Step2OTP() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(25);
  const [toast, setToast] = useState(true);
  const r0 = useRef<HTMLInputElement>(null);
  const r1 = useRef<HTMLInputElement>(null);
  const r2 = useRef<HTMLInputElement>(null);
  const r3 = useRef<HTMLInputElement>(null);
  const refs = [r0, r1, r2, r3];

  useEffect(() => {
    const t = setInterval(() => setTimer((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(t);
  }, []);

  function handleDigit(i: number, val: string) {
    const v = val.replace(/\D/, "").slice(-1);
    const next = digits.map((d, idx) => (idx === i ? v : d));
    setDigits(next);
    if (v && i < 3) refs[i + 1].current?.focus();
    if (next.every((d) => d !== ""))
      setTimeout(() => navigate("/analyzing"), 300);
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[i] && i > 0)
      refs[i - 1].current?.focus();
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans">
      {/* ── LEFT PANEL (desktop) ──────────────────────────────── */}
      <motion.aside
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-[55%] relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e1b4b 45%, #2e1065 100%)",
        }}
      >
        {/* Animated orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0.4, 0.25] }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full bg-indigo-600/30 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-[-100px] left-[-60px] w-[360px] h-[360px] rounded-full bg-violet-600/30 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.22, 1], opacity: [0.15, 0.28, 0.15] }}
            transition={{
              duration: 7,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-[40%] left-[30%] w-[280px] h-[280px] rounded-full bg-teal-500/20 blur-3xl"
          />
          {/* Dot-grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative z-10 p-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg">
              <div className="w-4 h-4 rounded-full bg-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              cready
            </span>
          </div>
        </div>

        {/* Centre content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 pb-4">
          {/* Trust chip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-widest text-teal-300 uppercase">
              India's Most Trusted Loan Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl xl:text-5xl font-black text-white leading-tight mb-3"
          >
            Smart Loans,{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg, #2dd4bf, #818cf8)",
              }}
            >
              Smarter Decisions
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-300 text-base mb-10 max-w-sm"
          >
            Verify your number to access your personalised offers
          </motion.p>

          {/* Benefit cards */}
          <div className="flex flex-col gap-3 max-w-sm">
            {benefits.map((b) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: b.delay, duration: 0.4 }}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/8 border border-white/10 backdrop-blur-sm cursor-default"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center text-xl shrink-0 shadow-md`}
                >
                  {b.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">
                    {b.title}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">{b.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="relative z-10 px-10 pb-10">
          <div className="flex items-center gap-6 pt-6 border-t border-white/10">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-white font-black text-lg leading-none">
                  {s.value}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.aside>

      {/* ── MOBILE BANNER (compact top strip) ────────────────── */}
      <div
        className="lg:hidden relative overflow-hidden px-5 pt-5 pb-4"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #2e1065 100%)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
          <span className="text-white font-bold text-base tracking-tight">
            cready
          </span>
          <span className="ml-auto text-xs text-teal-300 border border-teal-500/40 rounded-full px-2 py-0.5">
            India's #1 Loan Platform
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 border border-white/10"
            >
              <span className="text-base">{b.icon}</span>
              <span className="text-white text-xs font-medium leading-tight">
                {b.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ──────────────────────────────────────── */}
      <motion.main
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 bg-white flex flex-col items-center justify-center p-6 lg:p-12"
      >
        <div className="w-full max-w-md">
          {/* Mobile-only logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white" />
            </div>
            <span className="font-bold text-indigo-700 text-base">cready</span>
          </div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-black text-slate-800 mb-1">
              Verify Your Number
            </h1>
            <p className="text-slate-500 text-sm mb-8">
              OTP sent to your registered mobile
            </p>
          </motion.div>

          {/* OTP inputs */}
          <p className="text-sm font-semibold text-slate-700 mb-4">
            Enter 4-digit OTP
          </p>
          <div className="flex gap-3 mb-4" data-ocid="otp.input">
            {([0, 1, 2, 3] as const).map((i) => (
              <motion.input
                key={`digit-position-${i}`}
                ref={refs[i]}
                whileFocus={{
                  scale: 1.06,
                  boxShadow: "0 0 0 3px rgba(99,102,241,0.25)",
                }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digits[i]}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-16 h-16 text-center text-2xl font-bold bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-400 text-slate-800 transition-colors"
              />
            ))}
          </div>

          {/* Resend */}
          <p className="text-sm text-slate-500 mb-8">
            Didn't receive code?{" "}
            {timer > 0 ? (
              <span className="text-slate-400">
                Resend in{" "}
                <span className="font-semibold text-indigo-500">{timer}s</span>
              </span>
            ) : (
              <span className="text-indigo-600 cursor-pointer font-semibold hover:underline">
                Resend
              </span>
            )}
          </p>

          {/* CTA */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/analyzing")}
            data-ocid="otp.submit_button"
            className="relative w-full py-4 rounded-xl font-bold text-white text-base overflow-hidden group shadow-lg shadow-indigo-200"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)",
            }}
          >
            {/* Shimmer */}
            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            Verify &amp; Login
          </motion.button>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-2 mt-5 text-xs text-slate-400">
            <svg
              aria-hidden="true"
              className="w-4 h-4 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinejoin="round"
              />
            </svg>
            <span className="tracking-widest font-semibold">
              SECURE 256-BIT VERIFICATION
            </span>
          </div>
        </div>
      </motion.main>

      {/* ── TOAST ────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 10, x: "-50%" }}
            className="fixed bottom-6 left-1/2 bg-white shadow-2xl rounded-2xl px-5 py-3 border border-slate-100 z-50 flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <p className="font-semibold text-sm text-slate-800">OTP Sent!</p>
              <p className="text-xs text-slate-500">Check your SMS inbox</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
