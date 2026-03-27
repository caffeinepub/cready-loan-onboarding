import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
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

function EMICalc() {
  const [loan, setLoan] = useState(500000);
  const [tenure, setTenure] = useState(24);
  const [rate, setRate] = useState(10.5);
  const monthly = rate / 12 / 100;
  const emi =
    (loan * monthly * (1 + monthly) ** tenure) / ((1 + monthly) ** tenure - 1);
  const total = emi * tenure;
  const interest = total - loan;

  return (
    <div className="grid grid-cols-5 gap-6">
      <div className="col-span-3 space-y-5">
        {[
          {
            label: "Loan Amount",
            value: loan,
            set: setLoan,
            min: 10000,
            max: 5000000,
            step: 10000,
            format: (v: number) => `₹${v.toLocaleString("en-IN")}`,
          },
          {
            label: "Tenure (Months)",
            value: tenure,
            set: setTenure,
            min: 1,
            max: 84,
            step: 1,
            format: (v: number) => `${v} Months`,
          },
        ].map((s) => (
          <div key={s.label}>
            <div className="flex justify-between mb-1">
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                {s.label}
              </p>
              <span className="text-sm font-black text-slate-800">
                {s.format(s.value)}
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
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
            Interest Rate (% p.a.)
          </p>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(+e.target.value)}
            min={5}
            max={36}
            step={0.1}
            className="border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-800 w-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="col-span-2 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5 text-white flex flex-col justify-center">
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-1">
          Monthly EMI
        </p>
        <motion.p
          key={Math.round(emi)}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-black mb-5"
        >
          ₹{Math.round(emi).toLocaleString("en-IN")}
        </motion.p>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-indigo-200">Principal</span>
            <span className="font-bold">₹{loan.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-indigo-200">Total Interest</span>
            <span className="font-bold">
              ₹{Math.round(interest).toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between border-t border-indigo-400/40 pt-2">
            <span className="text-indigo-200">Total Repayment</span>
            <span className="font-black">
              ₹{Math.round(total).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EligibilityCalc() {
  const [income, setIncome] = useState(80000);
  const [existingEMI, setExistingEMI] = useState(5000);
  const foir = 0.5; // 50% FOIR
  const maxEMI = income * foir - existingEMI;
  const eligible = (maxEMI * 48) / 1.2; // rough estimate

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
        />
        <button
          type="button"
          onClick={search}
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
