import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../App";

const quotes = [
  {
    text: "Now the Sundays are ours again.",
    sub: '"a loan gave us space to build memories that matter"',
    bg: "from-orange-900 via-purple-900 to-indigo-950",
  },
];

const consentLabels = [
  { id: "consent-tc", text: "I have read and agree to T&C & Privacy" },
  {
    id: "consent-bureau",
    text: "I hereby consent to Cready being appointed as my authorised representative to receive my Credit Information",
  },
  {
    id: "consent-comm",
    text: "I hereby consent to receive loan related communication from Cready or its authorized representatives",
  },
];

export default function Step1Registration() {
  const navigate = useNavigate();
  const { setName, setMobile } = useApp();
  const [nameVal, setNameVal] = useState("");
  const [mobileVal, setMobileVal] = useState("");
  const [checks, setChecks] = useState([false, false, false]);
  const q = quotes[0];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setName(nameVal || "Bharat");
    setMobile(mobileVal);
    navigate("/otp");
  }

  return (
    <div className="min-h-screen flex font-sans">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className={`hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br ${q.bg} p-10 relative overflow-hidden`}
      >
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            cready
          </span>
        </div>
        <div className="relative z-10">
          <div className="w-2 h-2 rounded-full border-2 border-white mb-8" />
          <h2 className="text-white text-5xl font-black leading-tight mb-4">
            {q.text}
          </h2>
          <p className="text-green-400 text-lg italic">{q.sub}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 bg-white flex flex-col"
      >
        <div className="h-1 bg-gray-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "25%" }}
            className="h-full bg-gradient-to-r from-indigo-500 to-green-400"
          />
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <p className="text-gray-400 text-sm mb-1">
              Instant Personal Loans Available in
            </p>
            <h1 className="text-3xl font-black text-indigo-600 mb-1">
              Let's get you started
            </h1>
            <p className="text-gray-500 mb-8">
              Welcome! please enter your details
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  id="fullname"
                  type="text"
                  placeholder="Enter your full name"
                  value={nameVal}
                  onChange={(e) => setNameVal(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 placeholder-gray-400"
                />
              </div>
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Mobile Number
                </label>
                <div className="flex">
                  <span className="flex items-center gap-1 px-3 py-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl text-sm text-gray-600">
                    🇮🇳 +91
                  </span>
                  <input
                    id="mobile"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={mobileVal}
                    onChange={(e) => setMobileVal(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {consentLabels.map((item, i) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <input
                      id={item.id}
                      type="checkbox"
                      checked={checks[i]}
                      onChange={() =>
                        setChecks((c) =>
                          c.map((v, idx) => (idx === i ? !v : v)),
                        )
                      }
                      className="mt-0.5 accent-indigo-500 w-4 h-4 flex-shrink-0 cursor-pointer"
                    />
                    <label
                      htmlFor={item.id}
                      className="text-xs text-gray-500 cursor-pointer"
                    >
                      {item.text}
                    </label>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors text-base"
              >
                Send OTP
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
