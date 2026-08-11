/* =========================================================
   script.js
   Vanilla JS only — no frameworks or libraries.
   Organized into small, single-purpose modules that each
   run once on DOMContentLoaded.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initScrollReveal();
    initActiveNavHighlight();
    initProjects();      // renders cards + wires filter + modal
    initBackToTop();

    const footerYear = document.getElementById('footerYear');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
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
   the viewport, using IntersectionObserver.
   --------------------------------------------------------- */

function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');

    if (!items.length) return;

    // If browser doesn't support IntersectionObserver,
    // just show everything.
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
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    items.forEach(el => observer.observe(el));
}


/* ---------------------------------------------------------
   3. ACTIVE NAV LINK ON SCROLL
   --------------------------------------------------------- */

function initActiveNavHighlight() {
    const sections = document.querySelectorAll('main section[id]');
    const links = document.querySelectorAll('.nav__link');

    if (!sections.length || !links.length) return;

    const linkFor = (id) => {
        return Array.from(links).find(
            a => a.getAttribute('href') === `#${id}`
        );
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const link = linkFor(entry.target.id);

            if (!link) return;

            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('is-active'));
                link.classList.add('is-active');
            }
        });
    }, {
        rootMargin: '-45% 0px -50% 0px'
    });

    sections.forEach(section => observer.observe(section));
}


/* ---------------------------------------------------------
   4. PROJECTS: DATA, RENDER, FILTER, MODAL
   --------------------------------------------------------- */

const projectData = [
    {
        id: 'proj-1',
        title: '[ Predictive Model Project ]',
        category: 'ml',
        categoryLabel: 'Machine Learning',
        description: 'A short one-line summary of the model and the problem it solves.',
        fullDescription:
            'Replace with a full case-study description: the problem, your approach, the dataset used, and the outcome or accuracy achieved.',
        role: 'Model design, training, and evaluation.',
        stack: ['Python', 'Scikit-learn', 'Pandas'],
        github: '#',
        demo: '#'
    },

    {
        id: 'proj-2',
        title: '[ Data Analytics Dashboard ]',
        category: 'analytics',
        categoryLabel: 'Data Analytics',
        description: 'A short one-line summary of the dataset and the insight it surfaces.',
        fullDescription:
            'Replace with a full case-study description: the business question, the analysis process, and the key findings.',
        role: 'Data cleaning, analysis, and dashboard build.',
        stack: ['Python', 'Pandas', 'Power BI'],
        github: '#',
        demo: '#'
    },

    {
        id: 'proj-3',
        title: '[ Visualization Project ]',
        category: 'viz',
        categoryLabel: 'Visualization',
        description: 'A short one-line summary of what the visualization communicates.',
        fullDescription:
            'Replace with a full case-study description: what the visualization shows and why it matters to the audience.',
        role: 'Visualization design and implementation.',
        stack: ['Python', 'Matplotlib', 'Seaborn'],
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

    if (!grid) return;

    grid.innerHTML = list.map(project => `
        <article
            class="project-card reveal is-visible"
            data-category="${project.category}"
        >
            <div class="project-card__image">
                ${project.title.replace('[ ', '').replace(' ]', '')}
            </div>

            <div class="project-card__body">
                <span class="project-card__category">
                    ${project.categoryLabel}
                </span>

                <h3>${project.title}</h3>

                <p>${project.description}</p>

                <div class="project-card__footer">

                    <div class="project-card__links">
                        <a
                            class="icon-link"
                            href="${project.github}"
                            target="_blank"
                            rel="noopener"
                        >
                            GitHub
                        </a>

                        <a
                            class="icon-link"
                            href="${project.demo}"
                            target="_blank"
                            rel="noopener"
                        >
                            Live Demo
                        </a>
                    </div>

                    <button
                        class="project-card__details-btn"
                        data-project-id="${project.id}"
                    >
                        View Details →
                    </button>

                </div>
            </div>
        </article>
    `).join('');

    // Wire up "View Details" buttons
    grid.querySelectorAll('[data-project-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            openProjectModal(btn.dataset.projectId);
        });
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

            const filtered =
                filter === 'all'
                    ? projectData
                    : projectData.filter(
                        project => project.category === filter
                    );

            renderProjects(filtered);
        });
    });
}


function openProjectModal(id) {
    const project = projectData.find(p => p.id === id);

    if (!project) return;

    const modal = document.getElementById('projectModal');

    if (!modal) return;

    document.getElementById('modalCategory').textContent =
        project.categoryLabel;

    document.getElementById('modalTitle').textContent =
        project.title;

    document.getElementById('modalDescription').textContent =
        project.fullDescription;

    document.getElementById('modalRole').textContent =
        project.role;

    document.getElementById('modalGithub').href =
        project.github;

    document.getElementById('modalDemo').href =
        project.demo;

    document.getElementById('modalImage').textContent = '';

    const stackList = document.getElementById('modalStack');

    stackList.innerHTML = project.stack
        .map(tech => `<li>${tech}</li>`)
        .join('');

    modal.hidden = false;

    document.body.style.overflow = 'hidden';

    const closeButton = modal.querySelector('.modal__close');

    if (closeButton) {
        closeButton.focus();
    }
}


function closeProjectModal() {
    const modal = document.getElementById('projectModal');

    if (!modal) return;

    modal.hidden = true;
    document.body.style.overflow = '';
}


function wireModal() {
    const modal = document.getElementById('projectModal');

    if (!modal) return;

    modal.querySelectorAll('[data-close-modal]').forEach(el => {
        el.addEventListener('click', closeProjectModal);
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !modal.hidden) {
            closeProjectModal();
        }
    });
}


/* ---------------------------------------------------------
   5. BACK TO TOP BUTTON
   --------------------------------------------------------- */

function initBackToTop() {
    const btn = document.getElementById('backToTop');

    if (!btn) return;

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
