import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../App";
import DashboardLayout from "../components/DashboardLayout";

function CreditScoreDonut({ score }: { score: number }) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const pct = score / 900;
  const [dash, setDash] = useState(circ);
  useEffect(() => {
    setTimeout(() => setDash(circ * (1 - pct)), 300);
  }, [circ, pct]);

  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      <svg
        aria-hidden="true"
        width="192"
        height="192"
        viewBox="0 0 192 192"
        className="-rotate-90"
      >
        <circle
          cx="96"
          cy="96"
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="14"
        />
        <motion.circle
          cx="96"
          cy="96"
          r={r}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: dash }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6d28d9" />
            <stop offset="100%" stopColor="#2ee6a6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-4xl font-black text-slate-800">{score}</div>
        <div className="text-[9px] text-slate-400 tracking-widest uppercase">
          Equifax Score
        </div>
      </div>
    </div>
  );
}

export default function Step4Dashboard() {
  const navigate = useNavigate();
  const { name } = useApp();
  const [loanAmt, setLoanAmt] = useState(211000);
  const [tenure, setTenure] = useState(15);
  const [toast, setToast] = useState(true);
  const emi = Math.round(((loanAmt * 0.075) / tenure) * 10) / 10;
  const total = Math.round(emi * tenure);

  useEffect(() => {
    const t = setTimeout(() => setToast(false), 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <DashboardLayout>
      <div className="p-8 overflow-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800">
              Welcome back,{" "}
              <span className="text-indigo-500">{name || "Bharat"}!</span>
            </h1>
            <p className="text-slate-500 mt-1">
              Your personalized loan offers are ready.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                stroke="currentColor"
                strokeWidth={2}
              />
            </svg>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                Profile Status
              </p>
              <p className="text-sm font-bold text-slate-700">92% Verified</p>
            </div>
          </div>
        </div>

        {/* Credit score + Smart Insights */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-6">
            <CreditScoreDonut score={777} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-slate-800">
                  You're in the top 5%
                </h3>
                <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                  Excellent Score
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-4">
                Your credit health is exceptional. You qualify for the lowest
                interest rates in the market.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase">
                    Utilization
                  </p>
                  <p className="text-2xl font-black text-slate-800">12%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase">
                    On-Time Pay
                  </p>
                  <p className="text-2xl font-black text-green-500">100%</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/credit-report")}
                className="text-indigo-500 text-sm mt-3 hover:underline"
              >
                How to improve further? ↗
              </button>
            </div>
          </div>
          <div className="bg-[#0f172a] rounded-2xl p-5 text-white flex flex-col justify-between">
            <div className="w-9 h-9 bg-slate-700 rounded-xl flex items-center justify-center mb-3">
              ✨
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">Smart Insights</h3>
              <p className="text-slate-400 text-xs mb-4">
                Based on your profile, we recommend a tenure of 18 months to
                balance EMI and interest.
              </p>
              <p className="text-xs text-slate-400 mb-1">
                Eligibility Probability
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "98%" }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-400 rounded-full"
                  />
                </div>
                <span className="text-xs font-bold text-indigo-300">98%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loan calculator */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
              Loan Amount
            </p>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl font-black text-slate-800">
                ₹ {loanAmt.toLocaleString("en-IN")}
              </span>
              <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-lg">
                Max: ₹10L
              </span>
            </div>
            <input
              type="range"
              min={50000}
              max={1000000}
              step={5000}
              value={loanAmt}
              onChange={(e) => setLoanAmt(+e.target.value)}
              className="w-full accent-indigo-500 mb-5"
            />
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
              Tenure (Months)
            </p>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-black text-slate-800">
                {tenure} Months
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={60}
              step={1}
              value={tenure}
              onChange={(e) => setTenure(+e.target.value)}
              className="w-full accent-indigo-500"
            />
          </div>
          <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-slate-400">🧮</span>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                EMI Calculator
              </p>
            </div>
            <p className="text-xs text-slate-400 uppercase mb-1">
              Estimated EMI
            </p>
            <p className="text-3xl font-black text-slate-800 mb-4">
              ₹ {emi.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-slate-400 uppercase mb-1">
              Interest Rate
            </p>
            <p className="text-lg font-bold text-slate-700 mb-3">7.5% p.a.</p>
            <p className="text-xs text-slate-400 uppercase mb-1">
              Total Repayment
            </p>
            <p className="text-lg font-bold text-slate-700">
              ₹ {total.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/offers")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl text-base shadow-lg shadow-indigo-500/30 transition-colors"
        >
          View My Offers →
        </motion.button>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="fixed bottom-8 right-8 bg-white shadow-2xl rounded-2xl px-5 py-3 z-50 min-w-[220px] border border-slate-100"
          >
            <p className="font-semibold text-sm text-gray-800">
              Analysis Complete
            </p>
            <p className="text-xs text-gray-500">
              We've found a great offer for you!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
