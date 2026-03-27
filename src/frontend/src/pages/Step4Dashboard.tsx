import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../App";
import DashboardLayout from "../components/DashboardLayout";
import FDEligibilityModal from "../components/FDEligibilityModal";

function CreditScoreDonut({ score }: { score: number }) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const pct = score / 900;
  const [dash, setDash] = useState(circ);
  useEffect(() => {
    setTimeout(() => setDash(circ * (1 - pct)), 300);
  }, [circ, pct]);

  return (
    <div className="relative flex items-center justify-center w-full h-auto max-w-[192px] mx-auto">
      <svg aria-hidden="true" viewBox="0 0 192 192" className="-rotate-90">
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
        <div className="text-2xl sm:text-4xl font-black text-slate-800">
          {score}
        </div>
        <div className="text-[9px] text-slate-400 tracking-widest uppercase">
          Equifax Score
        </div>
      </div>
    </div>
  );
}

function VerticalBarChart({
  principal,
  interest,
  emi: _emi,
}: { principal: number; interest: number; emi: number }) {
  const total = principal + interest;
  const principalPct = total > 0 ? (principal / total) * 100 : 60;
  const interestPct = total > 0 ? (interest / total) * 100 : 40;
  const maxBarH = 180;
  const principalH = Math.round((principalPct / 100) * maxBarH);
  const interestH = Math.round((interestPct / 100) * maxBarH);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5">
          <motion.div
            className="w-2 h-2 rounded-full bg-indigo-500"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          />
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
            EMI Breakdown
          </span>
        </div>
      </div>
      <div
        className="flex items-end justify-center gap-6 mb-5"
        style={{ height: maxBarH + 60 }}
      >
        {/* Principal Bar */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            className="text-xs font-black text-indigo-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            ₹{principal.toLocaleString("en-IN")}
          </motion.div>
          <div className="relative flex items-end" style={{ height: maxBarH }}>
            <motion.div
              className="w-16 rounded-t-xl relative overflow-hidden shadow-lg shadow-indigo-200"
              style={{
                background:
                  "linear-gradient(180deg, #6366f1 0%, #4f46e5 50%, #3730a3 100%)",
              }}
              initial={{ height: 0 }}
              animate={{ height: principalH }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            >
              {principalH > 50 && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <span className="text-white text-[10px] font-black">
                    {principalPct.toFixed(0)}%
                  </span>
                </motion.div>
              )}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-64, 64] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2.5,
                  ease: "linear",
                  delay: 1,
                }}
                style={{ width: "200%" }}
              />
            </motion.div>
          </div>
          <span className="text-[11px] font-bold text-slate-600">
            Principal
          </span>
        </div>

        {/* Interest Bar */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            className="text-xs font-black text-amber-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            ₹{interest.toLocaleString("en-IN")}
          </motion.div>
          <div className="relative flex items-end" style={{ height: maxBarH }}>
            <motion.div
              className="w-16 rounded-t-xl relative overflow-hidden shadow-lg shadow-amber-200"
              style={{
                background:
                  "linear-gradient(180deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
              }}
              initial={{ height: 0 }}
              animate={{ height: interestH }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.35 }}
            >
              {interestH > 50 && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <span className="text-white text-[10px] font-black">
                    {interestPct.toFixed(0)}%
                  </span>
                </motion.div>
              )}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-64, 64] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2.5,
                  ease: "linear",
                  delay: 1.3,
                }}
                style={{ width: "200%" }}
              />
            </motion.div>
          </div>
          <span className="text-[11px] font-bold text-slate-600">Interest</span>
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
  const [loanAmt, setLoanAmt] = useState(500000);
  const [tenure, setTenure] = useState(24);
  const [rate, setRate] = useState(10.99);
  const [toastVisible, setToastVisible] = useState(true);
  const [showAmortization, setShowAmortization] = useState(false);
  const [selectedFDCardIdx, setSelectedFDCardIdx] = useState<number | null>(
    null,
  );

  const monthly = rate / 12 / 100;
  const emi =
    monthly > 0
      ? (loanAmt * monthly * (1 + monthly) ** tenure) /
        ((1 + monthly) ** tenure - 1)
      : loanAmt / tenure;
  const totalAmt = emi * tenure;
  const totalInterest = totalAmt - loanAmt;
  // Amortization schedule (year-by-year, up to 5 years)
  const amortization = (() => {
    const rows: {
      year: number;
      opening: number;
      emiPaid: number;
      principalPaid: number;
      interestPaid: number;
      closing: number;
    }[] = [];
    let balance = loanAmt;
    const years = Math.min(5, Math.ceil(tenure / 12));
    for (let y = 1; y <= years; y++) {
      const monthsInYear = Math.min(12, tenure - (y - 1) * 12);
      let principalPaid = 0;
      let interestPaid = 0;
      const opening = balance;
      for (let m = 0; m < monthsInYear; m++) {
        const intForMonth = balance * monthly;
        const principalForMonth = emi - intForMonth;
        interestPaid += intForMonth;
        principalPaid += principalForMonth;
        balance = Math.max(0, balance - principalForMonth);
      }
      rows.push({
        year: y,
        opening: Math.round(opening),
        emiPaid: Math.round(emi * monthsInYear),
        principalPaid: Math.round(principalPaid),
        interestPaid: Math.round(interestPaid),
        closing: Math.round(balance),
      });
    }
    return rows;
  })();

  useEffect(() => {
    const t = setTimeout(() => setToastVisible(false), 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 overflow-auto">
        {/* Welcome header */}
        <div className="flex items-start justify-between flex-wrap gap-2 mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800">
              Hey, {name || "Bharat"} 👋
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
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
                  <p className="text-xl sm:text-2xl font-black text-slate-800">
                    12%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase">
                    On-Time Pay
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-green-500">
                    100%
                  </p>
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
          {/* Mobile swipe carousel */}
          <div className="md:hidden">
            <div
              className="flex gap-4 overflow-x-auto pb-4"
              style={{
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {recommendedOffers.map((offer, i) => (
                <motion.div
                  key={offer.bank}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  whileDrag={{ scale: 0.97, rotate: 1 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  className={`bg-gradient-to-br ${offer.gradient} rounded-2xl p-5 text-white relative overflow-hidden cursor-pointer flex-shrink-0 w-[280px]`}
                  style={{ scrollSnapAlign: "start" }}
                  data-ocid={`dashboard.offer.${i + 1}`}
                >
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
                      onClick={() => navigate("/review")}
                      data-ocid={`dashboard.offer_apply.${i + 1}`}
                      className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold py-2 rounded-xl border border-white/30 transition-colors"
                    >
                      Apply Now
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center gap-1.5 mt-2">
              {recommendedOffers.map((offer) => (
                <div
                  key={offer.bank}
                  className="w-1.5 h-1.5 rounded-full bg-slate-300"
                />
              ))}
            </div>
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedOffers.map((offer, i) => (
              <motion.div
                key={offer.bank}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 20px 40px -10px rgba(0,0,0,0.25)",
                }}
                className={`bg-gradient-to-br ${offer.gradient} rounded-2xl p-5 text-white relative overflow-hidden cursor-pointer`}
                data-ocid={`dashboard.offer.${i + 1}`}
              >
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
                    onClick={() => navigate("/review")}
                    data-ocid={`dashboard.offer_apply.${i + 1}`}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold py-2 rounded-xl border border-white/30 transition-colors min-h-[44px]"
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
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-6 py-3 md:px-12 md:py-4 rounded-2xl text-base md:text-lg shadow-lg shadow-indigo-500/40 transition-all hover:shadow-xl hover:shadow-indigo-500/50 w-full max-w-xs sm:w-auto"
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                    onClick={() => setSelectedFDCardIdx(i)}
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
            className="fixed bottom-20 right-4 md:bottom-8 md:right-8 bg-white shadow-2xl rounded-2xl px-5 py-3 z-50 min-w-[220px] border border-slate-100"
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
      {/* Premium EMI Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6 overflow-hidden"
        data-ocid="dashboard.emi_calculator.card"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-lg">
            🧮
          </div>
          <div>
            <h2 className="text-white font-bold text-base">
              Personal Loan EMI Calculator
            </h2>
            <p className="text-indigo-200 text-xs">
              Instant estimates · Based on IDFC FIRST Bank rates
            </p>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">
            {/* Left: Sliders */}
            <div className="md:col-span-3 space-y-6">
              {/* Loan Amount */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Loan Amount
                  </span>
                  <span className="text-xl font-black text-indigo-600">
                    ₹{loanAmt.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={4000000}
                  step={10000}
                  value={loanAmt}
                  onChange={(e) => setLoanAmt(+e.target.value)}
                  className="w-full accent-indigo-600 h-2 cursor-pointer"
                  data-ocid="dashboard.loan_amount.input"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹50,000</span>
                  <span>₹40,00,000</span>
                </div>
              </div>

              {/* Tenure */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Tenure
                  </span>
                  <span className="text-xl font-black text-indigo-600">
                    {tenure} Months
                  </span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={60}
                  step={1}
                  value={tenure}
                  onChange={(e) => setTenure(+e.target.value)}
                  className="w-full accent-indigo-600 h-2 cursor-pointer"
                  data-ocid="dashboard.tenure.input"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>12 Mo</span>
                  <span>60 Mo</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Interest Rate
                  </span>
                  <span className="text-xl font-black text-indigo-600">
                    {rate.toFixed(2)}% p.a.
                  </span>
                </div>
                <input
                  type="range"
                  min={9.99}
                  max={36}
                  step={0.01}
                  value={rate}
                  onChange={(e) => setRate(+e.target.value)}
                  className="w-full accent-indigo-600 h-2 cursor-pointer"
                  data-ocid="dashboard.interest_rate.input"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>9.99%</span>
                  <span>36%</span>
                </div>
              </div>
            </div>

            {/* Right: Donut + Results */}
            <div className="col-span-2 flex flex-col items-center">
              <VerticalBarChart
                principal={loanAmt}
                interest={Math.round(totalInterest)}
                emi={Math.round(emi)}
              />

              {/* Result rows */}
              <div className="w-full space-y-2.5">
                <div className="bg-indigo-50 rounded-xl px-4 py-2.5">
                  <p className="text-[10px] text-indigo-500 uppercase font-semibold mb-0.5">
                    Monthly EMI
                  </p>
                  <motion.p
                    key={Math.round(emi)}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-black text-indigo-700"
                  >
                    ₹{Math.round(emi).toLocaleString("en-IN")}
                  </motion.p>
                </div>
                <div className="bg-slate-50 rounded-xl px-4 py-2.5 flex justify-between items-center">
                  <span className="text-xs text-slate-500">
                    Principal Amount
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    ₹{loanAmt.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="bg-slate-50 rounded-xl px-4 py-2.5 flex justify-between items-center">
                  <span className="text-xs text-slate-500">Total Interest</span>
                  <span className="text-sm font-bold text-amber-600">
                    ₹{Math.round(totalInterest).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="bg-slate-50 rounded-xl px-4 py-2.5 flex justify-between items-center border-t-2 border-indigo-100">
                  <span className="text-xs font-semibold text-slate-600">
                    Total Amount
                  </span>
                  <span className="text-sm font-black text-slate-800">
                    ₹{Math.round(totalAmt).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/review")}
                data-ocid="dashboard.emi_calculator_apply.button"
                className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/30 text-sm transition-all hover:shadow-xl hover:shadow-indigo-500/40"
              >
                Apply Now →
              </motion.button>

              {/* Amortization Schedule */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setShowAmortization(!showAmortization)}
                  data-ocid="dashboard.amortization.toggle"
                  className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <motion.span
                    animate={{ rotate: showAmortization ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block"
                  >
                    ▶
                  </motion.span>
                  View Year-by-Year Breakdown
                </button>

                <AnimatePresence>
                  {showAmortization && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-4"
                      data-ocid="dashboard.amortization.panel"
                    >
                      <div className="overflow-x-auto rounded-xl border border-slate-100">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-indigo-600 text-white">
                              <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider">
                                Year
                              </th>
                              <th className="px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider">
                                Opening
                              </th>
                              <th className="px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider">
                                EMI Paid
                              </th>
                              <th className="px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider">
                                Principal
                              </th>
                              <th className="px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider">
                                Interest
                              </th>
                              <th className="px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider">
                                Closing
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {amortization.map((row, i) => (
                              <motion.tr
                                key={row.year}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className={
                                  i % 2 === 0 ? "bg-white" : "bg-slate-50"
                                }
                                data-ocid={`dashboard.amortization.row.${i + 1}`}
                              >
                                <td className="px-3 py-2.5 font-bold text-indigo-600">
                                  Year {row.year}
                                </td>
                                <td className="px-3 py-2.5 text-right text-slate-700">
                                  ₹{row.opening.toLocaleString("en-IN")}
                                </td>
                                <td className="px-3 py-2.5 text-right text-slate-700">
                                  ₹{row.emiPaid.toLocaleString("en-IN")}
                                </td>
                                <td className="px-3 py-2.5 text-right text-indigo-600 font-semibold">
                                  ₹{row.principalPaid.toLocaleString("en-IN")}
                                </td>
                                <td className="px-3 py-2.5 text-right text-amber-600 font-semibold">
                                  ₹{row.interestPaid.toLocaleString("en-IN")}
                                </td>
                                <td className="px-3 py-2.5 text-right font-bold text-slate-800">
                                  ₹{row.closing.toLocaleString("en-IN")}
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 text-right">
                        * Showing up to 5 years
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <FDEligibilityModal
        open={selectedFDCardIdx !== null}
        onClose={() => setSelectedFDCardIdx(null)}
        card={
          selectedFDCardIdx !== null
            ? {
                name: fdCards[selectedFDCardIdx].name,
                bank: fdCards[selectedFDCardIdx].name.includes("SBM")
                  ? "SBM Bank"
                  : fdCards[selectedFDCardIdx].name.includes("HDFC")
                    ? "HDFC Bank"
                    : "IDFC FIRST Bank",
                fdFrom: fdCards[selectedFDCardIdx].fd,
                fee: fdCards[selectedFDCardIdx].fee,
                logo: fdCards[selectedFDCardIdx].logo,
                color: fdCards[selectedFDCardIdx].gradient,
              }
            : null
        }
      />
    </DashboardLayout>
  );
}
