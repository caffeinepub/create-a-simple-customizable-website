# Specification

## Summary
**Goal:** Add a publish flow so website content can be edited as Draft and then promoted to Live for the public site.

**Planned changes:**
- Update backend data model to persist separate Draft and Live versions of website content.
- Add backend APIs to read Live content, read Draft content, update Draft content, and publish Draft to Live atomically.
- Add a conditional Motoko state migration so existing single-version content becomes both initial Live and Draft on upgrade.
- Update the public frontend to render Live content by default.
- Update the editor to load/edit/save Draft content and include an explicit “Publish” action with clear English success/failure feedback, and refetch/invalidate so the site reflects published changes without a hard refresh.

**User-visible outcome:** Visitors see only Live content on the public site, while editors can save Draft changes privately and explicitly publish them to make updates appear on the live site.
