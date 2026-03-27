# Cready Loan Onboarding

## Current State
Dashboard home (Step4Dashboard.tsx) shows: credit score donut, smart insights, loan calculator/EMI, FD credit cards widget, then a View My Offers button at the bottom.

## Requested Changes (Diff)

### Add
- Recommended Offers section between the calculator and FD cards: 3-4 colorful loan offer cards with gradient backgrounds, lender name, offer amount, interest rate, approval probability bar, "Apply Now" CTA. Use vibrant distinct colors per card (purple, teal, orange, rose).
- Center-aligned "View All Offers →" button below the recommended offers section.

### Modify
- Move FD-Backed Credit Cards section to appear after the View All Offers button.
- Make the FD credit cards more colorful with vivid gradient card backgrounds instead of white.
- Remove the old bottom View My Offers button (replaced by centered one above FD section).

### Remove
- Old bottom `motion.button` for View My Offers.

## Implementation Plan
1. Add a `recommendedOffers` array with 3-4 mock loan offers (lender, amount, rate, approval %, gradient colors).
2. Render them as animated colorful gradient cards with approval bars after the calculator grid.
3. Add a centered "View All Offers" button (indigo gradient, full rounded, shadow) below the offers.
4. Render the FD credit cards section after the button, with gradient card backgrounds (purple, blue, orange).
