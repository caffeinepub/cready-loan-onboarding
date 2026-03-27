import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Confetti() {
  const pieces = Array.from({ length: 70 }, (_, i) => ({
    id: i,
    left: `${20 + ((i * 2.1) % 60)}%`,
    color: ["#7c5cff", "#2ee6a6", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899"][
      i % 6
    ],
    delay: (i % 10) * 0.1,
    duration: 2.5 + (i % 4) * 0.5,
    size: 6 + (i % 5) * 2,
    startLeft: `${40 + ((i % 10) - 5) * 3}%`,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: p.startLeft,
            top: "40%",
            width: p.size,
            height: p.size,
            background: p.color,
          }}
          animate={{
            left: p.left,
            y: ["0%", "150vh"],
            rotate: [0, 360, 720],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

const trackingId = "LN-98234-X";

export default function Step7ThankYou() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [showPoints, setShowPoints] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setToast(true), 1000);
    const t2 = setTimeout(() => setToast(false), 5000);
    const t3 = setTimeout(() => setShowBadge(true), 1500);
    const t4 = setTimeout(() => setShowPoints(true), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#060612] flex items-center justify-center relative overflow-hidden font-sans">
      <Confetti />

      {/* Aurora background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[400px] bg-indigo-600 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[400px] bg-violet-600 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-teal-500 rounded-full blur-[100px]"
        />
      </div>

      {/* Gamified Badge */}
      <AnimatePresence>
        {showBadge && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed top-20 left-4 z-20 text-left"
          >
            <div className="relative inline-block">
              {/* Radial glow */}
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.2, 0.6] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute inset-0 rounded-2xl bg-amber-400 blur-xl"
              />
              <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl px-4 py-3 shadow-2xl border border-amber-300/50">
                <div className="text-3xl mb-1">🏆</div>
                <p className="text-white font-black text-base">
                  🎁 Refer & Earn!
                </p>
                <p className="text-amber-100 text-xs mt-1">
                  Refer friends & family to Cready and unlock up to ₹1000 Amazon
                  vouchers!
                </p>
                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    className="text-xs text-amber-900 bg-amber-200 hover:bg-amber-100 rounded-full px-3 py-1 font-semibold transition-colors min-h-[44px]"
                  >
                    Share 🔗
                  </button>
                  <span className="text-xs text-amber-100">Badge #47,821</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* +20 Points floating text */}
      <AnimatePresence>
        {showPoints && (
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -80, opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="fixed bottom-60 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          >
            <div className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-black text-xl px-5 py-2 rounded-full shadow-lg">
              +20 Cready Points ✨
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative z-10 text-center max-w-md px-4"
      >
        {/* Animated checkmark */}
        <div className="relative flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
              delay: 0.2,
            }}
            className="w-28 h-28 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/50 relative"
          >
            <motion.svg
              aria-hidden="true"
              className="w-14 h-14 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <motion.path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </motion.svg>
            <motion.div
              animate={{ scale: [1, 1.4, 1.6], opacity: [0.5, 0.2, 0] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: 0.5,
              }}
              className="absolute inset-0 rounded-3xl border-2 border-indigo-400"
            />
          </motion.div>
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.6 }}
            className="absolute -bottom-2 -left-2 w-9 h-9 bg-green-400 rounded-full flex items-center justify-center shadow-lg"
          >
            <span className="text-white text-lg">★</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-2 border border-white/20 bg-white/5 backdrop-blur-sm rounded-full px-4 py-1.5 text-white/70 text-xs tracking-widest mb-6"
        >
          ⚙️ APPLICATION RECEIVED
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-4xl font-black text-white leading-tight mb-3"
        >
          Thank You! Your Application Has Been{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent">
            Submitted.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-slate-400 text-sm leading-relaxed mb-5"
        >
          Our team is reviewing your application. Track updates and continue
          your loan journey in our mobile app.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 rounded-xl px-5 py-2.5 mb-6"
        >
          <span className="text-indigo-300 text-xs uppercase tracking-wider">
            Tracking ID:
          </span>
          <span className="text-indigo-200 font-black text-sm">
            {trackingId}
          </span>
        </motion.div>

        {["🎉", "💰", "✅", "🚀"].map((e, i) => (
          <motion.span
            key={e}
            className="fixed text-2xl pointer-events-none"
            style={{ left: `${20 + i * 20}%`, bottom: "20%" }}
            animate={{ y: [-20, -80, -20], opacity: [0, 1, 0] }}
            transition={{
              duration: 3,
              delay: 1 + i * 0.3,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            {e}
          </motion.span>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex gap-3 justify-center"
        >
          <button
            type="button"
            className="flex items-center gap-2 bg-white text-slate-900 font-bold px-6 py-3.5 rounded-2xl text-sm hover:bg-slate-100 transition-colors shadow-xl min-h-[44px]"
          >
            Download the App 📱
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-white/70 hover:text-white font-semibold px-6 py-3.5 rounded-2xl text-sm border border-white/20 hover:border-white/40 transition-all min-h-[44px]"
          >
            Continue in App →
          </button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={() => navigate("/register")}
          className="mt-4 text-slate-600 hover:text-slate-400 text-xs transition-colors min-h-[44px] px-2"
        >
          Start a new application
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="fixed bottom-8 right-8 bg-white shadow-2xl rounded-2xl px-5 py-3 z-50 max-w-[260px]"
          >
            <p className="font-semibold text-sm text-gray-800">
              Details Confirmed
            </p>
            <p className="text-xs text-gray-500">
              Securely submitted to lender. Tracking number: {trackingId}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
