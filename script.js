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
   the grid and modal are generated from this single source.
--------------------------------------------------------- */
const projectData = [
  {
    id: 'proj-1',
    title: 'Predicting Adolescent Depression from Social Media & Lifestyle Patterns',
    category: 'ml',
    categoryLabel: 'Machine Learning',
    description: 'Classification models predicting adolescent depression risk from lifestyle and social media behavior data.',
    fullDescription: 'Built and compared Random Forest, Logistic Regression, and Decision Tree classifiers on an imbalanced dataset (97.5% vs 2.5% class split) to flag depression risk from sleep, stress, anxiety, and screen-time features. Applied SMOTE to the training set only, tuned hyperparameters with GridSearchCV, and optimized for F2-score and recall rather than accuracy given the imbalance. The Decision Tree model caught every depressed case in the test set (recall of 1.0), with sleep hours, stress level, and anxiety level emerging as the strongest predictors.',
    role: 'Built and evaluated the classification models, handled class-imbalance correction with SMOTE, and ran hyperparameter tuning.',
    stack: ['Python', 'Scikit-learn', 'Random Forest', 'Logistic Regression', 'Decision Tree', 'SMOTE'],
    github: '#',
    demo: '#'
  },
  {
    id: 'proj-2',
    title: 'Sales Data ETL & Reporting Pipeline',
    category: 'analytics',
    categoryLabel: 'Data Analytics',
    description: 'Group ETL pipeline that cleaned, normalized, and loaded retail sales data into a 3NF MySQL database.',
    fullDescription: 'A six-person group project that extracted Orders, People, and Returns data from an Excel workbook, ran data-quality checks, cleaned and normalized the dataset into Third Normal Form across ten relational tables, and loaded it into MySQL with Python, Pandas, SQLAlchemy, and PyMySQL. Validated the load with row-count, null, and foreign-key checks, then built operational and executive reporting tables exported to CSV and PDF for business decision-making.',
    role: 'Contributed to data cleaning, transformation, and MySQL loading scripts as part of a six-person team.',
    stack: ['Python', 'Pandas', 'MySQL', 'SQLAlchemy'],
    github: '#',
    demo: '#'
  },
  {
    id: 'proj-3',
    title: '2025 Investment Shortlist, Tableau Story',
    category: 'viz',
    categoryLabel: 'Visualization',
    description: 'An eight-visualization Tableau Story screening 60 companies into a defensible 2025 investment shortlist.',
    fullDescription: 'A group project combining fundamentals, market performance, risk, liquidity, and data quality into a transparent multi-criteria screening framework for a 60-company sample. The Tableau Story moves from sector context to company-level evidence to a preference-sensitive shortlist, using forecasting, a risk-return matrix, company clustering, what-if scenario weighting, and a liquidity Pareto analysis. Found a positive but outlier-sensitive relationship between free cash flow growth and annual return (Pearson r of 0.698, falling to 0.399 once the influential outlier was removed).',
    role: 'Contributed to the fundamentals-return correlation analysis and the risk-return and liquidity visualizations as part of a six-person team.',
    stack: ['Tableau', 'Statistical Analysis', 'Excel'],
    github: '#',
    demo: '#'
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
      <div class="project-card__image">Photo</div>
      <div class="project-card__body">
        <span class="project-card__category">${project.categoryLabel}</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-card__footer">
          <div class="project-card__links">
            <a class="icon-link" href="${project.github}" target="_blank" rel="noopener">GitHub</a>
            <a class="icon-link" href="${project.demo}" target="_blank" rel="noopener">Live Demo</a>
          </div>
          <button class="project-card__details-btn" data-project-id="${project.id}">View Details &rarr;</button>
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
  document.getElementById('modalCategory').textContent = project.categoryLabel;
  document.getElementById('modalTitle').textContent = project.title;
  document.getElementById('modalDescription').textContent = project.fullDescription;
  document.getElementById('modalRole').textContent = project.role;
  document.getElementById('modalGithub').href = project.github;
  document.getElementById('modalDemo').href = project.demo;

  const stackList = document.getElementById('modalStack');
  stackList.innerHTML = project.stack.map(tech => `<li>${tech}</li>`).join('');

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
   7. LIGHT / DARK THEME TOGGLE
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
   6. BACK TO TOP BUTTON
--------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
