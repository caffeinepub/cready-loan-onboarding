import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

type Ticket = {
  id: string;
  issue: string;
  status: string;
  date: string;
  priority: string;
  category?: string;
};

const initialTickets: Ticket[] = [
  {
    id: "TKT001",
    issue: "Loan application status enquiry",
    status: "Open",
    date: "Mar 25",
    priority: "High",
    category: "🏦 Loan Application",
  },
  {
    id: "TKT002",
    issue: "Credit score discrepancy on report",
    status: "In Progress",
    date: "Mar 22",
    priority: "Medium",
    category: "📊 Credit Score",
  },
  {
    id: "TKT003",
    issue: "KYC document re-upload request",
    status: "Resolved",
    date: "Mar 18",
    priority: "Low",
    category: "📄 KYC/Documents",
  },
  {
    id: "TKT004",
    issue: "EMI calculation clarification",
    status: "Resolved",
    date: "Mar 10",
    priority: "Low",
    category: "💰 EMI/Repayment",
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

const priorityColor: Record<string, string> = {
  Low: "bg-green-100 text-green-700 border-green-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  High: "bg-red-100 text-red-600 border-red-200",
};

const categories = [
  { emoji: "🏦", label: "Loan Application" },
  { emoji: "📊", label: "Credit Score" },
  { emoji: "📄", label: "KYC/Documents" },
  { emoji: "💰", label: "EMI/Repayment" },
  { emoji: "🔒", label: "Account Security" },
  { emoji: "❓", label: "General Enquiry" },
];

export default function Support() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [newTicketId, setNewTicketId] = useState("");

  // Form state
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function openModal() {
    setSelectedCategory("");
    setPriority("Medium");
    setSubject("");
    setDescription("");
    setFileName("");
    setSubmitted(false);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSubmitted(false);
  }

  function handleSubmit() {
    if (!selectedCategory || !subject.trim() || !description.trim()) return;
    const id = `TKT00${tickets.length + 1}`;
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
    const newTicket: Ticket = {
      id,
      issue: subject.trim(),
      status: "Open",
      date: dateStr,
      priority,
      category: `${categories.find((c) => c.label === selectedCategory)?.emoji} ${selectedCategory}`,
    };
    setNewTicketId(id);
    setTickets((prev) => [newTicket, ...prev]);
    setSubmitted(true);
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
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
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 text-sm w-full sm:w-auto"
          >
            💬 Start Live Chat
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            {
              label: "Open Tickets",
              val: String(tickets.filter((t) => t.status === "Open").length),
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
              val: String(
                tickets.filter((t) => t.status === "Resolved").length,
              ),
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  transition={{ delay: 0.25 + i * 0.06 }}
                  className="flex items-start justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  data-ocid={`ticket.item.${i + 1}`}
                >
                  <div>
                    <p className="text-xs font-mono text-slate-400 mb-0.5">
                      {t.id}
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {t.issue}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-slate-400">{t.date}</p>
                      {t.category && (
                        <p className="text-xs text-slate-400">{t.category}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColor[t.status]}`}
                    >
                      {t.status}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityColor[t.priority]}`}
                    >
                      {t.priority}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openModal}
              data-ocid="ticket.open_modal_button"
              className="mt-4 w-full py-2.5 bg-gradient-to-r from-indigo-50 to-violet-50 border border-dashed border-indigo-300 rounded-xl text-sm font-semibold text-indigo-600 hover:from-indigo-100 hover:to-violet-100 hover:border-indigo-400 transition-all"
            >
              ✦ Raise New Ticket
            </motion.button>
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

        {/* Raise Ticket Modal */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              data-ocid="ticket.modal"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 30 }}
                transition={{ type: "spring", damping: 22, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
              >
                {/* Modal Header */}
                <div className="relative bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-6 overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    {["orb-a", "orb-b", "orb-c", "orb-d"].map((key, i) => (
                      <motion.div
                        key={key}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 3 + i,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.7,
                        }}
                        className="absolute rounded-full bg-white"
                        style={{
                          width: `${60 + i * 40}px`,
                          height: `${60 + i * 40}px`,
                          top: `${-20 + i * 10}px`,
                          right: `${-20 + i * 15}px`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-xl backdrop-blur-sm">
                        🎫
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-white">
                          Raise a Ticket
                        </h2>
                        <p className="text-indigo-200 text-xs">
                          We'll get back to you within 2 hours
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={closeModal}
                      data-ocid="ticket.close_button"
                      className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-6 space-y-5 max-h-[70vh] overflow-y-auto"
                    >
                      {/* Category Grid */}
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                          Issue Category <span className="text-red-400">*</span>
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {categories.map((cat) => (
                            <motion.button
                              key={cat.label}
                              type="button"
                              whileHover={{ y: -2, scale: 1.02 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setSelectedCategory(cat.label)}
                              data-ocid={`ticket.${cat.label.toLowerCase().replace(/\//g, "-").replace(/ /g, "_")}.button`}
                              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 text-center transition-all ${
                                selectedCategory === cat.label
                                  ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-500/20"
                                  : "border-slate-100 bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50/50"
                              }`}
                            >
                              <span className="text-xl">{cat.emoji}</span>
                              <span
                                className={`text-[10px] font-bold leading-tight ${selectedCategory === cat.label ? "text-indigo-700" : "text-slate-600"}`}
                              >
                                {cat.label}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Priority */}
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                          Priority
                        </p>
                        <div className="flex gap-2">
                          {["Low", "Medium", "High"].map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setPriority(p)}
                              data-ocid={`ticket.priority_${p.toLowerCase()}.button`}
                              className={`flex-1 py-2 rounded-xl border-2 text-xs font-bold transition-all ${
                                priority === p
                                  ? p === "Low"
                                    ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
                                    : p === "Medium"
                                      ? "border-amber-500 bg-amber-50 text-amber-700 shadow-sm"
                                      : "border-red-500 bg-red-50 text-red-600 shadow-sm"
                                  : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                              }`}
                            >
                              {p === "Low"
                                ? "🟢"
                                : p === "Medium"
                                  ? "🟡"
                                  : "🔴"}{" "}
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label
                          htmlFor="ticket-subject"
                          className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2"
                        >
                          Subject <span className="text-red-400">*</span>
                        </label>
                        <input
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="Brief summary of your issue..."
                          id="ticket-subject"
                          data-ocid="ticket.input"
                          className="w-full border-2 border-slate-100 focus:border-indigo-400 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label
                          htmlFor="ticket-description"
                          className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2"
                        >
                          Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Describe your issue in detail..."
                          rows={3}
                          id="ticket-description"
                          data-ocid="ticket.textarea"
                          className="w-full border-2 border-slate-100 focus:border-indigo-400 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                        />
                      </div>

                      {/* Attachment */}
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                          Attachment (Optional)
                        </p>
                        <motion.div
                          whileHover={{ borderColor: "#6366f1" }}
                          onClick={() => fileRef.current?.click()}
                          data-ocid="ticket.dropzone"
                          className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-indigo-50/50 transition-all"
                        >
                          <span className="text-2xl">📎</span>
                          <p className="text-xs text-slate-400 text-center">
                            {fileName ? (
                              <span className="text-indigo-600 font-semibold">
                                {fileName}
                              </span>
                            ) : (
                              <>
                                <span className="text-indigo-600 font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                                <br />
                                PNG, JPG, PDF up to 10MB
                              </>
                            )}
                          </p>
                          <input
                            ref={fileRef}
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) =>
                              setFileName(e.target.files?.[0]?.name ?? "")
                            }
                            data-ocid="ticket.upload_button"
                          />
                        </motion.div>
                      </div>

                      {/* Submit */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        disabled={
                          !selectedCategory ||
                          !subject.trim() ||
                          !description.trim()
                        }
                        data-ocid="ticket.submit_button"
                        className="relative w-full py-3 rounded-2xl font-bold text-sm text-white overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all group"
                      >
                        <span className="relative z-10">🚀 Submit Ticket</span>
                        <motion.div
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                        />
                      </motion.button>
                    </motion.div>
                  ) : (
                    /* Success State */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-8 flex flex-col items-center text-center gap-4"
                      data-ocid="ticket.success_state"
                    >
                      <div className="relative">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            damping: 12,
                            stiffness: 200,
                            delay: 0.1,
                          }}
                          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
                        >
                          <span className="text-4xl">✅</span>
                        </motion.div>
                        {[1, 2, 3].map((r) => (
                          <motion.div
                            key={r}
                            initial={{ scale: 0.8, opacity: 0.6 }}
                            animate={{ scale: 2 + r * 0.4, opacity: 0 }}
                            transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: r * 0.3,
                            }}
                            className="absolute inset-0 rounded-full border-2 border-green-400"
                          />
                        ))}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-800">
                          Ticket Raised! 🎉
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">
                          Your ticket has been submitted successfully.
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-4 w-full">
                        <p className="text-xs text-slate-400 mb-1">Ticket ID</p>
                        <p className="text-2xl font-black text-indigo-700">
                          {newTicketId}
                        </p>
                        <div className="mt-3 flex items-center justify-center gap-2 text-green-600">
                          <span className="text-sm">⏱</span>
                          <p className="text-sm font-semibold">
                            Expected response within 2 hours
                          </p>
                        </div>
                      </div>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={closeModal}
                        data-ocid="ticket.close_button"
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 text-sm"
                      >
                        Done ✓
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.9 }}
              className="fixed bottom-0 right-0 sm:bottom-8 sm:right-8 w-full sm:w-80 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50"
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
