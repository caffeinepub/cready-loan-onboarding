# Cready Loan Onboarding — V14 Mobile-First Enhancement

## Current State
- 7-step onboarding (registration → OTP → analyzing → dashboard → offers → review → thank you)
- DashboardLayout with dark collapsible sidebar (desktop only)
- Dashboard home: credit score donut, loan calculator, 4 recommended offer cards, FD cards
- Routes: my-offers, credit-report, profile, calculators, ifsc-finder, support, gold-loan
- Animations: motion/react (framer-motion) throughout
- No mobile hamburger nav, no swipe gestures, no progress bar on onboarding
- No sidebar search, no footer quick-chat/FAQ
- Forms do not enforce input type=tel/number/email for mobile keyboards

## Requested Changes (Diff)

### Add
- **Dashboard bottom tab bar** (mobile only, fixed): Overview | Active Loans | History | Settings — 44px+ tap targets, single-row
- **Hamburger mobile menu** in DashboardLayout header — opens a full-screen slide-in drawer with the full nav, supports touch swipe-to-close
- **Sidebar search bar** (desktop collapsed/expanded sidebar) — filter nav items by label
- **Footer bar** on dashboard pages: Quick Chat button (opens a bottom sheet) + FAQ link
- **Onboarding persistent progress bar** — sticky top bar showing step X of 5 across Steps 1–6, with animated fill and skip button for returning users
- **Onboarding branching** — Step 1 gets salaried/self-employed toggle, routes to slightly different Step 3 analyzing screens
- **CIBIL score tooltip** — on Step 3 analyzing screen, hover/tap the credit score reveals a tooltip explaining CIBIL range (300–900)
- **Gamified badge animation on Step 7** — confetti burst + animated badge unlock on approval ("Loan Hero 🏆" or similar)
- **Real-time lender match counter** on Step 3 — animated count-up of matched lenders found
- **Confetti burst** on Step 7 (thank you/success page)
- **Staggered GSAP-style slide-in animation** on cards — `initial: {x:-50, opacity:0}` → `animate: {x:0, opacity:1}` with 0.05s stagger per card (use motion/react, no GSAP library needed)
- **Swipe carousel with parallax** — recommended offer cards become swipe-able on mobile with slight parallax depth effect

### Modify
- **DashboardLayout**: Add hamburger button in top header on mobile (md:hidden), add swipe gesture listener to open/close mobile drawer
- **DashboardLayout**: Add search input in sidebar above nav items
- **DashboardLayout**: Add footer bar with Quick Chat + FAQ, visible on dashboard pages
- **Step1Registration**: Add employment type toggle (Salaried / Self-Employed) above the form; store selection in AppContext; enforce inputMode="numeric" on phone field
- **Step2OTP**: enforce inputMode="numeric" on OTP inputs
- **Step3Analyzing**: Add real-time lender match counter animation; add CIBIL tooltip; show different analyzing copy for salaried vs self-employed
- **Step7ThankYou**: Add confetti burst animation + gamified badge (unlock animation)
- **All forms**: Single-column layout on mobile, ensure all numeric fields use type="tel" or inputMode="numeric", email fields use type="email" inputMode="email"
- **Dashboard home recommended offers grid**: Convert to horizontal swipe carousel on mobile (single-column, snap-scroll, parallax cards)
- **All pages**: min-h-0, overflow-x-hidden, no horizontal scroll
- **All interactive elements**: min 44×44px tap targets on mobile

### Remove
- No features removed

## Implementation Plan
1. Update `AppContext` in App.tsx to add `employmentType: 'salaried' | 'self-employed'` and `isReturningUser: boolean`
2. Update `Step1Registration`: add employment toggle, enforce numeric input modes, single-column mobile
3. Update `Step2OTP`: enforce numeric input mode
4. Update `Step3Analyzing`: animated lender match counter, CIBIL tooltip, employment-aware copy
5. Update `Step7ThankYou`: confetti burst (CSS keyframe particles), gamified badge unlock animation
6. Add persistent progress bar component → inject into Steps 1–6
7. Update `DashboardLayout`:
   - Add hamburger button (visible on mobile only) in header
   - Add slide-in mobile drawer with swipe-to-close gesture
   - Add search bar above nav items
   - Add sticky footer bar with Quick Chat bottom sheet and FAQ link
   - Add bottom tab bar (fixed, mobile only)
8. Update `Step4Dashboard` recommended offers: on mobile, convert grid to horizontal snap-scroll swipe carousel with parallax
9. Apply staggered `x:-50 opacity:0` slide-in to all card grids globally
10. Ensure all pages: overflow-x-hidden, 44px tap targets, single-column forms on mobile
11. Validate and build
