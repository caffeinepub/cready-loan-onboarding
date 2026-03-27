import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

const tickets = [
  {
    id: "TKT001",
    issue: "Loan application status enquiry",
    status: "Open",
    date: "Mar 25",
    priority: "High",
  },
  {
    id: "TKT002",
    issue: "Credit score discrepancy on report",
    status: "In Progress",
    date: "Mar 22",
    priority: "Medium",
  },
  {
    id: "TKT003",
    issue: "KYC document re-upload request",
    status: "Resolved",
    date: "Mar 18",
    priority: "Low",
  },
  {
    id: "TKT004",
    issue: "EMI calculation clarification",
    status: "Resolved",
    date: "Mar 10",
    priority: "Low",
  },
];

const faqs = [
  {
    q: "How is my credit score calculated?",
    a: "Your credit score is calculated based on payment history (35%), credit utilization (30%), credit age (15%), credit mix (10%), and new inquiries (10%).",
  },
  {
    q: "How long does loan disbursal take?",
    a: "Instant loans can be disbursed within minutes. Standard personal loans typically take 1–3 business days after documentation verification.",
  },
  {
    q: "Can I prepay my loan early?",
    a: "Yes, most of our partner lenders allow prepayment. Some may charge a foreclosure fee of 2–4% of the outstanding principal.",
  },
  {
    q: "What documents are required for a personal loan?",
    a: "You typically need PAN card, Aadhaar, last 3 months' salary slips, 6 months bank statement, and address proof.",
  },
  {
    q: "Why was my loan application rejected?",
    a: "Common reasons include low credit score, high FOIR, incomplete KYC, or mismatch in documents. Contact support for a detailed review.",
  },
];

const statusColor: Record<string, string> = {
  Open: "bg-orange-100 text-orange-600",
  "In Progress": "bg-blue-100 text-blue-600",
  Resolved: "bg-green-100 text-green-700",
};

export default function Support() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-black text-slate-800">
              Support Center
            </h1>
            <p className="text-slate-500 mt-1">
              We're here to help. Average response time: 2 hours.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setChatOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 text-sm"
          >
            💬 Start Live Chat
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Open Tickets",
              val: "1",
              icon: "📋",
              color: "text-orange-500",
            },
            {
              label: "Avg Response",
              val: "2h",
              icon: "⏱",
              color: "text-indigo-500",
            },
            {
              label: "Resolved This Month",
              val: "3",
              icon: "✅",
              color: "text-green-500",
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl">
                {s.icon}
              </div>
              <div>
                <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
              My Tickets
            </h3>
            <div className="space-y-3">
              {tickets.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                  className="flex items-start justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-mono text-slate-400 mb-1">
                      {t.id}
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {t.issue}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{t.date}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColor[t.status]}`}
                  >
                    {t.status}
                  </span>
                </motion.div>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-sm text-slate-500 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
            >
              + Raise New Ticket
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
              FAQs
            </h3>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div
                  key={faq.q}
                  className="border border-slate-100 rounded-xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 text-left transition-colors"
                  >
                    {faq.q}
                    <motion.span
                      animate={{ rotate: openFAQ === i ? 180 : 0 }}
                      className="text-slate-400 flex-shrink-0 ml-2"
                    >
                      ▼
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openFAQ === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-3 text-sm text-slate-500">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.9 }}
              className="fixed bottom-8 right-8 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white font-bold text-sm">
                    Live Support
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  className="text-white/70 hover:text-white text-lg"
                >
                  ×
                </button>
              </div>
              <div className="p-4 space-y-3 bg-slate-50 min-h-[160px]">
                <div className="bg-white rounded-xl p-3 shadow-sm text-sm text-slate-700">
                  Hi Bharat! 👋 How can I help you today?
                </div>
                <div className="text-[10px] text-slate-400 text-center">
                  Connecting you to an agent...
                </div>
              </div>
              <div className="p-3 border-t border-slate-100 flex gap-2">
                <input
                  placeholder="Type your message..."
                  className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  className="bg-indigo-600 text-white rounded-xl px-3 py-2 text-sm"
                >
                  →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
