// Data source for SRM University Delhi-NCR, Sonepat Clone
// All sections render dynamically from this data

export const tickerNotices = [
  "Tentative awardees of Hon'ble Chancellor's Medal",
  "Official Notification for 4th Convocation",
  "Advertisement for the Post of Project Fellow in a Haryana State Research funded research project",
  "MST - I Schedule :: Faculty of Law - Students can contact their respective department"
];

export const accreditationCards = [
  {
    badge: "A+",
    title: "NAAC ACCREDITED",
    desc: "Grade 'A+' accredited with outstanding CGPA score by NAAC (Govt of India)",
    theme: "blue"
  },
  {
    badge: "UGC",
    title: "UGC RECOGNIZED",
    desc: "Recognized by University Grants Commission under section 2(f) of 1956 Act",
    theme: "white"
  },
  {
    badge: "AIU",
    title: "AIU MEMBER",
    desc: "Proud Member of Association of Indian Universities & International Alliances",
    theme: "orange"
  },
  {
    badge: "NIRF",
    title: "EXCELLENCE RANKINGS",
    desc: "Top ranked multidisciplinary university in Delhi-NCR region for research",
    theme: "red"
  }
];

export const degreeOptions = [
  "Undergraduate (B.Tech, BBA, B.Com, Law, B.Sc)",
  "Postgraduate (M.Tech, MBA, M.Com, LL.M, M.Sc)",
  "Doctoral Programmes (Ph.D)",
  "Diploma & Professional Certificates"
];

export const interestOptions = [
  "Engineering & Technology",
  "Management Studies & Business",
  "Law & Legal Studies",
  "Finance & Commerce",
  "Hotel Management & Hospitality",
  "Science & Humanities",
  "Agricultural Sciences & Agribusiness",
  "Biotechnology & Life Sciences"
];

export const departments = [
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
  {
    name: "FACULTY OF AGRICULTURE",
    overlayType: "dark",
    desc: "The Faculty of Agriculture focuses on agronomy, organic techniques, smart…",
    fullDesc: "The Faculty of Agriculture focuses on agronomy, organic techniques, smart precision farming, and sustainable agricultural sciences across acres of demo farms.",
    bgGradient: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
    icon: "agriculture"
  }
];

export const spotlightSlides = [
  {
    title: "TWO-DAY INDUSTRIAL VISIT TO NPTI, NANGAL, PUNJAB",
    summary: "Students gained first-hand insights into hydro-electric turbines and grid management systems.",
    tag: "INDUSTRIAL EXPOSURE",
    date: "Sep 2026",
    gradient: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)"
  },
  {
    title: "NATIONAL CONFERENCE ON INNOVATION & SUSTAINABILITY",
    summary: "Eminent scientists and industry titans congregated for groundbreaking research discussions.",
    tag: "RESEARCH CONCLAVE",
    date: "Aug 2026",
    gradient: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)"
  },
  {
    title: "GLOBAL ALUMNI MEET 2026",
    summary: "Distinguished alumni across 40+ countries reconnect and mentor graduating batches.",
    tag: "CAMPUS EVENT",
    date: "Jul 2026",
    gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
  },
  {
    title: "CAMPUS HACKATHON & ROBOTICS EXPO",
    summary: "Over 200 student teams demonstrated AI prototypes and automated robotics solutions.",
    tag: "INNOVATION HUB",
    date: "Jun 2026",
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
    value: 1400,
    unit: "+",
    label: "Paid Internship",
    prefix: "",
    sub: "Across Top Corporates"
  },
  {
    value: 350,
    unit: "+",
    label: "Top Recruiters",
    prefix: "",
    sub: "Fortune 500 & Startups"
  },
  {
    value: 95,
    unit: "%",
    label: "Placement Record",
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
    quote: "The dynamic curriculum and industry-oriented faculty at SRMUH helped me crack multi-national placement offers. The research culture and international guest lectures set our foundation for corporate leadership in fintech analytics.",
    author: "Priya Sharma",
    role: "Alumna, MBA - Business Analytics",
    avatarBg: "#F26437",
    avatarInitials: "PS"
  },
  {
    quote: "The coding clubs, high-tech research labs, and dedicated hackathons transformed my technical journey. Mentorship from senior professors guided me to publish two international patents before graduation.",
    author: "Rohan Verma",
    role: "Alumnus, B.Tech. - Computer Science & Engg",
    avatarBg: "#00796B",
    avatarInitials: "RV"
  },
  {
    quote: "From courtroom moot courts to national legal aid camps, the Faculty of Law gave me the practical competence and advocacy confidence required to excel at top tier corporate law firms and bar councils.",
    author: "Ananya Sengupta",
    role: "Alumna, B.A. LL.B. (Hons)",
    avatarBg: "#6A1B9A",
    avatarInitials: "AS"
  }
];

export const calendarEvents = [
  {
    day: "30",
    month: "SEP",
    title: "Two-Day Industrial Visit to NPTI, Nangal, Punjab",
    category: "Industrial Exposure"
  },
  {
    day: "25",
    month: "SEP",
    title: "World Tourism Day 2026",
    category: "Campus Celebration"
  },
  {
    day: "24",
    month: "SEP",
    title: "ISO/IEC 17025:2017 & NABL Requirements",
    category: "Technical Workshop"
  },
  {
    day: "22",
    month: "SEP",
    title: "International Microorganism Day",
    category: "Science Department"
  },
  {
    day: "21",
    month: "SEP",
    title: "TOEFL Mock Test (21st September, 2026) and Global…",
    category: "Career Guidance"
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
