# Cready Loan Onboarding

## Current State
Full-stack fintech onboarding app with 7-step journey, dashboard with sidebar pages, credit report, IFSC finder, gold loan, calculators, profile, and my offers. Mobile view is optimized for dashboard home. All routing is fixed. Motion library (v12) is available.

## Requested Changes (Diff)

### Add
- PageTransition wrapper component using `motion` library with slide-in/out animation (x-axis slide) for cinematic feel
- Wrap every route page with PageTransition

### Modify
- Apply PageTransition to all journey steps: Step1-Step7, MyOffers, Dashboard, Review, Success
- CreditReport: Mobile layout fixes — score hero stacks properly, gauge scales down, cards go single column, expandable panels are full-width
- MyOffers: Mobile fixes — cards single column, carousels scroll properly, approval bars fit, feature pills wrap
- Profile: Mobile fixes — form fields full-width, completion ring centers, KYC badges wrap
- GoldLoan: Mobile fixes — gold rate tables responsive, calculator inputs stack, live rates grid single-column on mobile, form steps full-width
- IFSCFinder: Mobile fixes — two-column layout collapses to single column, dropdowns full-width, result table scrollable horizontally

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/components/PageTransition.tsx` — uses `motion.div` with `initial={x:60, opacity:0}`, `animate={x:0, opacity:1}`, `exit={x:-60, opacity:0}`, ease transition ~0.35s
2. Update App.tsx: wrap `<Routes>` with `<AnimatePresence mode="wait">`, use `location` key for transitions
3. Wrap each page's root element with `<PageTransition>` OR apply motion props at page level
4. Mobile audit and fix for CreditReport.tsx — add responsive classes throughout
5. Mobile audit and fix for MyOffers.tsx
6. Mobile audit and fix for Profile.tsx
7. Mobile audit and fix for GoldLoan.tsx
8. Mobile audit and fix for IFSCFinder.tsx
