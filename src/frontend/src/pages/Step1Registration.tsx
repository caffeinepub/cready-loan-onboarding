import {
  CheckCircle2,
  CreditCard,
  Gift,
  Phone,
  Shield,
  Smartphone,
  Star,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../App";
import StepIndicator from "../components/StepIndicator";

const benefits = [
  {
    icon: CreditCard,
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    border: "border-teal-400/20",
    title: "Check Credit Score",
    subtitle: "Get your free CIBIL score instantly",
  },
  {
    icon: Gift,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
    title: "Pre-qualified Offers",
    subtitle: "Personalised loan offers in seconds",
  },
  {
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    title: "Loan Amount Eligibility",
    subtitle: "Know exactly how much you can borrow",
  },
  {
    icon: Smartphone,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    title: "100% Digital Process",
    subtitle: "Apply, approve & disburse — no paperwork",
  },
];

const trustStats = [
  { icon: Users, value: "10L+", label: "Happy Users" },
  { icon: TrendingUp, value: "₹500Cr+", label: "Disbursed" },
  { icon: Star, value: "4.8★", label: "App Rating" },
];

const consentLabels = [
  { id: "consent-tc", text: "I have read and agree to T&C & Privacy" },
  {
    id: "consent-bureau",
    text: "I hereby consent to Cready being appointed as my authorised representative to receive my Credit Information",
  },
  {
    id: "consent-comm",
    text: "I hereby consent to receive loan related communication from Cready or its authorized representatives",
  },
];

function CustomCheckbox({
  id,
  checked,
  onChange,
  "data-ocid": dataOcid,
}: {
  id: string;
  checked: boolean;
  onChange: () => void;
  "data-ocid"?: string;
}) {
  return (
    <span className="relative flex-shrink-0 mt-0.5">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        data-ocid={dataOcid}
        className="sr-only peer"
      />
      <span
        aria-hidden="true"
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
          checked
            ? "border-transparent shadow-sm shadow-indigo-300"
            : "border-slate-300 bg-white hover:border-indigo-300"
        }`}
        style={
          checked
            ? { background: "linear-gradient(135deg, #6366f1, #7c3aed)" }
            : {}
        }
      >
        <AnimatePresence>
          {checked && (
            <motion.svg
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 12 12"
              aria-hidden="true"
            >
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </span>
    </span>
  );
}

export default function Step1Registration() {
  const navigate = useNavigate();
  const { setName, setMobile, setEmploymentType } = useApp();
  const [nameVal, setNameVal] = useState("");
  const [mobileVal, setMobileVal] = useState("");
  const [checks, setChecks] = useState([false, false, false]);
  const [empType, setEmpType] = useState<"salaried" | "self-employed">(
    "salaried",
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setName(nameVal || "Bharat");
    setMobile(mobileVal);
    setEmploymentType(empType);
    navigate("/otp");
  }

  return (
    <div className="min-h-screen flex font-sans overflow-x-hidden bg-white">
      {/* Left Hero Panel */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col justify-between w-[55%] relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #2e1065 100%)",
        }}
      >
        {/* Animated orbs */}
        <div
          className="absolute top-[-80px] left-[-80px] w-[360px] h-[360px] rounded-full opacity-30 blur-[80px] animate-pulse"
          style={{
            background: "radial-gradient(circle, #6366f1, transparent)",
          }}
        />
        <div
          className="absolute bottom-[-60px] right-[-60px] w-[320px] h-[320px] rounded-full opacity-25 blur-[80px] animate-pulse"
          style={{
            background: "radial-gradient(circle, #8b5cf6, transparent)",
            animationDelay: "1.5s",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full opacity-10 blur-[60px]"
          style={{
            background: "radial-gradient(circle, #06b6d4, transparent)",
          }}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <div className="w-4 h-4 rounded-full bg-white" />
            </div>
            <span className="text-white font-black text-2xl tracking-tight">
              Cready
            </span>
          </motion.div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-10 flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <Shield className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-teal-300 text-xs font-semibold tracking-wide">
                INDIA'S MOST TRUSTED LOAN PLATFORM
              </span>
            </div>
            <h2 className="text-white text-4xl xl:text-5xl font-black leading-tight mb-3">
              Smart Loans,
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #818cf8, #c084fc, #38bdf8)",
                }}
              >
                Smarter Decisions
              </span>
            </h2>
            <p className="text-slate-400 text-base mb-10">
              Check eligibility, compare offers & get funded — all in minutes.
            </p>
          </motion.div>

          {/* Benefits */}
          <div className="space-y-4">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.5 + i * 0.12,
                  duration: 0.5,
                  ease: "easeOut",
                }}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
                className={`flex items-center gap-4 p-4 rounded-2xl border ${b.border} ${b.bg} backdrop-blur-sm cursor-default`}
              >
                <div
                  className={`w-10 h-10 rounded-xl ${b.bg} border ${b.border} flex items-center justify-center flex-shrink-0`}
                >
                  <b.icon className={`w-5 h-5 ${b.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-white font-bold text-sm">
                      {b.title}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">{b.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="relative z-10 p-10"
        >
          <div className="flex items-center gap-2 border-t border-white/10 pt-6">
            {trustStats.map((s, i) => (
              <div key={s.label} className="flex-1 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <s.icon className="w-4 h-4 text-indigo-400" />
                  <span className="text-white font-black text-lg">
                    {s.value}
                  </span>
                </div>
                <p className="text-slate-500 text-xs">{s.label}</p>
                {i < trustStats.length - 1 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{
                      right: 0,
                      width: 1,
                      height: 32,
                      background: "rgba(255,255,255,0.1)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Right Form Panel */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 bg-white flex flex-col"
      >
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white" />
            </div>
            <span className="font-black text-lg text-indigo-700">Cready</span>
          </div>
        </div>

        {/* Mobile benefit pills */}
        <div className="lg:hidden px-6 pb-5">
          <div
            className="rounded-2xl p-4 space-y-2"
            style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b)" }}
          >
            <p className="text-white font-bold text-sm mb-3">Why Cready?</p>
            <div className="grid grid-cols-2 gap-2">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className={`flex items-center gap-2 rounded-xl p-2 ${b.bg} border ${b.border}`}
                >
                  <b.icon className={`w-4 h-4 ${b.color} flex-shrink-0`} />
                  <span className="text-white text-xs font-semibold leading-tight">
                    {b.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-8 lg:px-12">
          <div className="w-full max-w-md">
            {/* Step Indicator */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mb-5"
            >
              <StepIndicator currentStep={1} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8"
            >
              <p className="text-indigo-500 text-xs font-bold tracking-widest uppercase mb-2">
                Start your journey
              </p>
              <h1 className="text-3xl font-black text-slate-900 leading-tight">
                Get Started
                <span className="text-indigo-600"> Free</span>
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                No fees • No paperwork • Instant results
              </p>
            </motion.div>

            {/* Employment Type Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="mb-6"
            >
              <p className="text-sm font-bold text-slate-700 mb-2">I am a</p>
              <div className="relative flex bg-slate-100 rounded-2xl p-1">
                {(["salaried", "self-employed"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    data-ocid={`registration.${type.replace("-", "_")}.toggle`}
                    onClick={() => setEmpType(type)}
                    className="relative flex-1 py-3 text-sm font-semibold z-10 transition-colors min-h-[44px] capitalize"
                    style={{ color: empType === type ? "white" : "#64748b" }}
                  >
                    {empType === type && (
                      <motion.div
                        layoutId="empToggleBg"
                        className="absolute inset-0 rounded-xl shadow-md"
                        style={{
                          background:
                            "linear-gradient(135deg, #6366f1, #7c3aed)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">
                      {type === "salaried" ? "🏢 Salaried" : "💼 Self-Employed"}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <label
                  htmlFor="fullname"
                  className="block text-sm font-bold text-slate-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="fullname"
                    type="text"
                    placeholder="Enter your full name"
                    value={nameVal}
                    onChange={(e) => setNameVal(e.target.value)}
                    autoComplete="name"
                    data-ocid="registration.name.input"
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-slate-800 placeholder-slate-400 text-sm min-h-[48px] transition-all"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.4 }}
              >
                <label
                  htmlFor="mobile"
                  className="block text-sm font-bold text-slate-700 mb-2"
                >
                  Mobile Number
                </label>
                <div className="flex">
                  <span className="flex items-center gap-1.5 px-3.5 py-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl text-sm text-slate-600 font-medium">
                    🇮🇳 +91
                  </span>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="mobile"
                      type="tel"
                      inputMode="numeric"
                      placeholder="10-digit mobile number"
                      value={mobileVal}
                      onChange={(e) => setMobileVal(e.target.value)}
                      autoComplete="tel"
                      data-ocid="registration.mobile.input"
                      className="w-full pl-9 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-slate-800 placeholder-slate-400 text-sm min-h-[48px] transition-all"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="space-y-3 bg-slate-50 rounded-2xl p-4 border border-slate-100"
              >
                {consentLabels.map((item, i) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <CustomCheckbox
                      id={item.id}
                      checked={checks[i]}
                      onChange={() =>
                        setChecks((c) =>
                          c.map((v, idx) => (idx === i ? !v : v)),
                        )
                      }
                      data-ocid={`registration.consent.checkbox.${i + 1}`}
                    />
                    <label
                      htmlFor={item.id}
                      className="text-xs text-slate-500 cursor-pointer leading-relaxed"
                    >
                      {item.text}
                    </label>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.4 }}
              >
                <motion.button
                  whileHover={{
                    scale: 1.01,
                    boxShadow: "0 8px 30px rgba(99,102,241,0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  data-ocid="registration.submit.button"
                  className="relative w-full py-4 text-white font-bold rounded-2xl text-base min-h-[52px] overflow-hidden transition-all"
                  style={{
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #4f46e5 100%)",
                  }}
                >
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0 -skew-x-12 opacity-0 hover:opacity-100"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                    }}
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.6, ease: "linear" }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Send OTP →
                  </span>
                </motion.button>
              </motion.div>
            </form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="text-center text-xs text-slate-400 mt-6"
            >
              🔒 Your data is 100% secure & encrypted
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
