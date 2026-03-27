import { createContext, useContext, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
import Step5Offers from "./pages/Step5Offers";
import Step6Review from "./pages/Step6Review";
import Step7ThankYou from "./pages/Step7ThankYou";
import Support from "./pages/Support";

interface AppState {
  name: string;
  mobile: string;
  email: string;
  setName: (v: string) => void;
  setMobile: (v: string) => void;
  setEmail: (v: string) => void;
}

export const AppContext = createContext<AppState>({
  name: "",
  mobile: "",
  email: "",
  setName: () => {},
  setMobile: () => {},
  setEmail: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

export default function App() {
  const [name, setName] = useState("Bharat");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("john.doe@example.com");

  return (
    <AppContext.Provider
      value={{ name, mobile, email, setName, setMobile, setEmail }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<Step1Registration />} />
          <Route path="/otp" element={<Step2OTP />} />
          <Route path="/analyzing" element={<Step3Analyzing />} />
          <Route path="/dashboard" element={<Step4Dashboard />} />
          <Route path="/offers" element={<Step5Offers />} />
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
      </BrowserRouter>
    </AppContext.Provider>
  );
}
