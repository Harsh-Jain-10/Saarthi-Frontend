import {
  tickerNotices,
  accreditationCards,
  degreeOptions,
  interestOptions,
  departments,
  faculties,
  spotlightSlides,
  stats,
  recruiters,
  testimonials,
  calendarEvents,
  importantLinks
} from './data.js';

// Chat Module Initialization (isolated feature)
import { initChat } from './chat/chat-ui.js';
import { renderInteriorPage } from './pages.js';
import { programmeCatalogue } from './programmes.js';

const facultyRoutes = {
  engineering: 'faculty-engineering', commerce: 'faculty-commerce', hotel: 'faculty-hotel',
  law: 'faculty-law', management: 'faculty-management', science: 'faculty-science'
};
function facultyRouteFromText(value = '') {
  const name = value.toLowerCase();
  if (name.includes('engineering')) return facultyRoutes.engineering;
  if (name.includes('commerce') || name.includes('finance')) return facultyRoutes.commerce;
  if (name.includes('hotel')) return facultyRoutes.hotel;
  if (name.includes('law')) return facultyRoutes.law;
  if (name.includes('management')) return facultyRoutes.management;
  return facultyRoutes.science;
}

function navigateInteriorPage(route) {
  const nextHash = `#page/${route}`;
  if (window.location.hash === nextHash) {
    renderActiveInteriorPage();
  } else {
    window.location.hash = nextHash;
  }
}

function renderActiveInteriorPage() {
  const host = document.getElementById('interior-page-root');
  const homepage = document.getElementById('main-content');
  const routeMatch = window.location.hash.match(/^#page\/([a-z0-9-]+)/i);
  const route = routeMatch?.[1];

  homepage.hidden = Boolean(route);
  host.hidden = !route;
  if (route) {
    host.innerHTML = renderInteriorPage(route);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

function initInteriorPages() {
  window.addEventListener('hashchange', renderActiveInteriorPage);
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented) return;
    const routeLink = event.target.closest('[data-route]');
    if (routeLink) {
      event.preventDefault();
      navigateInteriorPage(routeLink.dataset.route);
      return;
    }

    if (event.target.closest('[data-home]')) {
      event.preventDefault();
      window.location.hash = '#hero';
    }
  });
  const filterCatalogue = (container) => {
    if (!container) return;
    const query = (container.querySelector('[data-catalogue-search]')?.value || '').trim().toLowerCase();
    const faculty = container.querySelector('[data-catalogue-faculty]')?.value || '';
    let visible = 0;
    container.querySelectorAll('[data-course-row]').forEach(row => {
      const matches = row.dataset.search.includes(query) && (!faculty || row.querySelector('td:nth-child(2)')?.textContent === faculty);
      row.hidden = !matches;
      visible += Number(matches);
    });
    const empty = container.querySelector('[data-empty-state]');
    if (empty) empty.hidden = visible !== 0;
    const count = container.querySelector('[data-catalogue-count]');
    if (count) count.textContent = `${visible} programme${visible === 1 ? '' : 's'}`;
  };
  document.addEventListener('input', event => {
    if (event.target.matches('[data-catalogue-search]')) filterCatalogue(event.target.closest('.interior-section'));
  });
  document.addEventListener('change', event => {
    if (event.target.matches('[data-catalogue-faculty]')) filterCatalogue(event.target.closest('.interior-section'));
  });
  renderActiveInteriorPage();
}

/* ==========================================================================
   TOAST HELPER
   ========================================================================== */
function showToast(message = "Demo site: this page is not available") {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'srmuh-toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/* ==========================================================================
   1. FIXED HEADER & MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initNavigation() {
  const toggleBtn = document.getElementById('menu-toggle-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('nav-drawer-backdrop');
  const closeBtn = document.getElementById('drawer-close-btn');
  const navLinks = document.querySelectorAll('.drawer-nav-link');
  const drawerApplyBtn = document.getElementById('drawer-apply-action');

  function openDrawer() {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-active');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-active');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', () => {
    if (drawer.classList.contains('is-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
      if (link.dataset.page) {
        navigateInteriorPage(link.dataset.page);
        return;
      }
      const targetId = link.getAttribute('data-target');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  if (drawerApplyBtn) {
    drawerApplyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
      navigateInteriorPage('admissions');
    });
  }

  // Back to top button
  const backToTopBtn = document.getElementById('back-to-top-btn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Portal dropdown in top utility bar
  const portalBtn = document.getElementById('portal-quick-dropdown');
  if (portalBtn) {
    portalBtn.setAttribute('aria-expanded', 'false');
    document.addEventListener('click', event => {
      const activeMenu = document.getElementById('quick-access-menu');
      if (!activeMenu || activeMenu.contains(event.target) || portalBtn.contains(event.target)) return;
      activeMenu.remove();
      portalBtn.setAttribute('aria-expanded', 'false');
    });
    portalBtn.addEventListener('click', () => {
      let menu = document.getElementById('quick-access-menu');
      if (menu) {
        menu.remove();
        portalBtn.setAttribute('aria-expanded', 'false');
        return;
      }
      menu = document.createElement('nav');
      menu.id = 'quick-access-menu';
      menu.className = 'quick-access-menu';
      menu.setAttribute('aria-label', 'Quick access links');
      menu.innerHTML = `<strong>Quick access</strong><a href="https://www.srmuniversity.ac.in/center-of-excellence" target="_blank" rel="noopener noreferrer">Centres of Excellence ↗</a><a href="https://www.srmuniversity.ac.in/examination" target="_blank" rel="noopener noreferrer">Examination ↗</a><a href="https://www.srmuniversity.ac.in/feekart" target="_blank" rel="noopener noreferrer">Fee payment ↗</a><a href="https://www.srmuniversity.ac.in/downloads" target="_blank" rel="noopener noreferrer">Downloads ↗</a><a href="https://www.srmuniversity.ac.in/faq" target="_blank" rel="noopener noreferrer">FAQs ↗</a><a href="https://www.srmuniversity.ac.in/careers" target="_blank" rel="noopener noreferrer">Careers ↗</a><a href="https://erpsrm.com/srmhonline/studentportal/loginManager/youLogin.jsp" target="_blank" rel="noopener noreferrer">Student portal ↗</a><a href="https://erpsrm.com/srmparentportal/parents/loginManager/youLogin.jsp" target="_blank" rel="noopener noreferrer">Parent portal ↗</a><a href="https://erpsrm.com/srmhonline/srmhalumni/loginManager/youLogin.jsp" target="_blank" rel="noopener noreferrer">Alumni portal ↗</a><a href="https://erpsrm.com/evarsitysrmh/usermanager/loginManager/youLogin.jsp" target="_blank" rel="noopener noreferrer">e-Varsity ERP ↗</a>`;
      document.body.appendChild(menu);
      portalBtn.setAttribute('aria-expanded', 'true');
    });
  }

  // Accessibility tab
  const accessTab = document.getElementById('accessibility-tab');
  if (accessTab) {
    accessTab.setAttribute('aria-expanded', 'false');
    accessTab.addEventListener('click', () => {
      let panel = document.getElementById('accessibility-panel');
      if (panel) {
        panel.remove();
        accessTab.setAttribute('aria-expanded', 'false');
        return;
      }
      panel = document.createElement('div');
      panel.id = 'accessibility-panel';
      panel.className = 'accessibility-panel';
      panel.innerHTML = '<strong>Accessibility options</strong><button type="button" data-a11y="large">Larger text</button><button type="button" data-a11y="contrast">High contrast</button><button type="button" data-a11y="reset">Reset</button>';
      document.body.appendChild(panel);
      accessTab.setAttribute('aria-expanded', 'true');
      panel.addEventListener('click', event => {
        const action = event.target.dataset.a11y;
        if (action === 'large') document.body.classList.toggle('a11y-large-text');
        if (action === 'contrast') document.body.classList.toggle('a11y-high-contrast');
        if (action === 'reset') document.body.classList.remove('a11y-large-text', 'a11y-high-contrast');
        if (action) localStorage.setItem('srmuh-a11y', JSON.stringify({large:document.body.classList.contains('a11y-large-text'),contrast:document.body.classList.contains('a11y-high-contrast')}));
      });
    });
  }

  // Convocation tab
  const convocationTab = document.getElementById('convocation-tab');
  if (convocationTab) {
    convocationTab.addEventListener('click', (e) => {
      e.preventDefault();
      navigateInteriorPage('notices');
    });
  }

  const searchToggle = document.getElementById('utility-search-toggle');
  searchToggle?.addEventListener('click', () => {
    if (window.location.hash.startsWith('#page/')) window.location.hash = '#search-programmes';
    document.getElementById('search-programmes')?.scrollIntoView({behavior:'smooth'});
    window.setTimeout(() => document.getElementById('programme-keyword')?.focus(), 280);
  });

  try {
    const prefs = JSON.parse(localStorage.getItem('srmuh-a11y') || '{}');
    document.body.classList.toggle('a11y-large-text', Boolean(prefs.large));
    document.body.classList.toggle('a11y-high-contrast', Boolean(prefs.contrast));
  } catch { /* ignore invalid optional display preferences */ }
}

/* ==========================================================================
   2. HERO PARTICLES ANIMATION
   ========================================================================== */
function initHeroParticles() {
  const canvas = document.getElementById('hero-particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animationId;
  let width, height;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 30), 45);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1.2
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   3. ACCREDITATION CARDS RENDER
   ========================================================================== */
function renderAccreditations() {
  const container = document.getElementById('accreditation-cards-wrapper');
  if (!container) return;

  container.innerHTML = accreditationCards.map(card => `
    <div class="accreditation-card theme-${card.theme}" tabindex="0">
      <div class="accred-badge-box">${card.badge}</div>
      <div class="accred-info">
        <span class="accred-title">${card.title}</span>
        <span class="accred-desc">${card.desc}</span>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   4. SEARCH FOR PROGRAMMES
   ========================================================================== */
function initSearchProgrammes() {
  const degreeSelect = document.getElementById('degree-select');
  const interestSelect = document.getElementById('interest-select');
  const searchForm = document.getElementById('programmes-search-form');
  const keyword = document.getElementById('programme-keyword');
  const results = document.getElementById('programme-search-results');

  degreeOptions.forEach(opt => {
    const el = document.createElement('option');
    el.value = opt;
    el.textContent = opt;
    degreeSelect.appendChild(el);
  });

  interestOptions.forEach(opt => {
    const el = document.createElement('option');
    el.value = opt;
    el.textContent = opt;
    interestSelect.appendChild(el);
  });

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const courseQuery = keyword.value.trim().toLowerCase();
    const degree = degreeSelect.value;
    const interest = interestSelect.value;
    const selectedFaculty = interest.includes('Engineering') ? 'Engineering & Technology' : interest.includes('Management') ? 'Management Studies' : interest.includes('Law') ? 'Law' : interest.includes('Commerce') ? 'Finance & Commerce' : interest.includes('Hotel') ? 'Hotel Management' : interest.includes('Agricultur') ? 'Science & Humanities' : interest === 'Science & Humanities' || interest.includes('Biotechnology') ? 'Science & Humanities' : '';
    const interestTerm = interest.includes('Computer Science') ? 'computer science' : interest.includes('Biomedical') ? 'biomedical' : interest.includes('Agricultur') ? 'agriculture' : '';
    const isUG = degree.startsWith('Undergraduate');
    const isPG = degree.startsWith('Postgraduate');
    const isPhD = degree.toLowerCase().includes('ph.d') || degree.toLowerCase().includes('doctoral');
    const isIntegrated = degree.toLowerCase().includes('integrated');
    const matches = programmeCatalogue.filter(course => (!courseQuery || course.name.toLowerCase().includes(courseQuery) || course.faculty.toLowerCase().includes(courseQuery)) && (!interestTerm || course.name.toLowerCase().includes(interestTerm)) && (!selectedFaculty || course.faculty === selectedFaculty) && (!isUG || course.level === 'UG') && (!isPG || course.level === 'PG') && (!isPhD || course.level === 'PhD') && (!isIntegrated || course.level === 'Integrated'));
    results.hidden = false;
    results.innerHTML = `<div class="programme-search-results-heading"><strong>${matches.length} matching programme${matches.length===1?'':'s'}</strong><a href="#page/programmes" data-route="programmes">Browse full catalogue →</a></div>${matches.length ? `<div class="programme-search-result-grid">${matches.slice(0,12).map(course=>`<a href="#page/course-${course.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}" data-route="course-${course.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}"><strong>${course.name}</strong><span>${course.faculty} · ${course.duration} · ₹${course.fee.toLocaleString('en-IN')}/year</span></a>`).join('')}</div>`:'<p>No courses match those filters. Try a broader search or select All Interests.</p>'}`;
    results.scrollIntoView({behavior:'smooth',block:'nearest'});
  });

  const biharLink = document.getElementById('bihar-scheme-link');
  if (biharLink) {
    biharLink.addEventListener('click', (e) => {
      e.preventDefault();
      navigateInteriorPage('bihar-credit-card');
    });
  }
}

/* ==========================================================================
   5. WHAT WOULD YOU LIKE TO STUDY (18 DEPARTMENTS)
   ========================================================================== */
function renderDepartments() {
  const container = document.getElementById('departments-grid-container');
  if (!container) return;

  container.innerHTML = departments.map(dept => `
    <div class="dept-card" data-code="${dept.code}" role="button" tabindex="0" aria-label="${dept.name}">
      <div class="dept-icon-box" aria-hidden="true">${dept.icon}</div>
      <div class="dept-name">${dept.name}</div>
    </div>
  `).join('');

  container.querySelectorAll('.dept-card').forEach(card => {
    const openDepartment = () => {
      const name = card.querySelector('.dept-name').textContent;
      sessionStorage.setItem('srmuhCatalogueQuery', name.replace(/^Department of /, '').replace(/\s*\(.+\)$/, ''));
      navigateInteriorPage(facultyRouteFromText(name));
    };
    card.addEventListener('click', openDepartment);
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openDepartment(); } });
  });
}

/* ==========================================================================
   6. ACADEMIC EXCELLENCE (FACULTIES STACK)
   ========================================================================== */
function renderFaculties() {
  const container = document.getElementById('faculties-stack-container');
  if (!container) return;

  container.innerHTML = faculties.map(fac => `
    <div class="faculty-card overlay-${fac.overlayType}">
      <div class="faculty-media" style="background: ${fac.bgGradient}">
        <div class="faculty-badge-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
      </div>
      <div class="faculty-overlay-panel">
        <div>
          <h3 class="faculty-title">${fac.name}</h3>
          <p class="faculty-description">${fac.desc}</p>
        </div>
        <div class="faculty-action">
          <button type="button" class="btn-amber-pill faculty-explore-btn" data-fac="${fac.name}">Explore</button>
        </div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.faculty-explore-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateInteriorPage(facultyRouteFromText(btn.getAttribute('data-fac')));
    });
  });
}

/* ==========================================================================
   7. SPOTLIGHT CAROUSEL
   ========================================================================== */
function initSpotlightCarousel() {
  const slider = document.getElementById('spotlight-slider');
  const prevBtn = document.getElementById('spotlight-prev');
  const nextBtn = document.getElementById('spotlight-next');
  if (!slider) return;

  slider.innerHTML = spotlightSlides.map(slide => `
    <a href="#page/news" data-route="news" class="spotlight-slide-card">
      <div class="spotlight-media" style="background: ${slide.gradient}">
        <span class="spotlight-tag">${slide.tag}</span>
        <span class="spotlight-date">${slide.date}</span>
      </div>
      <div class="spotlight-slanted-panel">
        <h3 class="spotlight-title">${slide.title}</h3>
        <p class="spotlight-summary">${slide.summary}</p>
      </div>
    </a>
  `).join('');

  prevBtn.addEventListener('click', () => {
    slider.scrollBy({ left: -320, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    slider.scrollBy({ left: 320, behavior: 'smooth' });
  });
}

/* ==========================================================================
   8. RESEARCH & INNOVATION ANIMATED COUNTERS
   ========================================================================== */
function initAnimatedCounters() {
  const container = document.getElementById('stats-counters-container');
  if (!container) return;

  container.innerHTML = stats.map(stat => `
    <div class="counter-card">
      <div class="counter-value-box">
        <span class="counter-prefix">${stat.prefix}</span><span class="counter-number" data-target="${stat.value}">0</span><span class="counter-unit">${stat.unit}</span>
      </div>
      <div class="counter-label">${stat.label}</div>
      <div class="counter-sub">${stat.sub}</div>
    </div>
  `).join('');

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(container);

  function animateCounters() {
    const numbers = container.querySelectorAll('.counter-number');
    numbers.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 1600;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quadratic
        const ease = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(ease * target);
        el.textContent = current.toLocaleString('en-IN');

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target.toLocaleString('en-IN');
        }
      }
      requestAnimationFrame(updateCounter);
    });
  }
}

/* ==========================================================================
   9. PLACEMENTS & RECRUITERS GRID
   ========================================================================== */
function renderPlacements() {
  const container = document.getElementById('recruiters-grid-container');
  const viewMoreBtn = document.getElementById('placements-view-more');
  if (!container) return;

  container.innerHTML = recruiters.map(name => `
    <div class="recruiter-card" tabindex="0">
      <span>${name}</span>
    </div>
  `).join('');

  if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateInteriorPage('placements');
    });
  }
}

/* ==========================================================================
   10. STUDENT TESTIMONIALS CAROUSEL
   ========================================================================== */
function initTestimonialsCarousel() {
  const track = document.getElementById('testimonials-track');
  const pagination = document.getElementById('testimonial-pagination');
  const viewMoreBtn = document.getElementById('testimonials-view-more');
  if (!track || !pagination) return;

  let currentIndex = 0;

  function renderSlide(index) {
    const item = testimonials[index];
    track.innerHTML = `
      <div class="testimonial-card">
        <div class="testimonial-quote-block">
          <div class="quote-mark" aria-hidden="true">“</div>
          <p class="quote-text">${item.quote}</p>
        </div>
        <div class="testimonial-author-block">
          <div class="author-avatar" style="background-color: ${item.avatarBg}">
            ${item.avatarInitials}
          </div>
          <div class="author-info">
            <span class="author-name">${item.author}</span>
            <span class="author-role">${item.role}</span>
          </div>
        </div>
      </div>
    `;

    // Update dots
    pagination.querySelectorAll('.dot-pill').forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('is-active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('is-active');
        dot.setAttribute('aria-selected', 'false');
      }
    });
  }

  // Create pagination dots
  pagination.innerHTML = testimonials.map((_, idx) => `
    <button type="button" class="dot-pill ${idx === 0 ? 'is-active' : ''}" data-index="${idx}" aria-label="Slide ${idx + 1}" role="tab"></button>
  `).join('');

  pagination.querySelectorAll('.dot-pill').forEach(dot => {
    dot.addEventListener('click', () => {
      currentIndex = parseInt(dot.getAttribute('data-index'), 10);
      renderSlide(currentIndex);
    });
  });

  renderSlide(0);

  // Auto rotate testimonials every 6 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    renderSlide(currentIndex);
  }, 6000);

  if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', () => {
      navigateInteriorPage('alumni');
    });
  }
}

/* ==========================================================================
   11. EVENTS CALENDAR (DYNAMIC MONTH NAVIGATION)
   ========================================================================== */
function initEventsCalendar() {
  const monthTitle = document.getElementById('calendar-current-month');
  const gridContainer = document.getElementById('calendar-grid-container');
  const prevBtn = document.getElementById('calendar-prev-month');
  const nextBtn = document.getElementById('calendar-next-month');
  const todayBtn = document.getElementById('calendar-today-btn');
  const eventsListContainer = document.getElementById('events-list-container');

  const today = new Date();
  let currentYear = today.getFullYear();
  let currentMonth = today.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayHeaders = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Real current date for highlighting
  const realNow = new Date();
  const realCurrentDate = realNow.getDate();

  function renderCalendar() {
    monthTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    let html = '';
    // Header cells
    dayHeaders.forEach(day => {
      html += `<div class="cal-header-cell">${day}</div>`;
    });

    // Compute first day of month and total days
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Empty cells before first day
    for (let i = 0; i < firstDayIndex; i++) {
      html += `<div class="cal-day-cell empty"></div>`;
    }

    // Days of month
    for (let d = 1; d <= totalDays; d++) {
      // Highlight today if October 2026 (or matching real date)
      const isToday = currentMonth === today.getMonth() && currentYear === today.getFullYear() && d === today.getDate();
      html += `
        <div class="cal-day-cell ${isToday ? 'is-today' : ''}" data-day="${d}">
          ${d}
        </div>
      `;
    }

    gridContainer.innerHTML = html;

    // Attach click events to date cells
    gridContainer.querySelectorAll('.cal-day-cell:not(.empty)').forEach(cell => {
      cell.addEventListener('click', () => {
        const day = cell.getAttribute('data-day');
        renderEventList(day, currentMonth);
        gridContainer.querySelectorAll('.cal-day-cell').forEach(item=>item.classList.toggle('is-selected',item===cell));
      });
    });
  }

  prevBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
    renderEventList();
  });

  nextBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
    renderEventList();
  });

  todayBtn.addEventListener('click', () => {
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();
    renderCalendar();
    renderEventList();
  });

  renderCalendar();

  // Render Events list
  function renderEventList(day = '', month = currentMonth) {
    const monthAbbrev = monthNames[month].slice(0,3).toUpperCase();
    const visibleEvents = calendarEvents.filter(evt => currentYear === 2026 && evt.month === monthAbbrev && (!day || Number(evt.day) === Number(day)));
    eventsListContainer.innerHTML = visibleEvents.length ? visibleEvents.map(evt => `
      <a class="event-item-row" href="${evt.url || '#page/news'}" ${evt.url ? 'target="_blank" rel="noopener noreferrer"' : 'data-route="news"'}>
        <span class="event-date-block"><span class="event-day-num">${evt.day}</span><span class="event-month-text">${evt.month}</span></span>
        <span class="event-details"><span class="event-title">${evt.title}</span><span class="event-category-tag">${evt.category}</span></span>
      </a>`).join('') : `<p class="events-empty-state">${day ? `No events are listed for ${day} ${monthNames[month]}.` : `No events are listed for ${monthNames[month]} ${currentYear}.`} Browse <a href="#page/news" data-route="news">news and notices</a> for university updates.</p>`;
  }
  renderEventList();
}

/* ==========================================================================
   12. FOOTER & FIXED NEWS TICKER
   ========================================================================== */
function initFooterAndTicker() {
  // Render Important Links
  const linksContainer = document.getElementById('footer-important-links-list');
  if (linksContainer) {
    const routeFor = (label) => {
      const value = label.toLowerCase();
      if (value.includes('quality')) return 'iqac';
      if (value.includes('nirf') || value.includes('recognition') || value.includes('regulatory')) return 'recognitions';
      if (value.includes('ncc')) return 'ncc';
      if (value.includes('nss')) return 'nss';
      if (value.includes('contact')) return 'contact';
      if (value.includes('calendar')) return 'academic-calendar';
      if (value.includes('download') || value.includes('brochure')) return 'downloads';
      if (value.includes('resource')) return 'library';
      if (value.includes('placement')) return 'placements';
      if (value.includes('sparks')) return 'sparks';
      if (value.includes('sdg')) return 'sdg-partnership';
      if (value.includes('academic bank')) return 'abc';
      if (value.includes('national academic')) return 'nad';
      if (value.includes('best practices')) return 'institutional-best-practices';
      if (value.includes('distinctiveness')) return 'institutional-distinctiveness';
      if (value.includes('international')) return 'international-admissions';
      if (value.includes('annual report') || value.includes('audited account')) return 'annual-reports';
      if (value.includes('scholarship')) return 'scholarships';
      if (value.includes('fee')) return 'fees';
      if (value.includes('alumni')) return 'alumni';
      if (value.includes('research') || value.includes('patent') || value.includes('project')) return 'research';
      if (value.includes('sports')) return 'sports';
      if (value.includes('transport')) return 'transport';
      if (value.includes('accommodation') || value.includes('hostel')) return 'accommodation';
      if (value.includes('admission')) return 'admissions';
      if (value.includes('vision')) return 'vision-mission';
      if (value.includes('organogram')) return 'organogram';
      if (value.includes('statute')) return 'statutes';
      if (value.includes('statutory bodies')) return 'statutes';
      if (value.includes('committees')) return 'administration';
      if (value.includes('board of studies')) return 'statutes';
      if (value.includes('law publications')) return 'research-publications';
      if (value.includes('welfare')) return 'student-life';
      if (value.includes('anti-ragging')) return 'anti-ragging';
      if (value.includes('code of conduct')) return 'code-of-conduct';
      if (value.includes('feekart')) return 'fees';
      if (value.includes('nep')) return 'nep-saarthi';
      if (value.includes('disclosure')) return 'self-disclosure';
      if (value.includes('academic bank') || value.includes('national academic')) return 'about';
      if (value.includes('best practices')) return 'about';
      if (value.includes('distinctiveness')) return 'about';
      return 'about';
    };
    linksContainer.innerHTML = importantLinks.map(link => `<li><a href="#page/${routeFor(link)}" data-route="${routeFor(link)}" class="footer-sub-link">${link}</a></li>`).join('');
  }

  // Last updated date
  const lastUpdatedEl = document.getElementById('footer-last-updated');
  if (lastUpdatedEl) {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    lastUpdatedEl.textContent = formatted;
  }

  // Render Ticker Marquee with duplicated items for infinite smooth scrolling
  const tickerTrack = document.getElementById('ticker-marquee-track');
  if (tickerTrack) {
    const tickerContent = tickerNotices.map(notice => `
      <a class="ticker-item" href="#page/notices" data-route="notices">${notice}</a>
      <span class="ticker-sep">|</span>
    `).join('');

    // Duplicate 3 times to ensure continuous marquee text
    tickerTrack.innerHTML = tickerContent + tickerContent + tickerContent;
  }

  const heroApplyBtn = document.getElementById('hero-apply-btn');
  heroApplyBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('search-programmes')?.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('programme-keyword')?.focus({preventScroll:true});
  });
}

/* ==========================================================================
   BOOTSTRAP APPLICATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initInteriorPages();
  initNavigation();
  initHeroParticles();
  renderAccreditations();
  initSearchProgrammes();
  renderDepartments();
  renderFaculties();
  initSpotlightCarousel();
  initAnimatedCounters();
  renderPlacements();
  initTestimonialsCarousel();
  initEventsCalendar();
  initFooterAndTicker();

  // Initialize the modular Talk to us feature
  try {
    initChat();
  } catch (err) {
    console.error("Chat initialization error:", err);
  }
});
