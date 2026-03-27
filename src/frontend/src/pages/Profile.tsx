import { motion } from "motion/react";
import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

const kycItems = [
  { label: "PAN Card", value: "ABCDE1234F", status: "Verified", icon: "🪪" },
  { label: "Aadhaar", value: "XXXX XXXX 4321", status: "Verified", icon: "🏛" },
  {
    label: "Bank Account",
    value: "SBI •••• 5678",
    status: "Verified",
    icon: "🏦",
  },
  {
    label: "Address Proof",
    value: "Utility Bill",
    status: "Verified",
    icon: "📄",
  },
];

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Bharat Bhushan");
  const [email, setEmail] = useState("bharat.sharma@gmail.com");
  const [mobile, setMobile] = useState("+91 98765 43210");
  const [address, setAddress] = useState("42, MG Road, Bengaluru, KA 560001");

  return (
    <DashboardLayout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-black text-slate-800">My Profile</h1>
            <p className="text-slate-500 mt-1">
              Manage your personal details and KYC status.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setEditing(!editing)}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              editing
                ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                : "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
            }`}
          >
            {editing ? "💾 Save Changes" : "✏️ Edit Profile"}
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#0f172a] to-indigo-900 rounded-2xl p-6 text-white flex flex-col items-center"
          >
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-3xl font-black">
                B
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs">
                ✓
              </div>
            </div>
            <p className="text-xl font-black">{name}</p>
            <p className="text-indigo-300 text-sm mt-1">Premium Member</p>
            <div className="mt-4 w-full">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Profile Completion</span>
                <span className="font-bold">92%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "92%" }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-indigo-400 to-teal-400 rounded-full"
                />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 w-full text-center">
              <div className="bg-white/10 rounded-xl p-2">
                <p className="text-xs text-slate-400">Member Since</p>
                <p className="font-bold text-sm">Jan 2025</p>
              </div>
              <div className="bg-white/10 rounded-xl p-2">
                <p className="text-xs text-slate-400">Credit Score</p>
                <p className="font-bold text-sm text-green-400">777</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
              Personal Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: "Full Name",
                  value: name,
                  onChange: setName,
                  editable: true,
                },
                {
                  label: "Email Address",
                  value: email,
                  onChange: setEmail,
                  editable: true,
                },
                {
                  label: "Mobile Number",
                  value: mobile,
                  onChange: setMobile,
                  editable: true,
                },
                {
                  label: "Date of Birth",
                  value: "15 Aug 1992",
                  onChange: () => {},
                  editable: false,
                },
                {
                  label: "PAN Number",
                  value: "ABCDE1234F",
                  onChange: () => {},
                  editable: false,
                },
                {
                  label: "Address",
                  value: address,
                  onChange: setAddress,
                  editable: true,
                },
              ].map((field) => (
                <div key={field.label}>
                  <p className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                    {field.label}
                  </p>
                  {editing && field.editable ? (
                    <input
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full border border-indigo-300 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-slate-800 py-2">
                      {field.value}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
              KYC Status
            </h3>
            <div className="space-y-3">
              {kycItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-slate-800">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-400">{item.value}</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                    ✓ {item.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
              Employment Details
            </h3>
            <div className="space-y-4">
              {[
                { label: "Employment Type", value: "Salaried", icon: "💼" },
                {
                  label: "Company Name",
                  value: "Tata Consultancy Services",
                  icon: "🏢",
                },
                { label: "Monthly Income", value: "₹95,000", icon: "💰" },
                { label: "Work Experience", value: "6 Years", icon: "📅" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-lg">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="font-bold text-slate-800">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
