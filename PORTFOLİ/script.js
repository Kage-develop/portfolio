class Portfolio {
  constructor() {
    this.sliderPage = 0;
    this.sliderRepos = [];
    this.cardsPerPage = 3;
    this.init();
  }

  init() {
    this.initLoadingScreen();
    this.initScrollProgress();
    this.initBackToTop();
    this.initCursor();
    this.initTheme();
    this.initNavbar();
    this.initScrollAnimations();
    this.initSkillBars();
    this.initContactForm();
    this.initSmoothScroll();
    this.initActiveNav();
    this.initMobileMenu();
    this.initGithubRepos();
    this.initFooterYear();
    this.initParticles();
    this.initSpotlight();
    this.initLazyLoading();
    this.updateCardsPerPage();
    window.addEventListener('resize', () => this.updateCardsPerPage());
  }

  escapeHTML(value = '') {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }[char]));
  }

  updateCardsPerPage() {
    const w = window.innerWidth;
    this.cardsPerPage = w < 768 ? 1 : w < 1100 ? 2 : 3;
    if (this.sliderRepos.length) this.renderSlider();
  }

  initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    window.addEventListener('load', () => {
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';
        setTimeout(() => loadingScreen.classList.add('hidden'), 500);
      }, 800);
    });
  }

  initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = (window.scrollY / total * 100) + '%';
    });
  }

  initBackToTop() {
    const btn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => btn.classList.toggle('show', window.pageYOffset > 300));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (window.innerWidth <= 768) { cursor.style.display = 'none'; follower.style.display = 'none'; return; }
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      setTimeout(() => { follower.style.left = (e.clientX - 16) + 'px'; follower.style.top = (e.clientY - 16) + 'px'; }, 80);
    });
    document.querySelectorAll('a, button, .project-card').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.style.transform = 'scale(1.5)'; follower.style.transform = 'scale(1.2)'; });
      el.addEventListener('mouseleave', () => { cursor.style.transform = 'scale(1)'; follower.style.transform = 'scale(1)'; });
    });
  }

  /* ─── THEME — dark mode view-transition animasyonu ─── */
  initTheme() {
    const toggle = document.querySelector('.theme-toggle');
    const icon = toggle.querySelector('i');
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
      icon.className = 'fas fa-sun';
    }

    toggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

      const applyTheme = () => {
        if (isDark) {
          document.documentElement.removeAttribute('data-theme');
          icon.className = 'fas fa-moon';
          localStorage.setItem('theme', 'light');
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          icon.className = 'fas fa-sun';
          localStorage.setItem('theme', 'dark');
        }
      };

      // View Transition API destekleyen tarayıcılarda animasyonlu geçiş
      if (document.startViewTransition) {
        document.startViewTransition(applyTheme);
      } else {
        applyTheme();
      }
    });
  }

  initNavbar() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (window.scrollY > 50) {
        navbar.style.background = isDark ? 'rgba(15,23,42,0.88)' : 'rgba(255,255,255,0.88)';
        navbar.style.boxShadow = isDark ? '0 18px 55px rgba(0,0,0,0.35)' : '0 18px 55px rgba(15,23,42,0.12)';
      } else {
        navbar.style.background = '';
        navbar.style.boxShadow = '';
      }
    });
  }

  initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (!toggle) return;
    toggle.addEventListener('click', () => { menu.classList.toggle('active'); toggle.classList.toggle('active'); });
    document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => { menu.classList.remove('active'); toggle.classList.remove('active'); }));
  }

  initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.about-card, .project-card, .skill-category, .skill-pill, .contact-method, .floating-card, .feature, .timeline-item, .timeline-content').forEach(el => {
      el.style.opacity = '0'; el.style.transform = 'translateY(30px)'; el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  initSkillBars() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.style.width = entry.target.getAttribute('data-width') + '%'; observer.unobserve(entry.target); }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skill-progress').forEach(bar => {
      bar.style.width = '0%'; bar.style.transition = 'width 1.2s cubic-bezier(0.4,0,0.2,1)'; observer.observe(bar);
    });
  }

  /* ─── CONTACT FORM — i18n bildirimleri ─── */
  initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submit-btn');

      // Aktif dili window._i18n'den oku (index.html'deki applyLang() tarafından set edilir)
      const t = window._i18n || {};

      btn.disabled = true;
      btn.innerHTML = `<span>${t.formSending || 'Sending...'}</span><i class="fas fa-spinner fa-spin"></i>`;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          this.showNotification(t.formSuccess || 'Message sent successfully!', 'success');
          form.reset();
        } else {
          this.showNotification(t.formError || 'Something went wrong. Try again.', 'error');
        }
      } catch {
        this.showNotification(t.formConnErr || 'Connection error. Try again.', 'error');
      }

      btn.disabled = false;
      btn.innerHTML = `<span>${t.formSend || 'Send Message'}</span><i class="fas fa-paper-plane"></i>`;
    });
  }

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ─── GITHUB REPOS WITH SLIDER ─── */
  initActiveNav() {
    const links = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
    const sections = links
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    if (!links.length || !sections.length) return;

    const setActive = () => {
      const offset = window.scrollY + 140;
      let current = sections[0].id;
      sections.forEach(section => {
        if (section.offsetTop <= offset) current = section.id;
      });
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
    };

    setActive();
    window.addEventListener('scroll', setActive, { passive: true });
  }

  initGithubRepos() {
    const track = document.getElementById('repoTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsEl = document.getElementById('sliderDots');
    if (!track) return;

    const gradients = [
      'linear-gradient(135deg,#667eea,#764ba2)',
      'linear-gradient(135deg,#f093fb,#f5576c)',
      'linear-gradient(135deg,#4facfe,#00f2fe)',
      'linear-gradient(135deg,#43e97b,#38f9d7)',
      'linear-gradient(135deg,#fa709a,#fee140)',
      'linear-gradient(135deg,#a18cd1,#fbc2eb)',
      'linear-gradient(135deg,#fccb90,#d57eeb)',
      'linear-gradient(135deg,#a1c4fd,#c2e9fb)',
      'linear-gradient(135deg,#fd7043,#ff8a65)',
      'linear-gradient(135deg,#26c6da,#00acc1)',
      'linear-gradient(135deg,#66bb6a,#43a047)',
      'linear-gradient(135deg,#ab47bc,#8e24aa)',
    ];

    fetch('https://api.github.com/users/Kage-develop/repos?sort=updated&per_page=12')
      .then(res => res.json())
      .then(repos => {
        if (!Array.isArray(repos) || repos.length === 0) throw new Error('No repos');
        this.sliderRepos = repos.map((repo, i) => ({ repo, gradient: gradients[i % gradients.length] }));
        this.sliderPage = 0;
        this.renderSlider();

        prevBtn.addEventListener('click', () => { this.sliderPage--; this.renderSlider(); });
        nextBtn.addEventListener('click', () => { this.sliderPage++; this.renderSlider(); });

        let startX = 0;
        const slider = document.getElementById('repoSlider');
        slider.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
        slider.addEventListener('touchend', e => {
          const diff = startX - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50) { diff > 0 ? this.sliderPage++ : this.sliderPage--; this.renderSlider(); }
        });
      })
      .catch(() => {
        this.sliderRepos = this.getFallbackRepos().map((repo, i) => ({ repo, gradient: gradients[i % gradients.length] }));
        this.sliderPage = 0;
        this.renderSlider();
        prevBtn.addEventListener('click', () => { this.sliderPage--; this.renderSlider(); });
        nextBtn.addEventListener('click', () => { this.sliderPage++; this.renderSlider(); });
      });
  }

  getFallbackRepos() {
    return [
      {
        name: 'Kage-develop Portfolio',
        description: 'Featured GitHub work by Sübhan Sultanlı. Live repository data appears automatically when GitHub is available.',
        html_url: 'https://github.com/Kage-develop',
        homepage: 'https://kage-develop.github.io/',
        language: 'JavaScript',
        stargazers_count: 0,
        forks_count: 0,
      },
      {
        name: 'Web Application Projects',
        description: 'Frontend experiments and functional web interfaces built with HTML, CSS, and JavaScript.',
        html_url: 'https://github.com/Kage-develop',
        homepage: '',
        language: 'CSS',
        stargazers_count: 0,
        forks_count: 0,
      },
      {
        name: 'Python & Data Projects',
        description: 'Python practice, data science learning, and algorithm-focused development work.',
        html_url: 'https://github.com/Kage-develop',
        homepage: '',
        language: 'Python',
        stargazers_count: 0,
        forks_count: 0,
      },
    ];
  }

  renderSlider() {
    const track = document.getElementById('repoTrack');
    const dotsEl = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');

    const total = this.sliderRepos.length;
    const pages = Math.ceil(total / this.cardsPerPage);
    this.sliderPage = Math.max(0, Math.min(this.sliderPage, pages - 1));

    const start = this.sliderPage * this.cardsPerPage;
    const visible = this.sliderRepos.slice(start, start + this.cardsPerPage);

    track.style.opacity = '0';
    track.style.transform = 'translateY(10px)';

    setTimeout(() => {
      track.innerHTML = visible.map(({ repo, gradient }) => `
        <div class="project-card repo-card">
          <div class="project-image" style="background:${gradient}">
            <div class="project-overlay">
              <div class="project-actions">
                <a href="${this.escapeHTML(repo.html_url)}" target="_blank" class="project-link" aria-label="Open GitHub repository"><i class="fab fa-github"></i></a>
                ${repo.homepage ? `<a href="${this.escapeHTML(repo.homepage)}" target="_blank" class="project-link" aria-label="Open live project"><i class="fas fa-external-link-alt"></i></a>` : ''}
              </div>
            </div>
          </div>
          <div class="project-content">
            <h3>${this.escapeHTML(repo.name)}</h3>
            <p>${this.escapeHTML(repo.description || 'No description yet.')}</p>
            <div class="project-tech">
              ${repo.language ? `<span>${this.escapeHTML(repo.language)}</span>` : ''}
              <span>Stars ${Number(repo.stargazers_count) || 0}</span>
              <span>${Number(repo.forks_count) || 0} forks</span>
            </div>
            <div class="project-buttons">
              ${repo.homepage ? `<a href="${this.escapeHTML(repo.homepage)}" target="_blank" rel="noopener" class="btn btn-primary project-btn">Live Demo</a>` : ''}
            </div>
          </div>
        </div>
      `).join('');

      track.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      track.style.opacity = '1';
      track.style.transform = 'translateY(0)';

      this.initTiltCards();
    }, 50);

    dotsEl.innerHTML = Array.from({ length: pages }, (_, i) =>
      `<button class="dot ${i === this.sliderPage ? 'active' : ''}" data-page="${i}"></button>`
    ).join('');
    dotsEl.querySelectorAll('.dot').forEach(d =>
      d.addEventListener('click', () => { this.sliderPage = +d.dataset.page; this.renderSlider(); })
    );

    prevBtn.disabled = this.sliderPage === 0;
    nextBtn.disabled = this.sliderPage === pages - 1;
  }

  initTiltCards() {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateY(0)'; });
    });
  }

  initFooterYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ─── PARTICLES ─── */
  initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const particleCount = window.innerWidth < 768 ? 26 : 64;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2.5 + 1, opacity: Math.random() * 0.5 + 0.1,
    }));
    let mouse = { x: -9999, y: -9999 };
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const color = isDark() ? '150,150,255' : '99,102,241';
      particles.forEach(p => {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) { p.vx += (dx / dist) * 0.3; p.vy += (dy / dist) * 0.3; }
        p.vx *= 0.99; p.vy *= 0.99; p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.opacity})`; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${color},${0.15 * (1 - d / 120)})`; ctx.lineWidth = 0.8; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    };
    animate();
  }

  /* ─── SPOTLIGHT ─── */
  initSpotlight() {
    const spotlight = document.getElementById('spotlight');
    if (!spotlight || window.innerWidth <= 768) return;
    document.addEventListener('mousemove', (e) => { spotlight.style.left = e.clientX + 'px'; spotlight.style.top = e.clientY + 'px'; });
    document.querySelectorAll('.project-card, .timeline-content, .contact-method, .feature, .skill-pill').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--spotlight-x', (e.clientX - rect.left) + 'px');
        el.style.setProperty('--spotlight-y', (e.clientY - rect.top) + 'px');
        el.classList.add('spotlight-active');
      });
      el.addEventListener('mouseleave', () => el.classList.remove('spotlight-active'));
    });
  }

  /* ─── LAZY LOADING ─── */
  initLazyLoading() {
    const imgObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { const img = entry.target; if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); } obs.unobserve(img); }
      });
    }, { rootMargin: '200px' });
    document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('section-loaded'); });
    }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('section').forEach(s => sectionObserver.observe(s));
  }

  showNotification(message, type) {
    const n = document.createElement('div');
    n.style.cssText = `position:fixed;top:20px;right:20px;background:${type === 'success' ? '#10b981' : '#ef4444'};color:white;padding:1rem 1.5rem;border-radius:12px;z-index:10000;transform:translateX(400px);transition:transform 0.3s ease;box-shadow:0 10px 30px rgba(0,0,0,0.2);font-weight:500;font-size:14px;max-width:calc(100vw - 40px);`;
    n.textContent = message;
    document.body.appendChild(n);
    setTimeout(() => n.style.transform = 'translateX(0)', 100);
    setTimeout(() => { n.style.transform = 'translateX(400px)'; setTimeout(() => n.remove(), 300); }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => new Portfolio());
