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
      const target = document.getElementById('search-programmes');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      showToast("Redirecting to Admissions Application Form");
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
    portalBtn.addEventListener('click', () => {
      const footerPortals = document.querySelector('.portals-col');
      if (footerPortals) {
        footerPortals.scrollIntoView({ behavior: 'smooth' });
      }
      showToast("Quick Access: Portals section");
    });
  }

  // Accessibility tab
  const accessTab = document.getElementById('accessibility-tab');
  if (accessTab) {
    accessTab.addEventListener('click', () => {
      showToast("Accessibility tools: High Contrast / Large Text mode active");
    });
  }

  // Convocation tab
  const convocationTab = document.getElementById('convocation-tab');
  if (convocationTab) {
    convocationTab.addEventListener('click', (e) => {
      e.preventDefault();
      showToast("SRMUH Third Convocation 2025: Official Notice and Live Stream");
    });
  }
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
    const deptSection = document.getElementById('study-departments');
    if (deptSection) {
      deptSection.scrollIntoView({ behavior: 'smooth' });
    }
    const selDegree = degreeSelect.value || "All Degrees";
    const selInterest = interestSelect.value || "All Interests";
    showToast(`Showing programmes for: ${selInterest} (${selDegree})`);
  });

  const biharLink = document.getElementById('bihar-scheme-link');
  if (biharLink) {
    biharLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast("Bihar Student Credit Card Scheme: 0% collateral financial assistance");
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
    card.addEventListener('click', () => {
      const name = card.querySelector('.dept-name').textContent;
      showToast(`Selected: ${name}`);
    });
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
      showToast(`Exploring ${btn.getAttribute('data-fac')}`);
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
    <div class="spotlight-slide-card">
      <div class="spotlight-media" style="background: ${slide.gradient}">
        <span class="spotlight-tag">${slide.tag}</span>
        <span class="spotlight-date">${slide.date}</span>
      </div>
      <div class="spotlight-slanted-panel">
        <h3 class="spotlight-title">${slide.title}</h3>
        <p class="spotlight-summary">${slide.summary}</p>
      </div>
    </div>
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
      showToast("View More: Opening Corporate Relations & Placements Report");
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
      showToast("View More Testimonials: Opening Alumni Success Stories");
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

  let currentYear = 2026;
  let currentMonth = 9; // 0-indexed: 9 = October

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
      const isToday = (currentMonth === 9 && currentYear === 2026 && d === realCurrentDate) || (d === 13);
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
        showToast(`Events for ${day} ${monthNames[currentMonth]} ${currentYear}`);
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
  });

  nextBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  });

  todayBtn.addEventListener('click', () => {
    currentMonth = 9; // October 2026 default
    currentYear = 2026;
    renderCalendar();
    showToast("Reset to October 2026");
  });

  renderCalendar();

  // Render Events list
  eventsListContainer.innerHTML = calendarEvents.map(evt => `
    <div class="event-item-row" tabindex="0">
      <div class="event-date-block">
        <span class="event-day-num">${evt.day}</span>
        <span class="event-month-text">${evt.month}</span>
      </div>
      <div class="event-details">
        <span class="event-title">${evt.title}</span>
        <span class="event-category-tag">${evt.category}</span>
      </div>
    </div>
  `).join('');

  eventsListContainer.querySelectorAll('.event-item-row').forEach(row => {
    row.addEventListener('click', () => {
      const title = row.querySelector('.event-title').textContent;
      showToast(`Event Details: ${title}`);
    });
  });
}

/* ==========================================================================
   12. FOOTER & FIXED NEWS TICKER
   ========================================================================== */
function initFooterAndTicker() {
  // Render Important Links
  const linksContainer = document.getElementById('footer-important-links-list');
  if (linksContainer) {
    linksContainer.innerHTML = importantLinks.map(link => `
      <li><a href="#demo-link" class="footer-sub-link">${link}</a></li>
    `).join('');

    linksContainer.querySelectorAll('.footer-sub-link').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        showToast(`Demo site: ${a.textContent} page is not available`);
      });
    });
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
      <span class="ticker-item">${notice}</span>
      <span class="ticker-sep">|</span>
    `).join('');

    // Duplicate 3 times to ensure continuous marquee text
    tickerTrack.innerHTML = tickerContent + tickerContent + tickerContent;
  }

  // Hero action buttons
  const heroApplyBtn = document.getElementById('hero-apply-btn');
  if (heroApplyBtn) {
    heroApplyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('search-programmes');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      showToast("Online Admissions Application 2026-27");
    });
  }

  // Generic demo toasts for portals, flyers, socials
  document.querySelectorAll('a[href^="#demo-"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showToast("Demo site: this feature is not available");
    });
  });
}

/* ==========================================================================
   BOOTSTRAP APPLICATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
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
