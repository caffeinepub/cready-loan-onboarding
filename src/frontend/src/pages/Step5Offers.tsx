import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const recommended = [
  {
    name: "Moneyview",
    color: "text-green-600",
    tags: ["RECOMMENDED", "INSTANT PAPERLESS DISBURSAL"],
    chance: 98,
    emi: 15427,
    rate: "0.039%* per day",
    disbursal: "Instant",
    features: ["No Hidden Charges", "Flexible Tenure"],
  },
  {
    name: "RapidMoney",
    color: "text-green-600",
    tags: ["RECOMMENDED", "FAST APPROVAL"],
    chance: 96,
    emi: 17731,
    rate: "0.1 to 0.15% per day",
    disbursal: "2 Hours",
    features: ["Minimal Docs", "24/7 Support"],
  },
  {
    name: "Zype",
    color: "text-violet-600",
    tags: ["RECOMMENDED", "CREDIT LINE"],
    chance: 97,
    emi: 14900,
    rate: "0.05%* per day",
    disbursal: "Same Day",
    features: ["Zero Processing Fee", "Flexible Repayment"],
  },
  {
    name: "KreditBee",
    color: "text-orange-500",
    tags: ["RECOMMENDED", "STUDENT FRIENDLY"],
    chance: 95,
    emi: 13200,
    rate: "0.08% per day",
    disbursal: "4 Hours",
    features: ["Quick Approval", "Easy EMI"],
  },
];

const matched = [
  {
    name: "Olyv",
    chance: 85,
    emi: 14200,
    days: "1 Day",
    badge: "MATCHED",
    barColor: "bg-green-500",
  },
  {
    name: "Poonawalla",
    chance: 82,
    emi: 13800,
    days: "2 Days",
    badge: "HIGHER LOAN AMOUNT",
    barColor: "bg-green-500",
  },
  {
    name: "Aditya Birla",
    chance: 80,
    emi: 16100,
    days: "3 Days",
    badge: "HIGHER LOAN AMOUNT",
    barColor: "bg-yellow-400",
  },
  {
    name: "SMFG",
    chance: 78,
    emi: 15500,
    days: "Instant",
    badge: "INSTANT DISBURSAL",
    barColor: "bg-yellow-400",
  },
  {
    name: "Credit+",
    chance: 75,
    emi: 12900,
    days: "1 Day",
    badge: "MATCHED",
    barColor: "bg-yellow-400",
  },
  {
    name: "LendingPlate",
    chance: 70,
    emi: 11500,
    days: "2 Days",
    badge: "MATCHED",
    barColor: "bg-yellow-400",
  },
];

const filters = [
  "Instant Disbursal",
  "Paperless",
  "Low Interest",
  "Pre-Approved",
];

export default function Step5Offers() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-50 font-sans"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="text-slate-400 hover:text-slate-600"
        >
          ←
        </button>
        <button
          type="button"
          className="flex items-center gap-1 border border-slate-200 rounded-full px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 font-medium"
        >
          <svg
            aria-hidden="true"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M3 6h18M7 12h10M11 18h2"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
          All Filters
        </button>
        {filters.map((f) => (
          <button
            type="button"
            key={f}
            className="border border-slate-200 rounded-full px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            {f}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-sm text-slate-500">
          SORT BY:
          <select className="border border-slate-200 rounded-lg px-2 py-1 text-sm text-slate-700 bg-white">
            <option>Approval Chances</option>
            <option>Lowest EMI</option>
            <option>Fastest Disbursal</option>
          </select>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Recommended */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              ⚡
            </span>
            Recommended Offers
          </h2>
          <span className="text-slate-400 text-sm">
            {recommended.length} Offers Found
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-10">
          {recommended.map((o, i) => (
            <motion.div
              key={o.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm">
                      🏦
                    </div>
                  </div>
                  <h3 className={`text-xl font-black ${o.color}`}>{o.name}</h3>
                  <div className="flex gap-1 mt-1">
                    {o.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] font-bold text-slate-400 tracking-wider"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-500 font-black text-lg">
                    ↗ {o.chance}% Chance
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase">
                    Approval Probability
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">
                    Expected EMI
                  </p>
                  <p className="text-xl font-black text-slate-800">
                    ₹{o.emi.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">
                    Interest Rate
                  </p>
                  <p className="text-sm font-bold text-slate-700">{o.rate}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">
                    Disbursal
                  </p>
                  <p className="text-sm font-bold text-green-500 flex items-center gap-1">
                    ⏱ {o.disbursal}
                  </p>
                </div>
              </div>
              <div className="space-y-1 mb-4">
                {o.features.map((f) => (
                  <p
                    key={f}
                    className="text-xs text-slate-500 flex items-center gap-1"
                  >
                    <span className="text-green-500">✓</span>
                    {f}
                  </p>
                ))}
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/review")}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-colors"
              >
                Apply Now →
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Matched */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
            <svg
              aria-hidden="true"
              className="w-4 h-4 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                strokeWidth={2}
              />
              <path
                d="M21 21l-4.35-4.35"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800">Matched Offers</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {matched.map((o, i) => (
            <motion.div
              key={o.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-sm">
                  🏦
                </div>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                  {o.days}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-2">
                {o.name}
              </h3>
              <p className="text-[10px] text-slate-400 uppercase">
                EMI Starts At
              </p>
              <p className="text-xl font-black text-slate-800 mb-2">
                ₹{o.emi.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] text-slate-400 uppercase mb-1">
                Approval Chance
              </p>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${o.chance}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`h-full ${o.barColor} rounded-full`}
                  />
                </div>
                <span
                  className={`text-xs font-bold ${o.chance >= 82 ? "text-green-500" : "text-yellow-500"}`}
                >
                  {o.chance}%
                </span>
              </div>
              <span className="text-[10px] border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                {o.badge}
              </span>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/review")}
                className="w-full mt-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-sm border border-slate-200 transition-colors"
              >
                Apply Now →
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
