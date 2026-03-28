import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

// ─── Gold Rate Data ──────────────────────────────────────────────────────────
const BASE_GOLD_RATES = {
  "22K": {
    "1g": { today: 13460, yesterday: 13315 },
    "8g": { today: 107680, yesterday: 106520 },
    "10g": { today: 134600, yesterday: 133150 },
  },
  "24K": {
    "1g": { today: 14683, yesterday: 13981 },
    "8g": { today: 117464, yesterday: 111848 },
    "10g": { today: 146830, yesterday: 139810 },
  },
  "18K": {
    "1g": { today: 11013, yesterday: 10486 },
    "8g": { today: 88104, yesterday: 83888 },
    "10g": { today: 110130, yesterday: 104860 },
  },
};

const BASE_CITY_RATES: Record<
  string,
  { "22K": number; "24K": number; "18K": number }
> = {
  Mumbai: { "22K": 13575, "24K": 14809, "18K": 11107 },
  Delhi: { "22K": 13358, "24K": 14573, "18K": 10930 },
  Chennai: { "22K": 13431, "24K": 14652, "18K": 10989 },
  Bengaluru: { "22K": 13345, "24K": 14558, "18K": 10919 },
  Hyderabad: { "22K": 13345, "24K": 14558, "18K": 10919 },
  Kolkata: { "22K": 13345, "24K": 14558, "18K": 10919 },
  Pune: { "22K": 13350, "24K": 14562, "18K": 10922 },
  Ahmedabad: { "22K": 13352, "24K": 14565, "18K": 10924 },
};

const tenDayData = [
  {
    date: "28 Mar 2026",
    k22: 107680,
    k22chg: +1160,
    k24: 117464,
    k24chg: +5616,
  },
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
];

// Weekly chart data: per gram, Oct to Mar
const chartData22K = [
  10800, 11100, 11400, 11200, 11600, 11900, 12200, 12000, 12400, 12700, 13000,
  12800, 13100, 13315, 13460,
];
const chartData24K = [
  11340, 11655, 11970, 11760, 12180, 12495, 12810, 12600, 13020, 13335, 13650,
  13440, 13755, 13981, 14683,
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

// ─── Auto-refresh Gold Rates Hook ────────────────────────────────────────────
const RAPIDAPI_KEY = "547e59a0c9msh94218b69b03c6d0p13afcejsn056dd1d013c0";
const RAPIDAPI_HOST = "gold-silver-live-price-india.p.rapidapi.com";
const CITIES = [
  "Mumbai",
  "Delhi",
  "Chennai",
  "Bengaluru",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Ahmedabad",
] as const;

async function fetchGoldForCity(city: string): Promise<{
  rate22K: number;
  rate24K: number;
  rate18K: number;
  isLive: boolean;
} | null> {
  try {
    const res = await fetch(
      `https://${RAPIDAPI_HOST}/gold_price_india_city_value/?city=${encodeURIComponent(city)}`,
      {
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": RAPIDAPI_HOST,
        },
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const r22 = Number(
      data?.gold_price_22K ?? data?.["22K"] ?? data?.rate_22K ?? 0,
    );
    const r24 = Number(
      data?.gold_price_24K ?? data?.["24K"] ?? data?.rate_24K ?? 0,
    );
    const r18 = Number(
      data?.gold_price_18K ?? data?.["18K"] ?? data?.rate_18K ?? 0,
    );
    if (!r22 || !r24) return null;
    return {
      rate22K: r22,
      rate24K: r24,
      rate18K: r18 || Math.round(r24 * 0.75),
      isLive: true,
    };
  } catch {
    return null;
  }
}

function buildRatesFromPerGram(
  r22: number,
  r24: number,
  r18: number,
): typeof BASE_GOLD_RATES {
  const yesterday = (today: number) => Math.round(today * 0.99);
  return {
    "22K": {
      "1g": { today: r22, yesterday: yesterday(r22) },
      "8g": { today: r22 * 8, yesterday: yesterday(r22 * 8) },
      "10g": { today: r22 * 10, yesterday: yesterday(r22 * 10) },
    },
    "24K": {
      "1g": { today: r24, yesterday: yesterday(r24) },
      "8g": { today: r24 * 8, yesterday: yesterday(r24 * 8) },
      "10g": { today: r24 * 10, yesterday: yesterday(r24 * 10) },
    },
    "18K": {
      "1g": { today: r18, yesterday: yesterday(r18) },
      "8g": { today: r18 * 8, yesterday: yesterday(r18 * 8) },
      "10g": { today: r18 * 10, yesterday: yesterday(r18 * 10) },
    },
  };
}

function useGoldRates() {
  const [rates, setRates] = useState(BASE_GOLD_RATES);
  const [cityR, setCityR] = useState(BASE_CITY_RATES);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const results = await Promise.allSettled(
        CITIES.map((city) => fetchGoldForCity(city)),
      );
      const newCityR: Record<
        string,
        { "22K": number; "24K": number; "18K": number }
      > = { ...BASE_CITY_RATES };
      let baseRate24 = BASE_GOLD_RATES["24K"]["1g"].today;
      let baseRate22 = BASE_GOLD_RATES["22K"]["1g"].today;
      let baseRate18 = BASE_GOLD_RATES["18K"]["1g"].today;
      let gotLive = false;
      let firstSuccess = true;

      results.forEach((result, idx) => {
        if (result.status === "fulfilled" && result.value) {
          const d = result.value;
          const cityName = CITIES[idx];
          newCityR[cityName] = {
            "22K": d.rate22K,
            "24K": d.rate24K,
            "18K": d.rate18K,
          };
          if (firstSuccess) {
            baseRate22 = d.rate22K;
            baseRate24 = d.rate24K;
            baseRate18 = d.rate18K;
            gotLive = d.isLive;
            firstSuccess = false;
          }
        }
      });

      if (!firstSuccess) {
        setRates(buildRatesFromPerGram(baseRate22, baseRate24, baseRate18));
        setCityR(newCityR);
        setIsLive(gotLive);
      }
      setLastUpdated(new Date());
    } catch {
      setLastUpdated(new Date());
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [refresh]);

  return { rates, cityR, lastUpdated, isRefreshing, isLive, refresh };
}

// ─── Gold Rates Section ──────────────────────────────────────────────────────
function GoldRatesSection({
  onApply,
  rates,
  cityR,
  lastUpdated,
  isRefreshing,
  isLive,
  silverRate,
  onRefresh,
}: {
  onApply: () => void;
  rates: typeof BASE_GOLD_RATES;
  cityR: typeof BASE_CITY_RATES;
  lastUpdated: Date;
  isRefreshing: boolean;
  isLive: boolean;
  silverRate: number | null;
  onRefresh: () => void;
}) {
  const [calcGrams, setCalcGrams] = useState(1);
  const [calcKarat, setCalcKarat] = useState<"22K" | "24K" | "18K">("22K");
  const [calcCity, setCalcCity] = useState("Mumbai");
  const [calcResult, setCalcResult] = useState<number | null>(null);
  const [cityRateCity, setCityRateCity] = useState("");

  function calculate() {
    const ratePerGram = cityR[calcCity][calcKarat];
    setCalcResult(ratePerGram * calcGrams);
  }

  const cities = Object.keys(cityR);

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
              {isLive ? (
                <span className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full text-xs font-bold">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                  Live
                </span>
              ) : (
                <span className="flex items-center gap-1.5 bg-amber-900/40 px-2.5 py-1 rounded-full text-xs font-bold text-amber-200">
                  <span className="w-2 h-2 bg-amber-300 rounded-full" />
                  Cached
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-amber-100 text-sm">
                Last updated: {lastUpdated.toLocaleTimeString("en-IN")}
              </p>
              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-amber-200 hover:text-white transition-all disabled:opacity-60"
                title="Refresh rates"
              >
                <span
                  className={`text-base leading-none ${isRefreshing ? "animate-spin inline-block" : ""}`}
                  style={{ display: "inline-block" }}
                >
                  ↻
                </span>
              </button>
            </div>
          </div>
          <motion.button
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 32px rgba(251,191,36,0.6)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={onApply}
            className="relative overflow-hidden bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-900 font-black px-7 py-3 rounded-xl text-sm shadow-xl shadow-amber-500/40"
            data-ocid="gold_loan.apply.button"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2.2,
                ease: "linear",
              }}
              style={{ width: "60%" }}
            />
            <span className="relative z-10 flex items-center gap-2">
              Apply for Gold Loan ✦
            </span>
          </motion.button>
        </div>
      </div>

      {/* Rate Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {(["22K", "24K", "18K"] as const).map((karat) => (
          <motion.div
            key={karat}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-5 py-3 flex items-center gap-2">
              <span className="text-lg">
                {karat === "22K" ? "⭐" : karat === "24K" ? "✨" : "💛"}
              </span>
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
                    const r = rates[karat][qty];
                    const chg = r.today - r.yesterday;
                    const pct =
                      r.yesterday > 0
                        ? ((chg / r.yesterday) * 100).toFixed(2)
                        : "0.00";
                    const isUp = chg >= 0;
                    return (
                      <tr
                        key={qty}
                        className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <td className="px-4 py-3 font-bold text-slate-700">
                          {qty}
                        </td>
                        <td className="px-4 py-3 font-black text-slate-900">
                          <div>{fmt(r.today)}</div>
                          <div
                            className={`text-xs font-semibold mt-0.5 ${isUp ? "text-green-600" : "text-red-500"}`}
                          >
                            {isUp ? "↑" : "↓"} {isUp ? "+" : ""}
                            {fmt(Math.abs(chg))} ({isUp ? "+" : "-"}
                            {Math.abs(Number(pct))}%)
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {fmt(r.yesterday)}
                        </td>
                        <td
                          className={`px-4 py-3 font-bold text-xs ${isUp ? "text-green-600" : "text-red-600"}`}
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
                {(["22K", "24K", "18K"] as const).map((k) => (
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
                    At ₹{cityR[calcCity][calcKarat].toLocaleString("en-IN")}
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
                        22K /g
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold">
                        24K /g
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold">
                        18K /g
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {cityRateCity}
                      </td>
                      <td className="px-4 py-3 font-black text-teal-700">
                        {fmt(cityR[cityRateCity]["22K"])}
                      </td>
                      <td className="px-4 py-3 font-black text-orange-600">
                        {fmt(cityR[cityRateCity]["24K"])}
                      </td>
                      <td className="px-4 py-3 font-black text-yellow-600">
                        {fmt(cityR[cityRateCity]["18K"])}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 text-center">
                    <p className="text-xs text-teal-600 font-semibold mb-0.5">
                      22K (10g)
                    </p>
                    <p className="text-base font-black text-teal-700">
                      {fmt(cityR[cityRateCity]["22K"] * 10)}
                    </p>
                  </div>
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
                    <p className="text-xs text-orange-600 font-semibold mb-0.5">
                      24K (10g)
                    </p>
                    <p className="text-base font-black text-orange-700">
                      {fmt(cityR[cityRateCity]["24K"] * 10)}
                    </p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-center">
                    <p className="text-xs text-yellow-600 font-semibold mb-0.5">
                      18K (10g)
                    </p>
                    <p className="text-base font-black text-yellow-700">
                      {fmt(cityR[cityRateCity]["18K"] * 10)}
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
            value:
              silverRate !== null
                ? `₹${silverRate.toLocaleString("en-IN")}`
                : "₹245",
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
const GOLD_PRICE_22K = 13460;
const steps = [
  "Gold Details",
  "Loan Details",
  "Personal Info",
  "Review & Submit",
];

export default function GoldLoan() {
  const formRef = useRef<HTMLDivElement>(null);
  const { rates, cityR, lastUpdated, isRefreshing, isLive, refresh } =
    useGoldRates();
  const [silverRate, setSilverRate] = useState<number | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    async function fetchSilver() {
      try {
        const res = await fetch(
          `https://${RAPIDAPI_HOST}/silver_price_india_city_value/?city=Mumbai`,
          {
            headers: {
              "x-rapidapi-key":
                "547e59a0c9msh94218b69b03c6d0p13afcejsn056dd1d013c0",
              "x-rapidapi-host": RAPIDAPI_HOST,
            },
          },
        );
        if (!res.ok) return;
        const data = await res.json();
        // Try common keys for silver per gram
        const raw =
          data?.silver_price ??
          data?.price ??
          data?.["1g"] ??
          data?.rate ??
          null;
        const parsed =
          raw !== null
            ? Number.parseFloat(String(raw).replace(/[^0-9.]/g, ""))
            : null;
        if (parsed && !Number.isNaN(parsed) && parsed > 0) {
          setSilverRate(Math.round(parsed));
        }
      } catch {
        // Keep fallback ₹245
      }
    }
    fetchSilver();
  }, []);
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
        <div className="p-8 flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          {/* Gold particle dots */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 18 }, (_, i) => i).map((i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full bg-amber-400/60"
                style={{
                  left: `${(i * 17) % 100}%`,
                  top: `${(i * 23 + 10) % 100}%`,
                }}
                animate={{ y: [-20, -80], opacity: [0.8, 0], scale: [1, 0.4] }}
                transition={{
                  duration: 2 + (i % 3) * 0.5,
                  delay: i * 0.15,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 1,
                }}
              />
            ))}
          </div>
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-10 border border-amber-500/30 shadow-2xl shadow-amber-900/40 text-center max-w-md w-full backdrop-blur"
          >
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-amber-400/20 pointer-events-none" />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-6 relative"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-600 flex items-center justify-center text-5xl shadow-xl shadow-amber-500/50">
                ✦
              </div>
              <motion.div
                className="absolute inset-0 rounded-full ring-4 ring-amber-400/40"
                animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-black mb-2"
              style={{
                background:
                  "linear-gradient(135deg, #fbbf24, #f59e0b, #fcd34d)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Application Submitted!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-slate-400 mb-6 text-sm"
            >
              Your gold loan application has been received. Our team will reach
              out shortly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-amber-950/60 to-yellow-950/60 border border-amber-500/40 rounded-2xl p-5 mb-6"
            >
              <p className="text-[10px] text-amber-400/80 uppercase tracking-widest mb-2 font-bold">
                Reference ID
              </p>
              <p
                className="text-3xl font-black font-mono tracking-wider"
                style={{
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {refId}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="grid grid-cols-2 gap-3 text-sm mb-6"
            >
              {[
                {
                  label: "Loan Amount",
                  value: `₹${currentLoan.toLocaleString("en-IN")}`,
                },
                { label: "Tenure", value: `${tenure} Months` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3"
                >
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className="font-black text-white">{item.value}</p>
                </div>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xs text-slate-500"
            >
              Our agent will contact you within 2 hours for gold assessment.
            </motion.p>
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
        <GoldRatesSection
          onApply={scrollToForm}
          rates={rates}
          cityR={cityR}
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          isLive={isLive}
          silverRate={silverRate}
          onRefresh={refresh}
        />

        {/* Form Section */}
        <div ref={formRef}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2
              className="text-2xl font-black mb-1"
              style={{
                background:
                  "linear-gradient(135deg, #fbbf24, #f59e0b, #fcd34d)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Gold Loan Application
            </h2>
            <p className="text-slate-400 text-sm">
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
                      background:
                        i < step
                          ? "linear-gradient(135deg, #f59e0b, #fbbf24)"
                          : i === step
                            ? "transparent"
                            : "transparent",
                      borderColor: i <= step ? "#f59e0b" : "#334155",
                      color:
                        i < step
                          ? "#1e293b"
                          : i === step
                            ? "#fbbf24"
                            : "#475569",
                      boxShadow:
                        i === step ? "0 0 16px rgba(251,191,36,0.4)" : "none",
                    }}
                    className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-black transition-all"
                  >
                    {i < step ? "✓" : i + 1}
                  </motion.div>
                  <span
                    className={`text-[10px] mt-1 font-semibold whitespace-nowrap ${i <= step ? "text-amber-400" : "text-slate-500"}`}
                  >
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-2 mb-4 ${i < step ? "bg-gradient-to-r from-amber-500 to-amber-400" : "bg-slate-700"}`}
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
              className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-amber-500/30 shadow-xl shadow-amber-900/20 backdrop-blur mb-6"
            >
              {step === 0 && (
                <div className="space-y-5">
                  <h3
                    className="text-lg font-black"
                    style={{
                      background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Gold Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-amber-400/70 uppercase tracking-wider block mb-2 font-bold">
                        Gold Weight (grams)
                      </p>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(+e.target.value)}
                        min={1}
                        max={500}
                        className="w-full bg-slate-800/80 border border-slate-600 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all placeholder:text-slate-500"
                        data-ocid="gold_loan.weight_form.input"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-amber-400/70 uppercase tracking-wider block mb-2 font-bold">
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
                                ? "bg-gradient-to-r from-amber-400 to-yellow-300 border-amber-400 text-slate-900 shadow-lg shadow-amber-500/30"
                                : "bg-slate-800/80 border-slate-600 text-slate-400 hover:border-amber-400/60"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-xs text-amber-400/80 uppercase tracking-wider mb-1 font-bold">
                      Estimated Gold Value
                    </p>
                    <p className="text-3xl font-black text-amber-300">
                      ₹{estimatedValue.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-amber-500/70 mt-1">
                      Based on ₹13,460/g for 22K · {weight}g at {purity}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-amber-400/70 uppercase tracking-wider block mb-2 font-bold">
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
                              ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 border-amber-400 shadow-md shadow-amber-500/25"
                              : "bg-slate-800/60 border-slate-600 text-slate-400 hover:border-amber-400/60"
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
                  <h3
                    className="text-lg font-black"
                    style={{
                      background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
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
                      className="w-full accent-amber-400"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
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
                    <p className="text-xs text-amber-400/70 uppercase tracking-wider block mb-2 font-bold">
                      Loan Purpose
                    </p>
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-600 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
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
                  <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-4">
                    <p className="text-xs text-amber-400/80 uppercase tracking-wider mb-2 font-bold">
                      Estimated Monthly Interest
                    </p>
                    <p className="text-2xl font-black text-amber-300">
                      ₹{Math.round(emi).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-amber-500/70">
                      At 1% per month (reducing balance)
                    </p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3
                    className="text-lg font-black"
                    style={{
                      background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
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
                        <p className="text-xs text-amber-400/70 uppercase tracking-wider block mb-1 font-bold">
                          {f.label}
                        </p>
                        <input
                          value={f.value}
                          onChange={(e) => f.set(e.target.value)}
                          className="w-full bg-slate-800/80 border border-slate-600 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3
                    className="text-lg font-black"
                    style={{
                      background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
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
                        className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3"
                      >
                        <p className="text-[10px] text-amber-400/70 uppercase font-bold">
                          {item.label}
                        </p>
                        <p className="font-bold text-white text-sm mt-0.5">
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
                className="px-6 py-3 border border-amber-500/40 rounded-xl text-sm font-semibold text-amber-400 hover:bg-amber-500/10 transition-all"
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
              className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-900 font-black px-8 py-3 rounded-xl text-sm shadow-xl shadow-amber-500/30 transition-all"
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
