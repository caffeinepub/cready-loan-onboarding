import {
  ChevronDown,
  ChevronRight,
  Play,
  Star,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

// ─── SVG Gauge ────────────────────────────────────────────────────────────────
function CreditGauge({ score }: { score: number }) {
  const size = 220;
  const cx = 110;
  const cy = 120;
  const r = 80;
  const span = 300;
  const pct = Math.min((score - 300) / 550, 1);
  const arcLen = 2 * Math.PI * r;

  function polarToXY(angleDeg: number, radius: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  function arc(from: number, to: number, rad: number) {
    const s = polarToXY(from, rad);
    const e = polarToXY(to, rad);
    const large = to - from > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${rad} ${rad} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const trackStart = 210 - 90; // -90 offset = bottom-center is 0
  const trackEnd = trackStart + 300;

  return (
    <div className="flex flex-col items-center">
      <svg
        aria-label="Credit score gauge"
        role="img"
        width={size}
        height={size + 20}
        viewBox={`0 0 ${size} ${size + 20}`}
      >
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        {/* Track */}
        <path
          d={arc(trackStart + 90, trackEnd + 90, r)}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Fill */}
        <motion.path
          d={arc(trackStart + 90, trackEnd + 90, r)}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${arcLen}`}
          initial={{ strokeDashoffset: arcLen }}
          animate={{ strokeDashoffset: arcLen - arcLen * (span / 360) * pct }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />
        {/* Score labels */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          className="font-black"
          style={{ fontSize: 44, fontWeight: 900, fill: "#1e293b" }}
        >
          {score}
        </text>
        <text
          x={cx}
          y={cy + 16}
          textAnchor="middle"
          style={{
            fontSize: 11,
            fill: "#64748b",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          EQUIFAX SCORE
        </text>
        {/* Min/Max */}
        {(() => {
          const a = polarToXY(trackStart + 90, r + 22);
          return (
            <text
              x={a.x}
              y={a.y}
              textAnchor="middle"
              style={{ fontSize: 9, fill: "#94a3b8" }}
            >
              300
            </text>
          );
        })()}
        {(() => {
          const a = polarToXY(trackEnd + 90, r + 22);
          return (
            <text
              x={a.x}
              y={a.y}
              textAnchor="middle"
              style={{ fontSize: 9, fill: "#94a3b8" }}
            >
              850
            </text>
          );
        })()}
      </svg>
      <div className="flex flex-col items-center gap-1 -mt-6">
        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
          ✦ Excellent Score
        </span>
        <span className="text-xs text-slate-400 mt-1">Top 5% in India</span>
      </div>
    </div>
  );
}

// ─── Score History ────────────────────────────────────────────────────────────
const scoreHistory = [
  { month: "Oct", score: 720 },
  { month: "Nov", score: 731 },
  { month: "Dec", score: 745 },
  { month: "Jan", score: 758 },
  { month: "Feb", score: 770 },
  { month: "Mar", score: 777 },
];

function ScoreHistoryBar({
  score,
  month,
  index,
  max,
}: { score: number; month: string; index: number; max: number }) {
  const pct = ((score - 680) / (max - 680)) * 100;
  const hue = 210 + ((score - 680) / (max - 680)) * 60;
  const color = `hsl(${hue}, 80%, 50%)`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08 }}
      className="flex flex-col items-center gap-2 flex-1"
    >
      <span className="text-sm font-black text-indigo-700">{score}</span>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{
            duration: 0.8,
            delay: 0.2 + index * 0.1,
            ease: "easeOut",
          }}
        />
      </div>
      <span className="text-xs text-gray-500 font-medium">{month}</span>
    </motion.div>
  );
}

// ─── Score Booster Challenge ──────────────────────────────────────────────────
const challengeTasks = [
  { id: "t1", label: "Reduce credit utilization below 30%", pts: 15 },
  { id: "t2", label: "Pay all dues on time this month", pts: 10 },
  { id: "t3", label: "Avoid new credit inquiries", pts: 8 },
  { id: "t4", label: "Dispute any incorrect entries", pts: 12 },
  { id: "t5", label: "Maintain old credit accounts", pts: 5 },
  { id: "t6", label: "Keep credit card balance under ₹36,000", pts: 10 },
];

function ScoreBooster() {
  const baseScore = 777;
  const target = 827;
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const gained = challengeTasks
    .filter((t) => checked.has(t.id))
    .reduce((a, b) => a + b.pts, 0);
  const currentScore = baseScore + gained;
  const progress = ((currentScore - baseScore) / (target - baseScore)) * 100;

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6"
      data-ocid="credit.score_booster.card"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">
              Score Booster
            </div>
            <h3 className="text-xl font-black text-white">
              Boost Your Credit Score To 800+
            </h3>
          </div>
          <div className="text-3xl">🚀</div>
        </div>
        {/* Progress toward 827 */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-indigo-200">Current Score</span>
            <span className="text-xs text-indigo-200">Target: 827</span>
          </div>
          <div className="flex items-center gap-3">
            <motion.span
              key={currentScore}
              initial={{ scale: 1.3, color: "#fff" }}
              animate={{ scale: 1, color: "#fff" }}
              className="text-3xl font-black text-white"
            >
              {currentScore}
            </motion.span>
            <div className="flex-1">
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-300"
                  animate={{ width: `${Math.max(progress, 0)}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between mt-0.5">
                <span className="text-[10px] text-indigo-200">777</span>
                <span className="text-[10px] text-indigo-200">827</span>
              </div>
            </div>
            <span className="text-xl font-black text-white">827</span>
          </div>
          {gained > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center gap-1"
            >
              <span className="text-xs font-bold text-emerald-300">
                +{gained} pts earned
              </span>
              {checked.size === challengeTasks.length && (
                <span className="text-xs bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold ml-1">
                  🎉 All Complete!
                </span>
              )}
            </motion.div>
          )}
        </div>
      </div>
      {/* Tasks */}
      <div className="p-6">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">
          Complete these tasks to boost your score
        </p>
        <div className="space-y-3">
          {challengeTasks.map((task, i) => {
            const done = checked.has(task.id);
            return (
              <motion.button
                key={task.id}
                type="button"
                onClick={() => toggle(task.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                data-ocid={`credit.booster_task.${i + 1}`}
                className={`w-full flex items-center gap-4 p-3.5 rounded-xl border transition-all text-left ${
                  done
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-100 hover:bg-indigo-50 hover:border-indigo-100"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    done ? "bg-green-500 border-green-500" : "border-gray-300"
                  }`}
                >
                  {done && (
                    <svg
                      aria-hidden="true"
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 12 12"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`flex-1 text-sm font-medium ${done ? "text-green-700 line-through" : "text-gray-700"}`}
                >
                  {task.label}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                    done
                      ? "bg-green-100 text-green-600"
                      : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  +{task.pts} pts
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── FD Credit Cards ──────────────────────────────────────────────────────────
const fdCards = [
  {
    id: "sbm",
    name: "SBM ZET Credit Card",
    bank: "SBM Bank",
    fdFrom: "₹2,000",
    fee: "Lifetime Free",
    feeColor: "bg-green-100 text-green-700",
    benefits: [
      "20% off on Swiggy & Zomato",
      "5% cashback on Amazon & Flipkart",
    ],
    color: "from-purple-500 to-indigo-600",
    logo: "🏦",
  },
  {
    id: "tata",
    name: "Tata Neu Infinity HDFC Bank",
    bank: "HDFC Bank",
    fdFrom: "₹15,000",
    fee: "1st Year: ₹1,499 waived",
    feeColor: "bg-blue-100 text-blue-700",
    benefits: [
      "Up to 10% value-back on Tata Neu",
      "8 domestic lounge visits/yr",
    ],
    color: "from-blue-500 to-cyan-600",
    logo: "💳",
  },
  {
    id: "idfc",
    name: "IDFC FIRST Earn Credit Card",
    bank: "IDFC FIRST Bank",
    fdFrom: "₹5,000",
    fee: "1st Year: ₹499 waived",
    feeColor: "bg-orange-100 text-orange-700",
    benefits: [
      "1% cashback on all UPI spends",
      "Save ₹1,200/yr on movie tickets",
    ],
    color: "from-orange-400 to-pink-500",
    logo: "🎯",
  },
];

function FDCreditCards() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6"
      data-ocid="credit.fd_cards.card"
    >
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Credit Cards to Improve CIBIL Score
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            FD-backed secured credit cards — best way to build credit
          </p>
        </div>
        <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">
          FD-Backed
        </span>
      </div>
      <div className="divide-y divide-gray-50">
        {fdCards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 + i * 0.08 }}
            className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
            data-ocid={`credit.fd_card.${i + 1}`}
          >
            {/* Card visual */}
            <div
              className={`w-14 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-xl flex-shrink-0 relative`}
            >
              {card.logo}
              <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full">
                FD
              </span>
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-gray-900 truncate">
                  {card.name}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${card.feeColor}`}
                >
                  {card.fee}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                FD starting from {card.fdFrom} · {card.bank}
              </div>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {card.benefits.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
            {/* Actions */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                data-ocid={`credit.fd_card_eligibility.${i + 1}`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                Check Eligibility
              </motion.button>
              <button
                type="button"
                className="text-[11px] text-indigo-500 hover:underline"
              >
                + More Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Detail Panel helpers (light theme) ──────────────────────────────────────
function TipBox({
  color,
  children,
}: { color: string; children: React.ReactNode }) {
  const map: Record<string, { border: string; bg: string; text: string }> = {
    green: { border: "#22c55e", bg: "#f0fdf4", text: "#166534" },
    red: { border: "#ef4444", bg: "#fef2f2", text: "#991b1b" },
    blue: { border: "#3b82f6", bg: "#eff6ff", text: "#1e40af" },
    yellow: { border: "#f59e0b", bg: "#fffbeb", text: "#92400e" },
    teal: { border: "#14b8a6", bg: "#f0fdfa", text: "#134e4a" },
  };
  const s = map[color] ?? map.blue;
  return (
    <div
      className="rounded-lg p-3 text-xs leading-relaxed"
      style={{
        borderLeft: `3px solid ${s.border}`,
        background: s.bg,
        color: s.text,
      }}
    >
      {children}
    </div>
  );
}

function ActionBtn({ label, ocid }: { label: string; ocid: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      data-ocid={ocid}
      className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600"
    >
      {label}
    </motion.button>
  );
}

function StatGrid({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-lg px-3 py-2 bg-gray-50 border border-gray-100"
        >
          <div className="text-gray-900 font-bold text-sm">{s.value}</div>
          <div className="text-gray-400 text-[10px] mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function PaymentDetail() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return (
    <div className="space-y-4">
      <StatGrid
        stats={[
          { label: "On-Time Payments", value: "48/48" },
          { label: "Late Payments", value: "0" },
          { label: "Missed", value: "0" },
          { label: "Worst Ever", value: "Never" },
        ]}
      />
      <div>
        <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-2">
          Last 6 Months
        </p>
        <div className="flex gap-3">
          {months.map((m) => (
            <div key={m} className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-green-600 bg-green-50 border border-green-200">
                <svg
                  aria-hidden="true"
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 12 12"
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-[9px] text-gray-400">{m}</span>
            </div>
          ))}
        </div>
      </div>
      <TipBox color="green">
        Perfect payment record! This is the single biggest factor in your credit
        score (35% weight).
      </TipBox>
      <ActionBtn
        label="Set Payment Reminders →"
        ocid="insight.payment.action_button"
      />
    </div>
  );
}

function UtilisationDetail() {
  const pct = 75;
  return (
    <div className="space-y-4">
      <StatGrid
        stats={[
          { label: "Current Utilisation", value: "310%" },
          { label: "Recommended", value: "<30%" },
          { label: "Total Limit", value: "₹1,20,000" },
          { label: "Used", value: "₹90,000" },
        ]}
      />
      <div>
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>Used ₹90,000</span>
          <span>Free ₹30,000</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-400 to-orange-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 text-[10px] px-2 py-1 rounded-full w-fit bg-amber-50 text-amber-700 border border-amber-100">
          ⚠ High utilisation can reduce score by 50–80 pts
        </div>
      </div>
      <TipBox color="red">
        Try to reduce credit card balance to below ₹36,000 to stay under the 30%
        threshold.
      </TipBox>
      <ActionBtn
        label="Request Limit Increase →"
        ocid="insight.utilisation.action_button"
      />
    </div>
  );
}

function AgeDetail() {
  const accounts = [
    { label: "Home Loan", age: 8, color: "#818cf8" },
    { label: "Credit Card 1", age: 5, color: "#a78bfa" },
    { label: "Auto Loan", age: 4, color: "#60a5fa" },
    { label: "Credit Card 2", age: 3, color: "#34d399" },
    { label: "Personal Loan", age: 2, color: "#f472b6" },
    { label: "Savings OD", age: 1.3, color: "#fb923c" },
  ];
  const max = 8;
  return (
    <div className="space-y-4">
      <StatGrid
        stats={[
          { label: "Oldest Account", value: "8Y 0M" },
          { label: "Newest Account", value: "1Y 4M" },
          { label: "Average Age", value: "4Y 8M" },
          { label: "Accounts", value: "6" },
        ]}
      />
      <div className="space-y-1.5">
        <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-2">
          Account Age Timeline
        </p>
        {accounts.map((a) => (
          <div key={a.label} className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 w-24 flex-shrink-0 truncate">
              {a.label}
            </span>
            <div className="flex-1 h-2 rounded-full bg-gray-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(a.age / max) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: a.color }}
              />
            </div>
            <span className="text-[10px] text-gray-400 w-8 text-right">
              {a.age}Y
            </span>
          </div>
        ))}
      </div>
      <TipBox color="blue">
        Don't close your oldest accounts. Age contributes ~15% to your score.
      </TipBox>
    </div>
  );
}

function EnquiriesDetail() {
  const monthlyData = [
    { month: "Oct", count: 2 },
    { month: "Nov", count: 1 },
    { month: "Dec", count: 3 },
    { month: "Jan", count: 0 },
    { month: "Feb", count: 1 },
    { month: "Mar", count: 1 },
  ];
  const maxCount = 3;
  return (
    <div className="space-y-4">
      <StatGrid
        stats={[
          { label: "Hard Enquiries", value: "8" },
          { label: "Soft Enquiries", value: "3" },
          { label: "Last 6 Months", value: "2" },
          { label: "Last 12 Months", value: "8" },
        ]}
      />
      <div>
        <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-2">
          Enquiries per Month
        </p>
        <div className="flex items-end gap-2 h-16">
          {monthlyData.map((d) => (
            <div
              key={d.month}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div
                className="w-full flex items-end justify-center"
                style={{ height: "44px" }}
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{
                    height:
                      d.count === 0 ? 4 : `${(d.count / maxCount) * 44}px`,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full rounded-t"
                  style={{
                    background:
                      d.count === 0
                        ? "#f1f5f9"
                        : "linear-gradient(180deg, #f59e0b, #d97706)",
                  }}
                />
              </div>
              <span className="text-[9px] text-gray-400">{d.month}</span>
            </div>
          ))}
        </div>
      </div>
      <TipBox color="yellow">
        Each hard enquiry can lower score by 5–10 pts temporarily. Space out
        loan applications.
      </TipBox>
      <ActionBtn
        label="View All Enquiries →"
        ocid="insight.enquiries.action_button"
      />
    </div>
  );
}

function AccountDetail() {
  const segments = [
    { label: "Credit Cards", pct: 40, color: "#818cf8" },
    { label: "Home Loan", pct: 35, color: "#34d399" },
    { label: "Personal Loan", pct: 25, color: "#fb923c" },
  ];
  return (
    <div className="space-y-4">
      <StatGrid
        stats={[
          { label: "Active Accounts", value: "4" },
          { label: "Closed Accounts", value: "2" },
          { label: "Credit Cards", value: "2" },
          { label: "Loans", value: "2" },
        ]}
      />
      <div>
        <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-2">
          Credit Mix Breakdown
        </p>
        <div className="h-4 rounded-full overflow-hidden flex bg-gray-100">
          {segments.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ width: 0 }}
              animate={{ width: `${s.pct}%` }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: "easeOut" }}
              className="h-full"
              style={{ background: s.color }}
            />
          ))}
        </div>
        <div className="flex gap-4 mt-2">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: s.color }}
              />
              <span className="text-[10px] text-gray-400">
                {s.label} {s.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
      <TipBox color="teal">
        A healthy credit mix shows lenders you can manage different types of
        credit.
      </TipBox>
    </div>
  );
}

function InsightDrillDown({ label }: { label: string }) {
  switch (label) {
    case "Payment":
      return <PaymentDetail />;
    case "Utilisation":
      return <UtilisationDetail />;
    case "Age":
      return <AgeDetail />;
    case "Enquiries":
      return <EnquiriesDetail />;
    case "Accounts":
      return <AccountDetail />;
    default:
      return null;
  }
}

const insights = [
  {
    label: "Payment",
    impact: "High Impact",
    impactColor: "bg-red-50 text-red-600",
    value: "64%",
    sub: "Timely Payment",
    icon: "💳",
    progressColor: "from-green-400 to-emerald-500",
    progress: 64,
  },
  {
    label: "Utilisation",
    impact: "High Impact",
    impactColor: "bg-red-50 text-red-600",
    value: "310%",
    sub: "Total utilisation",
    icon: "📊",
    progressColor: "from-red-400 to-orange-500",
    progress: 80,
  },
  {
    label: "Age",
    impact: "Medium Impact",
    impactColor: "bg-amber-50 text-amber-600",
    value: "8Y 0M",
    sub: "Oldest account",
    icon: "📅",
    progressColor: "from-blue-400 to-indigo-500",
    progress: 70,
  },
  {
    label: "Enquiries",
    impact: "Medium Impact",
    impactColor: "bg-amber-50 text-amber-600",
    value: "8",
    sub: "Hard enquiries",
    icon: "🔍",
    progressColor: "from-yellow-400 to-amber-500",
    progress: 55,
  },
  {
    label: "Accounts",
    impact: "Low Impact",
    impactColor: "bg-green-50 text-green-600",
    value: "6",
    sub: "Total accounts",
    icon: "🏦",
    progressColor: "from-violet-400 to-purple-500",
    progress: 85,
  },
];

function InsightRow({
  item,
  index,
}: { item: (typeof insights)[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.08 }}
      data-ocid={`insight.item.${index + 1}`}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 py-4 px-5 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
      >
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-semibold text-gray-800 text-sm">
              {item.label}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.impactColor}`}
            >
              {item.impact}
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.progress}%` }}
              transition={{
                duration: 1,
                delay: 0.6 + index * 0.1,
                ease: "easeOut",
              }}
              className={`h-full rounded-full bg-gradient-to-r ${item.progressColor}`}
            />
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-gray-800 font-bold text-sm">{item.value}</div>
          <div className="text-gray-400 text-[10px]">{item.sub}</div>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 ml-1"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mx-3 mb-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <InsightDrillDown label={item.label} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CreditReport() {
  const score = 777;
  const maxHistory = Math.max(...scoreHistory.map((s) => s.score));

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          {/* ─── Page Header ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-black text-gray-900">Credit Report</h1>
            <p className="text-gray-500 text-sm mt-1">
              Your complete credit health overview · Last updated: 27 Mar 2026
            </p>
          </motion.div>

          {/* ─── Score Hero ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6"
            data-ocid="credit.score_hero.card"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left: Gauge */}
              <div className="flex flex-col items-center">
                <CreditGauge score={score} />
                <div className="flex gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      ECN
                    </p>
                    <p className="text-sm font-bold text-gray-700">
                      CR7845291036
                    </p>
                  </div>
                  <div className="w-px bg-gray-200" />
                  <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Name
                    </p>
                    <p className="text-sm font-bold text-gray-700">
                      Rahul Sharma
                    </p>
                  </div>
                  <div className="w-px bg-gray-200" />
                  <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Bureau
                    </p>
                    <p className="text-sm font-bold text-gray-700">Equifax</p>
                  </div>
                </div>
              </div>
              {/* Right: Info */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-2xl font-black text-gray-900">
                    Score: {score} —{" "}
                  </h2>
                  <span className="text-xl font-black bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent">
                    EXCELLENT
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-6">
                  You're in the top 5% of credit holders in India. Your
                  financial health is outstanding.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    {
                      label: "Total Accounts",
                      value: "6",
                      icon: "🏦",
                      color: "bg-violet-50 text-violet-700",
                    },
                    {
                      label: "Active Loans",
                      value: "2",
                      icon: "📋",
                      color: "bg-blue-50 text-blue-700",
                    },
                    {
                      label: "Credit Cards",
                      value: "2",
                      icon: "💳",
                      color: "bg-pink-50 text-pink-700",
                    },
                    {
                      label: "On-Time Pay",
                      value: "100%",
                      icon: "✅",
                      color: "bg-green-50 text-green-700",
                    },
                  ].map((s, i) => (
                    <div
                      key={s.label}
                      className={`rounded-xl p-3 ${s.color} flex items-center gap-3`}
                      data-ocid={`credit.stat.card.${i + 1}`}
                    >
                      <span className="text-xl">{s.icon}</span>
                      <div>
                        <div className="font-black text-lg leading-none">
                          {s.value}
                        </div>
                        <div className="text-xs opacity-70 mt-0.5">
                          {s.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    data-ocid="credit.score_plus.button"
                    className="flex-1 py-2.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600"
                  >
                    <Star size={14} />
                    Join Score Plus
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    data-ocid="credit.progress.button"
                    className="flex-1 py-2.5 rounded-xl font-semibold text-indigo-600 text-sm flex items-center justify-center gap-2 border-2 border-indigo-100 bg-indigo-50"
                  >
                    <TrendingUp size={14} />
                    Credit Progress
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── Score History ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6"
            data-ocid="credit.score_history.card"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Score History (6 Months)
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Your credit score trajectory
                </p>
              </div>
              <span className="text-xs bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full border border-green-100">
                ↑ +57 pts in 6 months
              </span>
            </div>
            <div className="flex gap-3">
              {scoreHistory.map((s, i) => (
                <ScoreHistoryBar
                  key={s.month}
                  score={s.score}
                  month={s.month}
                  index={i}
                  max={maxHistory}
                />
              ))}
            </div>
          </motion.div>

          {/* ─── Score Booster Challenge ──────────────────────────────── */}
          <ScoreBooster />

          {/* ─── FD Credit Cards ──────────────────────────────────────── */}
          <FDCreditCards />

          {/* ─── Report Insights ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6"
            data-ocid="credit.report_insights.card"
          >
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
              <div>
                <h3 className="text-gray-900 font-bold text-sm">
                  Report Insights
                </h3>
                <p className="text-gray-400 text-xs">
                  5 factors affecting your score · tap any row to expand
                </p>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
            <div className="divide-y divide-gray-50">
              {insights.map((item, i) => (
                <InsightRow key={item.label} item={item} index={i} />
              ))}
            </div>
          </motion.div>

          {/* ─── Score Plus Banner ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl p-6 mb-6 relative overflow-hidden bg-gradient-to-r from-amber-500 to-yellow-400"
            data-ocid="credit.score_plus_banner.card"
          >
            <div className="relative z-10 flex items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={16} className="text-amber-900" />
                  <span className="text-amber-900 text-xs font-bold uppercase tracking-widest">
                    Introducing Score Plus
                  </span>
                </div>
                <h3 className="text-amber-950 text-lg font-black mb-2">
                  Unlock Premium Credit Insights
                </h3>
                <p className="text-amber-800 text-sm mb-4">
                  Get detailed analysis, personalized recommendations, and
                  real-time score monitoring with Score Plus.
                </p>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  data-ocid="credit.score_plus_cta.button"
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-amber-950 text-amber-100"
                >
                  Learn More →
                </motion.button>
              </div>
              <div className="w-40 h-28 rounded-xl overflow-hidden relative flex-shrink-0 bg-amber-400/40 border border-amber-300/50 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer bg-amber-900/30 border-2 border-amber-950"
                  data-ocid="credit.score_plus_video.button"
                >
                  <Play size={18} className="text-amber-950 ml-1" />
                </motion.div>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="text-[10px] text-amber-900/70 font-medium">
                    Score Plus Overview
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── Recommended Section Header ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="flex items-center gap-4 mb-5"
          >
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-gray-400 text-sm font-semibold tracking-wider uppercase">
              Recommended for you
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </motion.div>

          {/* Recommended Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              data-ocid="credit.recommended.card.1"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">
                    Personal Loan
                  </div>
                  <h4 className="text-base font-black text-gray-900">
                    Pre-approved ₹5,00,000
                  </h4>
                </div>
                <span className="bg-green-50 text-green-600 text-xs font-bold px-2 py-0.5 rounded-full border border-green-100">
                  98% Approval
                </span>
              </div>
              <div className="flex gap-4 mb-4">
                <div>
                  <p className="text-[10px] text-gray-400">Interest</p>
                  <p className="font-bold text-gray-800 text-sm">10.5% p.a.</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Tenure</p>
                  <p className="font-bold text-gray-800 text-sm">Up to 5Y</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">EMI from</p>
                  <p className="font-bold text-gray-800 text-sm">₹10,748</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-ocid="credit.recommended_loan.button"
                className="w-full py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600"
              >
                Apply Now →
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              data-ocid="credit.recommended.card.2"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
                    Credit Card
                  </div>
                  <h4 className="text-base font-black text-gray-900">
                    Axis Bank Ace Credit Card
                  </h4>
                </div>
                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full border border-blue-100">
                  Lifetime Free
                </span>
              </div>
              <div className="flex gap-4 mb-4">
                <div>
                  <p className="text-[10px] text-gray-400">Cashback</p>
                  <p className="font-bold text-gray-800 text-sm">Up to 5%</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Limit</p>
                  <p className="font-bold text-gray-800 text-sm">Up to ₹3L</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Lounge</p>
                  <p className="font-bold text-gray-800 text-sm">4 visits/yr</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-ocid="credit.recommended_card.button"
                className="w-full py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-500"
              >
                Check Eligibility →
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
