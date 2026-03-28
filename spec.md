# Cready - Onboarding Journey Polish + Profile Image Upload

## Current State
- 7-step onboarding: Step1Registration (split layout, employment toggle, form, consents), Step2OTP (split layout, 4-digit OTP), Step3Analyzing (dark animated analysis screen), then dashboard with Step4-7.
- Profile page: dark card with text avatar "B", editable personal/employment details, KYC status — but NO image upload option.
- All steps have consistent indigo/violet gradient brand identity.
- No step progress counter shown on onboarding steps.

## Requested Changes (Diff)

### Add
- **Profile image upload**: On the profile card avatar, add a camera icon overlay (always visible, not just edit mode). Clicking opens a file input for image selection. Uploaded image displayed as the avatar (circular crop). Store in `localStorage` as base64 data URL. Persist across sessions.
- **Step progress indicator on onboarding pages**: Subtle sticky progress bar or step chip at the top of each onboarding page (Step 1/3 Registration, Step 2/3 OTP, Step 3/3 Analyzing).
- **6-digit OTP support in Step2**: Update to 6 boxes (modern Indian fintech standard) — keep auto-advance and backspace behavior.

### Modify
- **Step1Registration**: Improve consent checkboxes with custom styled pill checkboxes. Add a top-center step indicator pill ("Step 1 of 3"). Improve form field focus states (more vibrant ring). Add a more polished mobile-first hero pill at the top.
- **Step2OTP**: Change from 4-digit to 6-digit OTP boxes. Add step indicator ("Step 2 of 3"). Make OTP boxes more premium (larger, more modern, subtle shadow on focus). Timer pill more stylish.
- **Step3Analyzing**: Add step indicator ("Step 3 of 3"). Make the analysis card more cinematic — add a subtle pulsing ring around the logo, improve progress bar aesthetics.
- **Profile avatar area**: Replace static "B" text circle with an interactive avatar that shows uploaded photo or initials. Add hover state with camera icon. Include a small upload affordance label below avatar ("Change Photo").
- **Profile completion**: If user has uploaded photo, bump to 100% completion.

### Remove
- Nothing removed.

## Implementation Plan
1. Update `Profile.tsx`:
   - Add `profileImage` state, initialized from `localStorage.getItem('profileImage')`
   - Add hidden `<input type="file" accept="image/*">` ref
   - Avatar click opens file input (FileReader to get base64, save to localStorage and state)
   - Show circular cropped image when set, else show initials
   - Camera icon overlay on avatar hover
   - Update completion % to 100 when photo set

2. Update `Step2OTP.tsx`:
   - Change digit array to 6 elements
   - Add 6 refs
   - Adjust OTP box sizing for 6 boxes (slightly smaller to fit)
   - Add step indicator at top

3. Update `Step1Registration.tsx`:
   - Add step indicator at top of right panel
   - Improve checkbox styling with custom animated checkboxes

4. Update `Step3Analyzing.tsx`:
   - Add step indicator
   - Minor visual polish
