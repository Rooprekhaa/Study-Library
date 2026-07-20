// ============================================================
// FIREBASE CONFIG
// Replace with the config from YOUR new Firebase project:
// Firebase Console → Project Settings → General → Your apps → SDK setup
// ============================================================
export const firebaseConfig = {
  apiKey: "AIzaSyC12N1m7MXgTC18WzQjpBoueYIkQDvTmss",
  authDomain: "architecture-study-library.firebaseapp.com",
  projectId: "architecture-study-library",
  storageBucket: "architecture-study-library.firebasestorage.app",
  messagingSenderId: "354975922303",
  appId: "1:354975922303:web:33b97d0cfd4b0ec967a74a"
};

// Add the email address(es) that should have admin access.
// These must match the Google account(s) used to sign in on admin.html.
export const ADMIN_EMAILS = [
  "your-email@gmail.com"
];

// Shown in the site footer. Update this string whenever you edit the
// curriculum, add a course, or make any other change worth noting.
export const LAST_UPDATED = "16 July 2026";

// Material types shown as "Quick Access" and in the contribute form.
export const MATERIAL_TYPES = ["Notes", "Books", "Question Papers", "Videos", "Syllabus", "Software", "Other"];

// Shown in the "Important Links" panel on the homepage. Edit freely.
export const IMPORTANT_LINKS = [
  { label: "IIA Official Website", url: "https://www.indianinstituteofarchitects.com/" },
  { label: "Council of Architecture (COA)", url: "https://www.coa.gov.in/" },
  { label: "National Digital Library of India (NDLI)", url: "https://ndl.iitkgp.ac.in/" },
  { label: "e-ShodhSindhu", url: "https://ess.inflibnet.ac.in/" },
  { label: "NAAC", url: "https://www.naac.gov.in/" },
  { label: "ResearchGate", url: "https://www.researchgate.net/" }
];

// A curated set of subjects shown in the "Popular Subjects" panel — each just
// runs a search for that term, so it doesn't need to map to one exact course/part.
export const POPULAR_SUBJECTS = [
  "Building Construction", "Theory of Structures", "History of Architecture",
  "Environmental Studies", "Computer Applications", "Landscape Architecture",
  "Architectural Design", "Working Drawings", "Climatic Design", "Professional Practice"
];

// ============================================================
// CURRICULUM
// Four courses, each with parts/semesters, each with subjects.
//
// Sourcing notes (so you know what to double-check with your own college):
// - Diploma: sourced from VES College of Architecture, Mumbai (COA-approved,
//   MSBTE-affiliated 3-year/6-semester Diploma in Architecture) — this is a
//   real, published curriculum, not a placeholder.
// - B.Arch: sourced from the School of Planning & Architecture, New Delhi's
//   published B.Arch syllabus (COA-aligned, 10 semesters) — condensed to the
//   main subjects per semester; some minor/zero-credit courses were omitted
//   for brevity. Every college's exact subject list varies slightly.
// - M.Arch: COA regulates M.Arch as a 2-year/4-semester program, but exact
//   subjects vary a lot by specialization and institute — this list follows
//   the common general structure, not one specific college's syllabus.
// - IIA: transcribed directly from the Indian Institute of Architects
//   Associateship Examination Scheme 2014 (photographed pages), Part I–IV.
//
// Edit freely — add/rename/remove subjects, semesters, or whole courses.
// `id` values are stored on every material, so avoid changing an `id`
// once material has been tagged with it (renaming `label`/`name` is fine).
// ============================================================
export const COURSES = [
  {
    id: "diploma",
    name: "Diploma",
    fullName: "Diploma in Architecture (3-Year, MSBTE/COA)",
    tagline: "Study material for all six semesters of the Diploma course.",
    accent: "blue",
    parts: [
      { id: "s1", label: "Semester I", subjects: [
        "Basic Mathematics", "Basic Science (Physics & Chemistry)", "Communication Skills",
        "Engineering Graphics", "Fundamentals of ICT", "Yoga and Meditation", "Civil Engineering Workshop"
      ]},
      { id: "s2", label: "Semester II", subjects: [
        "Applied Mathematics", "Construction Materials", "History of Architecture & Culture",
        "Applied Physics", "Basic Design", "Professional Communication", "Social and Life Skills"
      ]},
      { id: "s3", label: "Semester III", subjects: [
        "Architecture Design I", "Building Services", "Theory of Structures",
        "Basic Surveying & Levelling", "Building Construction Technology I", "Computer Aided Drawings I"
      ]},
      { id: "s4", label: "Semester IV", subjects: [
        "Architecture Design II", "Working Drawing", "Estimation & Costing",
        "Building Construction II", "Computer Aided Drawings II", "Electives", "Environmental Education & Sustainability"
      ]},
      { id: "s5", label: "Semester V", subjects: [
        "Architecture Design III", "Advance Building Services", "Professional Practice",
        "Design of R.C.C. Structures", "Computer Aided Drawings III"
      ]},
      { id: "s6", label: "Semester VI", subjects: [
        "Internship", "Dissertation Project / Thesis"
      ]}
    ]
  },
  {
    id: "barch",
    name: "B.Arch",
    fullName: "Bachelor of Architecture (5-Year, 10 Semesters)",
    tagline: "Subject-wise notes, books, papers and more for all semesters.",
    accent: "green",
    parts: [
      { id: "s1", label: "Semester 1", subjects: [
        "Architectural Design 1", "Visual Arts & Basic Design 1", "Computer Applications 1",
        "Building Construction 1", "Theory of Structures 1", "Environmental Studies",
        "Model Making & Workshop Practice", "Human Settlements & Vernacular Architecture"
      ]},
      { id: "s2", label: "Semester 2", subjects: [
        "Architectural Design 2", "Visual Arts & Basic Design 2", "Computer Applications 2",
        "Building Construction 2", "Theory of Structures 2", "Climate-Responsive Design",
        "Surveying & Levelling", "History of Architecture 1", "Sociology & Culture"
      ]},
      { id: "s3", label: "Semester 3", subjects: [
        "Architectural Design 3", "Visual Arts & Basic Design 3", "Computer Applications 3",
        "Building Construction 3", "Theory of Structures 3", "Water, Waste & Sanitation",
        "Site Planning & Landscape Studies", "History of Architecture 2", "Art & Architectural Appreciation 1"
      ]},
      { id: "s4", label: "Semester 4", subjects: [
        "Architectural Design 4", "Visual Arts & Basic Design 4", "Computer Applications 4",
        "Building Construction 4", "Theory of Structures 4", "Electrification, Lighting & Acoustics",
        "Low-Energy Passive Design", "History of Architecture 3", "Art & Architectural Appreciation 2"
      ]},
      { id: "s5", label: "Semester 5", subjects: [
        "Architectural Design 5", "Building Construction 5", "Theory of Structures 5",
        "HVAC, Mechanised Mobility & Fire Safety", "Energy-Positive Active Design",
        "Estimating & Costing", "History of Architecture 4", "Design Methodology"
      ]},
      { id: "s6", label: "Semester 6", subjects: [
        "Architectural Design 6", "Building Construction 6", "Theory of Structures & Design",
        "Sustainable Services & Green Buildings", "Sustainable Urban Habitats",
        "Specifications & Contracts", "Contemporary Architecture", "Architectural Theories"
      ]},
      { id: "s7", label: "Semester 7", subjects: [
        "Architectural Design 7 (Choice-Based Studio)", "Working Drawings", "Project Management",
        "Architectural Research Seminar", "Electives"
      ]},
      { id: "s8", label: "Semester 8", subjects: [
        "Practical Training (Internship)"
      ]},
      { id: "s9", label: "Semester 9", subjects: [
        "Architectural Design 9 (Urban Interventions)", "Professional Practice I",
        "Urban Design Studies", "Dissertation / Art Thesis", "Electives"
      ]},
      { id: "s10", label: "Semester 10", subjects: [
        "Architectural Design Thesis", "Thesis Design Research", "Professional Practice II"
      ]}
    ]
  },
  {
    id: "march",
    name: "M.Arch",
    fullName: "Master of Architecture (2-Year, 4 Semesters)",
    tagline: "Advanced resources for all specializations and semesters.",
    accent: "purple",
    parts: [
      { id: "s1", label: "Semester 1", subjects: [
        "Advanced Design Studio I", "Research Methodology", "Theory of Architecture",
        "Advanced Building Technology", "Specialization Elective I"
      ]},
      { id: "s2", label: "Semester 2", subjects: [
        "Advanced Design Studio II", "Specialization Core Subject", "Advanced Building Technology II",
        "Specialization Elective II", "Seminar"
      ]},
      { id: "s3", label: "Semester 3", subjects: [
        "Dissertation — Proposal & Literature Review", "Specialization Studio", "Specialization Elective III"
      ]},
      { id: "s4", label: "Semester 4", subjects: [
        "Thesis — Final Design & Research", "Viva Voce"
      ]}
    ]
  },
  {
    id: "iia",
    name: "IIA",
    fullName: "Indian Institute of Architects — Associateship Examination (2014 Scheme)",
    tagline: "Resources for IIA's Associateship (AIIA) examination, part-wise.",
    accent: "amber",
    parts: [
      { id: "p1", label: "Part I", subjects: [
        "101 - Architectural Design", "102 - Building Construction & Materials I",
        "103 - History of Architecture I", "104 - Architectural Drawing",
        "105 - Basic Design & Appreciation of Art & Architecture",
        "106 - Structural Mechanics", "107 - Communication Skills"
      ]},
      { id: "p2", label: "Part II", subjects: [
        "201 - Architectural Design II", "202 - Building Construction & Materials II",
        "203 - Building Services", "204 - Sustainable Architecture & Environment",
        "205 - Theory & Design of Structure", "206 - Estimation, Costing & Specification",
        "207 - Architectural Appraisal (Viva-Voce)", "208 - Design Portfolio (Viva-Voce)",
        "209 - Computer Aided Design (Viva-Voce)"
      ]},
      { id: "p3", label: "Part III", subjects: [
        "301 - Architectural Design III", "302 - Arch. Construction & Working Drawing",
        "303 - Town Planning", "304 - Advanced Building Services", "305 - Interior Design",
        "306 - Advanced Structural Design", "307 - Professional Practice & Management",
        "308 - Landscape Architecture", "309 - Acoustics", "310 - Design Portfolio (Viva-Voce)"
      ]},
      { id: "p4", label: "Part IV", subjects: [
        "401 - Architectural Design IV", "402 - Advanced Building Construction",
        "403.1 - Urban Design (Elective)", "403.2 - Traffic and Transportation (Elective)",
        "403.3 - Architectural Illumination (Elective)", "403.4 - Building Economics (Elective)",
        "403.5 - Architecture Conservation (Elective)", "403.6 - Construction Management (Elective)",
        "403.7 - Architectural Legislation (Elective)", "403.8 - Housing (Elective)",
        "404 - Professional Experience (Viva Voce)", "405 - Arch. Design Thesis, Portfolio & Viva-Voce"
      ]}
    ]
  }
];
