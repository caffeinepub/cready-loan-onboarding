import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface FDCard {
  name: string;
  bank: string;
  fdFrom: string;
  fee: string;
  logo: string;
  color?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  card: FDCard | null;
}

const BANKS = ["SBM Bank", "HDFC Bank", "IDFC FIRST Bank"];
const TENURES = ["6 months", "1 year", "2 years", "3 years"];
const BILLING_CYCLES = [
  "1st of month",
  "10th of month",
  "15th of month",
  "25th of month",
];

export default function FDEligibilityModal({ open, onClose, card }: Props) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  const [fullName, setFullName] = useState("Rahul Sharma");
  const [mobile, setMobile] = useState("98765 43210");
  const [pan, setPan] = useState("ABCPD1234F");
  const [email, setEmail] = useState("rahul.sharma@email.com");

  const [bank, setBank] = useState("");
  const [fdAmount, setFdAmount] = useState("");
  const [tenure, setTenure] = useState("1 year");

  const [billing, setBilling] = useState("1st of month");
  const [creditLimit, setCreditLimit] = useState(80);

  useEffect(() => {
    if (open && card) {
      setStep(0);
      setDir(1);
      setBank(card.bank);
      setFdAmount("");
      setTenure("1 year");
      setBilling("1st of month");
      setCreditLimit(80);
    }
  }, [open, card]);

  const goNext = () => {
    setDir(1);
    setStep((s) => s + 1);
  };
  const goBack = () => {
    setDir(-1);
    setStep((s) => s - 1);
  };

  if (!open || !card) return null;

  const gradientClass = card.color || "from-indigo-500 to-purple-600";
  const steps = ["Personal", "FD Details", "Preferences", "Done"];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  const inputCls =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50";
  const labelCls = "block text-xs font-semibold text-gray-500 mb-1";

  const fdMin = card.fdFrom
    ? Number.parseInt(card.fdFrom.replace(/[^0-9]/g, ""), 10) || 5000
    : 5000;
  const parsedAmt =
    Number.parseInt(fdAmount.replace(/[^0-9]/g, ""), 10) || fdMin;
  const limitAmt = Math.round((parsedAmt * creditLimit) / 100);

  return (
    <dialog
      open
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent w-full h-full max-w-none max-h-none m-0 p-0"
      data-ocid="fd_eligibility.modal"
      aria-label="FD Credit Card Eligibility Application"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden mx-auto my-auto"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Card header */}
        <div
          className={`bg-gradient-to-r ${gradientClass} px-6 py-5 relative overflow-hidden`}
        >
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-2 w-16 h-16 rounded-full bg-white/10" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{card.logo}</span>
              <div>
                <p className="text-white font-bold text-base leading-tight">
                  {card.name}
                </p>
                <p className="text-white/70 text-xs">
                  {card.bank} · FD from {card.fdFrom}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              data-ocid="fd_eligibility.close_button"
              className="text-white/70 hover:text-white transition-colors text-xl leading-none"
            >
              ✕
            </button>
          </div>
          <div className="relative flex items-center gap-2 mt-5">
            {steps.map((s, idx) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                    idx < step
                      ? "bg-white text-indigo-600"
                      : idx === step
                        ? "bg-white/30 text-white ring-2 ring-white"
                        : "bg-white/10 text-white/40"
                  }`}
                >
                  {idx < step ? "✓" : idx + 1}
                </div>
                <span
                  className={`text-[10px] font-semibold hidden sm:block ${idx === step ? "text-white" : "text-white/40"}`}
                >
                  {s}
                </span>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 w-6 rounded-full mx-1 ${idx < step ? "bg-white" : "bg-white/20"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-5 min-h-[260px] overflow-hidden relative">
          <AnimatePresence custom={dir} mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <h3 className="text-base font-bold text-gray-900 mb-4">
                  Personal Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fd-name" className={labelCls}>
                      Full Name
                    </label>
                    <input
                      id="fd-name"
                      className={inputCls}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      data-ocid="fd_eligibility.name_input"
                    />
                  </div>
                  <div>
                    <label htmlFor="fd-mobile" className={labelCls}>
                      Mobile Number
                    </label>
                    <input
                      id="fd-mobile"
                      className={inputCls}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      data-ocid="fd_eligibility.mobile_input"
                    />
                  </div>
                  <div>
                    <label htmlFor="fd-pan" className={labelCls}>
                      PAN Number
                    </label>
                    <input
                      id="fd-pan"
                      className={inputCls}
                      value={pan}
                      onChange={(e) => setPan(e.target.value)}
                      data-ocid="fd_eligibility.pan_input"
                    />
                  </div>
                  <div>
                    <label htmlFor="fd-email" className={labelCls}>
                      Email Address
                    </label>
                    <input
                      id="fd-email"
                      className={inputCls}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      data-ocid="fd_eligibility.email_input"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <h3 className="text-base font-bold text-gray-900 mb-4">
                  FD Details
                </h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="fd-bank" className={labelCls}>
                      FD Bank
                    </label>
                    <select
                      id="fd-bank"
                      className={inputCls}
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      data-ocid="fd_eligibility.bank_select"
                    >
                      {BANKS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="fd-amount" className={labelCls}>
                      FD Amount (min {card.fdFrom})
                    </label>
                    <input
                      id="fd-amount"
                      className={inputCls}
                      placeholder={`e.g. ${card.fdFrom}`}
                      value={fdAmount}
                      onChange={(e) => setFdAmount(e.target.value)}
                      data-ocid="fd_eligibility.fd_amount_input"
                    />
                  </div>
                  <div>
                    <label htmlFor="fd-tenure" className={labelCls}>
                      FD Tenure
                    </label>
                    <select
                      id="fd-tenure"
                      className={inputCls}
                      value={tenure}
                      onChange={(e) => setTenure(e.target.value)}
                      data-ocid="fd_eligibility.tenure_select"
                    >
                      {TENURES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <h3 className="text-base font-bold text-gray-900 mb-4">
                  Card Preferences
                </h3>
                <div className="flex flex-col gap-5">
                  <div>
                    <p className={labelCls}>Selected Card</p>
                    <div
                      className={`bg-gradient-to-r ${gradientClass} rounded-xl px-4 py-3 flex items-center gap-3`}
                    >
                      <span className="text-2xl">{card.logo}</span>
                      <div>
                        <p className="text-white font-bold text-sm">
                          {card.name}
                        </p>
                        <p className="text-white/70 text-xs">
                          Annual fee: {card.fee}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="fd-credit-limit" className={labelCls}>
                      Desired Credit Limit:{" "}
                      <span className="text-indigo-600 font-bold">
                        ₹{limitAmt.toLocaleString("en-IN")}
                      </span>
                      <span className="text-gray-400 ml-1">
                        ({creditLimit}% of FD)
                      </span>
                    </label>
                    <input
                      id="fd-credit-limit"
                      type="range"
                      min={75}
                      max={90}
                      value={creditLimit}
                      onChange={(e) => setCreditLimit(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                      data-ocid="fd_eligibility.credit_limit_input"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>75%</span>
                      <span>90%</span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="fd-billing" className={labelCls}>
                      Billing Cycle
                    </label>
                    <select
                      id="fd-billing"
                      className={inputCls}
                      value={billing}
                      onChange={(e) => setBilling(e.target.value)}
                      data-ocid="fd_eligibility.billing_select"
                    >
                      {BILLING_CYCLES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="flex flex-col items-center text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4"
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    aria-hidden="true"
                  >
                    <motion.path
                      d="M10 20 L17 27 L30 13"
                      stroke="#16a34a"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Application Submitted!
                </h3>
                <p className="text-sm text-gray-500 mb-5 max-w-xs">
                  We'll review your FD details and reach out within 24 hours.
                </p>
                <div
                  className={`bg-gradient-to-r ${gradientClass} rounded-xl px-5 py-3 flex items-center gap-3 text-left`}
                >
                  <span className="text-2xl">{card.logo}</span>
                  <div>
                    <p className="text-white font-bold text-sm">{card.name}</p>
                    <p className="text-white/70 text-xs">{card.bank}</p>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mt-4">
                  Reference: FD{Date.now().toString().slice(-8)}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-6 pb-5 flex items-center justify-between gap-3">
          {step > 0 && step < 3 ? (
            <button
              type="button"
              onClick={goBack}
              data-ocid="fd_eligibility.cancel_button"
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 2 && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={goNext}
              data-ocid="fd_eligibility.primary_button"
              className="ml-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors"
            >
              Next →
            </motion.button>
          )}

          {step === 2 && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={goNext}
              data-ocid="fd_eligibility.submit_button"
              className="ml-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors"
            >
              Submit Application
            </motion.button>
          )}

          {step === 3 && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              data-ocid="fd_eligibility.confirm_button"
              className="ml-auto px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-colors"
            >
              Done ✓
            </motion.button>
          )}
        </div>
      </motion.div>
    </dialog>
  );
}
