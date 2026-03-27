import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

const recommended = [
  {
    name: "Moneyview",
    color: "text-green-600",
    tags: ["RECOMMENDED", "INSTANT PAPERLESS"],
    chance: 98,
    emi: 15427,
    rate: "0.039%/day",
    disbursal: "Instant",
    features: ["No Hidden Charges", "Flexible Tenure", "Zero Foreclosure Fee"],
  },
  {
    name: "RapidMoney",
    color: "text-green-600",
    tags: ["RECOMMENDED", "FAST APPROVAL"],
    chance: 96,
    emi: 17731,
    rate: "0.1–0.15%/day",
    disbursal: "2 Hours",
    features: ["Minimal Docs", "24/7 Support", "Instant KYC"],
  },
  {
    name: "Zype",
    color: "text-violet-600",
    tags: ["RECOMMENDED", "CREDIT LINE"],
    chance: 97,
    emi: 14900,
    rate: "0.05%/day",
    disbursal: "Same Day",
    features: ["Zero Processing Fee", "Flexible Repayment"],
  },
  {
    name: "KreditBee",
    color: "text-orange-500",
    tags: ["RECOMMENDED", "STUDENT FRIENDLY"],
    chance: 95,
    emi: 13200,
    rate: "0.08%/day",
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
    badge: "HIGHER LOAN",
    barColor: "bg-green-500",
  },
  {
    name: "Aditya Birla",
    chance: 80,
    emi: 16100,
    days: "3 Days",
    badge: "HIGHER LOAN",
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
    barColor: "bg-orange-400",
  },
];

const filters = [
  "All",
  "Instant Disbursal",
  "Paperless",
  "Low Interest",
  "Pre-Approved",
];

export default function MyOffers() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <DashboardLayout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-black text-slate-800">My Offers</h1>
            <span className="bg-indigo-600 text-white text-sm font-bold px-4 py-1.5 rounded-full">
              {recommended.length + matched.length} Offers Found
            </span>
          </div>
          <p className="text-slate-500">
            Personalised offers matched to your credit profile.
          </p>
        </motion.div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === f
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-4">
          <span className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-sm">
            ⚡
          </span>
          Recommended Offers
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-10">
          {recommended.map((o, i) => (
            <motion.div
              key={o.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{
                y: -3,
                boxShadow: "0 12px 40px rgba(99,102,241,0.12)",
              }}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-xl flex items-center justify-center text-lg mb-2">
                    🏦
                  </div>
                  <h3 className={`text-xl font-black ${o.color}`}>{o.name}</h3>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {o.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] font-bold text-slate-400 tracking-wider bg-slate-50 px-1.5 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-500 font-black text-xl">
                    ↗ {o.chance}%
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase">
                    Approval
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">EMI</p>
                  <p className="text-lg font-black text-slate-800">
                    ₹{o.emi.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Rate</p>
                  <p className="text-sm font-bold text-slate-700">{o.rate}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">
                    Disbursal
                  </p>
                  <p className="text-sm font-bold text-green-500">
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
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-500/20"
              >
                Apply Now →
              </motion.button>
            </motion.div>
          ))}
        </div>

        <h2 className="text-xl font-black text-slate-800 mb-4">
          Matched Offers
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {matched.map((o, i) => (
            <motion.div
              key={o.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                  🏦
                </div>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                  {o.days}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-1">
                {o.name}
              </h3>
              <p className="text-[10px] text-slate-400 uppercase">
                EMI Starts At
              </p>
              <p className="text-xl font-black text-slate-800 mb-2">
                ₹{o.emi.toLocaleString("en-IN")}
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
    </DashboardLayout>
  );
}
