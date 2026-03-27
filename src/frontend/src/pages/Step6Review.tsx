import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../App";

interface Field {
  label: string;
  value: string;
  type?: string;
}

export default function Step6Review() {
  const navigate = useNavigate();
  const { email } = useApp();
  const [fields, setFields] = useState<Field[]>([
    { label: "PAN NUMBER", value: "ABCDE1234F" },
    { label: "DATE OF BIRTH", value: "01/01/1990", type: "date-display" },
    { label: "EMAIL ADDRESS", value: email || "john.doe@example.com" },
    { label: "PINCODE", value: "400001" },
    {
      label: "RECENT ADDRESS",
      value: "123, Premium Heights, Worli, Mumbai - 400018",
    },
  ]);
  const [editing, setEditing] = useState<number | null>(null);

  function update(i: number, val: string) {
    setFields((f) =>
      f.map((field, idx) => (idx === i ? { ...field, value: val } : field)),
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-white font-sans"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <button
          type="button"
          onClick={() => navigate("/offers")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm"
        >
          <svg
            aria-hidden="true"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
          Back
        </button>
        <div className="flex items-center gap-1 text-green-500 text-sm font-semibold">
          <svg
            aria-hidden="true"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              stroke="currentColor"
              strokeWidth={2}
            />
          </svg>
          BUREAU VERIFIED
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-slate-800 mb-3"
        >
          Review your <span className="text-indigo-500">details.</span>
        </motion.h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          To make your loan journey faster and smoother, we have securely
          fetched some of your details from the credit bureau. Please review and
          confirm them before proceeding.
        </p>

        <div className="space-y-4">
          {fields.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-1">
                {f.label}
              </p>
              <div className="relative border border-slate-200 rounded-xl px-4 py-3 flex items-center group hover:border-indigo-200 transition-colors">
                {editing === i ? (
                  <input
                    className="flex-1 text-sm text-slate-800 outline-none bg-transparent"
                    value={f.value}
                    onChange={(e) => update(i, e.target.value)}
                    onBlur={() => setEditing(null)}
                  />
                ) : (
                  <span className="flex-1 text-sm text-slate-800">
                    {f.value}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setEditing(i)}
                  className="text-slate-300 hover:text-indigo-400 transition-colors ml-2"
                >
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                    <path
                      d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/success")}
          className="w-full mt-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-base transition-colors shadow-lg"
        >
          Confirm &amp; Submit →
        </motion.button>

        <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
          <svg
            aria-hidden="true"
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              stroke="currentColor"
              strokeWidth={2}
            />
          </svg>
          Your data is encrypted and secure
        </p>
      </div>
    </motion.div>
  );
}
