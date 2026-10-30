# SRM University Delhi-NCR Demo

A responsive, locally navigable reconstruction of the SRM University Delhi-NCR, Sonepat public website. Built with semantic HTML, CSS and vanilla JavaScript using Vite. This is a student demonstration project; it is not operated by the university.

## Run locally

Requires Node.js 18 or later.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). To create a production bundle, run `npm run build`.

## What is included

- Responsive home page, navigation drawer and utility menus.
- Local pages for university information, administration, academics, admissions, international applicants, research, student services, notices and contact information.
- Searchable UG, PG, integrated and doctoral course catalogues, programme details and a 2027–28 annual tuition table.
- Working faculty and department navigation, calendar controls, event links, accessibility preferences, portal shortcuts and footer navigation.
- Saarthi text and voice chat interface, configurable to connect to the project’s separately hosted backend.

Course availability, tuition and notices can change. Verify programme requirements and fees with the official university or admissions portal before relying on them. Official portal links open the university’s own site.

## Saarthi backend configuration

The browser app expects a backend at `http://localhost:8000/api/chat` for text answers and `ws://localhost:8000/api/voice` for voice streaming unless overridden. The backend must be running separately. Configure alternate endpoints using a local `.env` file:

```env
VITE_CHAT_API_URL=http://localhost:8000/api/chat
VITE_VOICE_WS_URL=ws://localhost:8000/api/voice
```

Do not commit `.env` or credentials. `.env.example` contains only the variable names and sample values. If the text backend is unreachable, Saarthi displays a connection fallback; microphone input also requires browser permission and a working voice WebSocket service.

The text request body is `{ "query": "...", "session_id": "..." }`. The backend responds with `{ "answer": "...", "sources": ["https://..."] }`. See `src/chat/chat-service.js` and `src/chat/voice-service.js` for the current integration contract.

## Project structure

```text
index.html             Home page and shared site shell
src/main.js            Navigation, page lifecycle and interactive sections
src/pages.js           Local information pages and course detail rendering
src/programmes.js      Programme, duration and annual tuition catalogue
src/data.js            Departments, faculties, notices, events and footer data
src/style.css          Site styling and responsive layouts
src/chat/              Saarthi chat UI, API client and voice WebSocket client
```
