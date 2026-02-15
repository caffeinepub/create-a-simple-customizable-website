# Specification

## Summary
**Goal:** Update the default persisted website content so the site title is exactly "welcome to waxy" on fresh deploy/uninitialized state.

**Planned changes:**
- Update backend default/initial website content to set `siteTitle` to "welcome to waxy" when no prior saved content exists.
- Ensure `getWebsiteContent` returns `siteTitle == "welcome to waxy"` on fresh deploy.

**User-visible outcome:** On a fresh deploy, unauthenticated visitors see the header site title displayed as "welcome to waxy" without requiring any admin edits.
