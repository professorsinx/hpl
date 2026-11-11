# HPL 2027 · Healthcare Premier League

The website for the Healthcare Premier League, an inter-hospital tennis-ball
cricket tournament organised by Harshamitra Hospital, Trichy.

Built with Next.js 16 (App Router, Cache Components), React 19 and Supabase
(Postgres, Auth and Storage).

## What's in it

| Area | Route | Notes |
| --- | --- | --- |
| Home | `/` | Animated hero, tournament details, scrolling sponsor band, registration |
| Sponsors | `/sponsors` | Sponsor directory by tier; each logo in the home page band links here |
| Organisers | `/organizers` | Organising committee (`/organisers` redirects here) |
| Gallery | `/gallery` | Event photos and videos with a lightbox |
| Animation picker | `/animations` | The four hero animations side by side (not linked, not indexed) |
| Organiser console | `/admin` | Sign-in required: registrations, sponsors, photos and videos |

## First-time setup

1. **Install and configure**

   ```bash
   npm install
   cp .env.example .env.local   # then fill in the values
   ```

2. **Create the database objects.** Open the Supabase SQL editor and run
   [`supabase/migrations/20261111000000_cms_and_registration.sql`](supabase/migrations/20261111000000_cms_and_registration.sql).
   It is safe to run more than once. It creates the `sponsors`, `media_items`
   and `admins` tables, the three storage buckets, and the row level security
   policies, and hardens `teams` and `players` for public registration.

3. **Create your organiser login.**
   - Supabase dashboard → Authentication → Users → **Add user** (email and
     password, with "Auto confirm user" ticked).
   - Grant that user access to the console:

     ```sql
     insert into public.admins (user_id)
     select id from auth.users where email = 'you@example.com'
     on conflict do nothing;
     ```

   - Authentication → Sign In / Providers → turn **off** "Allow new users to
     sign up". A login alone never grants access (the `admins` table does),
     but there is no reason to leave sign-ups open.

4. **Run it**

   ```bash
   npm run dev
   ```

   Sign in at <http://localhost:3000/admin>.

## Day-to-day changes

| To change… | Edit |
| --- | --- |
| Dates, entry fee, contacts, hero animation | [`src/lib/site.ts`](src/lib/site.ts) |
| Organising committee names and bios | [`src/content/organizers.ts`](src/content/organizers.ts) |
| Sponsors, photos, videos, registrations | The organiser console at `/admin` |

### Choosing the hero animation

Open `/animations`, pick one of the four scenes, and set `heroScene` in
`src/lib/site.ts` to its id (`cover-drive`, `clean-bowled`, `pulse-rally` or
`the-squad`).

### Registration window

The registration form unlocks on the dates in `src/lib/site.ts`
(15 December 2026 to 15 January 2027, IST) and the server enforces the same
window. Outside production (`npm run dev`) it is always open so the flow can
be tested, and says so in a "Preview mode" note.

## How registration and payment work

1. A hospital employee fills in the three-step form: hospital and team (with
   an optional logo), captain and vice-captain, then payment.
2. They pay the entry fee in their own UPI app, by tapping the UPI deep link on
   a phone or scanning the QR code from a computer, and type in the 12-digit
   UPI reference (UTR).
3. The registration is stored as *pending*. In `/admin/registrations` the
   treasurer matches the UTR against the bank statement and marks it verified.

The site never touches money or bank credentials; the UTR is a claim that an
organiser confirms. A UTR can only be used for one registration.

## Security model

- Visitors use Supabase's public key. Row level security lets them **insert**
  a registration and read **published** sponsors and media, nothing else.
- Organisers sign in with Supabase Auth. Every admin page and every Server
  Action re-checks the session and membership of `public.admins`; the same rule
  is enforced again in the database by `public.is_admin()`.
- All input is validated in the browser, again in the Server Action
  ([`src/lib/validation.ts`](src/lib/validation.ts)), and again by database
  constraints.

## Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```
