# ROOPREKHAA — Architecture Study Library

A shared, community-contributed study library for an architecture WhatsApp group.
Students submit notes/books/links, an admin approves before anything goes public.
Browsing is organized as **Course → Part/Semester → Subject → Materials** across
four courses: IIA (Associateship exam), Diploma, B.Arch, and M.Arch.

Modern light/dark SaaS-style design with a real nav bar (Courses dropdown + quick
type links), homepage panels for Important Links / Announcements / Latest Uploads /
Popular Subjects, a newsletter signup, and a separate `syllabus/` folder of
official syllabus reference pages.

## Branding
The logo (`assets/logo.svg`) and wordmark (`assets/wordmark.svg`) are used in the
header and footer of `index.html` and `admin.html`. To change either later, just
replace those two files — nothing else references them by content, only by path,
so any same-named SVG drops in cleanly.

## The Syllabus link
The header/footer "Syllabus" quick-link opens `syllabus/index.html` in a new tab —
the 152-page official syllabus reference set, not a search of admin-uploaded
materials (that search exists too, just not from this button, since it's usually
empty and looked like a bug). Each subject's materials page also has an "Official
syllabus" button that jumps straight to that subject's specific syllabus page.


## Files

| File | Purpose |
|---|---|
| `index.html` | Public library — browse, search, contribute |
| `admin.html` | Admin review panel (Google sign-in required) |
| `app.js` | Public page logic |
| `admin.js` | Admin panel logic |
| `style.css` | Shared design system (light + dark theme) |
| `firebase-config.js` | **Edit this** — Firebase keys, admin emails, courses, links |
| `firestore.rules` | Firestore security rules |
| `storage.rules` | Not used — kept only in case you re-enable file uploads later |
| `syllabus/` | 152 subject-syllabus pages (Code/Intent/Contents/Notes/References), a separate local reference set — see `syllabus/README.md` |
| `assets/` | Logo (`logo.svg`) and wordmark (`wordmark.svg`) |

## Setup (15–20 minutes)

### 1. Create a new Firebase project
Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.

### 2. Enable the services you need
- **Build → Firestore Database** → Create database → **production mode**.
- **Build → Authentication** → Sign-in method → enable **Google**. (Any Google
  account can sign in as a student — access isn't restricted to `ADMIN_EMAILS`,
  that list only controls who can use `admin.html`.)

You do **not** need to enable Firebase Storage. Contributing material only
accepts a link (Google Drive, YouTube, etc.) — no files are uploaded to Firebase.
This is deliberate: Google now requires a billing account (Blaze plan) just to
activate Storage, even though usage within the free tier costs $0. Skipping
Storage means zero billing setup, ever.

### 3. Register a web app
Project Overview → **`</>`** (web) icon → register an app (no Hosting needed) →
copy the `firebaseConfig` object.

### 4. Edit `firebase-config.js`
- Paste your config into `firebaseConfig`.
- Add your Google email(s) to `ADMIN_EMAILS`.
- Check/edit `COURSES` (curriculum), `IMPORTANT_LINKS`, and `POPULAR_SUBJECTS`.

### 5. Match the security rules
`firestore.rules` has its own copy of the admin email list (rules can't read your
JS file) — edit the email inside `isAdmin()` there too. Then publish it in the
Firebase console: **Firestore Database → Rules → paste → Publish**.

### 6. Authorize your domain for Google Sign-In
**Authentication → Settings → Authorized domains → Add domain** → enter the exact
domain you'll host on (e.g. `yourname.github.io`). Without this, Google Sign-In
fails with `auth/unauthorized-domain`.

### 7. Host it
Any static host works — GitHub Pages, Netlify, Cloudflare Pages. No build step.

## What's new in this version

- **Modern light/dark theme** — toggle in the header (sun/moon icon), persisted
  via `localStorage`.
- **Real navigation** — Home, a Courses dropdown, quick type links (Notes/Books/
  Papers/Videos/Syllabus/Software), and Contribute, all in the header.
- **Homepage panels**: Important Links (curated, edit in `IMPORTANT_LINKS`),
  Announcements (with New/Update/Info badges — admin picks the type when posting),
  Latest Uploads, Popular Subjects, and a newsletter signup box.
- **Newsletter subscribers** — collected into a `subscribers` collection; view/export
  as CSV from the new **Subscribers** tab in `admin.html`. Only admins can read the
  list (anyone can submit their email, but the list itself isn't publicly browsable).

## Login gating

Browsing courses, parts/semesters, and subject names is open to everyone. Opening
a subject's materials, running a search, using Quick Access, or contributing all
require signing in with Google — enforced both in the UI and in `firestore.rules`
(reads/writes on `materials` are rejected for signed-out requests).

## How moderation works

1. A student submits material → saved as `status: "pending"`, invisible to everyone
   (including other signed-in students) until approved.
2. Sign into `admin.html` → **Pending** tab → **Approve** (goes live instantly) or
   **Reject** (deleted).
3. **Published** tab lets you remove anything later.
4. **Announcements** tab posts to the homepage panel — pick New/Update/Info as the
   badge color.
5. **Subscribers** tab shows everyone who signed up for the newsletter box, with a
   CSV export button.

## Curriculum sources

- **Diploma**: VES College of Architecture, Mumbai's COA-approved, MSBTE-affiliated
  6-semester Diploma in Architecture.
- **B.Arch**: School of Planning & Architecture, New Delhi's published COA-aligned
  10-semester syllabus (condensed to main subjects per semester).
- **M.Arch**: general COA-regulated 4-semester structure — varies a lot by
  specialization/institute, treat as a reasonable default more than the others.
- **IIA**: transcribed directly from the IIA Associateship Examination Scheme 2014,
  Part I–IV.

Double-check each against your own students' actual syllabus — colleges vary.

## Adding/renaming courses, semesters, or subjects later

Edit the `COURSES` array in `firebase-config.js` and redeploy — no database
migration needed. Materials are tagged with `courseId`, `partId`, and the subject
name string, so:
- Renaming a course/part `label` or `name` is always safe (only `id` matters for matching).
- Don't change an existing `id` once material has been tagged with it, or that
  material becomes unreachable through browsing (though it stays in the database).

## Notes on scale

- Firestore and Auth are free at this scale (500 members, a few hundred
  documents) — you won't hit billing, and there's no Storage/Blaze requirement
  since file uploads aren't used.
