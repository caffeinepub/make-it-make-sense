# Specification

## Summary
**Goal:** Build a minimal personal app (“Make It Make Sense”) with per-user Internet Identity sign-in, run-once onboarding, a mostly-silent daily surface, an interruption rewrite, and a weekly inconsistency reflection—while enforcing strict no-advice/no-questions constraints.

**Planned changes:**
- Add Internet Identity sign-in/out and per-user state scoped to the authenticated principal.
- Implement a run-once onboarding flow with exactly four questions shown one at a time, storing responses verbatim and marking onboarding complete.
- Create the mostly-silent daily experience: on most days show nothing; on some days show exactly one sentence derived only from the user’s stored wording (edited only for clarity/grammar).
- Add the centered “Your Current Explanation” block (exact title) that displays the single daily sentence when content is shown.
- Add the “State it without cushioning.” button to rewrite the displayed explanation into a more literal single sentence using only the user’s stored wording.
- Implement the weekly reflection shown at most once per rolling 7-day window, titled exactly “Where your logic bent.” and describing inconsistencies in explanations only.
- Enforce hard constraints across all app-generated text: no advice, no questions after onboarding, no prohibited words, and no dashboards/streaks/goals/reminders; preserve silence on silent days.
- Persist minimal backend data in a single Motoko actor: onboarding answers, completion flag, timestamps for daily/weekly surfacing, and minimal history needed for weekly inconsistency reflection.
- Add a minimal reset control that clears stored answers/history without any question-phrased confirmation, returning the user to onboarding.
- Apply a minimal, neutral, almost-clinical visual theme with restrained palette (avoid blue/purple), simple typography, ample whitespace, and centered explanation layout.

**User-visible outcome:** A user can sign in with Internet Identity, complete a one-time 4-step onboarding, and then see either a blank (silent) home or a single-sentence “Your Current Explanation,” optionally rewritten via “State it without cushioning.”; once per week they may see “Where your logic bent.”, and they can reset their data to start over.
