# Cready Loan Onboarding

## Current State
Seven-step onboarding flow (Register → OTP → Analyzing → Dashboard → Offers → Review → ThankYou). Dashboard has a sidebar with menu items (Dashboard, My Offers, Credit Report, Profile, Calculators, Support, Gold Loan) that are NOT clickable/routable.

## Requested Changes (Diff)

### Add
- Route `/my-offers` → MyOffers page (reuse Step5Offers data with sidebar layout)
- Route `/credit-report` → CreditReport page with full credit history, score breakdown, mock bureau data, animated charts
- Route `/profile` → Profile page with user details, KYC status, document upload mockups, editable fields
- Route `/calculators` → Calculators hub page with EMI calculator, eligibility calculator, IFSC finder tool
- Route `/support` → Support page with ticket list, FAQ accordion, live chat mockup
- Route `/gold-loan` → GoldLoan page with a full application form (gold weight, purity, valuation, personal details, submit)
- IFSC Finder tool: search by IFSC code or bank/branch name → show bank name, branch, address, MICR, city (mock data)
- All new pages share the same dark sidebar layout (DashboardLayout wrapper)
- Framer-motion animations on all new pages (staggered cards, slide-in panels, animated stats)

### Modify
- Step4Dashboard sidebar nav items made fully clickable with `useNavigate` routing
- Sidebar extracted into a shared `DashboardLayout` component used by all dashboard pages
- App.tsx gets new routes for all 7 new pages

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/components/DashboardLayout.tsx` — shared sidebar + wrapper
2. Refactor Step4Dashboard to use DashboardLayout
3. Create pages: MyOffers, CreditReport, Profile, Calculators (with IFSC Finder), Support, GoldLoan
4. Add routes in App.tsx
5. Validate build
