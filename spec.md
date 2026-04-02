# Cready Loan Onboarding

## Current State
- `Step2OTP.tsx` shows PAN Details Modal after OTP; both "Yes" and "No, Enter Manually" navigate to `/analyzing`
- `Step3Analyzing.tsx` (Analyzing Your Financial DNA) uses a very dark `#030718` background with white/cyan text throughout
- `Step7ThankYou.tsx` (Form Submitted) also uses the same `#030718` dark background with white text
- No separate PAN manual input step exists

## Requested Changes (Diff)

### Add
- New `StepPANInput.tsx` page — a dedicated PAN manual entry step
  - Route: `/pan-input`
  - Light theme, premium fintech look
  - Shows StepIndicator at top
  - PAN input field with real-time formatting (auto-capitalize, pattern AAAAA0000A)
  - Validation: 10-char alphanumeric, proper PAN format
  - Animated submit button, disabled until valid PAN entered
  - On submit → navigate to `/analyzing`
  - Back link to go back to OTP step

### Modify
- `Step2OTP.tsx` — change `onManual` handler from `navigate("/analyzing")` to `navigate("/pan-input")`
- `App.tsx` — add `<Route path="/pan-input" element={<StepPANInput />} />` 
- `Step3Analyzing.tsx` — convert from dark (#030718) to light theme
  - Background: `bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50` or similar clean white/light gradient
  - Neural network SVG lines: change from white/cyan to indigo/violet tones
  - DNA helix: keep colors but make opacity visible on light bg
  - All text: switch from `text-white` / `text-white/70` to `text-slate-800` / `text-slate-600` / `text-indigo-700`
  - Card/panel: switch from `bg-white/5 backdrop-blur border-white/10` to `bg-white/80 backdrop-blur border-slate-200 shadow-lg`
  - Toast notifications: adapt to light theme (white bg with colored border)
  - Binary stream: switch to light-colored indigo/slate text
  - Glow orbs: use softer light-mode pastel radial gradients
  - Scan line: keep indigo/cyan but adjust opacity for visibility
  - Overall feel: premium, airy, modern — matches the rest of Cready's light theme
- `Step7ThankYou.tsx` — convert from dark (#030718) to light theme
  - Background: `bg-gradient-to-br from-white via-indigo-50 to-violet-50`
  - All `text-white` → `text-slate-800` or `text-indigo-800`
  - `text-white/60`, `text-white/70` → `text-slate-500`, `text-slate-600`
  - `bg-white/5`, `bg-white/10` glass cards → `bg-white/80 shadow-xl border border-slate-100`
  - `border-white/10`, `border-white/15` → `border-slate-200` / `border-indigo-100`
  - Aurora overlay at top: change dark purple to indigo/violet light gradient
  - Bottom orb glows: change to soft indigo/violet light gradients (low opacity ~0.08-0.12)
  - Confetti: keep as-is (it's colorful, works on both themes)
  - Stat chips: white bg with colored text, shadow, border
  - Tracking ID section: light card with indigo text
  - Reward badge: white card with gradient text

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/pages/StepPANInput.tsx` (new light-theme PAN entry page)
2. Add route in `App.tsx`
3. Update `Step2OTP.tsx` `onManual` to `navigate("/pan-input")`
4. Refactor `Step3Analyzing.tsx` background, text, card classes to light theme
5. Refactor `Step7ThankYou.tsx` background, text, card classes to light theme
6. Validate and fix any TypeScript/build errors
