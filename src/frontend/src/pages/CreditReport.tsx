import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

function DonutScore({ score }: { score: number }) {
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
          stroke="url(#scoreGrad2)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: dash }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="scoreGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
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

const scoreHistory = [720, 731, 745, 758, 770, 777];
const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const maxS = Math.max(...scoreHistory);

const factors = [
  { label: "Payment History", value: 100, color: "bg-green-500", icon: "✅" },
  {
    label: "Credit Utilization",
    value: 88,
    color: "bg-indigo-500",
    icon: "📊",
  },
  { label: "Credit Age", value: 75, color: "bg-violet-500", icon: "📅" },
  { label: "Credit Inquiries", value: 92, color: "bg-teal-500", icon: "🔍" },
  { label: "Credit Mix", value: 70, color: "bg-orange-400", icon: "🔀" },
];

const bureaus = [
  { name: "Equifax", score: 777, status: "Active", updated: "Mar 25, 2026" },
  { name: "CIBIL", score: 782, status: "Active", updated: "Mar 24, 2026" },
  { name: "Experian", score: 771, status: "Active", updated: "Mar 23, 2026" },
];

export default function CreditReport() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-black text-slate-800">Credit Report</h1>
          <p className="text-slate-500 mt-1">
            Last updated: March 25, 2026 · Next refresh in 28 days
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center"
          >
            <DonutScore score={777} />
            <div className="mt-4 text-center">
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                Excellent Score
              </span>
              <p className="text-slate-500 text-xs mt-2">Top 5% in India</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
              Score History (6 Months)
            </h3>
            <div className="flex items-end gap-3 h-32">
              {scoreHistory.map((s, i) => (
                <div
                  key={months[i]}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-xs font-bold text-indigo-600">{s}</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(s / maxS) * 100}%` }}
                    transition={{ duration: 0.7, delay: i * 0.08 }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-400 min-h-[4px]"
                  />
                  <span className="text-[10px] text-slate-400">
                    {months[i]}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
              Score Factors
            </h3>
            <div className="space-y-4">
              {factors.map((f, i) => (
                <div key={f.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <span>{f.icon}</span>
                      {f.label}
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {f.value}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${f.value}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.07 }}
                      className={`h-full ${f.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
              Bureau Reports
            </h3>
            <div className="space-y-4">
              {bureaus.map((b, i) => (
                <motion.div
                  key={b.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                >
                  <div>
                    <p className="font-bold text-slate-800">{b.name}</p>
                    <p className="text-xs text-slate-400">
                      Updated {b.updated}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-indigo-600">
                      {b.score}
                    </p>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                      {b.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-4 gap-4"
        >
          {[
            { label: "Total Accounts", value: "6", icon: "🏦" },
            { label: "Active Loans", value: "2", icon: "📋" },
            { label: "Credit Cards", value: "2", icon: "💳" },
            { label: "On-Time Payments", value: "100%", icon: "✅" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.07 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center"
            >
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className="text-2xl font-black text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
