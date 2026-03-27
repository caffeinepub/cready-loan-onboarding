import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen flex font-sans">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-teal-900 via-indigo-900 to-purple-950 p-10 relative overflow-hidden"
      >
        <div className="absolute top-20 right-10 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            cready
          </span>
        </div>
        <div className="relative z-10">
          <div className="w-2 h-2 rounded-full border-2 border-white mb-8" />
          <h2 className="text-white text-5xl font-black leading-tight mb-4">
            Our Goa trip didn't just happen.
          </h2>
          <p className="text-green-400 text-lg italic">
            "it was earned and funded with love"
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 bg-white flex flex-col"
      >
        <div className="h-1 bg-gray-100">
          <motion.div
            initial={{ width: "25%" }}
            animate={{ width: "50%" }}
            className="h-full bg-gradient-to-r from-indigo-500 to-green-400"
          />
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <p className="text-gray-400 text-sm mb-1">
              Instant Personal Loans Available in
            </p>
            <h1 className="text-3xl font-black text-indigo-600 mb-1">
              Please verify your number
            </h1>
            <p className="text-gray-500 mb-8">Check your SMS for OTP Number</p>
            <p className="text-sm font-semibold text-gray-700 mb-4">
              Enter 4-digit OTP
            </p>

            <div className="flex gap-3 mb-4">
              {([0, 1, 2, 3] as const).map((i) => (
                <motion.input
                  key={`digit-position-${i}`}
                  ref={refs[i]}
                  whileFocus={{
                    scale: 1.05,
                    boxShadow: "0 0 0 3px rgba(99,102,241,0.3)",
                  }}
                  type="tel"
                  maxLength={1}
                  value={digits[i]}
                  onChange={(e) => handleDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-16 h-16 text-center text-2xl font-bold bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-400 text-gray-800"
                />
              ))}
            </div>

            <p className="text-sm text-gray-500 mb-8">
              Didn't receive code?{" "}
              {timer > 0 ? (
                <span className="text-gray-400">Resend in {timer}s</span>
              ) : (
                <span className="text-indigo-500 cursor-pointer font-semibold">
                  Resend
                </span>
              )}
            </p>

            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/analyzing")}
              className="w-full py-4 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors"
            >
              Verify &amp; Login
            </motion.button>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
              <svg
                aria-hidden="true"
                className="w-4 h-4 text-green-500"
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
              SECURE 256-BIT VERIFICATION
            </div>
          </div>
        </div>
      </motion.div>

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          className="fixed bottom-6 left-1/2 bg-white shadow-xl rounded-2xl px-5 py-3 border border-slate-100 z-50"
        >
          <p className="font-semibold text-sm text-gray-800">Success</p>
          <p className="text-xs text-gray-500">Sending OTP...</p>
        </motion.div>
      )}
    </div>
  );
}
