import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useRef, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

// ─── Gold Rate Data ──────────────────────────────────────────────────────────
const goldRates = {
  "22K": {
    "1g": { today: 13315, yesterday: 13515 },
    "8g": { today: 106520, yesterday: 108120 },
    "10g": { today: 133150, yesterday: 135150 },
  },
  "24K": {
    "1g": { today: 13981, yesterday: 14191 },
    "8g": { today: 111848, yesterday: 113528 },
    "10g": { today: 139810, yesterday: 141910 },
  },
};

const cityRates: Record<string, { "22K": number; "24K": number }> = {
  Mumbai: { "22K": 13315, "24K": 13981 },
  Delhi: { "22K": 13320, "24K": 13986 },
  Bengaluru: { "22K": 13310, "24K": 13975 },
  Chennai: { "22K": 13318, "24K": 13984 },
  Hyderabad: { "22K": 13312, "24K": 13978 },
  Kolkata: { "22K": 13325, "24K": 13992 },
  Pune: { "22K": 13308, "24K": 13974 },
  Ahmedabad: { "22K": 13322, "24K": 13988 },
};

const tenDayData = [
  {
    date: "27 Mar 2026",
    k22: 106520,
    k22chg: -1600,
    k24: 111848,
    k24chg: -1680,
  },
  { date: "26 Mar 2026", k22: 108120, k22chg: +160, k24: 113528, k24chg: +168 },
  {
    date: "25 Mar 2026",
    k22: 107960,
    k22chg: +4640,
    k24: 113360,
    k24chg: +4872,
  },
  {
    date: "24 Mar 2026",
    k22: 103320,
    k22chg: -2320,
    k24: 108488,
    k24chg: -2432,
  },
  { date: "23 Mar 2026", k22: 105640, k22chg: +880, k24: 110920, k24chg: +924 },
  {
    date: "22 Mar 2026",
    k22: 104760,
    k22chg: +1200,
    k24: 109996,
    k24chg: +1260,
  },
  { date: "21 Mar 2026", k22: 103560, k22chg: -800, k24: 108736, k24chg: -840 },
  {
    date: "20 Mar 2026",
    k22: 104360,
    k22chg: +960,
    k24: 109576,
    k24chg: +1008,
  },
  {
    date: "19 Mar 2026",
    k22: 103400,
    k22chg: -1600,
    k24: 108568,
    k24chg: -1680,
  },
  { date: "18 Mar 2026", k22: 105000, k22chg: +400, k24: 110248, k24chg: +420 },
];

// Weekly chart data: per gram, Oct to Mar
const chartData22K = [
  10800, 11100, 11400, 11200, 11600, 11900, 12200, 12000, 12400, 12700, 13000,
  12800, 13100, 13315, 13315,
];
const chartData24K = [
  11340, 11655, 11970, 11760, 12180, 12495, 12810, 12600, 13020, 13335, 13650,
  13440, 13755, 13981, 13981,
];
const chartLabels = [
  "Oct",
  "",
  "",
  "Nov",
  "",
  "",
  "Dec",
  "",
  "",
  "Jan",
  "",
  "",
  "Feb",
  "",
  "Mar",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const fmtChg = (n: number) => {
  const sign = n >= 0 ? "+" : "";
  const arrow = n >= 0 ? " ▲" : " ▼";
  return `${sign}${n.toLocaleString("en-IN")}${arrow}`;
};

// ─── SVG Line Chart ──────────────────────────────────────────────────────────
function LineChart() {
  const W = 480;
  const H = 180;
  const pad = { t: 16, r: 20, b: 40, l: 56 };
  const cW = W - pad.l - pad.r;
  const cH = H - pad.t - pad.b;
  const allVals = [...chartData22K, ...chartData24K];
  const minV = Math.min(...allVals) - 200;
  const maxV = Math.max(...allVals) + 200;

  const px = (i: number) => pad.l + (i / (chartData22K.length - 1)) * cW;
  const py = (v: number) => pad.t + cH - ((v - minV) / (maxV - minV)) * cH;

  const pathD = (data: number[]) =>
    data
      .map(
        (v, i) =>
          `${i === 0 ? "M" : "L"} ${px(i).toFixed(1)} ${py(v).toFixed(1)}`,
      )
      .join(" ");

  const gridLines = [11000, 12000, 13000, 14000];

  return (
    <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      {/* Grid */}
      {gridLines.map((v) => (
        <g key={`grid-${v}`}>
          <line
            x1={pad.l}
            x2={W - pad.r}
            y1={py(v)}
            y2={py(v)}
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          <text
            x={pad.l - 8}
            y={py(v) + 4}
            textAnchor="end"
            fontSize="10"
            fill="#94a3b8"
          >
            ₹{(v / 1000).toFixed(0)}K
          </text>
        </g>
      ))}
      {/* X labels */}
      {chartLabels.reduce<React.ReactNode[]>((acc, lbl, i) => {
        if (lbl)
          acc.push(
            <text
              key={`chart-label-${lbl}`}
              x={px(i)}
              y={H - 6}
              textAnchor="middle"
              fontSize="10"
              fill="#94a3b8"
            >
              {lbl}
            </text>,
          );
        return acc;
      }, [])}
      {/* Lines */}
      <path
        d={pathD(chartData22K)}
        fill="none"
        stroke="#0d9488"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={pathD(chartData24K)}
        fill="none"
        stroke="#f97316"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dots at last point */}
      <circle
        cx={px(chartData22K.length - 1)}
        cy={py(chartData22K[chartData22K.length - 1])}
        r="4"
        fill="#0d9488"
      />
      <circle
        cx={px(chartData24K.length - 1)}
        cy={py(chartData24K[chartData24K.length - 1])}
        r="4"
        fill="#f97316"
      />
      {/* Legend */}
      <rect
        x={pad.l}
        y={H - 38}
        width="10"
        height="3"
        rx="1.5"
        fill="#0d9488"
      />
      <text x={pad.l + 14} y={H - 32} fontSize="10" fill="#334155">
        22K Gold
      </text>
      <rect
        x={pad.l + 72}
        y={H - 38}
        width="10"
        height="3"
        rx="1.5"
        fill="#f97316"
      />
      <text x={pad.l + 86} y={H - 32} fontSize="10" fill="#334155">
        24K Gold
      </text>
    </svg>
  );
}

// ─── Gold Rates Section ──────────────────────────────────────────────────────
function GoldRatesSection({ onApply }: { onApply: () => void }) {
  const [calcGrams, setCalcGrams] = useState(1);
  const [calcKarat, setCalcKarat] = useState<"22K" | "24K">("22K");
  const [calcCity, setCalcCity] = useState("Mumbai");
  const [calcResult, setCalcResult] = useState<number | null>(null);
  const [cityRateCity, setCityRateCity] = useState("");

  function calculate() {
    const ratePerGram = cityRates[calcCity][calcKarat];
    setCalcResult(ratePerGram * calcGrams);
  }

  const cities = Object.keys(cityRates);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="space-y-6 mb-10"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-amber-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🏅</span>
              <h2 className="text-2xl font-black">Gold Rates in India</h2>
              <span className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full text-xs font-bold">
                <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-amber-100 text-sm">
              Last updated: 27 Mar 2026, 10:00 AM
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onApply}
            className="bg-white text-amber-600 font-black px-5 py-2.5 rounded-xl text-sm shadow-md hover:shadow-lg transition-shadow"
            data-ocid="gold_loan.apply.button"
          >
            Apply for Gold Loan →
          </motion.button>
        </div>
      </div>

      {/* Rate Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {(["22K", "24K"] as const).map((karat) => (
          <motion.div
            key={karat}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-5 py-3 flex items-center gap-2">
              <span className="text-lg">{karat === "22K" ? "⭐" : "✨"}</span>
              <span className="text-white font-bold text-sm">
                {karat} Gold Rates Today — Per Gram / 8g / 10g
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    {["Quantity", "Today", "Yesterday", "Change"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left text-xs font-bold tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(["1g", "8g", "10g"] as const).map((qty, i) => {
                    const r = goldRates[karat][qty];
                    const chg = r.today - r.yesterday;
                    return (
                      <tr
                        key={qty}
                        className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <td className="px-4 py-3 font-bold text-slate-700">
                          {qty}
                        </td>
                        <td className="px-4 py-3 font-black text-slate-900">
                          {fmt(r.today)}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {fmt(r.yesterday)}
                        </td>
                        <td
                          className={`px-4 py-3 font-bold text-xs ${chg >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {fmtChg(chg)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Calculator + City Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
        >
          <h3 className="font-black text-slate-800 text-base mb-4">
            Gold Rate Calculator
          </h3>
          <div className="space-y-4">
            <div>
              <p className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Select City
              </p>
              <select
                value={calcCity}
                onChange={(e) => setCalcCity(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                data-ocid="gold_loan.city.select"
              >
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Weight (grams)
              </p>
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={calcGrams}
                onChange={(e) => setCalcGrams(+e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                data-ocid="gold_loan.weight.input"
              />
            </div>
            <div>
              <p className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Karat
              </p>
              <div className="flex gap-2">
                {(["22K", "24K"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setCalcKarat(k)}
                    className={`flex-1 py-2.5 rounded-full text-sm font-bold border transition-all ${
                      calcKarat === k
                        ? "bg-amber-500 border-amber-500 text-white shadow-md"
                        : "border-slate-200 text-slate-500 hover:border-amber-300"
                    }`}
                    data-ocid={`gold_loan.karat_${k.toLowerCase()}.toggle`}
                  >
                    {k} Carat
                  </button>
                ))}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={calculate}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-3 rounded-xl text-sm shadow-md shadow-blue-200 hover:shadow-blue-300 transition-shadow"
              data-ocid="gold_loan.calculate.button"
            >
              CALCULATE
            </motion.button>
            <AnimatePresence>
              {calcResult !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 text-center"
                >
                  <p className="text-xs text-amber-600 font-semibold mb-1">
                    {calcGrams}g of {calcKarat} gold in {calcCity}
                  </p>
                  <p className="text-3xl font-black text-amber-700">
                    {fmt(calcResult)}
                  </p>
                  <p className="text-xs text-amber-500 mt-1">
                    At ₹{cityRates[calcCity][calcKarat].toLocaleString("en-IN")}
                    /gram
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Top Cities Rates */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
        >
          <h3 className="font-black text-slate-800 text-base mb-4">
            Gold Rate in Top Cities
          </h3>
          <div className="mb-4">
            <select
              value={cityRateCity}
              onChange={(e) => setCityRateCity(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              data-ocid="gold_loan.city_rates.select"
            >
              <option value="">-- Select City --</option>
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <AnimatePresence>
            {cityRateCity && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="px-4 py-2.5 text-left text-xs font-bold">
                        City
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold">
                        22K (per gram)
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold">
                        24K (per gram)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {cityRateCity}
                      </td>
                      <td className="px-4 py-3 font-black text-teal-700">
                        {fmt(cityRates[cityRateCity]["22K"])}
                      </td>
                      <td className="px-4 py-3 font-black text-orange-600">
                        {fmt(cityRates[cityRateCity]["24K"])}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 text-center">
                    <p className="text-xs text-teal-600 font-semibold mb-0.5">
                      22K (10g)
                    </p>
                    <p className="text-lg font-black text-teal-700">
                      {fmt(cityRates[cityRateCity]["22K"] * 10)}
                    </p>
                  </div>
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
                    <p className="text-xs text-orange-600 font-semibold mb-0.5">
                      24K (10g)
                    </p>
                    <p className="text-lg font-black text-orange-700">
                      {fmt(cityRates[cityRateCity]["24K"] * 10)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!cityRateCity && (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">🏙️</p>
              <p className="text-slate-400 text-sm">
                Select a city to see rates
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* 10-day table + Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* 10-day table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-5 py-3">
            <span className="text-white font-bold text-sm">
              Gold Rate in Mumbai — Last 10 Days (8g)
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-2.5 text-left text-xs font-bold">
                    Date
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold">
                    22K Standard (8g)
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold">
                    24K Pure (8g)
                  </th>
                </tr>
              </thead>
              <tbody>
                {tenDayData.map((row, i) => (
                  <tr
                    key={row.date}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  >
                    <td className="px-4 py-2.5 text-slate-700 font-medium whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-bold text-slate-800">
                        {fmt(row.k22)}
                      </span>{" "}
                      <span
                        className={`text-xs font-semibold ${row.k22chg >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        ({fmtChg(row.k22chg)})
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-bold text-slate-800">
                        {fmt(row.k24)}
                      </span>{" "}
                      <span
                        className={`text-xs font-semibold ${row.k24chg >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        ({fmtChg(row.k24chg)})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* SVG Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"
        >
          <h3 className="font-black text-slate-800 text-sm mb-1">
            Weekly Rate Comparison — Per Gram (₹)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            22K vs 24K · Oct 2025 to Mar 2026
          </p>
          <LineChart />
        </motion.div>
      </div>

      {/* Commodity tiles */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-4"
      >
        {[
          {
            label: "Silver Rate",
            value: "₹245",
            unit: "per gram",
            emoji: "🥈",
            bg: "from-slate-100 to-gray-200",
            text: "text-slate-700",
          },
          {
            label: "Petrol Price",
            value: "₹103.49",
            unit: "per litre",
            emoji: "⛽",
            bg: "from-red-50 to-orange-100",
            text: "text-red-700",
          },
          {
            label: "Diesel Price",
            value: "₹90.01",
            unit: "per litre",
            emoji: "🛢️",
            bg: "from-yellow-50 to-amber-100",
            text: "text-amber-700",
          },
        ].map((tile) => (
          <div
            key={tile.label}
            className={`bg-gradient-to-br ${tile.bg} rounded-2xl p-5 flex items-center gap-3 border border-white shadow-sm`}
          >
            <span className="text-3xl">{tile.emoji}</span>
            <div>
              <p className="text-xs text-slate-500 font-semibold">
                {tile.label}
              </p>
              <p className={`text-xl font-black ${tile.text}`}>{tile.value}</p>
              <p className="text-xs text-slate-400">{tile.unit}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Gold Loan Application
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
    </motion.div>
  );
}

// ─── Gold Loan Form ──────────────────────────────────────────────────────────
const GOLD_PRICE_22K = 13315;
const steps = [
  "Gold Details",
  "Loan Details",
  "Personal Info",
  "Review & Submit",
];

export default function GoldLoan() {
  const formRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const refId = `GL${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // Form state
  const [weight, setWeight] = useState(20);
  const [purity, setPurity] = useState<"18K" | "22K" | "24K">("22K");
  const [items, setItems] = useState<string[]>(["Bangles"]);
  const [loanAmt, setLoanAmt] = useState(500000);
  const [tenure, setTenure] = useState(12);
  const [purpose, setPurpose] = useState("Personal");
  const [fullName, setFullName] = useState("Bharat Bhushan");
  const [mobile, setMobile] = useState("+91 98765 43210");
  const [address, setAddress] = useState("42, MG Road");
  const [city, setCity] = useState("Bengaluru");
  const [formState, setFormState] = useState("Karnataka");
  const [pincode, setPincode] = useState("560001");

  const purityMultiplier =
    purity === "24K" ? 1 : purity === "22K" ? 0.9167 : 0.75;
  const estimatedValue = Math.round(weight * GOLD_PRICE_22K * purityMultiplier);
  const maxLoan = Math.round(estimatedValue * 0.75);
  const currentLoan = loanAmt || maxLoan;
  const emi = (Math.round(currentLoan * 0.01 * tenure) / tenure) * 1.1;

  const goldItems = [
    "Bangles",
    "Necklace",
    "Ring",
    "Coin",
    "Earrings",
    "Other",
  ];
  const toggleItem = (item: string) =>
    setItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="p-8 flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 text-center max-w-md w-full"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
            >
              💛
            </motion.div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">
              Application Submitted!
            </h2>
            <p className="text-slate-500 mb-4">
              Your gold loan application has been received.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-xs text-yellow-600 uppercase tracking-wider mb-1">
                Reference ID
              </p>
              <p className="text-2xl font-black text-yellow-700 font-mono">
                {refId}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-6">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">Loan Amount</p>
                <p className="font-black text-slate-800">
                  ₹{currentLoan.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">Tenure</p>
                <p className="font-black text-slate-800">{tenure} Months</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Our agent will contact you within 2 hours for gold assessment.
            </p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 bg-slate-50 min-h-full">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-black text-slate-800">Gold Loan</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Live gold rates & instant loan application — up to 75% of your gold
            value
          </p>
        </motion.div>

        {/* Gold Rates Section */}
        <GoldRatesSection onApply={scrollToForm} />

        {/* Form Section */}
        <div ref={formRef}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-black text-slate-800 mb-1">
              Gold Loan Application
            </h2>
            <p className="text-slate-500 text-sm">
              Get up to 75% of your gold value instantly.
            </p>
          </motion.div>

          {/* Progress */}
          <div className="flex items-center gap-0 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      backgroundColor: i <= step ? "#4f46e5" : "#e2e8f0",
                      color: i <= step ? "#ffffff" : "#94a3b8",
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                  >
                    {i < step ? "✓" : i + 1}
                  </motion.div>
                  <span
                    className={`text-[10px] mt-1 font-semibold whitespace-nowrap ${i <= step ? "text-indigo-600" : "text-slate-400"}`}
                  >
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 mb-4 ${i < step ? "bg-indigo-600" : "bg-slate-200"}`}
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6"
            >
              {step === 0 && (
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-slate-800">
                    Gold Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider block mb-2">
                        Gold Weight (grams)
                      </p>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(+e.target.value)}
                        min={1}
                        max={500}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        data-ocid="gold_loan.weight_form.input"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider block mb-2">
                        Gold Purity
                      </p>
                      <div className="flex gap-2">
                        {(["18K", "22K", "24K"] as const).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPurity(p)}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${
                              purity === p
                                ? "bg-yellow-400 border-yellow-400 text-slate-900"
                                : "border-slate-200 text-slate-500 hover:border-yellow-300"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-xs text-yellow-600 uppercase tracking-wider mb-1">
                      Estimated Gold Value
                    </p>
                    <p className="text-3xl font-black text-yellow-700">
                      ₹{estimatedValue.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-yellow-500 mt-1">
                      Based on ₹13,315/g for 22K · {weight}g at {purity}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider block mb-2">
                      Items to Pledge
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {goldItems.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleItem(item)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                            items.includes(item)
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "border-slate-200 text-slate-600 hover:border-indigo-300"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-slate-800">
                    Loan Details
                  </h3>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-xs text-slate-400 uppercase tracking-wider">
                        Loan Amount Required
                      </p>
                      <span className="text-sm font-black text-indigo-600">
                        ₹{currentLoan.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={50000}
                      max={500000}
                      step={5000}
                      value={currentLoan}
                      onChange={(e) => setLoanAmt(+e.target.value)}
                      className="w-full accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>₹50,000</span>
                      <span>Max: ₹5,00,000</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-xs text-slate-400 uppercase tracking-wider">
                        Tenure (Months)
                      </p>
                      <span className="text-sm font-black text-indigo-600">
                        {tenure} Months
                      </span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={24}
                      step={1}
                      value={tenure}
                      onChange={(e) => setTenure(+e.target.value)}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider block mb-2">
                      Loan Purpose
                    </p>
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {[
                        "Medical",
                        "Business",
                        "Education",
                        "Personal",
                        "Other",
                      ].map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                    <p className="text-xs text-indigo-500 uppercase tracking-wider mb-2">
                      Estimated Monthly Interest
                    </p>
                    <p className="text-2xl font-black text-indigo-700">
                      ₹{Math.round(emi).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-indigo-400">
                      At 1% per month (reducing balance)
                    </p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Full Name", value: fullName, set: setFullName },
                      { label: "Mobile Number", value: mobile, set: setMobile },
                      { label: "Address", value: address, set: setAddress },
                      { label: "City", value: city, set: setCity },
                      { label: "State", value: formState, set: setFormState },
                      { label: "Pincode", value: pincode, set: setPincode },
                    ].map((f) => (
                      <div key={f.label}>
                        <p className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                          {f.label}
                        </p>
                        <input
                          value={f.value}
                          onChange={(e) => f.set(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">
                    Review Your Application
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        label: "Gold Weight",
                        value: `${weight}g at ${purity}`,
                      },
                      {
                        label: "Estimated Gold Value",
                        value: `₹${estimatedValue.toLocaleString("en-IN")}`,
                      },
                      {
                        label: "Loan Amount",
                        value: `₹${currentLoan.toLocaleString("en-IN")}`,
                      },
                      { label: "Tenure", value: `${tenure} Months` },
                      { label: "Purpose", value: purpose },
                      { label: "Applicant", value: fullName },
                      { label: "Mobile", value: mobile },
                      { label: "City", value: `${city}, ${formState}` },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="bg-slate-50 rounded-xl p-3"
                      >
                        <p className="text-[10px] text-slate-400 uppercase">
                          {item.label}
                        </p>
                        <p className="font-bold text-slate-800 text-sm mt-0.5">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between">
            {step > 0 ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                data-ocid="gold_loan.back.button"
              >
                ← Back
              </motion.button>
            ) : (
              <div />
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (step < 3) setStep(step + 1);
                else setSubmitted(true);
              }}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold px-8 py-3 rounded-xl text-sm shadow-lg shadow-orange-500/25 transition-all"
              data-ocid="gold_loan.continue.button"
            >
              {step < 3 ? "Continue →" : "Submit Application 💛"}
            </motion.button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
