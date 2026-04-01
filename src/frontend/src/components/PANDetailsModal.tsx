import { AnimatePresence, motion } from "motion/react";

interface PANDetailsModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onManual: () => void;
}

export default function PANDetailsModal({
  isOpen,
  onConfirm,
  onManual,
}: PANDetailsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="pan-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm bg-black/50"
          data-ocid="pan_modal.modal"
        >
          <motion.div
            key="pan-card"
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Top accent strip */}
            <div
              className="h-1 w-full"
              style={{
                background: "linear-gradient(90deg, #6366f1, #0ea5e9, #2dd4bf)",
              }}
            />

            <div className="p-6">
              {/* Icon + Title */}
              <div className="flex flex-col items-center text-center mb-5">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
                  className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4 ring-4 ring-emerald-100"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-7 h-7 text-emerald-500"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.25C16.5 22.15 20 17.25 20 12V6l-8-4z"
                      fill="currentColor"
                      opacity="0.15"
                    />
                    <path
                      d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.25C16.5 22.15 20 17.25 20 12V6l-8-4z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>

                <h2 className="text-xl font-black text-slate-800 tracking-tight">
                  PAN Details Found
                </h2>
                <p className="text-slate-500 text-sm mt-1.5 leading-relaxed max-w-[260px]">
                  A PAN number linked to your registered mobile number has been
                  found. Please confirm if this is yours.
                </p>
              </div>

              {/* PAN Badge */}
              <div className="flex flex-col items-center mb-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  PAN Number
                </p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                  className="px-6 py-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-3"
                >
                  <span
                    className="font-mono font-black text-2xl tracking-[0.2em] text-indigo-700"
                    data-ocid="pan_modal.panel"
                  >
                    ABCDE1234F
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </motion.div>
              </div>

              {/* Helper note */}
              <div className="flex items-start gap-2 bg-slate-50 rounded-xl px-3.5 py-3 mb-6 border border-slate-100">
                <span className="text-base shrink-0 mt-0.5">✨</span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Auto-filled to speed up your process.{" "}
                  <span className="text-slate-600 font-medium">
                    If this is not your PAN, you may enter it manually.
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onConfirm}
                  data-ocid="pan_modal.confirm_button"
                  className="relative w-full py-3.5 rounded-xl font-bold text-white text-sm overflow-hidden group shadow-md shadow-indigo-200"
                  style={{
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                  }}
                >
                  <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  ✓ &nbsp;Yes, This Is My PAN
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01, backgroundColor: "#eef2ff" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onManual}
                  data-ocid="pan_modal.cancel_button"
                  className="w-full py-3.5 rounded-xl font-semibold text-indigo-600 text-sm bg-white border-2 border-indigo-200 hover:border-indigo-300 transition-colors"
                >
                  No, Enter Manually
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
