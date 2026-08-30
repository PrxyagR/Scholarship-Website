# MaplePath

MaplePath is a public, Canada-first directory of scholarships, internships, and competitions for high-school students in Grades 9–12.

## Site map

- `/` — mission, featured opportunities, and a quick orientation
- `/opportunities` — the searchable, filterable directory
- `/opportunities/[id]` — a decision-ready page for each listing
- `/how-it-works` — how to use the filters and verify a listing
- `/about` — the project mission and editorial promise
- `/sign-in` — email/password sign-in
- `/sign-up` — account creation with email confirmation
- `/account` — signed-in account page
- `/saved` — signed-in shortlist of saved opportunities
- `/privacy` — account data and measurement notice
- `/admin/signups` — private owner-only account metrics

## Account setup

MaplePath uses Supabase Auth for real email/password accounts. The directory remains public without an account. To enable account creation locally or on the deployed site:

1. Create a free Supabase project at [database.new](https://database.new).
2. In the Supabase project settings, copy the Project URL and the public publishable key into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Older projects can use `NEXT_PUBLIC_SUPABASE_ANON_KEY` instead.
3. Set `NEXT_PUBLIC_SITE_URL` to the deployed MaplePath URL, or `http://localhost:3000` for local development.
4. In Supabase Auth URL Configuration, set the Site URL and add these redirect URLs:
   - `https://maplepath-opportunities.prayagrakholia7.chatgpt.site/auth/confirm`
   - `https://maplepath-opportunities.prayagrakholia7.chatgpt.site/auth/callback`
   - `http://localhost:3000/auth/confirm`
   - `http://localhost:3000/auth/callback`
5. Keep email confirmation enabled. The confirmation route accepts Supabase’s `token_hash` email links; if you customize the Confirm signup email template, its link can use `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`.
6. For the private signup dashboard, configure `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_ADMIN_EMAIL` only as server-side secrets. Never put the service-role key in a `NEXT_PUBLIC_*` variable or commit it.

The owner can sign in with the configured admin email and open `/admin/signups`. “Registered accounts” is the count of unique Supabase Auth users; “Email-confirmed accounts” is the safer number to describe as verified registrations. Neither number is a page-view or unique-visitor metric.

## Saved opportunities

Signed-in users can save opportunities from the home highlights, directory cards, and detail pages. Their saved opportunity IDs are stored in their Supabase account metadata and shown at `/saved`. Signed-out visitors are sent to `/sign-in` and returned to the page they were viewing after authentication.

## Weekly catalog review

1. Search official organization, university, government, and competition pages for new or changed opportunities.
2. Confirm eligibility, Canada access, deadline, and the direct official application URL.
3. Add or update the record in `app/data/opportunities.ts`.
4. Remove expired dated opportunities from the active catalog and update `catalogUpdatedAt`.
5. Run `npm run build` before publishing.

Every visible listing should have an HTTPS official link, a clear grade range, a study-focus tag, and a `lastVerified` date. Opportunities with a rolling or annual cycle should use a descriptive deadline label rather than guessing an exact date.
