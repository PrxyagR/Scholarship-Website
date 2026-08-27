# MaplePath

MaplePath is a public, Canada-first directory of scholarships, internships, and competitions for high-school students in Grades 9–12.

## Weekly catalog review

1. Search official organization, university, government, and competition pages for new or changed opportunities.
2. Confirm eligibility, Canada access, deadline, and the direct official application URL.
3. Add or update the record in `app/data/opportunities.ts`.
4. Remove expired dated opportunities from the active catalog and update `catalogUpdatedAt`.
5. Run `npm run build` before publishing.

Every visible listing should have an HTTPS official link, a clear grade range, a study-focus tag, and a `lastVerified` date. Opportunities with a rolling or annual cycle should use a descriptive deadline label rather than guessing an exact date.
