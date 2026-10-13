# SRM University Delhi-NCR, Sonepat - Homepage Clone

A pixel-faithful, responsive, dummy front-end clone of the official homepage of **SRM University Delhi-NCR, Sonepat (Haryana, India)** built with vanilla HTML, CSS, and modern JavaScript using Vite.

---

## 🚀 How to Run on Localhost

### Prerequisites
- Node.js (v18 or higher) and npm installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
The site will start on port `5173` with `--host` enabled and automatically open in your default browser at:
- **Local:** `http://localhost:5173`
- **Network (Phone on same Wi-Fi):** `http://192.168.1.6:5173` *(replace with your local IP if changed)*

### 3. How to Stop the Server
In the terminal where the dev server is running, press:
```bash
Ctrl + C
```

---

## 📁 Project Structure

```text
├── index.html                  # Semantic single-page HTML with 12 stacked sections
├── package.json                # Vite vanilla JS scripts & dependencies
├── vite.config.js              # Vite server & build configurations
├── .env.example                # Environment variable template for Chat API
├── README.md                   # Documentation & guide
└── src/
    ├── style.css               # Design tokens, typography, responsive layout
    ├── data.js                 # Departments, faculties, stats, notices, events
    ├── main.js                 # App lifecycle, carousels, counters, calendar
    └── chat/
        ├── chat-config.js      # Chat feature flag & API endpoint settings
        ├── chat-service.js     # Async API communication & mock fallback
        └── chat-ui.js          # Robot launcher button, bottom-sheet/card panel
```

---

## 🎨 Design Tokens & Branding

- **Royal Blue (`#003A9B`):** Primary branding, header, faculties & placements.
- **Brand Orange (`#F26437`):** Bihar Credit Card banner, spotlight slant, side tabs.
- **Amber Gold (`#F9A62F`):** Buttons ("Apply Now →", "Explore", "View More"), NAAC A+ highlights.
- **Dark Footer (`#212121`):** Complete multi-column footer with all statutory links.
- **Ticker Bar (`#2B2B2B`):** Fixed bottom marquee bar with pulse indicator.
- **Card Grey (`#F1F1F1`):** 18 Academic department tiles.
- **Typography:**
  - *Open Sans* for body text and navigation.
  - *Roboto* bold uppercase for headings and faculty cards.
  - *Playfair Display* for Hero section main title ("Accepting Applications").

---

## 📜 12 Stacked Sections (Exact Order)

1. **HERO:** Admissions 2026-27 with interactive particle canvas and "Apply Now →".
2. **Accreditation Strip:** Horizontal swipeable cards (NAAC A+, UGC, AIU, NIRF).
3. **SEARCH FOR PROGRAMMES:** Blue-purple gradient card with Degree & Interest filters.
4. **Orange Banner:** Bihar Student Credit Card Scheme.
5. **WHAT WOULD YOU LIKE TO STUDY?:** 18 grey cards with crisp SVG line icons.
6. **ACADEMIC EXCELLENCE:** Stacked faculty cards with orange and dark overlay panels.
7. **SPOTLIGHT:** Touch-swipeable carousel with orange square navigation arrows.
8. **RESEARCH & INNOVATION:** Dark campus backdrop with animated live stat counters (50 LPA, 1400+, 350+, 95%).
9. **PLACEMENTS:** Heading, training description, and 4-column recruiter wordmark grid.
10. **STUDENT TESTIMONIALS:** Carousel with orange quotation marks, alumnus avatar, and active blue pill pagination dots.
11. **EVENTS CALENDAR:** Interactive month navigator (October 2026 default) + white EVENTS card.
12. **FOOTER:** Complete campus address, 4 regional offices, helplines, 25+ statutory links, Samadhaan grievance portal, and Back to Top button.

---

## 💬 Adding the "Talk to us" Feature Later

The "Talk to us" feature is designed as an **isolated, drop-in plug-in**:
- Deleting `/src/chat` and removing `import { initChat } from './chat/chat-ui.js'` leaves the entire website fully functional without any errors.

### To Enable Mock / Real Chat Mode:

1. Open `src/chat/chat-config.js` and set:
   ```javascript
   CHAT_ENABLED: true
   ```
   *(Alternatively, provide `window.SRMUH_CHAT_CONFIG = { CHAT_ENABLED: true }` in your HTML or browser console).*

2. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Set your backend URL:
   ```env
   VITE_CHAT_API_URL=https://api.yourdomain.com/chat
   ```

3. **Backend Contract** (documented in `src/chat/chat-service.js`):
   - **Request payload (POST JSON):**
     ```json
     {
       "query": "What is the fee structure for B.Tech CSE?",
       "session_id": "srmuh-session-xyz"
     }
     ```
   - **Response payload (POST JSON):**
     ```json
     {
       "answer": "The annual tuition fee for B.Tech CSE is...",
       "sources": ["https://srmuniversity.ac.in/fee-structure"]
     }
     ```
   - `chat-service.js` is the **only file** you need to edit when integrating a live AI or webhook backend.

---

## 📌 Assumptions & Dummy Behaviors

- **Data:** All department names, faculties, dates, and numbers match SRM University Delhi-NCR official records and mock data specifications.
- **Links & Submissions:** "Apply Now", "Explore", "View More", and footer links trigger non-blocking toast notifications informing the user that the action is part of the front-end demo.
- **Scroll Behavior:** Vertical scrolling is never locked (`html { scroll-behavior: smooth; }`), and horizontal overflow is strictly disabled.
- **Logos:** The SRM emblem is rendered via custom SVG incorporating the sunburst, wisdom tree, and ribbon. Corporate recruiters are presented as styled typography wordmarks.
