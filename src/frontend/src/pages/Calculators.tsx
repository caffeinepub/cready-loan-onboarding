import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

const ifscDB: Record<
  string,
  { bank: string; branch: string; city: string; micr: string }
> = {
  SBIN0001234: {
    bank: "State Bank of India",
    branch: "MG Road Branch",
    city: "Bengaluru",
    micr: "560002003",
  },
  HDFC0001111: {
    bank: "HDFC Bank",
    branch: "Koramangala Branch",
    city: "Bengaluru",
    micr: "560240002",
  },
  ICIC0003333: {
    bank: "ICICI Bank",
    branch: "BKC Branch",
    city: "Mumbai",
    micr: "400229002",
  },
  UTIB0005555: {
    bank: "Axis Bank",
    branch: "Indiranagar Branch",
    city: "Bengaluru",
    micr: "560211003",
  },
  KKBK0006666: {
    bank: "Kotak Mahindra Bank",
    branch: "Nariman Point",
    city: "Mumbai",
    micr: "400485001",
  },
};

const tabs = ["EMI Calculator", "Eligibility", "IFSC Finder"] as const;
type Tab = (typeof tabs)[number];

function EMIDonutChart({
  principal,
  interest,
  emi,
}: { principal: number; interest: number; emi: number }) {
  const r = 60;
  const sw = 18;
  const circ = 2 * Math.PI * r;
  const total = principal + interest;
  const principalRatio = total > 0 ? principal / total : 0.7;
  const principalDash = circ * principalRatio;
  const interestDash = circ * (1 - principalRatio);

  const prevEmiRef = useRef(emi);
  const [animatedEmi, setAnimatedEmi] = useState(emi);

  useEffect(() => {
    const start = prevEmiRef.current;
    const end = emi;
    const duration = 500;
    const startTime = Date.now();
    const frame = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setAnimatedEmi(Math.round(start + (end - start) * eased));
      if (t < 1) requestAnimationFrame(frame);
      else prevEmiRef.current = end;
    };
    requestAnimationFrame(frame);
  }, [emi]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 180, height: 180 }}
    >
      <svg
        aria-hidden="true"
        width="180"
        height="180"
        viewBox="0 0 160 160"
        className="-rotate-90"
      >
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={sw}
        />
        <motion.circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={sw}
          strokeLinecap="butt"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: circ - interestDash }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="#4f46e5"
          strokeWidth={sw}
          strokeLinecap="butt"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - principalDash }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold leading-tight">
          Monthly EMI
        </div>
        <div className="text-xl font-black text-slate-800 leading-tight">
          ₹{animatedEmi.toLocaleString("en-IN")}
        </div>
      </div>
    </div>
  );
}

function EMICalc() {
  const navigate = useNavigate();
  const [loan, setLoan] = useState(500000);
  const [tenure, setTenure] = useState(24);
  const [rate, setRate] = useState(10.99);
  const [showAmortization, setShowAmortization] = useState(false);

  const monthly = rate / 12 / 100;
  const emi =
    monthly > 0
      ? (loan * monthly * (1 + monthly) ** tenure) /
        ((1 + monthly) ** tenure - 1)
      : loan / tenure;
  const totalAmt = emi * tenure;
  const totalInterest = totalAmt - loan;

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
    let balance = loan;
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

  return (
    <div>
      {/* IDFC-style header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-xl">
          🧮
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-base">
            Personal Loan EMI Calculator
          </h3>
          <p className="text-xs text-slate-400">
            Analyse like IDFC FIRST Bank · Real-time computation
          </p>
        </div>
        <div className="ml-auto">
          <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-indigo-100">
            IDFC Style
          </span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-8">
        {/* Left: Sliders */}
        <div className="col-span-3 space-y-7">
          {/* Loan Amount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Loan Amount
              </span>
              <span className="text-2xl font-black text-indigo-600">
                ₹{loan.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min={50000}
                max={4000000}
                step={10000}
                value={loan}
                onChange={(e) => setLoan(+e.target.value)}
                className="w-full accent-indigo-600 h-2 cursor-pointer"
                data-ocid="calculators.loan_amount.input"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹50,000</span>
              <span>₹40,00,000</span>
            </div>
          </div>

          {/* Tenure */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Tenure (Months)
              </span>
              <span className="text-2xl font-black text-indigo-600">
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
              data-ocid="calculators.tenure.input"
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
                Interest Rate (% p.a.)
              </span>
              <span className="text-2xl font-black text-indigo-600">
                {rate.toFixed(2)}%
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
              data-ocid="calculators.interest_rate.input"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>9.99%</span>
              <span>36%</span>
            </div>
          </div>

          {/* Quick-select tenure chips */}
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold mb-2">
              Quick Tenure
            </p>
            <div className="flex gap-2 flex-wrap">
              {[12, 18, 24, 36, 48, 60].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTenure(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    tenure === t
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                      : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  {t}M
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Donut + Results */}
        <div className="col-span-2 flex flex-col items-center">
          <EMIDonutChart
            principal={loan}
            interest={Math.round(totalInterest)}
            emi={Math.round(emi)}
          />

          {/* Legend */}
          <div className="flex gap-5 mt-3 mb-5">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-indigo-600" />
              <span className="text-[11px] text-slate-500 font-semibold">
                Principal
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-[11px] text-slate-500 font-semibold">
                Interest
              </span>
            </div>
          </div>

          {/* Result breakdown */}
          <div className="w-full space-y-2.5">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl px-4 py-3">
              <p className="text-[10px] text-indigo-200 uppercase font-semibold mb-0.5">
                Monthly EMI
              </p>
              <motion.p
                key={Math.round(emi)}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-black text-white"
              >
                ₹{Math.round(emi).toLocaleString("en-IN")}
              </motion.p>
            </div>
            <div className="bg-slate-50 rounded-xl px-4 py-2.5 flex justify-between">
              <span className="text-xs text-slate-500">Principal Amount</span>
              <span className="text-sm font-bold text-slate-800">
                ₹{loan.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl px-4 py-2.5 flex justify-between">
              <span className="text-xs text-slate-500">
                Total Interest Payable
              </span>
              <span className="text-sm font-bold text-amber-600">
                ₹{Math.round(totalInterest).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5 flex justify-between">
              <span className="text-xs font-semibold text-indigo-700">
                Total Amount Payable
              </span>
              <span className="text-sm font-black text-indigo-800">
                ₹{Math.round(totalAmt).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/my-offers")}
            data-ocid="calculators.emi_eligibility.button"
            className="w-full mt-4 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg text-sm"
          >
            Check Your Eligibility →
          </motion.button>
        </div>
      </div>

      {/* Amortization Schedule */}
      <div className="mt-8 border-t border-slate-100 pt-6">
        <button
          type="button"
          onClick={() => setShowAmortization(!showAmortization)}
          data-ocid="calculators.amortization.toggle"
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
              data-ocid="calculators.amortization.panel"
            >
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                        Year
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
                        Opening Balance
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
                        EMI Paid
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
                        Principal Paid
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
                        Interest Paid
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
                        Closing Balance
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
                        className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                        data-ocid={`calculators.amortization.row.${i + 1}`}
                      >
                        <td className="px-4 py-3 font-bold text-indigo-600">
                          Year {row.year}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-700">
                          ₹{row.opening.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-700">
                          ₹{row.emiPaid.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-right text-indigo-600 font-semibold">
                          ₹{row.principalPaid.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-right text-amber-600 font-semibold">
                          ₹{row.interestPaid.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-800">
                          ₹{row.closing.toLocaleString("en-IN")}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-right">
                * Showing up to 5 years. Actual schedule may vary slightly due
                to rounding.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EligibilityCalc() {
  const [income, setIncome] = useState(80000);
  const [existingEMI, setExistingEMI] = useState(5000);
  const foir = 0.5;
  const maxEMI = income * foir - existingEMI;
  const eligible = (maxEMI * 48) / 1.2;

  return (
    <div className="grid grid-cols-5 gap-6">
      <div className="col-span-3 space-y-5">
        {[
          {
            label: "Monthly Income",
            value: income,
            set: setIncome,
            min: 15000,
            max: 500000,
            step: 5000,
          },
          {
            label: "Existing EMIs",
            value: existingEMI,
            set: setExistingEMI,
            min: 0,
            max: 100000,
            step: 1000,
          },
        ].map((s) => (
          <div key={s.label}>
            <div className="flex justify-between mb-1">
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                {s.label}
              </p>
              <span className="text-sm font-black text-slate-800">
                ₹{s.value.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.value}
              onChange={(e) => s.set(+e.target.value)}
              className="w-full accent-indigo-600"
            />
          </div>
        ))}
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Available EMI Capacity</p>
          <p className="text-2xl font-black text-indigo-600">
            ₹{Math.max(0, Math.round(maxEMI)).toLocaleString("en-IN")}/mo
          </p>
        </div>
      </div>
      <div className="col-span-2 bg-gradient-to-br from-teal-600 to-indigo-600 rounded-2xl p-5 text-white flex flex-col justify-center">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-200 mb-1">
          Max Loan Eligibility
        </p>
        <motion.p
          key={Math.round(eligible)}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-black mb-5"
        >
          ₹{Math.max(0, Math.round(eligible)).toLocaleString("en-IN")}
        </motion.p>
        <p className="text-teal-200 text-xs">
          Based on 50% FOIR rule over 48 months tenure
        </p>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-teal-200">Net Monthly Income</span>
            <span className="font-bold">₹{income.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-teal-200">Existing Obligations</span>
            <span className="font-bold">
              ₹{existingEMI.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function IFSCTab() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<
    null | ((typeof ifscDB)[string] & { ifsc: string })
  >(null);
  const [nf, setNf] = useState(false);

  function search() {
    const code = q.toUpperCase().trim();
    const d = ifscDB[code];
    if (d) {
      setRes({ ...d, ifsc: code });
      setNf(false);
    } else {
      setNf(true);
      setRes(null);
    }
  }

  return (
    <div className="max-w-lg">
      <div className="flex gap-3 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Enter IFSC Code (e.g. SBIN0001234)"
          className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
          data-ocid="calculators.ifsc_search.input"
        />
        <button
          type="button"
          onClick={search}
          data-ocid="calculators.ifsc_search.button"
          className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
        >
          Search
        </button>
      </div>
      <AnimatePresence>
        {res && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-indigo-100 rounded-2xl p-5 shadow-md"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-xl">
                🏦
              </div>
              <div>
                <p className="font-black text-slate-800">{res.bank}</p>
                <p className="text-xs text-slate-500">{res.branch}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] text-slate-400 uppercase">IFSC</p>
                <p className="font-mono font-bold">{res.ifsc}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] text-slate-400 uppercase">MICR</p>
                <p className="font-mono font-bold">{res.micr}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] text-slate-400 uppercase">City</p>
                <p className="font-bold">{res.city}</p>
              </div>
            </div>
          </motion.div>
        )}
        {nf && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-red-50 rounded-xl p-4 text-center"
          >
            <p className="text-red-500 font-bold text-sm">
              IFSC not found. Try SBIN0001234 or HDFC0001111
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Calculators() {
  const [activeTab, setActiveTab] = useState<Tab>("EMI Calculator");

  return (
    <DashboardLayout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-black text-slate-800">
            Calculators & Tools
          </h1>
          <p className="text-slate-500 mt-1">
            Plan smarter with our financial calculators.
          </p>
        </motion.div>

        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              data-ocid={`calculators.${tab.toLowerCase().replace(/ /g, "_")}.tab`}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            {activeTab === "EMI Calculator" && <EMICalc />}
            {activeTab === "Eligibility" && <EligibilityCalc />}
            {activeTab === "IFSC Finder" && <IFSCTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
