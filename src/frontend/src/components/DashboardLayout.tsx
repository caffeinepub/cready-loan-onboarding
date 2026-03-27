import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode, useState } from "react";
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

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex font-sans bg-slate-50">
      {/* Sidebar */}
      <motion.div
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="min-h-screen bg-[#0f172a] flex flex-col text-slate-300 flex-shrink-0 overflow-hidden"
      >
        <div className="p-4 flex items-center gap-3 border-b border-slate-800">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 hover:bg-indigo-400 transition-colors"
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

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {!collapsed && (
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 px-2">
              Main Menu
            </p>
          )}
          {mainMenu.map((item) => {
            const active = location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                type="button"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
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
            className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-white flex items-center gap-2 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            <span>←</span>
            {!collapsed && " Back to Home"}
          </button>
          <button
            type="button"
            className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-2 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            <span>→</span>
            {!collapsed && " Logout"}
          </button>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
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
    </div>
  );
}
