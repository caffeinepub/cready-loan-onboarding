import { AnimatePresence, motion } from "motion/react";
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

const recommendedOffers = [
  {
    bank: "HDFC Bank",
    type: "Personal Loan",
    amount: "₹8,00,000",
    rate: "10.5% p.a.",
    processing: "1%",
    approval: 96,
    badge: "Instant Approval",
    badgeColor: "bg-green-400 text-green-900",
    gradient: "from-violet-500 to-purple-700",
    icon: "🏛️",
  },
  {
    bank: "ICICI Bank",
    type: "Personal Loan",
    amount: "₹6,50,000",
    rate: "11.0% p.a.",
    processing: "0.5%",
    approval: 91,
    badge: "Best Rate",
    badgeColor: "bg-sky-300 text-sky-900",
    gradient: "from-teal-500 to-emerald-700",
    icon: "🏦",
  },
  {
    bank: "Axis Bank",
    type: "Personal Loan",
    amount: "₹5,00,000",
    rate: "12.0% p.a.",
    processing: "1.5%",
    approval: 88,
    badge: "Fast Disbursal",
    badgeColor: "bg-yellow-300 text-yellow-900",
    gradient: "from-orange-500 to-rose-600",
    icon: "⚡",
  },
  {
    bank: "Bajaj Finserv",
    type: "Personal Loan",
    amount: "₹10,00,000",
    rate: "13.0% p.a.",
    processing: "2%",
    approval: 85,
    badge: "High Amount",
    badgeColor: "bg-orange-300 text-orange-900",
    gradient: "from-blue-500 to-indigo-700",
    icon: "💼",
  },
];

const fdCards = [
  {
    name: "SBM ZET Credit Card",
    fd: "FD from ₹2,000",
    fee: "Lifetime Free",
    gradient: "from-purple-600 to-violet-800",
    logo: "🏦",
  },
  {
    name: "Tata Neu HDFC Secured",
    fd: "FD from ₹15,000",
    fee: "1st Year Free",
    gradient: "from-blue-600 to-cyan-700",
    logo: "💳",
  },
  {
    name: "IDFC FIRST Earn Card",
    fd: "FD from ₹5,000",
    fee: "1st Year Free",
    gradient: "from-orange-500 to-rose-600",
    logo: "🎯",
  },
];

export default function Step4Dashboard() {
  const navigate = useNavigate();
  const { name } = useApp();
  const [loanAmt, setLoanAmt] = useState(211000);
  const [tenure, setTenure] = useState(15);
  const [toastVisible, setToastVisible] = useState(true);
  const emi = Math.round(((loanAmt * 0.075) / tenure) * 10) / 10;
  const total = Math.round(emi * tenure);

  useEffect(() => {
    const t = setTimeout(() => setToastVisible(false), 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <DashboardLayout>
      <div className="p-8 overflow-auto">
        {/* Welcome header */}
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

        {/* Recommended Offers */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-800">
                  🔥 Recommended For You
                </h2>
                <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                  4 Offers Matched
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                Based on your credit score 777
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedOffers.map((offer, i) => (
              <motion.div
                key={offer.bank}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 20px 40px -10px rgba(0,0,0,0.25)",
                }}
                className={`bg-gradient-to-br ${offer.gradient} rounded-2xl p-5 text-white relative overflow-hidden cursor-pointer`}
                data-ocid={`dashboard.offer.${i + 1}`}
              >
                {/* Background blob */}
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
                <div className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full bg-white/5" />

                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{offer.icon}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${offer.badgeColor}`}
                    >
                      {offer.badge}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-0.5">
                    {offer.bank}
                  </p>
                  <p className="text-xs text-white/60 mb-3">{offer.type}</p>
                  <p className="text-2xl font-black mb-3">{offer.amount}</p>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-[10px]">
                    <div>
                      <p className="text-white/60">Interest</p>
                      <p className="font-bold">{offer.rate}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Processing</p>
                      <p className="font-bold">{offer.processing}</p>
                    </div>
                  </div>

                  {/* Approval bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-white/70">Approval Chance</span>
                      <span className="font-bold">{offer.approval}%</span>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${offer.approval}%` }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                        className="h-full bg-white rounded-full"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate("/my-offers")}
                    data-ocid={`dashboard.offer_apply.${i + 1}`}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold py-2 rounded-xl border border-white/30 transition-colors"
                  >
                    Apply Now
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Offers button */}
        <div className="flex justify-center mb-8">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/my-offers")}
            data-ocid="dashboard.view_all_offers.button"
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-12 py-4 rounded-2xl text-lg shadow-lg shadow-indigo-500/40 transition-all hover:shadow-xl hover:shadow-indigo-500/50"
          >
            View All 12 Offers →
          </motion.button>
        </div>

        {/* FD-Backed Credit Cards */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                FD-Backed Credit Cards
              </p>
              <p className="text-sm font-bold text-slate-700">
                Build credit with secured credit cards
              </p>
            </div>
            <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">
              Secured
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {fdCards.map((card, i) => (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                whileHover={{ scale: 1.02 }}
                className={`bg-gradient-to-br ${card.gradient} rounded-xl shadow-md p-4 relative overflow-hidden`}
                data-ocid={`dashboard.fd_card.${i + 1}`}
              >
                {/* Decorative blobs */}
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
                <div className="absolute -bottom-6 -left-2 w-14 h-14 rounded-full bg-white/5" />

                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{card.logo}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                      {card.fee}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white mb-1 leading-tight">
                    {card.name}
                  </p>
                  <p className="text-[10px] text-white/70 mb-3">{card.fd}</p>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    data-ocid={`dashboard.fd_card_eligibility.${i + 1}`}
                    className="w-full bg-white text-slate-800 text-xs font-bold py-1.5 rounded-lg hover:bg-white/90 transition-colors"
                  >
                    Check Eligibility
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toastVisible && (
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
