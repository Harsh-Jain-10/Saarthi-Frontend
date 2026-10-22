// Data source for SRM University Delhi-NCR, Sonepat Clone
// All sections render dynamically from this data

export const tickerNotices = [
  "MST - II Schedule :: Faculty of Humanities",
  "MST - II Schedule :: Faculty of Sciences",
  "MST - II Schedule :: Faculty of Management & Commerce",
  "MST - II Schedule :: Faculty of Law",
  "MST - II Schedule :: Faculty of Engineering and Technology",
  "Hon'ble Chancellor's Medal Notification for 4th Convocation",
  "Project Fellow vacancy — Haryana State Research Fund"
];

export const accreditationCards = [
  {
    badge: "01",
    title: "INTELLECTUALLY DIVERSE",
    desc: "A community of learners with different perspectives and ambitions",
    theme: "blue"
  },
  {
    badge: "50+",
    title: "CAREER PROGRAMMES",
    desc: "Explore career-focused programmes across disciplines",
    theme: "white"
  },
  {
    badge: "02",
    title: "INDUSTRY-ALIGNED CURRICULUM",
    desc: "Learn with current ideas, practical work and industry context",
    theme: "orange"
  },
  {
    badge: "03",
    title: "ADVANCED PEDAGOGY",
    desc: "An engaging approach to teaching, learning and discovery",
    theme: "red"
  }
];

export const degreeOptions = [
  "Undergraduate (B.Tech, BBA, B.Com, Law, B.Sc)",
  "Postgraduate (M.Tech, MBA, M.Com, LL.M, M.Sc)",
  "Doctoral Programmes (Ph.D)",
  "UG/PG Integrated Programmes",
  "Ph.D. Programmes"
];

export const interestOptions = [
  "Engineering & Technology",
  "Management Studies & Business",
  "Law & Legal Studies",
  "Finance & Commerce",
  "Hotel Management & Hospitality",
  "Science & Humanities",
  "Agricultural Sciences & Agribusiness",
  "Biotechnology & Life Sciences",
  "Computer Science",
  "Biomedical Engineering",
  "Agriculture"
];

export const departments = [
  {
    name: "Department of Biomedical Engineering",
    code: "BIO-MED",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><path d="M3 12h4l2-6 4 12 2-6h6"/><circle cx="12" cy="12" r="10"/></svg>`
  },
  {
    name: "Department of Computer Science & Engineering (CSE)",
    code: "CSE",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><circle cx="8" cy="10" r="1.5"/><circle cx="16" cy="10" r="1.5"/><line x1="10.5" y1="10" x2="13.5" y2="10"/></svg>`
  },
  {
    name: "Civil Engineering",
    code: "CIVIL",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h6M9 13h6M9 17h6"/></svg>`
  },
  {
    name: "Electrical & Electronics Engineering",
    code: "EEE",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
  },
  {
    name: "Electronics & Communication Engineering",
    code: "ECE",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><path d="M4.93 4.93a10 10 0 0 1 14.14 0M7.76 7.76a6 6 0 0 1 8.48 0M10.59 10.59a2 2 0 0 1 2.82 0M12 17v5M8 22h8"/></svg>`
  },
  {
    name: "Mechanical Engineering",
    code: "MECH",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
  },
  {
    name: "Finance & Commerce",
    code: "COMMERCE",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
  },
  {
    name: "Hotel Management",
    code: "HM",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>`
  },
  {
    name: "Law",
    code: "LAW",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><line x1="12" y1="3" x2="12" y2="21"/><path d="M6 6l-4 6h8zM18 6l-4 6h8zM3 21h18"/></svg>`
  },
  {
    name: "Management Studies",
    code: "MGMT",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`
  },
  {
    name: "Agriculture",
    code: "AGRI",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><path d="M12 22V10M12 10a8 8 0 0 1 8-8c0 4.42-3.58 8-8 8zm0 0a8 8 0 0 0-8-8c0 4.42 3.58 8 8 8zM5 19l4-4M19 19l-4-4"/></svg>`
  },
  {
    name: "Biotechnology",
    code: "BIOTECH",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><path d="M10 2v7.31M14 2v7.31M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0M7 16h10"/></svg>`
  },
  {
    name: "Chemistry",
    code: "CHEM",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><path d="M9 3h6M10 3v5l-6 10.5A2 2 0 0 0 5.73 21h12.54A2 2 0 0 0 20 18.5L14 8V3M7.5 16h9"/></svg>`
  },
  {
    name: "Computer Sciences",
    code: "CS",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`
  },
  {
    name: "Environmental Sciences",
    code: "ENV",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`
  },
  {
    name: "Food Technology",
    code: "FOOD",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>`
  },
  {
    name: "Foreign Languages",
    code: "LANG",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
  },
  {
    name: "Humanities and Social Sciences",
    code: "HSS",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15zM8 7h8M8 11h6"/></svg>`
  },
  {
    name: "Mathematics",
    code: "MATH",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>`
  }
  ,{
    name: "Microbiology",
    code: "MICRO",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><circle cx="12" cy="12" r="7"/><path d="M12 5V2M12 22v-3M5 12H2m20 0h-3M7 7 5 5m14 14-2-2m0-10 2-2M5 19l2-2"/><circle cx="10" cy="10" r="1"/><circle cx="14" cy="13" r="1"/></svg>`
  },
  {
    name: "Physics",
    code: "PHYS",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>`
  },
  {
    name: "Physical Education & Sports",
    code: "SPORTS",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.8" fill="none"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20"/></svg>`
  }
];

export const faculties = [
  {
    name: "FACULTY OF ENGINEERING & TECHNOLOGY",
    overlayType: "orange",
    desc: "The Faculty of Engineering and Technology aims to emerge as a leading world-class…",
    fullDesc: "The Faculty of Engineering and Technology aims to emerge as a leading world-class centre of research, cutting-edge innovation, and exemplary technological engineering education.",
    bgGradient: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    icon: "engineering"
  },
  {
    name: "FACULTY OF FINANCE AND COMMERCE",
    overlayType: "dark",
    desc: "The Faculty of Finance and Commerce examines economic decision-making. Our…",
    fullDesc: "The Faculty of Finance and Commerce examines economic decision-making. Our specialized programmes combine FinTech, investment banking, and global trade dynamics.",
    bgGradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
    icon: "finance"
  },
  {
    name: "FACULTY OF HOTEL MANAGEMENT",
    overlayType: "dark",
    desc: "The Faculty of Hotel Management offers an excellent teaching and hospitality…",
    fullDesc: "The Faculty of Hotel Management offers an excellent teaching and hospitality ecosystem equipped with commercial training kitchens, mock guest suites, and global internships.",
    bgGradient: "linear-gradient(135deg, #373b44 0%, #4286f4 100%)",
    icon: "hospitality"
  },
  {
    name: "FACULTY OF LAW",
    overlayType: "dark",
    desc: "The Faculty of Law provides comprehensive legal education, clinical exposure…",
    fullDesc: "The Faculty of Law provides comprehensive legal education, clinical exposure, moot courts, and corporate law immersion led by distinguished jurists and practitioners.",
    bgGradient: "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
    icon: "law"
  },
  {
    name: "FACULTY OF MANAGEMENT STUDIES",
    overlayType: "dark",
    desc: "The Faculty of Management Studies trains futuristic global business leaders…",
    fullDesc: "The Faculty of Management Studies trains futuristic global business leaders through case studies, analytics, and leadership labs with strong industry linkage.",
    bgGradient: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)",
    icon: "management"
  },
  {
    name: "FACULTY OF SCIENCE AND HUMANITIES",
    overlayType: "dark",
    desc: "The Faculty of Science and Humanities fosters multidisciplinary discovery…",
    fullDesc: "The Faculty of Science and Humanities fosters multidisciplinary discovery, foundational sciences, critical thinking, and innovation for societal impact.",
    bgGradient: "linear-gradient(135deg, #114357 0%, #f29492 100%)",
    icon: "science"
  },
];

export const spotlightSlides = [
  {
    title: "B.COM WITH ACCA ORIENTATION",
    summary: "Students explored professional accounting pathways and global career opportunities.",
    tag: "ACADEMICS",
    date: "Oct 2026",
    gradient: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)"
  },
  {
    title: "TOWARDS TB ELIMINATION 2035",
    summary: "A lecture on the roadmap and strategies to combat MDR and XDR tuberculosis.",
    tag: "PUBLIC HEALTH LECTURE",
    date: "Oct 2026",
    gradient: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)"
  },
  {
    title: "ANTIMICROBIAL RESISTANCE: THE SILENT PANDEMIC",
    summary: "Research perspectives on multidrug-resistant Gram-negative pathogens.",
    tag: "SCIENCE LECTURE",
    date: "Oct 2026",
    gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
  },
  {
    title: "HACKPRIX 2026",
    summary: "Student innovation and problem-solving at the university’s annual hackathon.",
    tag: "STUDENT INNOVATION",
    date: "Sep 2026",
    gradient: "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)"
  }
];

export const stats = [
  {
    value: 50,
    unit: "LPA",
    label: "Highest Package",
    prefix: "₹",
    sub: "International Placement"
  },
  {
    value: 925,
    unit: "+",
    label: "Companies Visited",
    prefix: "",
    sub: "Across Top Corporates"
  },
  {
    value: 2024,
    unit: "+",
    label: "Jobs Placement",
    prefix: "",
    sub: "Fortune 500 & Startups"
  },
  {
    value: 1400,
    unit: "+",
    label: "Paid Internship",
    prefix: "",
    sub: "Consistent Track Record"
  }
];

export const recruiters = [
  "Extramarks",
  "Zelf Studie",
  "LIDO",
  "doodleblue",
  "3Pillar Global",
  "AIS (Asahi India Glass)",
  "VINOVE",
  "indiamart",
  "XenonStack",
  "mthree",
  "LIVSPACE",
  "PUMA",
  "Prescient",
  "Ubiquiti",
  "TFT",
  "Shoperty",
  "ACC Gold",
  "Tecplix"
];

export const testimonials = [
  {
    quote: "I completed my B.Tech in Biomedical Engineering from SRMUH. I would confidently say that SRMUH is one of the best Universities. I got exposed to some excellent opportunities, and they referred me to IIT, for my first research paper. I also received four placement offers during the Campus Placements.",
    author: "Ashish Mishra",
    role: "Alumna, B.Tech. -Biomedical Engineering",
    avatarBg: "#003A9B",
    avatarInitials: "AM"
  },
  {
    quote: "It was my immense luck and fortune to be a part of an institute like SRM University. The entire faculty and department leave no stone unturned to shape one's future. My four years at SRMUH have been a wonderful experience of learning with prolific exposure to the outside world along with making some beautiful bonds for lifetime.",
    author: "R Vinupriya",
    role: "Alumna, B.Tech. Biomedical Engineering",
    avatarBg: "#F26437",
    avatarInitials: "PS"
  },
  {
    quote: "My overall experience has been beneficial because of my professors who approached teaching with a more conscious effort and taught me to approach learning in the same way. SRMUH has helped me academically and in grooming my overall personality.",
    author: "Sujata",
    role: "Student, M.Sc. Microbiology",
    avatarBg: "#00796B",
    avatarInitials: "RV"
  },
  {
    quote: "SRMUH is a dream for every aspirant who wants to touch heights in their career. The dynamic management and continuous support from faculties helped me a lot. It is my privilege to be part of the SRM Family.",
    author: "Dhruv Garg",
    role: "Student, LL.B. (Hons.)",
    avatarBg: "#6A1B9A",
    avatarInitials: "AS"
  }
];

export const calendarEvents = [
  {
    day: "16",
    month: "OCT",
    title: "B.Com with ACCA orientation",
    category: "Academic Event",
    url: "https://www.srmuniversity.ac.in/event/b-com-with-acca-orientation"
  },
  {
    day: "02",
    month: "OCT",
    title: "Lecture: Roadmap and strategies to combat MDR and XDR Tuberculosis",
    category: "Public Health Lecture",
    url: "https://www.srmuniversity.ac.in/event/lecture-on-in-the-path-towards-tb-elimination-2035-roadmap-and-strategies-to-combat-mdr-and-xdr-tuberculosis"
  },
  {
    day: "01",
    month: "OCT",
    title: "Antimicrobial Resistance (AMR): The Silent Pandemic",
    category: "Science Lecture",
    url: "https://www.srmuniversity.ac.in/event/lecture-on-antimicrobial-resistance-amr-the-silent-pandemic-challenges-and-opportunities-to-combat-the-emergence-of-multidrug-resistant-gram-negative-pathogens"
  },
  {
    day: "30",
    month: "SEP",
    title: "Two-Day Industrial Visit to NPTI, Nangal, Punjab",
    category: "Industrial Exposure",
    url: "https://www.srmuniversity.ac.in/event/two-day-industrial-visit-to-npti-nangal-punjab"
  },
  {
    day: "25",
    month: "SEP",
    title: "World Tourism Day 2026",
    category: "Campus Celebration",
    url: "https://www.srmuniversity.ac.in/event/world-tourism-day-2026"
  },
  {
    day: "24",
    month: "SEP",
    title: "ISO/IEC 17025:2017 & NABL Requirements",
    category: "Technical Workshop",
    url: "https://www.srmuniversity.ac.in/event/iso-iec-17025-2017-nabl-requirements"
  },
  {
    day: "26",
    month: "SEP",
    title: "HackPrix 2026",
    category: "Student Innovation",
    url: "https://www.srmuniversity.ac.in/event/hackprix-2026"
  },
  {
    day: "21",
    month: "SEP",
    title: "TOEFL Mock Test (21st September, 2026) and Global…",
    category: "Career Guidance",
    url: "https://www.srmuniversity.ac.in/event/toefl-mock-test-21st-september-2026-and-global-education-fair-22nd-september-2026"
  },
  {
    day: "16",
    month: "SEP",
    title: "Probiotic Awareness Day",
    category: "Health & Nutrition"
  }
];

export const importantLinks = [
  "Internal Quality Assurance Cell (IQAC)",
  "NIRF",
  "NEP SAARTHI",
  "Institutional Best Practices",
  "Institutional Distinctiveness",
  "National Cadet Corps (NCC)",
  "National Service Scheme (NSS)",
  "National Academic Depository (NAD)",
  "Academic Bank of Credits (ABC)",
  "Contact Us",
  "Chart",
  "Open Access E-Resources",
  "Academic Calendar",
  "Downloads",
  "SPARKS Initiators",
  "SDG 17 Partnership for Goals",
  "Placement Policy for Students",
  "Regulatory Approvals & Recognitions",
  "SRMU Statutory Bodies",
  "Statutory Committees",
  "Anti-Ragging Policy",
  "Code of conduct",
  "Board of Studies (BoS)",
  "Mandatory Disclosure",
  "Faculty of Law Publications",
  "Student Welfare Department"
];

export const portalLinks = [
  "Student Portal",
  "Parent Portal",
  "Alumni Portal",
  "University ERP"
];
