# Specification

## Summary
**Goal:** Ensure website content and user profiles persist in the backend across canister redeploys/upgrades instead of resetting.

**Planned changes:**
- Persist editable `websiteContent` so updates made via `updateWebsiteContent` survive upgrades and `getWebsiteContent` returns the updated values after redeploy.
- Persist `userProfiles` so profiles saved via `saveCallerUserProfile` remain available via `getCallerUserProfile`/`getUserProfile` after upgrades, keeping existing authorization behavior unchanged.
- Add upgrade-safe state handling with conditional migration support (introducing `backend/migration.mo` only if needed) so upgrades from older deployed versions preserve existing `websiteContent` and `userProfiles`.

**User-visible outcome:** Content edits and saved user profiles remain intact after backend upgrades/redeploys; fresh installs still show the current default website content.
