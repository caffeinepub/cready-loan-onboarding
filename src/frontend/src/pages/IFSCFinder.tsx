import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

type BranchInfo = {
  name: string;
  ifsc: string;
  micr: string;
  address: string;
  phone: string;
  branchCode: string;
};

type BankData = {
  states: string[];
  cities: Record<string, string[]>;
  branches: Record<string, BranchInfo[]>;
};

const bankData: Record<string, BankData> = {
  "State Bank of India": {
    states: ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Gujarat"],
    cities: {
      Maharashtra: ["Mumbai", "Pune", "Nagpur"],
      Karnataka: ["Bengaluru", "Mysuru"],
      Delhi: ["New Delhi", "Dwarka"],
      "Tamil Nadu": ["Chennai", "Coimbatore"],
      Gujarat: ["Ahmedabad", "Surat"],
    },
    branches: {
      Mumbai: [
        {
          name: "RTGSHO",
          ifsc: "SBIN0004343",
          micr: "400002988",
          address: "State Bank Bhavan, Madame Cama Road",
          phone: "022-22740841",
          branchCode: "004343",
        },
        {
          name: "Bandra Branch",
          ifsc: "SBIN0001234",
          micr: "400002003",
          address: "Link Road, Bandra West",
          phone: "022-26400100",
          branchCode: "001234",
        },
      ],
      Bengaluru: [
        {
          name: "MG Road Branch",
          ifsc: "SBIN0001234",
          micr: "560002003",
          address: "42, MG Road, Bengaluru",
          phone: "Not Provided",
          branchCode: "001234",
        },
      ],
      "New Delhi": [
        {
          name: "Connaught Place",
          ifsc: "SBIN0005678",
          micr: "110002088",
          address: "10, Connaught Place, New Delhi",
          phone: "011-23412345",
          branchCode: "005678",
        },
      ],
      Chennai: [
        {
          name: "Anna Salai Branch",
          ifsc: "SBIN0007890",
          micr: "600002001",
          address: "Anna Salai, Chennai",
          phone: "044-28523456",
          branchCode: "007890",
        },
      ],
      Ahmedabad: [
        {
          name: "Ellis Bridge Branch",
          ifsc: "SBIN0008901",
          micr: "380002001",
          address: "Ellis Bridge, Ahmedabad",
          phone: "079-26578901",
          branchCode: "008901",
        },
      ],
    },
  },
  "HDFC Bank": {
    states: ["Maharashtra", "Karnataka", "Telangana", "Delhi"],
    cities: {
      Maharashtra: ["Mumbai", "Pune"],
      Karnataka: ["Bengaluru"],
      Telangana: ["Hyderabad"],
      Delhi: ["New Delhi"],
    },
    branches: {
      Mumbai: [
        {
          name: "Andheri West",
          ifsc: "HDFC0002222",
          micr: "400240002",
          address: "Link Road, Andheri West, Mumbai",
          phone: "022-67523456",
          branchCode: "002222",
        },
      ],
      Bengaluru: [
        {
          name: "Koramangala Branch",
          ifsc: "HDFC0001111",
          micr: "560240002",
          address: "80 Feet Road, Koramangala",
          phone: "080-25345678",
          branchCode: "001111",
        },
      ],
      Hyderabad: [
        {
          name: "Banjara Hills",
          ifsc: "HDFC0003456",
          micr: "500240001",
          address: "Road No 12, Banjara Hills, Hyderabad",
          phone: "040-23456789",
          branchCode: "003456",
        },
      ],
      "New Delhi": [
        {
          name: "Connaught Place",
          ifsc: "HDFC0004567",
          micr: "110240001",
          address: "N-Block, Connaught Place, Delhi",
          phone: "011-43567890",
          branchCode: "004567",
        },
      ],
    },
  },
  "ICICI Bank": {
    states: ["Maharashtra", "Telangana", "Karnataka"],
    cities: {
      Maharashtra: ["Mumbai", "Pune"],
      Telangana: ["Hyderabad"],
      Karnataka: ["Bengaluru"],
    },
    branches: {
      Mumbai: [
        {
          name: "Bandra Kurla Complex",
          ifsc: "ICIC0003333",
          micr: "400229002",
          address: "BKC, Bandra East, Mumbai",
          phone: "022-33667788",
          branchCode: "003333",
        },
      ],
      Hyderabad: [
        {
          name: "Jubilee Hills",
          ifsc: "ICIC0004444",
          micr: "500229002",
          address: "Road No 36, Jubilee Hills, Hyderabad",
          phone: "040-23390000",
          branchCode: "004444",
        },
      ],
      Bengaluru: [
        {
          name: "Residency Road",
          ifsc: "ICIC0005678",
          micr: "560229001",
          address: "Residency Road, Bengaluru",
          phone: "080-22345678",
          branchCode: "005678",
        },
      ],
    },
  },
  "Axis Bank": {
    states: ["Karnataka", "Maharashtra", "Delhi"],
    cities: {
      Karnataka: ["Bengaluru", "Mysuru"],
      Maharashtra: ["Mumbai"],
      Delhi: ["New Delhi"],
    },
    branches: {
      Bengaluru: [
        {
          name: "Indiranagar Branch",
          ifsc: "UTIB0005555",
          micr: "560211003",
          address: "100 Feet Road, Indiranagar, Bengaluru",
          phone: "080-25789012",
          branchCode: "005555",
        },
      ],
      Mumbai: [
        {
          name: "Nariman Point",
          ifsc: "UTIB0006789",
          micr: "400211001",
          address: "Nariman Point, Mumbai",
          phone: "022-66189900",
          branchCode: "006789",
        },
      ],
      "New Delhi": [
        {
          name: "Rajouri Garden",
          ifsc: "UTIB0007890",
          micr: "110211001",
          address: "Rajouri Garden, New Delhi",
          phone: "011-45678901",
          branchCode: "007890",
        },
      ],
    },
  },
  "Kotak Mahindra Bank": {
    states: ["Maharashtra", "Karnataka"],
    cities: {
      Maharashtra: ["Mumbai", "Pune"],
      Karnataka: ["Bengaluru"],
    },
    branches: {
      Mumbai: [
        {
          name: "Nariman Point",
          ifsc: "KKBK0006666",
          micr: "400485001",
          address: "Nariman Point, Mumbai",
          phone: "022-66006022",
          branchCode: "006666",
        },
      ],
      Bengaluru: [
        {
          name: "Whitefield Branch",
          ifsc: "KKBK0007777",
          micr: "560485001",
          address: "ITPL Road, Whitefield, Bengaluru",
          phone: "080-66006022",
          branchCode: "007777",
        },
      ],
    },
  },
  "Punjab National Bank": {
    states: ["Delhi", "Punjab"],
    cities: {
      Delhi: ["New Delhi", "Dwarka"],
      Punjab: ["Chandigarh", "Amritsar"],
    },
    branches: {
      "New Delhi": [
        {
          name: "Chandni Chowk Branch",
          ifsc: "PUNB0007777",
          micr: "110024001",
          address: "Chandni Chowk, Old Delhi",
          phone: "011-23861649",
          branchCode: "007777",
        },
      ],
      Chandigarh: [
        {
          name: "Sector 17 Branch",
          ifsc: "PUNB0008888",
          micr: "160024001",
          address: "Sector 17, Chandigarh",
          phone: "0172-2701234",
          branchCode: "008888",
        },
      ],
    },
  },
  "Bank of India": {
    states: ["Maharashtra", "Karnataka"],
    cities: { Maharashtra: ["Mumbai"], Karnataka: ["Bengaluru"] },
    branches: {
      Mumbai: [
        {
          name: "Fort Branch",
          ifsc: "BKID0008888",
          micr: "400013006",
          address: "Star House, C-5, G Block, BKC",
          phone: "022-66684444",
          branchCode: "008888",
        },
      ],
    },
  },
  "Canara Bank": {
    states: ["Karnataka", "Tamil Nadu"],
    cities: { Karnataka: ["Bengaluru", "Mysuru"], "Tamil Nadu": ["Chennai"] },
    branches: {
      Bengaluru: [
        {
          name: "Head Office",
          ifsc: "CNRB0009999",
          micr: "560015001",
          address: "112, J.C. Road, Bengaluru",
          phone: "080-22064232",
          branchCode: "009999",
        },
      ],
    },
  },
  "IDFC First Bank": {
    states: ["Maharashtra", "Karnataka"],
    cities: { Maharashtra: ["Mumbai"], Karnataka: ["Bengaluru"] },
    branches: {
      Mumbai: [
        {
          name: "BKC Branch",
          ifsc: "IDFB0010101",
          micr: "400754001",
          address: "C-32, G Block, BKC, Mumbai",
          phone: "022-71908000",
          branchCode: "010101",
        },
      ],
    },
  },
  "Yes Bank": {
    states: ["Maharashtra"],
    cities: { Maharashtra: ["Mumbai", "Pune"] },
    branches: {
      Mumbai: [
        {
          name: "Lower Parel Branch",
          ifsc: "YESB0011111",
          micr: "400532003",
          address: "Lower Parel, Mumbai",
          phone: "022-33473747",
          branchCode: "011111",
        },
      ],
    },
  },
  "Bank of Baroda": {
    states: ["Gujarat", "Maharashtra"],
    cities: { Gujarat: ["Ahmedabad", "Surat"], Maharashtra: ["Mumbai"] },
    branches: {
      Ahmedabad: [
        {
          name: "Ahmedabad Main Branch",
          ifsc: "BARB0012345",
          micr: "380012001",
          address: "Baroda House, Nr. Income Tax, Ahmedabad",
          phone: "079-26582924",
          branchCode: "012345",
        },
      ],
    },
  },
};

const bankColors: Record<string, string> = {
  "State Bank of India": "bg-blue-100 text-blue-700 border-blue-200",
  "HDFC Bank": "bg-red-100 text-red-700 border-red-200",
  "ICICI Bank": "bg-orange-100 text-orange-700 border-orange-200",
  "Axis Bank": "bg-purple-100 text-purple-700 border-purple-200",
  "Kotak Mahindra Bank": "bg-red-100 text-red-800 border-red-200",
  "Punjab National Bank": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Bank of India": "bg-blue-100 text-blue-800 border-blue-200",
  "Canara Bank": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "IDFC First Bank": "bg-teal-100 text-teal-700 border-teal-200",
  "Yes Bank": "bg-sky-100 text-sky-700 border-sky-200",
  "Bank of Baroda": "bg-orange-100 text-orange-800 border-orange-200",
};

const quickBanks = [
  "ICICI Bank",
  "State Bank of India",
  "Axis Bank",
  "HDFC Bank",
];

function SelectBox({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex-1 min-w-0">
      <p className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </p>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full appearance-none border rounded-xl px-4 py-3 text-sm font-medium bg-white transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent pr-10 ${
            disabled
              ? "border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50"
              : "border-slate-200 text-slate-800 cursor-pointer hover:border-violet-300"
          }`}
        >
          <option value="">-- Select {label} --</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            aria-hidden="true"
            className="w-4 h-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function IFSCFinder() {
  const [selBank, setSelBank] = useState("");
  const [selState, setSelState] = useState("");
  const [selCity, setSelCity] = useState("");
  const [selBranch, setSelBranch] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobileSubmitted, setMobileSubmitted] = useState(false);

  const bankList = Object.keys(bankData);
  const stateList = selBank ? (bankData[selBank]?.states ?? []) : [];
  const cityList =
    selBank && selState ? (bankData[selBank]?.cities[selState] ?? []) : [];
  const branchList =
    selBank && selCity ? (bankData[selBank]?.branches[selCity] ?? []) : [];

  const resultBranches: BranchInfo[] = selBranch
    ? branchList.filter((b) => b.name === selBranch)
    : selCity && branchList.length > 0
      ? branchList
      : [];

  function handleBankChange(bank: string) {
    setSelBank(bank);
    setSelState("");
    setSelCity("");
    setSelBranch("");
  }
  function handleStateChange(state: string) {
    setSelState(state);
    setSelCity("");
    setSelBranch("");
  }
  function handleCityChange(city: string) {
    setSelCity(city);
    setSelBranch("");
  }
  function handleReset() {
    setSelBank("");
    setSelState("");
    setSelCity("");
    setSelBranch("");
  }

  const showResults = resultBranches.length > 0;

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 bg-slate-50 min-h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-black text-slate-800">IFSC Finder</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Instant bank branch lookup — verified IFSC & MICR codes across India
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left — Main IFSC Search */}
          <div className="xl:col-span-2 space-y-5">
            {/* Intro Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-white font-bold text-base">
                    Search for IFSC / MICR Codes
                  </span>
                </div>
              </div>
              <div className="px-6 py-5">
                <h2 className="text-xl font-black text-slate-800 mb-2">
                  Search IFSC &amp; MICR
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  List of IFSC code, MICR code &amp; Branch Address of all bank
                  branches in India. Find verified IFSC codes quickly to use for{" "}
                  <strong className="text-violet-700">NEFT</strong>,{" "}
                  <strong className="text-violet-700">RTGS</strong> &amp;{" "}
                  <strong className="text-violet-700">IMPS</strong>{" "}
                  transactions.
                </p>
              </div>
            </motion.div>

            {/* Search Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
            >
              {/* Quick-fill chips */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Quick Select Bank
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickBanks.map((bank) => (
                    <motion.button
                      key={bank}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleBankChange(bank)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        selBank === bank
                          ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200"
                          : `${bankColors[bank] ?? "bg-slate-100 text-slate-600 border-slate-200"} hover:shadow-sm`
                      }`}
                      data-ocid={`ifsc.${bank.toLowerCase().replace(/ /g, "_")}.button`}
                    >
                      {bank}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Cascading Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <SelectBox
                  label="Search by Bank"
                  value={selBank}
                  options={bankList}
                  onChange={handleBankChange}
                />
                <SelectBox
                  label="Search by State"
                  value={selState}
                  options={stateList}
                  onChange={handleStateChange}
                  disabled={!selBank}
                />
                <SelectBox
                  label="Search by City"
                  value={selCity}
                  options={cityList}
                  onChange={handleCityChange}
                  disabled={!selState}
                />
                <SelectBox
                  label="Search by Branch"
                  value={selBranch}
                  options={branchList.map((b) => b.name)}
                  onChange={setSelBranch}
                  disabled={!selCity}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-violet-600 hover:text-violet-800 font-semibold underline underline-offset-2 transition-colors"
                  data-ocid="ifsc.reset.button"
                >
                  ↺ Reset Details
                </button>
              </div>
            </motion.div>

            {/* Results Table */}
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-sm font-bold text-violet-800">
                        {resultBranches.length} Branch
                        {resultBranches.length !== 1 ? "es" : ""} Found
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {selBank} · {selCity}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-violet-600 text-white">
                          {[
                            "IFSC Code",
                            "MICR Code",
                            "Bank",
                            "Address",
                            "City",
                            "State",
                            "Branch",
                            "Phone",
                            "Branch Code",
                          ].map((h) => (
                            <th
                              key={h}
                              className="px-4 py-3 text-left text-xs font-bold tracking-wide whitespace-nowrap"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {resultBranches.map((branch, i) => (
                          <motion.tr
                            key={`${branch.ifsc}-${i}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                          >
                            <td className="px-4 py-3 font-mono font-bold text-violet-700 whitespace-nowrap">
                              {branch.ifsc}
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-600 whitespace-nowrap">
                              {branch.micr}
                            </td>
                            <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                              {selBank}
                            </td>
                            <td className="px-4 py-3 text-slate-600 min-w-[160px]">
                              {branch.address}
                            </td>
                            <td className="px-4 py-3 text-teal-700 font-semibold whitespace-nowrap">
                              {selCity}
                            </td>
                            <td className="px-4 py-3 text-teal-600 whitespace-nowrap">
                              {selState}
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-medium whitespace-nowrap">
                              {branch.name}
                            </td>
                            <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                              {branch.phone}
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">
                              {branch.branchCode}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
                    <p className="text-[11px] text-slate-400">
                      ⚠ Disclaimer: IFSC codes are verified periodically. For
                      real-time accuracy, verify with your bank. This data is
                      for illustrative purposes only.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty state when bank selected but no city/branch yet */}
            <AnimatePresence>
              {selBank && !showResults && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center"
                >
                  <div className="w-14 h-14 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 text-violet-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <p className="text-slate-500 font-semibold text-sm">
                    Select State → City → Branch to view results
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Use the dropdowns above to narrow down your search
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right — Loan Offer Card */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              {/* Top: Login */}
              <div className="px-5 py-4 border-b border-slate-100 flex justify-end">
                <button
                  type="button"
                  className="text-xs font-bold text-violet-700 border border-violet-200 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-full transition-colors"
                  data-ocid="ifsc.login.button"
                >
                  Existing User? Login to Resume Journey
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-black text-slate-800 mb-1 leading-tight">
                  Check <span className="text-slate-900">Personal</span>{" "}
                  <span className="text-teal-600">Loan Offers</span>
                </h3>
                <p className="text-xs text-slate-400 mb-5">
                  Get personalised offers from 50+ lenders in seconds
                </p>

                {!mobileSubmitted ? (
                  <div className="space-y-4">
                    <div>
                      <p className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Enter Mobile Number
                      </p>
                      <div className="flex border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent transition-all">
                        <div className="flex items-center gap-1.5 px-3 bg-slate-50 border-r border-slate-200">
                          <span className="text-base">🇮🇳</span>
                          <span className="text-sm font-bold text-slate-700">
                            +91
                          </span>
                        </div>
                        <input
                          type="tel"
                          value={mobile}
                          onChange={(e) =>
                            setMobile(
                              e.target.value.replace(/\D/g, "").slice(0, 10),
                            )
                          }
                          placeholder="98765 43210"
                          className="flex-1 px-3 py-3 text-sm font-medium text-slate-800 bg-white focus:outline-none"
                          data-ocid="ifsc.mobile.input"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      By proceeding, I authorize Cready to access my credit
                      report and confirm I&apos;ve read the{" "}
                      <span className="text-violet-600 cursor-pointer">
                        Terms &amp; Conditions
                      </span>{" "}
                      and{" "}
                      <span className="text-violet-600 cursor-pointer">
                        Privacy Policy
                      </span>
                      .
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        mobile.length === 10 && setMobileSubmitted(true)
                      }
                      className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                        mobile.length === 10
                          ? "bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-lg shadow-violet-200 hover:shadow-violet-300"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                      data-ocid="ifsc.submit.button"
                    >
                      Submit
                    </motion.button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg
                        aria-hidden="true"
                        className="w-7 h-7 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="font-bold text-slate-800 mb-1">
                      Request Received!
                    </p>
                    <p className="text-xs text-slate-500">
                      We&apos;ll send personalised offers to +91 {mobile}{" "}
                      shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setMobile("");
                        setMobileSubmitted(false);
                      }}
                      className="mt-3 text-xs text-violet-600 underline"
                    >
                      Change Number
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Bank Info Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-5 text-white"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-violet-200 mb-3">
                Coverage Stats
              </p>
              <div className="space-y-3">
                {[
                  { label: "Banks Covered", value: "11+" },
                  { label: "States", value: "10+" },
                  { label: "Branch Records", value: "30+" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-violet-100">{s.label}</span>
                    <span className="text-lg font-black">{s.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
