# Study Library — Syllabus Folders

152 subject folders across all four courses (IIA, Diploma, B.Arch, M.Arch),
mirroring the exact same Course → Part/Semester → Subject structure used on
the website. Each subject has its own folder containing an `index.html`.

## Open it
Open `Study-Library-Syllabus/index.html` in a browser — it links down through
every course → part → subject.

## Status
- **1 subject has real content**: IIA → Part I → `101 - Architectural Design`,
  transcribed from the syllabus page you photographed. It shows a green
  "✓ Content added" badge.
- **151 subjects are blank templates** (Code / Duration / Max Marks / Pass
  Marks / Intent / Contents / Notes / Reference Books, all empty placeholders)
  — they show a grey "○ Template — not filled in yet" badge.

## How to fill one in
Open the subject's `index.html` in a text editor and replace the placeholder
text. Each field is plain, obvious HTML — no build step, no scripts. For
example, in the `<div class="meta-grid">` block:

```html
<div><div class="m-label">Code</div><div class="m-value empty">Not added yet</div></div>
```

becomes:

```html
<div><div class="m-label">Code</div><div class="m-value">201</div></div>
```

(just remove the word `empty` from the class, and put the real value in).
Same pattern for Intent, Contents, Notes, and Reference Books — replace the
`<div class="placeholder">...</div>` with your real content.

## Folder structure
```
Study-Library-Syllabus/
  style.css                          ← shared stylesheet, don't move this
  index.html                         ← top-level index of all courses
  IIA/
    Part I/
      index.html                     ← index of this part's subjects
      101 - Architectural Design/
        index.html                   ← the actual subject page
      102 - Building Construction & Materials I/
        index.html
      ...
    Part II/  Part III/  Part IV/
  Diploma/
    Semester I/ ... Semester VI/
  B.Arch/
    Semester 1/ ... Semester 10/
  M.Arch/
    Semester 1/ ... Semester 4/
```

## If you photograph more syllabus pages
Send them my way and I'll transcribe them into their matching subject folder
the same way I did for 101 — just tell me which course/part/subject each page
belongs to if it isn't obvious from the page itself.

## Note on scope
This folder set is separate from the live website (`app.js`/`firebase-config.js`
etc.) — it's a local reference/working set for building out real syllabus content
subject by subject. Nothing here is wired to Firestore. If you eventually want
this content live on the site, the easiest path is pasting each subject's real
content into the "Contribute material" form as a "Syllabus" type resource.
