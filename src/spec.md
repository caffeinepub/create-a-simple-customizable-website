# Specification

## Summary
**Goal:** Allow any user (including anonymous) to edit and save website content without admin restrictions.

**Planned changes:**
- Update the backend `updateWebsiteContent` method to remove admin-only authorization so any caller (including anonymous) can successfully persist `WebsiteContent`.
- Update the editor UI so it no longer blocks non-admin users or shows an “Only administrators can edit” access-denied state.
- Remove/disable frontend admin-gating behaviors (e.g., reliance on `isCallerAdmin`, `caffeineAdminToken`, or React Query calls used only to gate editing) so the edit flow works end-to-end without admin checks.

**User-visible outcome:** Clicking “Edit Site” opens the editor for anyone, and saving works for non-admin and anonymous users, with the updated content visible afterward.
