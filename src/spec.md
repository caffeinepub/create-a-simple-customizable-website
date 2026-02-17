# Specification

## Summary
**Goal:** Fix the admin editor so signed-in admins can load, edit, and save draft website content using an authenticated Internet Identity actor (not an anonymous actor), while providing clear access messaging for non-authenticated/non-admin users.

**Planned changes:**
- Update the editor’s draft-content API calls to use an authenticated Internet Identity backend actor for admin-only draft endpoints.
- Ensure saving draft changes succeeds and shows a clear success confirmation to the user.
- Keep publishing behavior working as-is, including refreshing live site content after a successful publish.
- Improve editor access handling: prompt sign-in when not authenticated, and show an explicit access-denied message when authenticated but not authorized; keep all user-facing text in English.

**User-visible outcome:** Admins who are signed in can open the editor, see draft content without Unauthorized errors, edit and save drafts with a clear success message, and publish normally; non-authenticated or non-admin users see clear guidance to sign in and/or provide the existing admin secret token URL parameter instead of a generic load failure.
