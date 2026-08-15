/* =========================================================
   script.js
   Vanilla JS only. No frameworks or libraries.
   Organized into small, single-purpose modules that each
   run once on DOMContentLoaded.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initActiveNavHighlight();
  initProjects();      // renders cards + wires filter + modal
  initBackToTop();
  initThemeToggle();
  initHeroOrb();
  document.getElementById('footerYear').textContent = new Date().getFullYear();
});

/* ---------------------------------------------------------
   1. MOBILE NAV TOGGLE
--------------------------------------------------------- */
function initNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link is tapped (mobile)
  menu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------------------
   2. SCROLL REVEAL
   Adds .is-visible to any .reveal element once it enters
   the viewport, using IntersectionObserver (no scroll-jank).
--------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  // If the browser doesn't support IO, just show everything.
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
}

/* ---------------------------------------------------------
   3. ACTIVE NAV LINK ON SCROLL
--------------------------------------------------------- */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('main section[id]');
  const links = document.querySelectorAll('.nav__link');
  if (!sections.length || !links.length) return;

  const linkFor = (id) => Array.from(links).find(a => a.getAttribute('href') === `#${id}`);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = linkFor(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(sec => observer.observe(sec));
}

/* ---------------------------------------------------------
   4. PROJECTS: data, render, filter, modal
   Edit the projectData array below to add/replace projects.
   The grid and modal are generated from this single source.
   Each project's "image" points to its thumbnail/banner photo
   under assets/projects/.
--------------------------------------------------------- */
const projectData = [
  {
    id: 'proj-1',
    title: 'Predicting Adolescent Depression from Social Media & Lifestyle Patterns',
    category: 'ml',
    categoryLabel: 'Machine Learning',
    image: 'assets/projects/depression-prediction.png',
    description: 'Classification models predicting adolescent depression risk from lifestyle and social media behavior data.',
    fullDescription: 'Built and compared Random Forest, Logistic Regression, and Decision Tree classifiers on an imbalanced dataset (97.5% vs 2.5% class split) to flag depression risk from sleep, stress, anxiety, and screen-time features.',
    highlights: [
      'Compared Random Forest, Logistic Regression, and Decision Tree classifiers on a 97.5% vs 2.5% imbalanced dataset.',
      'Applied SMOTE to the training set only, keeping the test set untouched for a realistic evaluation.',
      'Tuned hyperparameters with GridSearchCV, optimizing for F2-score and recall over raw accuracy.',
      'Identified sleep hours, stress level, and anxiety level as the strongest predictors.',
      'Reached a recall of 1.0 on the Decision Tree model, catching every depressed case in the test set.'
    ],
    role: 'Built and evaluated the classification models, handled class-imbalance correction with SMOTE, and ran hyperparameter tuning.',
    stack: ['Python', 'Scikit-learn', 'Random Forest', 'Logistic Regression', 'Decision Tree', 'SMOTE']
  },
  {
    id: 'proj-2',
    title: 'Sales Data ETL & Reporting Pipeline',
    category: 'analytics',
    categoryLabel: 'Data Analytics',
    image: 'assets/projects/etl-pipeline.png',
    description: 'Group ETL pipeline that cleaned, normalized, and loaded retail sales data into a 3NF MySQL database.',
    fullDescription: 'A six-person group project that extracted Orders, People, and Returns data from an Excel workbook and turned it into a normalized, query-ready MySQL database with automated reporting.',
    highlights: [
      'Extracted Orders, People, and Returns data from a multi-sheet Excel workbook.',
      'Ran data-quality checks, removed invalid records, and standardized postal codes.',
      'Normalized the dataset into Third Normal Form across ten relational tables.',
      'Loaded the data into MySQL with Python, Pandas, SQLAlchemy, and PyMySQL, preserving foreign key relationships.',
      'Validated the load with row-count, null, and foreign-key checks, then generated operational and executive reports.'
    ],
    role: 'Contributed to data cleaning, transformation, and MySQL loading scripts as part of a six-person team.',
    stack: ['Python', 'Pandas', 'MySQL', 'SQLAlchemy']
  },
  {
    id: 'proj-3',
    title: '2025 Investment Shortlist, Tableau Story',
    category: 'viz',
    categoryLabel: 'Visualization',
    image: 'assets/projects/investment-shortlist.png',
    description: 'An eight-visualization Tableau Story screening 60 companies into a defensible 2025 investment shortlist.',
    fullDescription: 'A group project combining fundamentals, market performance, risk, liquidity, and data quality into a transparent multi-criteria screening framework for a 60-company sample.',
    highlights: [
      'Built an eight-visualization Tableau Story moving through context, relationships, risk, decision, and action.',
      'Tested the link between free cash flow growth and annual return (Pearson r of 0.698, dropping to 0.399 without the influential outlier).',
      'Identified companies combining above-average return with below-average volatility using a risk-return matrix.',
      'Built a what-if scenario model letting weights shift between Conservative, Growth, Quality, and Momentum priorities.',
      'Ran a liquidity Pareto analysis showing the top 12 companies account for 66.1% of daily trading volume.'
    ],
    role: 'Contributed to the fundamentals-return correlation analysis and the risk-return and liquidity visualizations as part of a six-person team.',
    stack: ['Tableau', 'Statistical Analysis', 'Excel']
  }
];

function initProjects() {
  const grid = document.getElementById('projectGrid');
  if (!grid) return;

  renderProjects(projectData);
  wireFilterBar();
  wireModal();
}

function renderProjects(list) {
  const grid = document.getElementById('projectGrid');
  grid.innerHTML = list.map(project => `
    <article class="project-card reveal is-visible" data-category="${project.category}">
      <div class="project-card__image" style="background-image: url('${project.image}')"></div>
      <div class="project-card__body">
        <span class="project-card__category">${project.categoryLabel}</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-card__footer">
          <button class="project-card__details-btn" data-project-id="${project.id}">View Full Case Study &rarr;</button>
        </div>
      </div>
    </article>
  `).join('');

  // Wire up "View Details" buttons for the freshly rendered cards
  grid.querySelectorAll('[data-project-id]').forEach(btn => {
    btn.addEventListener('click', () => openProjectModal(btn.dataset.projectId));
  });
}

function wireFilterBar() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;
      const filtered = filter === 'all'
        ? projectData
        : projectData.filter(p => p.category === filter);
      renderProjects(filtered);
    });
  });
}

function openProjectModal(id) {
  const project = projectData.find(p => p.id === id);
  if (!project) return;

  const modal = document.getElementById('projectModal');
  document.getElementById('modalImage').style.backgroundImage = `url('${project.image}')`;
  document.getElementById('modalCategory').textContent = project.categoryLabel;
  document.getElementById('modalTitle').textContent = project.title;
  document.getElementById('modalDescription').textContent = project.fullDescription;
  document.getElementById('modalRole').textContent = project.role;

  document.getElementById('modalHighlights').innerHTML =
    project.highlights.map(point => `<li>${point}</li>`).join('');

  document.getElementById('modalStack').innerHTML =
    project.stack.map(tech => `<li>${tech}</li>`).join('');

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal__close').focus();
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  modal.hidden = true;
  document.body.style.overflow = '';
}

function wireModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  modal.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', closeProjectModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeProjectModal();
  });
}

/* ---------------------------------------------------------
   5. HERO PARTICLE SPHERE
   An original animated visual (not a copy of any reference
   image): particles are placed on a sphere using a Fibonacci
   distribution, projected to 2D, and slowly rotated on canvas.
--------------------------------------------------------- */
function initHeroOrb() {
  const canvas = document.getElementById('heroOrb');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const POINT_COUNT = 900;
  let points = [];
  let width, height, radius, dpr;

  // angle = rotation around Y axis, tilt = rotation around X axis.
  // Both are user-draggable; autoRotate only advances angle when true.
  let angle = 0;
  let tilt = 0.4;
  let autoRotate = true;
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let resumeTimer = null;

  // Color stops the sphere cycles through as points rotate front to back
  const COLOR_STOPS = [
    { r: 190, g: 55, b: 130 },  // deep pink
    { r: 116, g: 45, b: 190 },  // deep violet
    { r: 40, g: 80, b: 190 },   // deep blue
    { r: 180, g: 140, b: 20 }   // deep yellow (brand accent)
  ];

  function lerpColor(t) {
    const segments = COLOR_STOPS.length - 1;
    const scaled = t * segments;
    const i = Math.min(Math.floor(scaled), segments - 1);
    const localT = scaled - i;
    const a = COLOR_STOPS[i];
    const b = COLOR_STOPS[i + 1];
    return {
      r: a.r + (b.r - a.r) * localT,
      g: a.g + (b.g - a.g) * localT,
      b: a.b + (b.b - a.b) * localT
    };
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    radius = Math.min(width, height) * 0.42;
  }

  // Fibonacci sphere: evenly distributes N points across a sphere's surface
  function buildPoints() {
    points = [];
    const offset = 2 / POINT_COUNT;
    const increment = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < POINT_COUNT; i++) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const phi = i * increment;
      points.push({
        x: Math.cos(phi) * r,
        y: y,
        z: Math.sin(phi) * r
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);

    const projected = points.map(p => {
      // rotate around Y axis
      let x = p.x * cosA - p.z * sinA;
      let z = p.x * sinA + p.z * cosA;
      let y = p.y;
      // tilt around X axis
      const y2 = y * cosT - z * sinT;
      const z2 = y * sinT + z * cosT;
      return { x, y: y2, z: z2 };
    });

    // Painter's algorithm: draw back-to-front
    projected.sort((a, b) => a.z - b.z);

    projected.forEach(p => {
      const scale = (p.z + 1.6) / 2.6; // depth-based scale/opacity, 0 (back) to 1 (front)
      const screenX = cx + p.x * radius;
      const screenY = cy + p.y * radius;
      const size = Math.max(0.6, scale * 2.4);
      const color = lerpColor((p.y + 1) / 2);
      const alpha = 0.4 + scale * 0.6;

      ctx.beginPath();
      ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.r | 0}, ${color.g | 0}, ${color.b | 0}, ${alpha.toFixed(2)})`;
      ctx.fill();
    });
  }

  function tick() {
    if (autoRotate && !prefersReducedMotion) {
      angle += 0.0011; // slow idle drift
    }
    draw();
    requestAnimationFrame(tick);
  }

  // --- Pointer drag: click/touch and drag the sphere to rotate it manually ---
  function onPointerDown(e) {
    isDragging = true;
    autoRotate = false;
    clearTimeout(resumeTimer);
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.classList.add('is-dragging');
    canvas.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    angle += dx * 0.008;
    tilt = Math.max(-1.3, Math.min(1.3, tilt + dy * 0.006));
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    canvas.classList.remove('is-dragging');
    // Resume the gentle idle drift a moment after the user lets go
    resumeTimer = setTimeout(() => { autoRotate = true; }, 1400);
  }

  canvas.style.touchAction = 'none';
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);

  resize();
  buildPoints();
  draw();
  requestAnimationFrame(tick);

  window.addEventListener('resize', () => {
    resize();
    draw();
  });
}

/* ---------------------------------------------------------
   6. LIGHT / DARK THEME TOGGLE
   The initial theme is set by an inline script in <head> to
   avoid a flash of the wrong theme. This just wires the button.
--------------------------------------------------------- */
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

/* ---------------------------------------------------------
   7. BACK TO TOP BUTTON
--------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
