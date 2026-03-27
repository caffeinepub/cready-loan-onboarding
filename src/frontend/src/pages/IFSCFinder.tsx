import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

const ifscDatabase: Record<
  string,
  {
    bank: string;
    branch: string;
    address: string;
    city: string;
    state: string;
    micr: string;
    swift: string;
  }
> = {
  SBIN0001234: {
    bank: "State Bank of India",
    branch: "MG Road Branch",
    address: "42, MG Road, Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    micr: "560002003",
    swift: "SBININBB",
  },
  SBIN0005678: {
    bank: "State Bank of India",
    branch: "Connaught Place Branch",
    address: "10, Connaught Place, New Delhi",
    city: "New Delhi",
    state: "Delhi",
    micr: "110002088",
    swift: "SBININBB",
  },
  HDFC0001111: {
    bank: "HDFC Bank",
    branch: "Koramangala Branch",
    address: "80 Feet Road, Koramangala, Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    micr: "560240002",
    swift: "HDFCINBB",
  },
  HDFC0002222: {
    bank: "HDFC Bank",
    branch: "Andheri West Branch",
    address: "Link Road, Andheri West, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    micr: "400240002",
    swift: "HDFCINBB",
  },
  ICIC0003333: {
    bank: "ICICI Bank",
    branch: "Bandra Kurla Complex",
    address: "BKC, Bandra East, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    micr: "400229002",
    swift: "ICICININB",
  },
  ICIC0004444: {
    bank: "ICICI Bank",
    branch: "Jubilee Hills Branch",
    address: "Road No 36, Jubilee Hills, Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    micr: "500229002",
    swift: "ICICININB",
  },
  UTIB0005555: {
    bank: "Axis Bank",
    branch: "Indiranagar Branch",
    address: "100 Feet Road, Indiranagar, Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    micr: "560211003",
    swift: "AXISINBB",
  },
  KKBK0006666: {
    bank: "Kotak Mahindra Bank",
    branch: "Nariman Point Branch",
    address: "Nariman Point, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    micr: "400485001",
    swift: "KKBKINBB",
  },
  PUNB0007777: {
    bank: "Punjab National Bank",
    branch: "Chandni Chowk Branch",
    address: "Chandni Chowk, Old Delhi",
    city: "Delhi",
    state: "Delhi",
    micr: "110024001",
    swift: "PUNBINBBDEL",
  },
  BKID0008888: {
    bank: "Bank of India",
    branch: "Fort Branch",
    address: "Star House, C-5, G Block, BKC, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    micr: "400013006",
    swift: "BKIDINBB",
  },
  CNRB0009999: {
    bank: "Canara Bank",
    branch: "Head Office",
    address: "112, J.C. Road, Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    micr: "560015001",
    swift: "CNRBINBBNFD",
  },
  IDFB0010101: {
    bank: "IDFC First Bank",
    branch: "Naman Chambers",
    address: "C-32, G Block, BKC, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    micr: "400754001",
    swift: "IDFBINBB",
  },
  YESB0011111: {
    bank: "Yes Bank",
    branch: "Lower Parel Branch",
    address: "Lower Parel, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    micr: "400532003",
    swift: "YESBINBB",
  },
  BARB0012345: {
    bank: "Bank of Baroda",
    branch: "Ahmedabad Main Branch",
    address: "Baroda House, Nr. Income Tax, Ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    micr: "380012001",
    swift: "BARBINBB",
  },
};

export default function IFSCFinder() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<
    null | ((typeof ifscDatabase)[string] & { ifsc: string })
  >(null);
  const [notFound, setNotFound] = useState(false);
  const [searching, setSearching] = useState(false);

  function handleSearch() {
    const code = query.toUpperCase().trim();
    setSearching(true);
    setResult(null);
    setNotFound(false);
    setTimeout(() => {
      const data = ifscDatabase[code];
      if (data) {
        setResult({ ...data, ifsc: code });
      } else {
        setNotFound(true);
      }
      setSearching(false);
    }, 600);
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-black text-slate-800">IFSC Finder</h1>
          <p className="text-slate-500 mt-1">
            Find bank branch details instantly using the IFSC code.
          </p>
        </motion.div>

        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6"
          >
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Enter IFSC Code
            </p>
            <div className="flex gap-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g. SBIN0001234"
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-mono uppercase text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSearch}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-lg shadow-indigo-500/25 transition-colors"
              >
                {searching ? "🔍..." : "Search"}
              </motion.button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <p className="text-xs text-slate-400 mr-1">Try:</p>
              {["SBIN0001234", "HDFC0001111", "ICIC0003333", "UTIB0005555"].map(
                (code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setQuery(code);
                    }}
                    className="text-xs bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 text-slate-500 px-2.5 py-1 rounded-lg transition-colors font-mono"
                  >
                    {code}
                  </button>
                ),
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-xl flex items-center justify-center text-2xl">
                      🏦
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-800">
                        {result.bank}
                      </h3>
                      <p className="text-sm text-slate-500">{result.branch}</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
                    ✓ Valid IFSC
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "IFSC Code", value: result.ifsc, mono: true },
                    { label: "MICR Code", value: result.micr, mono: true },
                    { label: "City", value: result.city, mono: false },
                    { label: "State", value: result.state, mono: false },
                    { label: "SWIFT Code", value: result.swift, mono: true },
                    { label: "Address", value: result.address, mono: false },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.06 }}
                      className="bg-slate-50 rounded-xl p-3"
                    >
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                        {item.label}
                      </p>
                      <p
                        className={`text-sm font-bold text-slate-800 ${item.mono ? "font-mono" : ""}`}
                      >
                        {item.value}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            {notFound && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center"
              >
                <p className="text-4xl mb-2">🔍</p>
                <p className="font-bold text-red-600">IFSC Not Found</p>
                <p className="text-sm text-red-400 mt-1">
                  Please check the code and try again.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
