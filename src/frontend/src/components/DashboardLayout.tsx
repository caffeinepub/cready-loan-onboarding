import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const mainMenu = [
  { label: "Dashboard", path: "/dashboard", icon: "⊞" },
  { label: "My Offers", path: "/my-offers", icon: "◈" },
  { label: "Credit Report", path: "/credit-report", icon: "📊" },
  { label: "Profile", path: "/profile", icon: "👤" },
  { label: "Calculators", path: "/calculators", icon: "🧮" },
  { label: "Support", path: "/support", icon: "🎧" },
  { label: "Gold Loan", path: "/gold-loan", icon: "💛" },
];

const toolsMenu = [{ label: "IFSC Finder", path: "/ifsc-finder", icon: "🏦" }];

const bottomTabs = [
  {
    label: "Overview",
    path: "/dashboard",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-5 h-5"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Loans",
    path: "/my-offers",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-5 h-5"
      >
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    label: "Credit",
    path: "/credit-report",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-5 h-5"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    label: "Settings",
    path: "/profile",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-5 h-5"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const faqItems = [
  {
    q: "How is my credit score calculated?",
    a: "Your CIBIL score (300–900) is calculated based on payment history (35%), credit utilization (30%), credit age (15%), credit mix (10%), and new inquiries (10%).",
  },
  {
    q: "When will I receive my loan?",
    a: "Approved loans are disbursed within 24–48 hours after document verification. Instant disbursal is available for pre-approved offers.",
  },
  {
    q: "What documents do I need?",
    a: "PAN card, Aadhaar, last 3 months salary slips (salaried) or last 2 years ITR (self-employed), and 6 months bank statements.",
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const chatNextId = useRef(3);
  const [chatMessages, setChatMessages] = useState<
    { id: number; from: string; text: string }[]
  >([
    {
      id: 0,
      from: "bot",
      text: "Hi! I'm Cready AI. How can I help you today?",
    },
    {
      id: 1,
      from: "bot",
      text: "Common questions: loan status, credit score, EMI calculator",
    },
    { id: 2, from: "bot", text: "Type your question below or pick from FAQ ↓" },
  ]);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const allMenuItems = [...mainMenu, ...toolsMenu];
  const filteredMenu = searchQuery
    ? allMenuItems.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allMenuItems;

  function handleDrawerTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleDrawerTouchEnd(e: React.TouchEvent) {
    touchEndX.current = e.changedTouches[0].clientX;
    if (touchStartX.current - touchEndX.current > 60) {
      setMobileDrawerOpen(false);
    }
  }

  function sendChat() {
    if (!chatInput.trim()) return;
    const uid = chatNextId.current;
    chatNextId.current += 2;
    setChatMessages((prev) => [
      ...prev,
      { id: uid, from: "user", text: chatInput },
      {
        id: uid + 1,
        from: "bot",
        text: "Thanks for your question! Our support team will get back to you shortly. You can also check /support for help.",
      },
    ]);
    setChatInput("");
  }

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = mobileDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

  return (
    <div className="min-h-screen flex font-sans bg-slate-50">
      {/* Desktop Sidebar */}
      <motion.div
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="min-h-screen bg-[#0f172a] hidden lg:flex flex-col text-slate-300 flex-shrink-0 overflow-hidden"
      >
        <div className="p-4 flex items-center gap-3 border-b border-slate-800">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 hover:bg-indigo-400 transition-colors min-h-[44px] min-w-[44px]"
          >
            <div className="w-3 h-3 rounded-full bg-white" />
          </button>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white font-bold text-lg"
            >
              cready
            </motion.span>
          )}
        </div>

        {!collapsed && (
          <div className="px-3 py-3 border-b border-slate-800">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-ocid="sidebar.search_input"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[44px]"
            />
          </div>
        )}

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {!collapsed && !searchQuery && (
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 px-2">
              Main Menu
            </p>
          )}
          {(searchQuery ? filteredMenu : mainMenu).map((item) => {
            const active = location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                type="button"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(item.path)}
                data-ocid={`sidebar.${item.label.toLowerCase().replace(/ /g, "_")}.link`}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all min-h-[44px] ${
                  active
                    ? "bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-900/40"
                    : "hover:bg-slate-800/70 text-slate-400 hover:text-white"
                }`}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
                {active && !collapsed && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                  />
                )}
              </motion.button>
            );
          })}

          {!searchQuery && (
            <div className="pt-4">
              {!collapsed && (
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 px-2">
                  Tools
                </p>
              )}
              {toolsMenu.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <motion.button
                    key={item.path}
                    type="button"
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(item.path)}
                    data-ocid={`sidebar.${item.label.toLowerCase().replace(/ /g, "_")}.link`}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all min-h-[44px] ${
                      active
                        ? "bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-900/40"
                        : "hover:bg-slate-800/70 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                  </motion.button>
                );
              })}
            </div>
          )}
        </nav>

        <div className="p-3 space-y-2 border-t border-slate-800">
          {!collapsed && (
            <div className="bg-indigo-900/40 border border-indigo-700/30 rounded-xl p-3">
              <p className="text-xs font-bold text-indigo-300 mb-1">Pro Tip</p>
              <p className="text-xs text-slate-400">
                Complete your profile to unlock 2% lower interest rates.
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-white flex items-center gap-2 rounded-lg hover:bg-slate-800/50 transition-colors min-h-[44px]"
          >
            <span>←</span>
            {!collapsed && " Back to Home"}
          </button>
          <button
            type="button"
            className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-2 rounded-lg hover:bg-slate-800/50 transition-colors min-h-[44px]"
          >
            <span>→</span>
            {!collapsed && " Logout"}
          </button>
        </div>

        {/* Desktop Footer */}
        <div className="p-3 border-t border-slate-800 flex gap-2">
          <button
            type="button"
            data-ocid="sidebar.chat.button"
            onClick={() => setChatOpen(true)}
            className="flex-1 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg py-2 px-2 transition-colors min-h-[44px] flex items-center justify-center gap-1"
          >
            {collapsed ? "💬" : "💬 Quick Chat"}
          </button>
          {!collapsed && (
            <button
              type="button"
              data-ocid="sidebar.faq.button"
              onClick={() => setFaqOpen(true)}
              className="flex-1 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg py-2 px-2 transition-colors min-h-[44px]"
            >
              FAQ
            </button>
          )}
        </div>
      </motion.div>

      {/* Mobile header bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between px-4 py-3 min-h-14"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-white" />
          </div>
          <span className="text-white font-bold text-lg">cready</span>
        </div>
        <button
          type="button"
          data-ocid="mobile.hamburger.button"
          onClick={() => setMobileDrawerOpen(true)}
          className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-white min-h-[44px] min-w-[44px]"
          aria-label="Open menu"
        >
          <span className="block w-5 h-0.5 bg-current" />
          <span className="block w-5 h-0.5 bg-current" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </div>

      {/* Mobile Drawer overlay */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onTouchStart={handleDrawerTouchStart}
              onTouchEnd={handleDrawerTouchEnd}
              className="lg:hidden fixed top-0 left-0 z-50 h-full w-[min(288px,85vw)] bg-[#0f172a] flex flex-col shadow-2xl"
              data-ocid="mobile.drawer.panel"
            >
              <div className="p-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  </div>
                  <span className="text-white font-bold text-lg">cready</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="text-slate-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close menu"
                  data-ocid="mobile.drawer.close_button"
                >
                  ✕
                </button>
              </div>
              <div className="px-3 py-3 border-b border-slate-800">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[44px]"
                />
              </div>
              <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {[...mainMenu, ...toolsMenu]
                  .filter(
                    (item) =>
                      !searchQuery ||
                      item.label
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                  )
                  .map((item) => {
                    const active = location.pathname === item.path;
                    return (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => {
                          navigate(item.path);
                          setMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all min-h-[44px] ${
                          active
                            ? "bg-indigo-600 text-white font-semibold"
                            : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                        }`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 overflow-auto lg:overflow-auto pt-14 lg:pt-0 pb-16 lg:pb-0 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile bottom tab bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-xl flex h-16">
        {bottomTabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              type="button"
              onClick={() => navigate(tab.path)}
              data-ocid={`bottomtab.${tab.label.toLowerCase().replace(/ /g, "_")}.tab`}
              className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors min-h-[44px] ${
                active ? "text-indigo-600" : "text-slate-400"
              }`}
            >
              <span className={active ? "text-indigo-600" : "text-slate-400"}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {active && (
                <motion.div
                  layoutId="bottomTabIndicator"
                  className="absolute bottom-0 h-0.5 w-10 bg-indigo-600 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Chat bottom sheet */}
      <AnimatePresence>
        {chatOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setChatOpen(false)}
              className="fixed inset-0 z-50 bg-black/40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[80vh]"
              data-ocid="chat.modal"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm">
                    💬
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800">
                      Cready Support
                    </p>
                    <p className="text-xs text-green-500">● Online</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  className="text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  data-ocid="chat.close_button"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                        msg.from === "user"
                          ? "bg-indigo-500 text-white rounded-br-sm"
                          : "bg-slate-100 text-slate-700 rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 pb-6 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  data-ocid="chat.input"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={sendChat}
                  data-ocid="chat.submit_button"
                  className="bg-indigo-500 text-white rounded-xl px-4 min-h-[44px] hover:bg-indigo-600 transition-colors font-semibold text-sm"
                >
                  Send
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FAQ drawer */}
      <AnimatePresence>
        {faqOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFaqOpen(false)}
              className="fixed inset-0 z-50 bg-black/40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl p-6 pb-8 max-h-[80vh] overflow-y-auto"
              data-ocid="faq.panel"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">
                  Frequently Asked Questions
                </h3>
                <button
                  type="button"
                  onClick={() => setFaqOpen(false)}
                  className="text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  data-ocid="faq.close_button"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                {faqItems.map((item) => (
                  <div
                    key={item.q}
                    className="border border-slate-100 rounded-xl p-4"
                  >
                    <p className="font-semibold text-sm text-slate-800 mb-2">
                      {item.q}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
