import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

const recommended = [
  {
    name: "Moneyview",
    gradient: "from-green-500 to-emerald-700",
    shadow: "shadow-green-500/30",
    badgeColor: "bg-green-200 text-green-900",
    tags: ["RECOMMENDED", "INSTANT PAPERLESS"],
    chance: 98,
    emi: 15427,
    rate: "0.039%/day",
    disbursal: "Instant",
    features: ["No Hidden Charges", "Flexible Tenure", "Zero Foreclosure Fee"],
  },
  {
    name: "RapidMoney",
    gradient: "from-violet-500 to-purple-700",
    shadow: "shadow-violet-500/30",
    badgeColor: "bg-purple-200 text-purple-900",
    tags: ["RECOMMENDED", "FAST APPROVAL"],
    chance: 96,
    emi: 17731,
    rate: "0.1–0.15%/day",
    disbursal: "2 Hours",
    features: ["Minimal Docs", "24/7 Support", "Instant KYC"],
  },
  {
    name: "Zype",
    gradient: "from-blue-500 to-indigo-700",
    shadow: "shadow-blue-500/30",
    badgeColor: "bg-blue-200 text-blue-900",
    tags: ["RECOMMENDED", "CREDIT LINE"],
    chance: 97,
    emi: 14900,
    rate: "0.05%/day",
    disbursal: "Same Day",
    features: ["Zero Processing Fee", "Flexible Repayment", "Easy App"],
  },
  {
    name: "KreditBee",
    gradient: "from-orange-500 to-rose-600",
    shadow: "shadow-orange-500/30",
    badgeColor: "bg-orange-200 text-orange-900",
    tags: ["RECOMMENDED", "STUDENT FRIENDLY"],
    chance: 95,
    emi: 13200,
    rate: "0.08%/day",
    disbursal: "4 Hours",
    features: ["Quick Approval", "Easy EMI", "Paperless Process"],
  },
];

const matched = [
  {
    name: "Olyv",
    gradient: "from-teal-400 to-cyan-600",
    shadow: "shadow-teal-400/30",
    chance: 85,
    emi: 14200,
    days: "1 Day",
    badge: "MATCHED",
  },
  {
    name: "Poonawalla",
    gradient: "from-emerald-400 to-green-600",
    shadow: "shadow-emerald-400/30",
    chance: 82,
    emi: 13800,
    days: "2 Days",
    badge: "HIGHER LOAN",
  },
  {
    name: "Aditya Birla",
    gradient: "from-amber-400 to-orange-500",
    shadow: "shadow-amber-400/30",
    chance: 80,
    emi: 16100,
    days: "3 Days",
    badge: "HIGHER LOAN",
  },
  {
    name: "SMFG",
    gradient: "from-blue-400 to-indigo-600",
    shadow: "shadow-blue-400/30",
    chance: 78,
    emi: 15500,
    days: "Instant",
    badge: "INSTANT DISBURSAL",
  },
  {
    name: "Credit+",
    gradient: "from-purple-400 to-violet-600",
    shadow: "shadow-purple-400/30",
    chance: 75,
    emi: 12900,
    days: "1 Day",
    badge: "MATCHED",
  },
  {
    name: "LendingPlate",
    gradient: "from-rose-400 to-pink-600",
    shadow: "shadow-rose-400/30",
    chance: 70,
    emi: 11500,
    days: "2 Days",
    badge: "MATCHED",
  },
];

const unmatched = [
  { name: "Yes Bank", reason: "Low income proof", icon: "🏛️" },
  { name: "IndusInd Bank", reason: "Serviceable area", icon: "🏦" },
  { name: "RBL Bank", reason: "Existing application", icon: "🏢" },
  { name: "Karnataka Bank", reason: "Eligibility criteria", icon: "🏗️" },
  { name: "Federal Bank", reason: "Credit history", icon: "🏦" },
  { name: "South Indian Bank", reason: "Income threshold", icon: "🏛️" },
];

const reasonTips: Record<string, string[]> = {
  "Low income proof": [
    "Upload salary slips for last 3 months",
    "Add a co-applicant with stable income",
    "Include rental or freelance income in your application",
    "Ensure bank statement shows regular credits",
  ],
  "Serviceable area": [
    "Lender is expanding — check back in 30 days",
    "Try applying with a different residential address if applicable",
    "Contact the lender directly for area exceptions",
  ],
  "Existing application": [
    "Wait for your existing application to be processed or withdrawn",
    "Check application status before applying again",
    "Contact lender to withdraw duplicate application",
  ],
  "Eligibility criteria": [
    "Maintain a credit score above 700",
    "Reduce existing loan obligations",
    "Ensure stable employment for 12+ months",
    "Keep credit utilization below 30%",
  ],
  "Credit history": [
    "Pay all EMIs and credit card bills on time",
    "Avoid multiple loan applications in a short period",
    "Build credit history with a secured credit card",
    "Clear overdue amounts on existing accounts",
  ],
  "Income threshold": [
    "Show additional income sources in your application",
    "Apply for a smaller loan amount to meet income ratio",
    "Add a co-applicant to boost combined income",
  ],
};

const genericTips = [
  "Maintain a CIBIL score above 700",
  "Reduce existing EMI obligations",
  "Keep credit utilization below 30%",
  "Ensure stable employment for 12+ months",
  "Avoid multiple loan applications simultaneously",
];

type UnmatchedLender = (typeof unmatched)[0];

const filters = [
  "All",
  "Instant Disbursal",
  "Paperless",
  "Low Interest",
  "Pre-Approved",
];

function EligibilityModal({
  lender,
  onClose,
}: {
  lender: UnmatchedLender;
  onClose: () => void;
}) {
  const tips = reasonTips[lender.reason] ?? genericTips;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(15,23,42,0.55)",
      }}
      onClick={onClose}
      data-ocid="offers.eligibility.modal"
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 24 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient band */}
        <div className="bg-gradient-to-r from-indigo-600 to-teal-500 px-6 pt-6 pb-10 relative">
          <button
            type="button"
            onClick={onClose}
            data-ocid="offers.eligibility.close_button"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            ✕
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl border border-white/30">
              {lender.icon}
            </div>
            <div>
              <h2 className="text-white font-black text-lg leading-tight">
                {lender.name}
              </h2>
              <span className="inline-flex items-center gap-1 bg-red-500/80 text-white text-xs font-bold px-2.5 py-0.5 rounded-full mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Not Eligible
              </span>
            </div>
          </div>
        </div>

        {/* Content card lifted over gradient */}
        <div className="-mt-6 mx-4 bg-white rounded-2xl shadow-lg border border-slate-100 p-5 mb-4">
          {/* Reason */}
          <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-base">⚠️</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                Reason for Ineligibility
              </p>
              <p className="text-slate-700 font-semibold text-sm">
                {lender.reason}
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-indigo-50 to-teal-50 rounded-2xl p-4 mb-4">
            <p className="text-xs font-black text-indigo-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span>💡</span> How to Improve Your Eligibility
            </p>
            <ul className="space-y-2.5">
              {tips.map((tip, i) => (
                <motion.li
                  key={tip}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06 }}
                  className="flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-[10px] flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-slate-600 text-sm leading-snug">
                    {tip}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Next check date chip */}
          <div className="flex items-center justify-center gap-2 bg-teal-50 border border-teal-200 rounded-xl px-4 py-2.5">
            <span className="text-teal-500 text-sm">📅</span>
            <span className="text-teal-700 text-sm font-semibold">
              Check back after 90 days
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            data-ocid="offers.eligibility.confirm_button"
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow text-sm"
          >
            Got It — I'll Improve My Profile ✓
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MyOffers() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedLender, setSelectedLender] = useState<UnmatchedLender | null>(
    null,
  );
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (dir: "left" | "right") => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: dir === "right" ? 220 : -220,
        behavior: "smooth",
      });
    }
  };

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

        {/* Filter chips */}
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

        {/* Recommended Offers */}
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-4">
          <span className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-sm">
            ⚡
          </span>
          Recommended Offers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {recommended.map((o, i) => (
            <motion.div
              key={o.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className={`bg-gradient-to-br ${o.gradient} rounded-2xl p-5 text-white relative overflow-hidden shadow-xl ${o.shadow}`}
              data-ocid={`offers.recommended.item.${i + 1}`}
            >
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
              <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-white/5" />

              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-lg mb-2 border border-white/30">
                      🏦
                    </div>
                    <h3 className="text-xl font-black text-white">{o.name}</h3>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {o.tags.map((t) => (
                        <span
                          key={t}
                          className={`text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded ${o.badgeColor}`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-2xl text-white">
                      ↗ {o.chance}%
                    </p>
                    <p className="text-[10px] text-white/70 uppercase">
                      Approval
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${o.chance}%` }}
                      transition={{
                        duration: 1.2,
                        delay: 0.3 + i * 0.1,
                        ease: "easeOut",
                      }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <p className="text-[10px] text-white/60 uppercase">EMI</p>
                    <p className="text-lg font-black text-white">
                      ₹{o.emi.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/60 uppercase">Rate</p>
                    <p className="text-sm font-bold text-white/90">{o.rate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/60 uppercase">
                      Disbursal
                    </p>
                    <p className="text-sm font-bold text-white/90">
                      ⏱ {o.disbursal}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  {o.features.map((f) => (
                    <p
                      key={f}
                      className="text-xs text-white/90 flex items-center gap-1.5"
                    >
                      <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] flex-shrink-0">
                        ✓
                      </span>
                      {f}
                    </p>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/review")}
                  data-ocid={`offers.recommended_apply.${i + 1}`}
                  className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-xl text-sm transition-all border border-white/30"
                >
                  Apply Now →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Matched Offers */}
        <h2 className="text-xl font-black text-slate-800 mb-4">
          Matched Offers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {matched.map((o, i) => (
            <motion.div
              key={o.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -3, scale: 1.02 }}
              className={`bg-gradient-to-br ${o.gradient} rounded-2xl p-4 text-white relative overflow-hidden shadow-lg ${o.shadow}`}
              data-ocid={`offers.matched.item.${i + 1}`}
            >
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
              <div className="absolute -bottom-6 -left-2 w-16 h-16 rounded-full bg-white/5" />

              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center border border-white/30">
                    🏦
                  </div>
                  <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/30">
                    {o.days}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white mb-1">{o.name}</h3>
                <p className="text-[10px] text-white/60 uppercase">
                  EMI Starts At
                </p>
                <p className="text-xl font-black text-white mb-3">
                  ₹{o.emi.toLocaleString("en-IN")}
                </p>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${o.chance}%` }}
                      transition={{
                        duration: 0.9,
                        delay: 0.2 + i * 0.1,
                        ease: "easeOut",
                      }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                  <span className="text-xs font-bold text-white">
                    {o.chance}%
                  </span>
                </div>

                <span className="text-[10px] border border-white/30 bg-white/10 text-white px-2 py-0.5 rounded-full">
                  {o.badge}
                </span>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/review")}
                  data-ocid={`offers.matched_apply.${i + 1}`}
                  className="w-full mt-3 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold rounded-xl text-sm border border-white/30 transition-colors"
                >
                  Apply Now →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Unmatched Offers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-50 rounded-2xl p-6 border border-slate-200"
          data-ocid="offers.unmatched.panel"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center text-sm">
                  🔒
                </span>
                <h2 className="text-xl font-black text-slate-800">
                  Unmatched Offers
                </h2>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {unmatched.length} Not Eligible
                </span>
              </div>
              <p className="text-sm text-slate-500 ml-9">
                These lenders couldn't be matched to your profile at this time.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-5 ml-1">
            {[
              "You don't meet the lender's eligibility criteria.",
              "Your location isn't currently serviceable by the lender.",
              "You may have an ongoing loan or recent application with this lender.",
            ].map((reason) => (
              <div
                key={reason}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500"
              >
                <span className="text-red-400 flex-shrink-0">•</span>
                {reason}
              </div>
            ))}
          </div>

          {/* Carousel */}
          <div className="relative">
            <button
              type="button"
              onClick={() => scrollCarousel("left")}
              data-ocid="offers.unmatched_carousel.pagination_prev"
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:shadow-lg transition-all"
            >
              ←
            </button>

            <div
              ref={carouselRef}
              className="flex gap-3 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory"
              style={{ scrollbarWidth: "none" }}
            >
              {unmatched.map((lender, i) => (
                <motion.div
                  key={lender.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="flex-shrink-0 snap-start w-52 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                  data-ocid={`offers.unmatched.item.${i + 1}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl">
                      {lender.icon}
                    </div>
                    <span className="w-6 h-6 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-[10px]">
                      🔒
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">
                    {lender.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 mb-3">
                    {lender.reason}
                  </p>
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="flex-1 h-1 bg-red-100 rounded-full overflow-hidden">
                      <span
                        className="block h-full bg-red-300 rounded-full"
                        style={{ width: "30%" }}
                      />
                    </span>
                    <span className="text-[10px] text-red-400 font-semibold">
                      Not Eligible
                    </span>
                  </div>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedLender(lender)}
                    data-ocid={`offers.unmatched_check_later.${i + 1}`}
                    className="mt-1 w-full py-2 bg-gradient-to-r from-indigo-50 to-teal-50 border border-indigo-200 hover:border-indigo-400 rounded-xl text-center text-xs text-indigo-600 font-semibold transition-all hover:shadow-sm hover:shadow-indigo-100"
                  >
                    📋 Check Later
                  </motion.button>
                </motion.div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              data-ocid="offers.unmatched_carousel.pagination_next"
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:shadow-lg transition-all"
            >
              →
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-4 text-center">
            💡 Improve your credit profile to unlock these offers in the future
          </p>
        </motion.div>
      </div>

      {/* Eligibility Modal */}
      <AnimatePresence>
        {selectedLender && (
          <EligibilityModal
            lender={selectedLender}
            onClose={() => setSelectedLender(null)}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
