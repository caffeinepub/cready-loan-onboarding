import { createContext, useContext, useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Calculators from "./pages/Calculators";
import CreditReport from "./pages/CreditReport";
import GoldLoan from "./pages/GoldLoan";
import IFSCFinder from "./pages/IFSCFinder";
import MyOffers from "./pages/MyOffers";
import Profile from "./pages/Profile";
import Step1Registration from "./pages/Step1Registration";
import Step2OTP from "./pages/Step2OTP";
import Step3Analyzing from "./pages/Step3Analyzing";
import Step4Dashboard from "./pages/Step4Dashboard";
import Step6Review from "./pages/Step6Review";
import Step7ThankYou from "./pages/Step7ThankYou";
import StepPANInput from "./pages/StepPANInput";
import Support from "./pages/Support";

interface AppState {
  name: string;
  mobile: string;
  email: string;
  employmentType: "salaried" | "self-employed";
  isReturningUser: boolean;
  setName: (v: string) => void;
  setMobile: (v: string) => void;
  setEmail: (v: string) => void;
  setEmploymentType: (v: "salaried" | "self-employed") => void;
}

export const AppContext = createContext<AppState>({
  name: "",
  mobile: "",
  email: "",
  employmentType: "salaried",
  isReturningUser: false,
  setName: () => {},
  setMobile: () => {},
  setEmail: () => {},
  setEmploymentType: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

function AnimatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" replace />} />
      <Route path="/register" element={<Step1Registration />} />
      <Route path="/otp" element={<Step2OTP />} />
      <Route path="/pan-input" element={<StepPANInput />} />
      <Route path="/analyzing" element={<Step3Analyzing />} />
      <Route path="/dashboard" element={<Step4Dashboard />} />
      <Route path="/offers" element={<Navigate to="/my-offers" replace />} />
      <Route path="/review" element={<Step6Review />} />
      <Route path="/success" element={<Step7ThankYou />} />
      <Route path="/my-offers" element={<MyOffers />} />
      <Route path="/credit-report" element={<CreditReport />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/calculators" element={<Calculators />} />
      <Route path="/ifsc-finder" element={<IFSCFinder />} />
      <Route path="/support" element={<Support />} />
      <Route path="/gold-loan" element={<GoldLoan />} />
    </Routes>
  );
}

export default function App() {
  const [name, setName] = useState("Bharat");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("john.doe@example.com");
  const [employmentType, setEmploymentType] = useState<
    "salaried" | "self-employed"
  >("salaried");
  const [isReturningUser, setIsReturningUser] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem("cready_visited");
    if (visited) {
      setIsReturningUser(true);
    } else {
      localStorage.setItem("cready_visited", "true");
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        name,
        mobile,
        email,
        employmentType,
        isReturningUser,
        setName,
        setMobile,
        setEmail,
        setEmploymentType,
      }}
    >
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </AppContext.Provider>
  );
}
