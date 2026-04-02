import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../components/StepIndicator";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

function ShieldIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="w-8 h-8"
      stroke="currentColor"
    >
      <path
        d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-indigo-600"
      />
      <path
        d="M9 12l2 2 4-4"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-indigo-600"
      />
    </svg>
  );
}

export default function StepPANInput() {
  const navigate = useNavigate();
  const [pan, setPan] = useState("");
  const [touched, setTouched] = useState(false);

  const formatted = pan
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);
  const isValid = PAN_REGEX.test(formatted);
  const showError = touched && formatted.length > 0 && !isValid;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 10);
    setPan(val);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    navigate("/analyzing");
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background orbs */}
      <div
        className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full blur-[100px] opacity-15 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)",
        }}
      />

      {/* Step indicator */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <StepIndicator currentStep={2} />
      </div>

      {/* Back button */}
      <motion.button
        type="button"
        data-ocid="pan_input.back_button"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => navigate("/otp")}
        className="absolute top-6 left-6 z-20 flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            d="M19 12H5M12 5l-7 7 7 7"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </motion.button>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 max-w-md w-full mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 300,
                damping: 18,
              }}
              className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4"
            >
              <ShieldIcon />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-black text-slate-800 mb-2"
            >
              Enter Your PAN
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-slate-500 text-sm leading-relaxed"
            >
              Please enter your 10-digit PAN number to continue with your loan
              application.
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <label
                htmlFor="pan-input"
                className="block text-xs font-bold tracking-widest text-slate-400 uppercase mb-2"
              >
                PAN Number
              </label>
              <div className="relative">
                <input
                  id="pan-input"
                  data-ocid="pan_input.input"
                  type="text"
                  value={formatted}
                  onChange={handleChange}
                  onBlur={() => setTouched(true)}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  autoComplete="off"
                  spellCheck={false}
                  className={`w-full text-center text-xl font-black tracking-[0.3em] uppercase rounded-2xl border-2 px-4 py-4 outline-none transition-all duration-200 bg-slate-50 focus:bg-white ${
                    isValid
                      ? "border-emerald-400 focus:border-emerald-500 text-emerald-700"
                      : showError
                        ? "border-red-400 focus:border-red-500 text-red-700"
                        : "border-slate-200 focus:border-indigo-400 text-slate-800"
                  }`}
                />
                {/* Validation indicator */}
                {formatted.length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {isValid ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          className="w-3.5 h-3.5 text-emerald-600"
                        >
                          <path
                            d="M5 13l4 4L19 7"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    ) : showError ? (
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          className="w-3.5 h-3.5 text-red-500"
                        >
                          <path
                            d="M6 18L18 6M6 6l12 12"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </div>

              {/* Character count & validation message */}
              <div className="mt-2 flex items-center justify-between">
                {showError ? (
                  <motion.p
                    data-ocid="pan_input.error_state"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 font-medium"
                  >
                    Invalid PAN format. Use AAAAA0000A pattern.
                  </motion.p>
                ) : isValid ? (
                  <motion.p
                    data-ocid="pan_input.success_state"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-emerald-600 font-medium"
                  >
                    ✓ PAN format looks correct
                  </motion.p>
                ) : (
                  <p className="text-xs text-slate-400">
                    Format: 5 letters + 4 digits + 1 letter
                  </p>
                )}
                <span className="text-xs text-slate-300 font-mono tabular-nums">
                  {formatted.length}/10
                </span>
              </div>
            </motion.div>

            {/* Info note */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-6 flex items-start gap-3"
            >
              <span className="text-blue-400 text-sm mt-0.5">ℹ️</span>
              <p className="text-xs text-blue-600 leading-relaxed">
                Your PAN is used for identity verification and credit
                assessment. It is encrypted and stored securely.
              </p>
            </motion.div>

            {/* Continue button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                type="submit"
                data-ocid="pan_input.submit_button"
                disabled={!isValid}
                whileHover={isValid ? { scale: 1.01 } : {}}
                whileTap={isValid ? { scale: 0.98 } : {}}
                className={`relative w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all duration-300 overflow-hidden ${
                  isValid
                    ? "text-white cursor-pointer"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
                style={
                  isValid
                    ? {
                        background:
                          "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #4F46E5 100%)",
                        backgroundSize: "200% 200%",
                        boxShadow:
                          "0 8px 32px rgba(79,70,229,0.35), 0 2px 8px rgba(79,70,229,0.2)",
                      }
                    : undefined
                }
              >
                {isValid && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 1.5,
                    }}
                  />
                )}
                <span className="relative z-10">Continue →</span>
              </motion.button>
            </motion.div>
          </form>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-xs text-slate-400 mt-4"
          >
            🔒 256-bit encrypted · RBI compliant
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
