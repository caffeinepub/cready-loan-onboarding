import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

const GOLD_PRICE_22K = 6200; // per gram

const steps = [
  "Gold Details",
  "Loan Details",
  "Personal Info",
  "Review & Submit",
];

export default function GoldLoan() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const refId = `GL${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // Form state
  const [weight, setWeight] = useState(20);
  const [purity, setPurity] = useState<"18K" | "22K" | "24K">("22K");
  const [items, setItems] = useState<string[]>(["Bangles"]);
  const [loanAmt, setLoanAmt] = useState(0);
  const [tenure, setTenure] = useState(12);
  const [purpose, setPurpose] = useState("Personal");
  const [fullName, setFullName] = useState("Bharat Sharma");
  const [mobile, setMobile] = useState("+91 98765 43210");
  const [address, setAddress] = useState("42, MG Road");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
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

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="p-8 flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 text-center max-w-md w-full"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
            >
              💛
            </motion.div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">
              Application Submitted!
            </h2>
            <p className="text-slate-500 mb-4">
              Your gold loan application has been received.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-xs text-yellow-600 uppercase tracking-wider mb-1">
                Reference ID
              </p>
              <p className="text-2xl font-black text-yellow-700 font-mono">
                {refId}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-6">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">Loan Amount</p>
                <p className="font-black text-slate-800">
                  ₹{currentLoan.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">Tenure</p>
                <p className="font-black text-slate-800">{tenure} Months</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Our agent will contact you within 2 hours for gold assessment.
            </p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-black text-slate-800">
            Gold Loan Application
          </h1>
          <p className="text-slate-500 mt-1">
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
                    backgroundColor: i <= step ? "#4f46e5" : "#e2e8f0",
                    color: i <= step ? "#ffffff" : "#94a3b8",
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                >
                  {i < step ? "✓" : i + 1}
                </motion.div>
                <span
                  className={`text-[10px] mt-1 font-semibold whitespace-nowrap ${i <= step ? "text-indigo-600" : "text-slate-400"}`}
                >
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mb-4 ${i < step ? "bg-indigo-600" : "bg-slate-200"}`}
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
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6"
          >
            {step === 0 && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-slate-800">
                  Gold Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider block mb-2">
                      Gold Weight (grams)
                    </p>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(+e.target.value)}
                      min={1}
                      max={500}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider block mb-2">
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
                              ? "bg-yellow-400 border-yellow-400 text-slate-900"
                              : "border-slate-200 text-slate-500 hover:border-yellow-300"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-xs text-yellow-600 uppercase tracking-wider mb-1">
                    Estimated Gold Value
                  </p>
                  <p className="text-3xl font-black text-yellow-700">
                    ₹{estimatedValue.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-yellow-500 mt-1">
                    Based on ₹{GOLD_PRICE_22K}/g for 22K · {weight}g at {purity}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider block mb-2">
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
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "border-slate-200 text-slate-600 hover:border-indigo-300"
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
                <h3 className="text-lg font-bold text-slate-800">
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
                    min={10000}
                    max={maxLoan}
                    step={5000}
                    value={currentLoan}
                    onChange={(e) => setLoanAmt(+e.target.value)}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>₹10,000</span>
                    <span>Max: ₹{maxLoan.toLocaleString("en-IN")}</span>
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
                  <p className="text-xs text-slate-400 uppercase tracking-wider block mb-2">
                    Loan Purpose
                  </p>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                  <p className="text-xs text-indigo-500 uppercase tracking-wider mb-2">
                    Estimated Monthly Interest
                  </p>
                  <p className="text-2xl font-black text-indigo-700">
                    ₹{Math.round(emi).toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-indigo-400">
                    At 1% per month (reducing balance)
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Full Name", value: fullName, set: setFullName },
                    { label: "Mobile Number", value: mobile, set: setMobile },
                    { label: "Address", value: address, set: setAddress },
                    { label: "City", value: city, set: setCity },
                    { label: "State", value: state, set: setState },
                    { label: "Pincode", value: pincode, set: setPincode },
                  ].map((f) => (
                    <div key={f.label}>
                      <p className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                        {f.label}
                      </p>
                      <input
                        value={f.value}
                        onChange={(e) => f.set(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800">
                  Review Your Application
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Gold Weight", value: `${weight}g at ${purity}` },
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
                    { label: "City", value: `${city}, ${state}` },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-slate-50 rounded-xl p-3"
                    >
                      <p className="text-[10px] text-slate-400 uppercase">
                        {item.label}
                      </p>
                      <p className="font-bold text-slate-800 text-sm mt-0.5">
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
              className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
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
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold px-8 py-3 rounded-xl text-sm shadow-lg shadow-orange-500/25 transition-all"
          >
            {step < 3 ? "Continue →" : "Submit Application 💛"}
          </motion.button>
        </div>
      </div>
    </DashboardLayout>
  );
}
