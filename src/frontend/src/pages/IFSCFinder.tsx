import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

// ─── Types ───────────────────────────────────────────────────────────────────
type BranchObj = {
  IFSC: string;
  MICR: string;
  BANK: string;
  ADDRESS: string;
  CITY: string;
  DISTRICT: string;
  STATE: string;
  BRANCH: string;
  CONTACT: string;
  NEFT: boolean | string;
  RTGS: boolean | string;
  IMPS: boolean | string;
};

type LoadState = "idle" | "loading" | "success" | "error";

// ─── Constants ───────────────────────────────────────────────────────────────
const RAZORPAY = "https://ifsc.razorpay.com";

const FALLBACK_BANKS = [
  "ABHYUDAYA COOPERATIVE BANK",
  "AU SMALL FINANCE BANK",
  "AXIS BANK",
  "BANDHAN BANK",
  "BANK OF BARODA",
  "BANK OF INDIA",
  "BANK OF MAHARASHTRA",
  "BARCLAYS BANK",
  "BASSEIN CATHOLIC COOPERATIVE BANK",
  "BHARAT COOPERATIVE BANK",
  "CANARA BANK",
  "CENTRAL BANK OF INDIA",
  "CITI BANK",
  "CITY UNION BANK",
  "CORPORATION BANK",
  "COSMOS COOPERATIVE BANK",
  "DBS BANK",
  "DCB BANK",
  "DENA BANK",
  "DEUTSCHE BANK",
  "DHANLAXMI BANK",
  "EQUITAS SMALL FINANCE BANK",
  "ESAF SMALL FINANCE BANK",
  "FEDERAL BANK",
  "FINCARE SMALL FINANCE BANK",
  "GREATER BOMBAY COOPERATIVE BANK",
  "HDFC BANK",
  "HSBC BANK",
  "ICICI BANK",
  "IDBI BANK",
  "IDFC FIRST BANK",
  "INDIAN BANK",
  "INDIAN OVERSEAS BANK",
  "INDUSIND BANK",
  "ING VYSYA BANK",
  "JAMMU AND KASHMIR BANK",
  "JANA SMALL FINANCE BANK",
  "JANATA SAHAKARI BANK",
  "KALUPUR COMMERCIAL COOPERATIVE BANK",
  "KARNATAKA BANK",
  "KARUR VYSYA BANK",
  "KOTAK MAHINDRA BANK",
  "LAKSHMI VILAS BANK",
  "MEHSANA URBAN COOPERATIVE BANK",
  "MUNICIPAL COOPERATIVE BANK",
  "NAINITAL BANK",
  "NEW INDIA COOPERATIVE BANK",
  "NORTH EAST SMALL FINANCE BANK",
  "ORIENTAL BANK OF COMMERCE",
  "PUNJAB AND SIND BANK",
  "PUNJAB NATIONAL BANK",
  "RAJKOT NAGRIK SAHAKARI BANK",
  "RBL BANK",
  "SARASWAT BANK",
  "SHAMRAO VITHAL COOPERATIVE BANK",
  "SOUTH INDIAN BANK",
  "STANDARD CHARTERED BANK",
  "STATE BANK OF INDIA",
  "SURYODAY SMALL FINANCE BANK",
  "SYNDICATE BANK",
  "TAMILNAD MERCANTILE BANK",
  "UCO BANK",
  "UJJIVAN SMALL FINANCE BANK",
  "UNION BANK OF INDIA",
  "UNITED BANK OF INDIA",
  "UTKARSH SMALL FINANCE BANK",
  "VIJAYA BANK",
  "YES BANK",
  "ZOROASTRIAN COOPERATIVE BANK",
];

const QUICK_BANKS = [
  "STATE BANK OF INDIA",
  "HDFC BANK",
  "ICICI BANK",
  "AXIS BANK",
  "KOTAK MAHINDRA BANK",
  "PUNJAB NATIONAL BANK",
  "BANK OF BARODA",
  "CANARA BANK",
];

const QUICK_BANK_COLORS: Record<string, string> = {
  "STATE BANK OF INDIA": "bg-blue-100 text-blue-700 border-blue-200",
  "HDFC BANK": "bg-red-100 text-red-700 border-red-200",
  "ICICI BANK": "bg-orange-100 text-orange-700 border-orange-200",
  "AXIS BANK": "bg-purple-100 text-purple-700 border-purple-200",
  "KOTAK MAHINDRA BANK": "bg-rose-100 text-rose-700 border-rose-200",
  "PUNJAB NATIONAL BANK": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "BANK OF BARODA": "bg-amber-100 text-amber-700 border-amber-200",
  "CANARA BANK": "bg-yellow-100 text-yellow-700 border-yellow-200",
};

function fmt(s: string) {
  return s.replace(/_/g, " ");
}

// ─── Subcomponents ────────────────────────────────────────────────────────────
function Spinner({ size = 4 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className={`w-${size} h-${size} animate-spin text-violet-500`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
      />
    </svg>
  );
}

function SelectBox({
  label,
  value,
  options,
  onChange,
  disabled,
  loading,
  error,
  onRetry,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex-1 min-w-0">
      <p className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </p>
      {error ? (
        <div className="border border-red-200 rounded-xl px-4 py-3 bg-red-50 flex items-center justify-between gap-2">
          <span className="text-xs text-red-600">{error}</span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="text-xs font-bold text-violet-600 underline whitespace-nowrap"
            >
              Retry
            </button>
          )}
        </div>
      ) : (
        <div className="relative">
          {loading && (
            <div className="absolute inset-y-0 right-8 flex items-center">
              <Spinner size={4} />
            </div>
          )}
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || loading}
            className={`w-full appearance-none border rounded-xl px-4 py-3 text-sm font-medium bg-white transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent pr-10 ${
              disabled || loading
                ? "border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50"
                : "border-slate-200 text-slate-800 cursor-pointer hover:border-violet-300"
            }`}
          >
            <option value="">
              {loading ? `Loading ${label}s…` : `-- Select ${label} --`}
            </option>
            {options.map((o) => (
              <option key={o} value={o}>
                {fmt(o)}
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
      )}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded hover:bg-violet-100 text-slate-400 hover:text-violet-600 transition-colors flex-shrink-0"
      title="Copy"
    >
      {copied ? (
        <svg
          aria-hidden="true"
          className="w-3.5 h-3.5 text-green-500"
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
      ) : (
        <svg
          aria-hidden="true"
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      )}
    </button>
  );
}

function SkeletonRows({ n = 3 }: { n?: number }) {
  return (
    <>
      {[0, 1, 2].slice(0, n).map((rowIdx) => (
        <tr
          key={rowIdx}
          className={rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50"}
        >
          {["a", "b", "c", "d", "e", "f", "g", "h"].map((cellKey, j) => (
            <td key={cellKey} className="px-4 py-3">
              <div
                className="h-3 bg-slate-200 rounded animate-pulse"
                style={{ width: j === 3 ? "140px" : "72px" }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function IFSCFinder() {
  const [tab, setTab] = useState<"bank" | "ifsc">("bank");

  // ── Tab 1: Search by Bank state ─────────────────────────────────────────
  const [banks, setBanks] = useState<string[]>([]);
  const [banksState, setBanksState] = useState<LoadState>("idle");
  const [banksError, setBanksError] = useState("");

  const [selBank, setSelBank] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [statesState, setStatesState] = useState<LoadState>("idle");
  const [statesError, setStatesError] = useState("");

  const [selState, setSelState] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [citiesState, setCitiesState] = useState<LoadState>("idle");
  const [citiesError, setCitiesError] = useState("");

  const [selCity, setSelCity] = useState("");
  const [branches, setBranches] = useState<BranchObj[]>([]);
  const [branchesState, setBranchesState] = useState<LoadState>("idle");
  const [_branchesError, setBranchesError] = useState("");
  const [enrichedMap, setEnrichedMap] = useState<Record<string, BranchObj>>({});
  const [enrichingIfsc, setEnrichingIfsc] = useState<string | null>(null);

  // ── Tab 2: Search by IFSC ───────────────────────────────────────────────
  const [ifscInput, setIfscInput] = useState("");
  const [ifscResult, setIfscResult] = useState<BranchObj | null>(null);
  const [ifscState, setIfscState] = useState<LoadState>("idle");
  const [ifscError, setIfscError] = useState("");
  const [recentSearches, setRecentSearches] = useState<BranchObj[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("cready_ifsc_recent") || "[]");
    } catch {
      return [];
    }
  });

  // ── Loan offer sidebar ──────────────────────────────────────────────────
  const [mobile, setMobile] = useState("");
  const [mobileSubmitted, setMobileSubmitted] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const ifscDatasetRef = useRef<Record<
    string,
    Record<string, Record<string, Array<{ i: string; b: string }>>>
  > | null>(null);

  // ── Load dataset on mount ──────────────────────────────────────────────
  const loadBanks = useCallback(async () => {
    setBanksState("loading");
    setBanksError("");
    try {
      const res = await fetch("/ifsc_data.json");
      if (!res.ok) throw new Error("Failed");
      const data: Record<
        string,
        Record<string, Record<string, Array<{ i: string; b: string }>>>
      > = await res.json();
      ifscDatasetRef.current = data;
      const list = Object.keys(data).filter(Boolean).sort();
      setBanks(list.length > 0 ? list : FALLBACK_BANKS);
      setBanksState("success");
    } catch {
      setBanks(FALLBACK_BANKS);
      setBanksState("success");
    }
  }, []);

  useEffect(() => {
    loadBanks();
  }, [loadBanks]);

  // ── Load states from local dataset ──────────────────────────────────────
  async function loadStates(bank: string) {
    if (!bank) return;
    setStatesState("loading");
    setStatesError("");
    setStates([]);
    setCities([]);
    setBranches([]);
    setSelState("");
    setSelCity("");
    try {
      const ds = ifscDatasetRef.current;
      if (!ds) throw new Error("Dataset not loaded");
      const bankData = ds[bank];
      if (!bankData) throw new Error("Bank not found");
      setStates(Object.keys(bankData).filter(Boolean).sort());
      setStatesState("success");
    } catch {
      setStatesError("Unable to load states.");
      setStatesState("error");
    }
  }

  // ── Load cities from local dataset ──────────────────────────────────────
  async function loadCities(bank: string, state: string) {
    if (!bank || !state) return;
    setCitiesState("loading");
    setCitiesError("");
    setCities([]);
    setBranches([]);
    setSelCity("");
    try {
      const ds = ifscDatasetRef.current;
      if (!ds) throw new Error("Dataset not loaded");
      const stateData = ds[bank]?.[state];
      if (!stateData) throw new Error("State not found");
      setCities(Object.keys(stateData).filter(Boolean).sort());
      setCitiesState("success");
    } catch {
      setCitiesError("Unable to load cities.");
      setCitiesState("error");
    }
  }

  // ── Load branches from local dataset, then enrich on click via Razorpay ─
  async function loadBranches(bank: string, state: string, city: string) {
    if (!bank || !state || !city) return;
    setBranchesState("loading");
    setBranchesError("");
    setBranches([]);
    try {
      const ds = ifscDatasetRef.current;
      if (!ds) throw new Error("Dataset not loaded");
      const branchList = ds[bank]?.[state]?.[city];
      if (!branchList) throw new Error("City not found");
      const mapped: BranchObj[] = branchList.map(({ i, b }) => ({
        IFSC: i,
        BRANCH: b,
        BANK: bank,
        STATE: state,
        CITY: city,
        DISTRICT: "",
        ADDRESS: "",
        MICR: "",
        CONTACT: "",
        NEFT: "",
        RTGS: "",
        IMPS: "",
      }));
      setBranches(mapped);
      setBranchesState("success");
    } catch {
      setBranchesError("Unable to load branches.");
      setBranchesState("error");
    }
  }

  // ── Enrich a branch row with full details via Razorpay ──────────────────
  async function enrichBranch(ifsc: string): Promise<BranchObj | null> {
    try {
      const res = await fetch(`${RAZORPAY}/${ifsc}`);
      if (!res.ok) return null;
      return (await res.json()) as BranchObj;
    } catch {
      return null;
    }
  }

  function handleBankChange(bank: string) {
    setSelBank(bank);
    setSelState("");
    setSelCity("");
    setBranches([]);
    setBranchesState("idle");
    if (bank) loadStates(bank);
    else {
      setStates([]);
      setStatesState("idle");
    }
  }
  function handleStateChange(state: string) {
    setSelState(state);
    setSelCity("");
    setBranches([]);
    setBranchesState("idle");
    if (state) loadCities(selBank, state);
    else {
      setCities([]);
      setCitiesState("idle");
    }
  }
  function handleCityChange(city: string) {
    setSelCity(city);
    setBranches([]);
    if (city) loadBranches(selBank, selState, city);
    else setBranchesState("idle");
  }
  function handleReset() {
    setSelBank("");
    setSelState("");
    setSelCity("");
    setStates([]);
    setCities([]);
    setBranches([]);
    setStatesState("idle");
    setCitiesState("idle");
    setBranchesState("idle");
    setStatesError("");
    setCitiesError("");
    setBranchesError("");
    setEnrichedMap({});
    setEnrichingIfsc(null);
  }

  // ── IFSC Code Search ─────────────────────────────────────────────────────
  async function searchIfsc() {
    const code = ifscInput.trim().toUpperCase();
    if (code.length !== 11) return;
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setIfscState("loading");
    setIfscError("");
    setIfscResult(null);
    try {
      const res = await fetch(`${RAZORPAY}/${code}`, {
        signal: abortRef.current.signal,
      });
      if (res.status === 404) {
        setIfscError("Branch not found. Please check the IFSC code.");
        setIfscState("error");
        return;
      }
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      setIfscResult(data as BranchObj);
      setIfscState("success");
      setRecentSearches((prev) => {
        const updated = [
          data as BranchObj,
          ...prev.filter((r: BranchObj) => r.IFSC !== (data as BranchObj).IFSC),
        ].slice(0, 5);
        localStorage.setItem("cready_ifsc_recent", JSON.stringify(updated));
        return updated;
      });
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "AbortError") return;
      setIfscError("Network error. Please try again.");
      setIfscState("error");
    }
  }

  const showBranchResults = branchesState === "success" && branches.length > 0;
  const showBranchLoading = branchesState === "loading";
  const showBranchError = branchesState === "error";

  const boolLabel = (v: boolean | string) =>
    v === true || v === "true" || v === "Y" ? "✓ Yes" : "✗ No";

  const RESULT_FIELDS: { label: string; key: keyof BranchObj }[] = [
    { label: "Bank", key: "BANK" },
    { label: "Branch", key: "BRANCH" },
    { label: "IFSC Code", key: "IFSC" },
    { label: "MICR Code", key: "MICR" },
    { label: "Address", key: "ADDRESS" },
    { label: "City", key: "CITY" },
    { label: "District", key: "DISTRICT" },
    { label: "State", key: "STATE" },
    { label: "Contact", key: "CONTACT" },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-black text-slate-800">
            IFSC Finder
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Instant bank branch lookup — verified IFSC &amp; MICR codes across
            India
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* ── Left column ── */}
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
              <div className="px-4 sm:px-6 py-4">
                <h2 className="text-xl font-black text-slate-800 mb-2">
                  Search IFSC &amp; MICR
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  List of IFSC code, MICR code &amp; Branch Address of all bank
                  branches in India. Find verified codes for{" "}
                  <strong className="text-violet-700">NEFT</strong>,{" "}
                  <strong className="text-violet-700">RTGS</strong> &amp;{" "}
                  <strong className="text-violet-700">IMPS</strong>{" "}
                  transactions.
                </p>
              </div>
            </motion.div>

            {/* Search Mode Tabs + Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              {/* Tab Toggle */}
              <div className="flex border-b border-slate-100">
                {(["bank", "ifsc"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    data-ocid={`ifsc.${t}_tab.tab`}
                    className={`flex-1 py-3.5 text-sm font-bold transition-all relative ${
                      tab === t
                        ? "text-violet-700"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {t === "bank"
                      ? "🏦 Search by Bank"
                      : "🔍 Search by IFSC Code"}
                    {tab === t && (
                      <motion.div
                        layoutId="tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-5 sm:p-6">
                <AnimatePresence mode="wait">
                  {tab === "bank" ? (
                    <motion.div
                      key="bank-tab"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.18 }}
                    >
                      {/* Quick chips */}
                      <div className="mb-5">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          Quick Select Bank
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {QUICK_BANKS.map((bank) => (
                            <motion.button
                              key={bank}
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleBankChange(bank)}
                              data-ocid="ifsc.quick_bank.button"
                              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                selBank === bank
                                  ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200"
                                  : `${QUICK_BANK_COLORS[bank] ?? "bg-slate-100 text-slate-600 border-slate-200"} hover:shadow-sm`
                              }`}
                            >
                              {fmt(bank)}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Cascading Dropdowns */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <SelectBox
                          label="Bank"
                          value={selBank}
                          options={banks}
                          onChange={handleBankChange}
                          loading={banksState === "loading"}
                          error={banksError}
                          onRetry={loadBanks}
                        />
                        <SelectBox
                          label="State"
                          value={selState}
                          options={states}
                          onChange={handleStateChange}
                          disabled={!selBank}
                          loading={statesState === "loading"}
                          error={statesError}
                          onRetry={() => selBank && loadStates(selBank)}
                        />
                        <SelectBox
                          label="City"
                          value={selCity}
                          options={cities}
                          onChange={handleCityChange}
                          disabled={!selState}
                          loading={citiesState === "loading"}
                          error={citiesError}
                          onRetry={() =>
                            selState && loadCities(selBank, selState)
                          }
                        />
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={handleReset}
                            data-ocid="ifsc.reset.button"
                            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-violet-600 border border-violet-200 hover:bg-violet-50 transition-colors"
                          >
                            ↺ Reset
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="ifsc-tab"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.18 }}
                    >
                      <p className="text-sm text-slate-600 mb-4">
                        Enter the 11-character IFSC code to instantly look up
                        any branch across India.
                      </p>
                      <div className="flex gap-3 items-stretch">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={ifscInput}
                            maxLength={11}
                            onChange={(e) =>
                              setIfscInput(
                                e.target.value
                                  .toUpperCase()
                                  .replace(/[^A-Z0-9]/g, "")
                                  .slice(0, 11),
                              )
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              ifscInput.length === 11 &&
                              searchIfsc()
                            }
                            placeholder="e.g. SBIN0004343"
                            data-ocid="ifsc.ifsc_code.input"
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono font-bold text-slate-800 tracking-widest focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent uppercase placeholder:font-sans placeholder:font-normal placeholder:tracking-normal"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                            {ifscInput.length}/11
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={searchIfsc}
                          disabled={
                            ifscInput.length !== 11 || ifscState === "loading"
                          }
                          data-ocid="ifsc.find_branch.button"
                          className={`px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                            ifscInput.length === 11 && ifscState !== "loading"
                              ? "bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-lg shadow-violet-200 hover:shadow-violet-300"
                              : "bg-slate-100 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          {ifscState === "loading" && <Spinner size={4} />}
                          Find Branch
                        </motion.button>
                      </div>

                      {/* IFSC Result */}
                      <AnimatePresence>
                        {ifscState === "success" && ifscResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{
                              type: "spring",
                              stiffness: 260,
                              damping: 24,
                            }}
                            className="mt-5 bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 rounded-2xl overflow-hidden"
                            data-ocid="ifsc.result.card"
                          >
                            <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-5 py-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-white font-bold text-sm">
                                  Branch Found
                                </span>
                              </div>
                              <span className="font-mono text-violet-200 text-xs font-bold">
                                {ifscResult.IFSC}
                              </span>
                            </div>
                            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {RESULT_FIELDS.map(({ label, key }) => (
                                <div
                                  key={key}
                                  className="bg-white rounded-xl px-4 py-3 border border-violet-100"
                                >
                                  <p className="text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-1">
                                    {label}
                                  </p>
                                  <div className="flex items-center">
                                    <span className="text-sm font-semibold text-slate-800 break-all">
                                      {String(ifscResult[key] ?? "—")}
                                    </span>
                                    {ifscResult[key] && (
                                      <CopyButton
                                        text={String(ifscResult[key])}
                                      />
                                    )}
                                  </div>
                                </div>
                              ))}
                              <div className="bg-white rounded-xl px-4 py-3 border border-violet-100">
                                <p className="text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-1">
                                  Services
                                </p>
                                <div className="flex gap-3 text-xs font-bold">
                                  <span
                                    className={
                                      ifscResult.NEFT === true ||
                                      ifscResult.NEFT === "true"
                                        ? "text-green-600"
                                        : "text-slate-400"
                                    }
                                  >
                                    NEFT {boolLabel(ifscResult.NEFT)}
                                  </span>
                                  <span
                                    className={
                                      ifscResult.RTGS === true ||
                                      ifscResult.RTGS === "true"
                                        ? "text-green-600"
                                        : "text-slate-400"
                                    }
                                  >
                                    RTGS {boolLabel(ifscResult.RTGS)}
                                  </span>
                                  <span
                                    className={
                                      ifscResult.IMPS === true ||
                                      ifscResult.IMPS === "true"
                                        ? "text-green-600"
                                        : "text-slate-400"
                                    }
                                  >
                                    IMPS {boolLabel(ifscResult.IMPS)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="px-5 py-3 border-t border-violet-100">
                              <p className="text-[11px] text-slate-400">
                                ⚠ Data sourced from open banking APIs. Verify
                                IFSC codes with your bank before transacting.
                              </p>
                            </div>
                          </motion.div>
                        )}
                        {ifscState === "error" && (
                          <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-4 bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center justify-between"
                            data-ocid="ifsc.ifsc_search.error_state"
                          >
                            <div className="flex items-center gap-2">
                              <svg
                                aria-hidden="true"
                                className="w-4 h-4 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="text-sm text-red-700 font-medium">
                                {ifscError}
                              </span>
                            </div>
                            {!ifscError.includes("not found") && (
                              <button
                                type="button"
                                onClick={searchIfsc}
                                className="text-xs font-bold text-violet-600 underline"
                              >
                                Retry
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Recent Searches */}
            <AnimatePresence>
              {tab === "ifsc" && recentSearches.length > 0 && (
                <motion.div
                  key="recent-searches"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="mt-5 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/60 to-purple-50/60 p-4 shadow-sm"
                  data-ocid="ifsc.recent_searches.panel"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-violet-700">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Recent Searches
                    </div>
                    <button
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem("cready_ifsc_recent");
                      }}
                      className="text-xs text-violet-400 hover:text-violet-600 transition-colors"
                      type="button"
                      data-ocid="ifsc.recent_searches.clear_button"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {recentSearches.map((item) => (
                        <motion.div
                          key={item.IFSC}
                          layout
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.75 }}
                          transition={{ duration: 0.2 }}
                          className="group flex items-center gap-1.5 rounded-full border border-violet-200 bg-white/80 px-3 py-1.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                          data-ocid="ifsc.recent_searches.item"
                          onClick={() => {
                            setIfscInput(item.IFSC);
                            setTimeout(() => {
                              const input = item.IFSC.trim().toUpperCase();
                              if (input.length !== 11) return;
                              setIfscState("loading");
                              setIfscResult(null);
                              setIfscError("");
                              const ctrl = new AbortController();
                              abortRef.current = ctrl;
                              fetch(`https://ifsc.razorpay.com/${input}`, {
                                signal: ctrl.signal,
                              })
                                .then(async (res) => {
                                  if (res.status === 404) {
                                    setIfscError(
                                      `IFSC code "${input}" not found.`,
                                    );
                                    setIfscState("error");
                                    return;
                                  }
                                  if (!res.ok) throw new Error("Network error");
                                  const data = await res.json();
                                  setIfscResult(data as BranchObj);
                                  setIfscState("success");
                                  setRecentSearches((prev) => {
                                    const updated = [
                                      data as BranchObj,
                                      ...prev.filter(
                                        (r: BranchObj) =>
                                          r.IFSC !== (data as BranchObj).IFSC,
                                      ),
                                    ].slice(0, 5);
                                    localStorage.setItem(
                                      "cready_ifsc_recent",
                                      JSON.stringify(updated),
                                    );
                                    return updated;
                                  });
                                })
                                .catch((e) => {
                                  if (
                                    e instanceof Error &&
                                    e.name === "AbortError"
                                  )
                                    return;
                                  setIfscError(
                                    "Network error. Please try again.",
                                  );
                                  setIfscState("error");
                                });
                            }, 0);
                          }}
                        >
                          <span className="text-xs font-medium text-violet-700 max-w-[120px] truncate">
                            {item.BANK}
                          </span>
                          <span className="text-xs text-violet-400">·</span>
                          <span className="font-mono text-xs text-purple-600">
                            {item.IFSC}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const updated = recentSearches.filter(
                                (r) => r.IFSC !== item.IFSC,
                              );
                              setRecentSearches(updated);
                              localStorage.setItem(
                                "cready_ifsc_recent",
                                JSON.stringify(updated),
                              );
                            }}
                            className="ml-1 text-violet-300 hover:text-violet-600 transition-colors opacity-0 group-hover:opacity-100"
                            type="button"
                            data-ocid="ifsc.recent_searches.remove_button"
                          >
                            ×
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Branch Results Table (Tab 1) */}
            <AnimatePresence>
              {tab === "bank" &&
                (showBranchResults || showBranchLoading || showBranchError) && (
                  <motion.div
                    key="branch-table"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                    data-ocid="ifsc.results.table"
                  >
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100 px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {showBranchLoading ? (
                          <>
                            <Spinner size={4} />
                            <span className="text-sm font-bold text-violet-700">
                              Loading branches…
                            </span>
                          </>
                        ) : showBranchError ? (
                          <>
                            <span className="text-sm font-bold text-red-600">
                              Error loading branches
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                loadBranches(selBank, selState, selCity)
                              }
                              className="text-xs font-bold text-violet-600 underline ml-2"
                            >
                              Retry
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-sm font-bold text-violet-800">
                              {branches.length} Branch
                              {branches.length !== 1 ? "es" : ""} Found
                            </span>
                          </>
                        )}
                      </div>
                      {!showBranchLoading && !showBranchError && (
                        <span className="text-xs text-slate-400 font-medium">
                          {fmt(selBank)} · {fmt(selCity)}
                        </span>
                      )}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-violet-600 text-white">
                            {[
                              "IFSC Code",
                              "MICR Code",
                              "Bank",
                              "Branch",
                              "Address",
                              "City",
                              "State",
                              "Contact",
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
                          {showBranchLoading ? (
                            <SkeletonRows n={3} />
                          ) : (
                            branches.map((b, i) => (
                              <motion.tr
                                key={`${b.IFSC}-${i}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: Math.min(i * 0.05, 0.4) }}
                                className={`cursor-pointer transition-colors ${
                                  i % 2 === 0
                                    ? "bg-white hover:bg-violet-50/60"
                                    : "bg-slate-50 hover:bg-violet-50/60"
                                }`}
                                data-ocid={`ifsc.branch.item.${i + 1}`}
                                onClick={async () => {
                                  if (enrichedMap[b.IFSC]) return;
                                  setEnrichingIfsc(b.IFSC);
                                  const full = await enrichBranch(b.IFSC);
                                  if (full)
                                    setEnrichedMap((prev) => ({
                                      ...prev,
                                      [b.IFSC]: full,
                                    }));
                                  setEnrichingIfsc(null);
                                }}
                                title="Click to load full branch details"
                              >
                                {(() => {
                                  const row = enrichedMap[b.IFSC] ?? b;
                                  const isLoading = enrichingIfsc === b.IFSC;
                                  return (
                                    <>
                                      <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-1">
                                          <span className="font-mono font-bold text-violet-700">
                                            {row.IFSC}
                                          </span>
                                          <CopyButton text={row.IFSC} />
                                          {isLoading && (
                                            <span className="ml-1 w-3 h-3 rounded-full border-2 border-violet-400 border-t-transparent animate-spin inline-block" />
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 font-mono text-slate-600 whitespace-nowrap">
                                        {isLoading ? (
                                          <span className="text-slate-300">
                                            loading…
                                          </span>
                                        ) : (
                                          row.MICR || "—"
                                        )}
                                      </td>
                                      <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap max-w-[140px] truncate">
                                        {fmt(row.BANK)}
                                      </td>
                                      <td className="px-4 py-3 text-slate-700 font-medium whitespace-nowrap">
                                        {fmt(row.BRANCH)}
                                      </td>
                                      <td className="px-4 py-3 text-slate-600 min-w-[160px]">
                                        {isLoading ? (
                                          <span className="text-slate-300">
                                            loading…
                                          </span>
                                        ) : (
                                          row.ADDRESS || (
                                            <span className="text-slate-300 text-xs italic">
                                              click row to load
                                            </span>
                                          )
                                        )}
                                      </td>
                                      <td className="px-4 py-3 text-teal-700 font-semibold whitespace-nowrap">
                                        {fmt(row.CITY)}
                                      </td>
                                      <td className="px-4 py-3 text-teal-600 whitespace-nowrap">
                                        {fmt(row.STATE)}
                                      </td>
                                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                                        {isLoading ? (
                                          <span className="text-slate-300">
                                            loading…
                                          </span>
                                        ) : (
                                          row.CONTACT || "—"
                                        )}
                                      </td>
                                    </>
                                  );
                                })()}
                              </motion.tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    {showBranchResults && (
                      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
                        <p className="text-[11px] text-slate-400">
                          ⚠ Data sourced from open banking APIs. Verify IFSC
                          codes with your bank before transacting.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
            </AnimatePresence>

            {/* Empty prompt when bank selected but not city yet */}
            <AnimatePresence>
              {tab === "bank" &&
                selBank &&
                !selCity &&
                branchesState === "idle" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center"
                    data-ocid="ifsc.results.empty_state"
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
                      Select State → City to view branches
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      Use the dropdowns above to narrow down your search
                    </p>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-5">
            {/* Loan Offer Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-slate-100 flex justify-end">
                <button
                  type="button"
                  className="text-xs font-bold text-violet-700 border border-violet-200 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-colors"
                  data-ocid="ifsc.login.button"
                >
                  Existing User? Login to Resume Journey
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-slate-800 mb-1 leading-tight">
                  Check <span className="text-teal-600">Loan Offers</span>
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
                      data-ocid="ifsc.submit.button"
                      className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                        mobile.length === 10
                          ? "bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-lg shadow-violet-200"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
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

            {/* Stats Card */}
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
                  { label: "Banks Covered", value: "200+" },
                  { label: "States & UTs", value: "All" },
                  { label: "Branch Records", value: "160,000+" },
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
              <div className="mt-4 pt-4 border-t border-violet-500">
                <p className="text-xs text-violet-200 leading-relaxed">
                  Powered by open banking APIs. Data updated regularly for
                  accuracy.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
