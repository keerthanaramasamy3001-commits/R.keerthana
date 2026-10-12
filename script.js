// ============================================================
// KEERTHANA R — PORTFOLIO SCRIPT (Warm Luxury Clean Theme)
// ============================================================

// ---------- Scroll Progress & Back To Top ----------
const scrollProgressBar = document.getElementById("scroll-progress-bar");
const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  if (scrollProgressBar) {
    scrollProgressBar.style.width = scrollPct + "%";
  }

  if (backToTopBtn) {
    if (scrollTop > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  }
});

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Interactive background: the aurora gently follows mouse and touch movement.
const meshBackground = document.querySelector('.mesh-bg');
const interactiveBackground = false;
if (meshBackground && interactiveBackground) {
  const moveBackground = (x, y) => {
    const shiftX = ((x / window.innerWidth) - 0.5) * 92;
    const shiftY = ((y / window.innerHeight) - 0.5) * 64;
    meshBackground.style.setProperty('--bg-move-x', `${shiftX}px`);
    meshBackground.style.setProperty('--bg-move-y', `${shiftY}px`);
    meshBackground.style.transform = `translate3d(${shiftX * -0.32}px, ${shiftY * -0.32}px, 0)`;
  };

  window.addEventListener('pointermove', (event) => moveBackground(event.clientX, event.clientY), { passive: true });
  window.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    if (touch) moveBackground(touch.clientX, touch.clientY);
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    meshBackground.style.transform = 'translate3d(0, 0, 0)';
    meshBackground.style.setProperty('--bg-move-x', '0px');
    meshBackground.style.setProperty('--bg-move-y', '0px');
  });
}

// ---------- Typing effect ----------
const typingEl = document.getElementById("typing-text") || document.querySelector(".typing");

const roles = [
  "Full Stack Developer",
  "MCA Graduate | Software Developer",
  "Software Engineer"
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  if (!typingEl) return;

  const current = roles[roleIndex];

  if (!deleting) {
    charIndex++;
    typingEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1500);
      return;
    }
  } else {
    charIndex--;
    typingEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeLoop, deleting ? 35 : 75);
}

typeLoop();

// ---------- Scroll reveal ----------
const revealTargets = document.querySelectorAll(
  "section:not(.home), .project-box, .skill-card, .cert-card-light"
);

revealTargets.forEach((el) => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  },
  { threshold: 0.15 }
);

revealTargets.forEach((el) => revealObserver.observe(el));

// ---------- Skill card bars fill on view ----------
const scBars = document.querySelectorAll(".sc-bar");

const scBarObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const pct = getComputedStyle(el).getPropertyValue("--pct").trim();
        el.style.width = "0%";
        requestAnimationFrame(() => {
          setTimeout(() => { el.style.width = pct; }, 120);
        });
        scBarObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.3 }
);

scBars.forEach((bar) => scBarObserver.observe(bar));

// ---------- Active Nav Tabs & Smooth Scroll Alignment ----------
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a, nav ul li a");
const allHashLinks = document.querySelectorAll('a[href^="#"]');

function getNavOffset() {
  const navbar = document.querySelector(".navbar");
  return (navbar ? navbar.offsetHeight : 68) + 16;
}

function scrollToSection(targetId) {
  const cleanId = (targetId || "").replace(/^#/, "");
  const target = document.getElementById(cleanId);
  if (!target) return;
  const navOffset = getNavOffset();
  const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navOffset;
  window.scrollTo({
    top: Math.max(0, targetPos),
    behavior: "smooth"
  });
}

let isManualNavClick = false;
let clickTimer = null;

function updateActiveNav() {
  if (isManualNavClick) return;

  const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  const navOffset = getNavOffset() + 30;

  // At top of page, home is always active
  if (scrollY < 120) {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#home");
    });
    return;
  }

  // At bottom of page, contact is always active
  if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 60) {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#contact");
    });
    return;
  }

  let current = "";
  sections.forEach((sec) => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= navOffset && rect.bottom > navOffset) {
      current = sec.getAttribute("id");
    }
  });

  if (current) {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  }
}

// Handle all nav links and hash links with accurate offset
allHashLinks.forEach((link) => {
  const href = link.getAttribute("href");
  if (href && href.startsWith("#") && href.length > 1) {
    link.addEventListener("click", (e) => {
      const targetId = href.replace(/^#/, "");
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      // Immediately set active tab
      navLinks.forEach((l) => {
        l.classList.toggle("active", l.getAttribute("href") === href);
      });

      // Temporarily lock scroll spy while scrolling
      isManualNavClick = true;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        isManualNavClick = false;
        updateActiveNav();
      }, 750);

      // Perform offset scroll
      scrollToSection(targetId);

      // Cleanly push hash to browser URL
      if (window.history && window.history.pushState) {
        window.history.pushState(null, "", href);
      }
    });
  }
});

window.addEventListener("scroll", updateActiveNav, { passive: true });

window.addEventListener("load", () => {
  if (window.location.hash) {
    const hash = window.location.hash;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === hash);
    });
    setTimeout(() => {
      scrollToSection(hash);
    }, 120);
  } else {
    updateActiveNav();
  }
});

window.addEventListener("hashchange", () => {
  if (window.location.hash) {
    scrollToSection(window.location.hash);
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === window.location.hash);
    });
  }
});

function sendContactMessage(event) {
  event.preventDefault();
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('contact-feedback');
  if (!form || !feedback) return;

  const name = form.querySelector('input[name="name"]').value.trim();
  const email = form.querySelector('input[name="email"]').value.trim();
  const subject = form.querySelector('input[name="subject"]').value.trim();
  const message = form.querySelector('textarea[name="message"]').value.trim();

  const mailto = `mailto:keerthanaramasamy1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
  window.location.href = mailto;

  feedback.textContent = 'Opening your mail client now. Send the message from there to complete the contact.';
  feedback.classList.add('show');

  setTimeout(() => {
    feedback.classList.remove('show');
    if (form) form.reset();
  }, 4500);
}

// ---------- Animated stat counters ----------
function animateCount(el, target, suffix) {
  let count = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const tick = () => {
    count += step;
    if (count >= target) {
      el.textContent = target + suffix;
    } else {
      el.textContent = count + suffix;
      requestAnimationFrame(tick);
    }
  };
  tick();
}

const numEls = document.querySelectorAll(".stat .num");
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      const match = raw.match(/^(\d+)(\+?)$/);
      if (match) {
        el.textContent = "0" + match[2];
        animateCount(el, parseInt(match[1], 10), match[2]);
      }
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.6 }
);

numEls.forEach((el) => countObserver.observe(el));

// ============================================================
// PROJECT PREVIEW MODAL
// ============================================================

const projects = {
  'id-card': {
    title: 'Smart ID Card Management System',
    subtitle: 'Resume Project #1 · Web Application · PHP, MySQL & JSON',
    icon: '🪪',
    iconBg: 'linear-gradient(135deg, #3b82f6, #22d3ee)',
    desc: 'A web application to design, generate, manage and print ID cards for organizations. Developed with custom template formatting, automated QR codes, and batch printing ready PDF export.',
    tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'JSON'],
    features: [
      'Official Project listed on Keerthana\'s Resume',
      'Drag-and-drop ID card template customization',
      'Photo upload and crop functionality',
      'QR code auto-generation for each member card',
      'Batch print-ready PDF export and admin dashboard',
    ],
    github: 'https://github.com/keerthanaramasamy3001-commits/IDCARD-',
    demoUrl: 'http://localhost/idcard/',
  },
  'pasport': {
    title: 'PASPORT: Location Proof Generation & Verification Framework',
    subtitle: 'Resume Project #2 · Security & Cryptography · PHP & MySQL',
    icon: '🔐',
    iconBg: 'linear-gradient(135deg, #10b981, #22d3ee)',
    desc: 'A secure web framework for generating and verifying location proofs with privacy protection. Uses cryptographic techniques to ensure tamper-proof location verification.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL'],
    features: [
      'Official Project listed on Keerthana\'s Resume',
      'Cryptographic location proof generation',
      'Privacy-preserving verification mechanism',
      'Tamper-proof audit trail logging and schema validation',
      'Secure admin dashboard with real-time analytics',
    ],
    github: 'https://github.com/keerthanaramasamy3001-commits/passport',
    demoUrl: 'http://localhost/project123/',
  },
  'suicidal': {
    title: 'Suicidal Ideation Detection: Machine Learning Review Platform',
    subtitle: 'Resume Project #3 · ML Review Platform · PHP & MySQL',
    icon: '🧠',
    iconBg: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    desc: 'A web based review platform to analyze and present machine learning methods for suicidal ideation detection. Provides comparative benchmark analyses and research metrics.',
    tags: ['PHP 8.x', 'HTML5', 'MySQL', 'Machine Learning Review'],
    features: [
      'Official Project listed on Keerthana\'s Resume',
      'Multi-model ML comparison dashboard and research survey',
      'Social media text preprocessing pipeline metrics',
      'Benchmark dataset evaluation and accuracy comparison',
      'Research article annotation and review module',
    ],
    github: '#',
    demoUrl: 'https://keerthana01.freepage.cc/project2/',
  },
  'qr-menu': {
    title: 'Restaurant QR Menu System',
    subtitle: 'Contactless Digital Menu · PHP, JS & JSON',
    icon: '🍽️',
    iconBg: 'linear-gradient(135deg, #f97316, #fb923c)',
    desc: 'A complete contactless digital menu application. Restaurant administrators generate unique table QR codes and manage live food items via JSON datasets. Customers scan the QR code to instantly browse categories, view dishes, prices, and place orders smoothly.',
    tags: ['PHP', 'CSS', 'JavaScript', 'JSON', 'HTML5'],
    features: [
      'Instant dynamic table QR code generator',
      'Real-time JSON menu catalog with categories & pricing',
      'Mobile-first responsive ordering interface for diners',
      'Fast search with Veg / Non-Veg dietary filters',
      'Kitchen inventory & dish availability toggle manager',
    ],
    github: '#',
    demoUrl: 'https://keerthana01.freepage.cc/qr-menu/',
  },
  'realestate-crm': {
    title: 'Real Estate Lead & Site-Visit CRM',
    subtitle: 'Kumbakonam Property Connect Extension · PHP & JSON',
    icon: '🏢',
    iconBg: 'linear-gradient(135deg, #eab308, #f59e0b)',
    desc: 'An advanced CRM system extending Kumbakonam Property Connect. Designed for real estate agencies to list verified properties, capture prospective buyer leads, and coordinate client site visits with automated notification workflows.',
    tags: ['PHP', 'CSS', 'JavaScript', 'JSON', 'HTML5'],
    features: [
      'Property inventory management with location specs & gallery',
      'Lead qualification tracking (New Lead, Site Visit, Negotiation, Deal Closed)',
      'Automated site-visit scheduler with calendar reminders',
      'JSON-based structured lead inquiry & preference logging',
      'Performance analytics dashboard for agents & managers',
    ],
    github: '#',
    demoUrl: 'https://keerthana01.freepage.cc/realestatecrm/',
  },
  'travel-bucket': {
    title: 'My Travel Bucket List',
    subtitle: 'Interactive Travel Planner · HTML, CSS & JavaScript',
    icon: '✈️',
    iconBg: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    desc: 'An inspiring travel destination discovery and trip-planning web application. Enables globetrotters to browse picturesque travel destinations, customize their dream travel bucket list, track visited landmarks, and plan future adventures with an intuitive interactive UI.',
    tags: ['HTML5', 'CSS3', 'JavaScript'],
    features: [
      'Interactive destination exploration cards with photo previews',
      'Bucket-list wishlist & visited status toggling',
      'Dynamic category filters for beaches, mountains & city breaks',
      'Smooth responsive animations with glassmorphic cards',
      'Direct GitHub Pages deployment for rapid cross-device access',
    ],
    github: 'https://github.com/keerthanaramasamy3001-commits/tr',
    demoUrl: 'https://keerthanaramasamy3001-commits.github.io/tr/',
  },
  'superhero': {
    title: 'My Favorite Superhero',
    subtitle: 'Comics Fan Experience · HTML, CSS & JavaScript',
    icon: '⚡',
    iconBg: 'linear-gradient(135deg, #ef4444, #f59e0b)',
    desc: 'A vibrant superhero fan portal dedicated to legendary comic book heroes. Features rich character profile dossiers, superhuman strength and power stat radars, backstory origins, and an action-packed comic book design language.',
    tags: ['HTML5', 'CSS3', 'JavaScript'],
    features: [
      'Immersive hero showcase with comic-inspired visual themes',
      'Power attributes, superhuman stats, and combat rating gauges',
      'Character backstory, origin lore, and iconic villain rivals',
      'Interactive hero selector with dynamic transitions',
      'Fully responsive UI deployed seamlessly on GitHub Pages',
    ],
    github: 'https://github.com/keerthanaramasamy3001-commits/superhero',
    demoUrl: 'https://keerthanaramasamy3001-commits.github.io/superhero/',
  }
};

function openProjectModal(id) {
  const p = projects[id];
  if (!p) return;

  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalSubtitle').textContent = p.subtitle;
  document.getElementById('modalDesc').textContent = p.desc;

  const icon = document.getElementById('modalIcon');
  icon.textContent = p.icon;
  icon.style.background = p.iconBg;

  const tagsEl = document.getElementById('modalTags');
  tagsEl.innerHTML = p.tags.map(t => `<span>${t}</span>`).join('');

  const featEl = document.getElementById('modalFeatures');
  featEl.innerHTML = p.features.map(f => `<li>${f}</li>`).join('');

  document.getElementById('modalGithub').href = p.github;

  // Render live iframe demo
  const preview = document.getElementById('modalPreview');
  preview.innerHTML = `
    <div class="fake-browser" style="width:100%;height:100%;display:flex;flex-direction:column;">
      <div class="fake-browser-bar">
        <span class="fb-dot" style="background:#ff5f56"></span>
        <span class="fb-dot" style="background:#ffbd2e"></span>
        <span class="fb-dot" style="background:#27c93f"></span>
        <div class="fb-url">${p.demoUrl}</div>
        <a href="${p.demoUrl}" target="_blank" title="Open in new tab" style="color:#9ca3af;text-decoration:none;font-size:0.8rem;padding:0 4px;flex-shrink:0;">↗</a>
      </div>
      <div style="flex:1;position:relative;min-height:320px;">
        <iframe
          src="${p.demoUrl}"
          style="width:100%;height:100%;min-height:320px;border:none;border-radius:0 0 12px 12px;"
          title="${p.title} Demo"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  `;

  const modal = document.getElementById('projectModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  document.getElementById('projectModal').classList.remove('active');
  document.body.style.overflow = '';
}

// Project card click binding
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.project-box').forEach(box => {
    box.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      const pid = box.getAttribute('data-project');
      if (pid && typeof openProjectModal === 'function') {
        openProjectModal(pid);
      }
    });
  });
});

// Project Modal Esc listener
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProjectModal();
  }
});

// Certificate category filtering logic
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.cert-filter');
  const certCards = document.querySelectorAll('.cert-card-light');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter') || 'all';

      certCards.forEach(card => {
        const catAttr = card.getAttribute('data-category') || '';
        const categories = catAttr.trim().split(/\s+/);

        if (filterVal === 'all' || categories.includes(filterVal)) {
          card.classList.remove('hide');
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
          card.style.pointerEvents = 'auto';
        } else {
          card.classList.add('hide');
          card.style.display = 'none';
        }
      });
    });
  });
});
/* ================= CERTIFICATE DATA & MODAL ================= */

const certificateData = {
  "full-stack": {
    title: "Full-Stack Web Development",
    issuer: "Professional Certification",
    file: "certificates/full-stack.svg"
  },
  "dotnet": {
    title: ".NET Framework & C#",
    issuer: "Microsoft Stack / Specialist Certification",
    file: "certificates/dotnet.svg"
  },
  "sql": {
    title: "SQL (Basic & Advanced)",
    issuer: "HackerRank Certified",
    file: "certificates/sql.svg"
  },
  "css": {
    title: "CSS (Cascading Style Sheets)",
    issuer: "HackerRank Certified",
    file: "certificates/css.svg"
  },
  "css-design": {
    title: "CSS (Cascading Style Sheets)",
    issuer: "HackerRank Certified",
    file: "certificates/css.svg"
  },
  "cpp": {
    title: "C++ Programming",
    issuer: "HackerRank Certified",
    file: "certificates/cpp.svg"
  },
  "cpp-programming": {
    title: "C++ Programming",
    issuer: "HackerRank Certified",
    file: "certificates/cpp.svg"
  },
  "javascript": {
    title: "JavaScript (Intermediate / ES6+)",
    issuer: "HackerRank Certified",
    file: "certificates/javascript.svg"
  },
  "javascript-intermediate": {
    title: "JavaScript (Intermediate / ES6+)",
    issuer: "HackerRank Certified",
    file: "certificates/javascript.svg"
  },
  "java": {
    title: "Java (Core & OOP)",
    issuer: "HackerRank Certified",
    file: "certificates/java.svg"
  },
  "java-basic": {
    title: "Java (Core & OOP)",
    issuer: "HackerRank Certified",
    file: "certificates/java.svg"
  },
  "springboot": {
    title: "Spring Boot Framework",
    issuer: "Backend Framework Certification",
    file: "certificates/springboot.svg"
  },
  "springboot-framework": {
    title: "Spring Boot Framework",
    issuer: "Backend Framework Certification",
    file: "certificates/springboot.svg"
  }
};


/* ================= OPEN CERTIFICATE MODAL ================= */

function openCertModal(certificateName) {
  const image = document.getElementById("certificateImage");
  const download = document.getElementById("downloadCertificate");
  const modal = document.getElementById("certificateModal");
  const modalTitle = document.getElementById("modalCertTitle");

  if (!modal || !image) return;

  const cert = certificateData[certificateName];

  if (!cert) {
    console.warn("Certificate not found for:", certificateName);
    return;
  }

  const filePath = typeof cert === "string" ? cert : cert.file;
  const title = (cert && cert.title) ? cert.title : certificateName;

  image.src = filePath;
  image.alt = `${title} Certificate — R Keerthana`;

  if (modalTitle) {
    modalTitle.textContent = title;
  }

  if (download) {
    download.href = filePath;
    download.setAttribute("download", `Keerthana_R_${certificateName.replace(/[^a-zA-Z0-9_-]/g, '_')}_Certificate.svg`);
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}


/* ================= CLOSE CERTIFICATE MODAL ================= */

function closeCertModal() {
  const modal = document.getElementById("certificateModal");
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
}


/* ================= CLICK OUTSIDE & ESC KEY ================= */

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("certificateModal");
  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === this) {
        closeCertModal();
      }
    });
  }

  // Bind card clicks so clicking anywhere on the card opens the certificate
  document.querySelectorAll(".cert-card-light").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      const btn = card.querySelector(".cert-view-btn");
      if (btn) btn.click();
    });
  });
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeCertModal();
  }
});


/* ================= PRINT CERTIFICATE ================= */

function printCertificate() {
  const image = document.getElementById("certificateImage");
  if (!image || !image.src) return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Certificate — R Keerthana</title>
      <style>
        @page { size: landscape; margin: 0; }
        body {
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #030712;
        }
        img {
          width: 100vw;
          max-height: 100vh;
          object-fit: contain;
        }
      </style>
    </head>
    <body>
      <img src="${image.src}" alt="Certificate">
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.onload = function () {
    printWindow.focus();
    printWindow.print();
  };
}


/* =========================================================
   NEW GOLD NAVBAR / HERO BEHAVIOR (added per user request)
========================================================= */
(function () {
  const goldMenuBtn = document.querySelector(".menu-btn");
  const goldNavLinks = document.querySelector(".nav-links");

  if (goldMenuBtn && goldNavLinks) {
    goldMenuBtn.addEventListener("click", () => {
      goldNavLinks.classList.toggle("show");
    });

    goldNavLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        goldNavLinks.classList.remove("show");
      });
    });
  }

  // Interactive Ambient Background & Mouse Parallax on Hero Section
  const homeSection = document.querySelector("section.home");
  const photoFrame = document.querySelector(".photo-circle-frame");
  const badgeTopLeft = document.querySelector(".badge-top-left");
  const badgeBottomLeft = document.querySelector(".badge-bottom-left");
  const badgeBottomRight = document.querySelector(".badge-bottom-right");

  if (homeSection) {
    let ticking = false;

    window.addEventListener("mousemove", (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = homeSection.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          homeSection.style.setProperty("--mouse-x", `${mouseX}px`);
          homeSection.style.setProperty("--mouse-y", `${mouseY}px`);

          if (window.innerWidth > 900) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const tiltX = (e.clientX - centerX) / centerX;
            const tiltY = (e.clientY - centerY) / centerY;

            if (photoFrame) {
              photoFrame.style.transform = `translate3d(${tiltX * 8}px, ${tiltY * 8}px, 0)`;
            }
            if (badgeTopLeft) {
              badgeTopLeft.style.transform = `translate3d(${tiltX * -14}px, ${tiltY * -12}px, 0)`;
            }
            if (badgeBottomLeft) {
              badgeBottomLeft.style.transform = `translate3d(${tiltX * 12}px, ${tiltY * 14}px, 0)`;
            }
            if (badgeBottomRight) {
              badgeBottomRight.style.transform = `translate3d(${tiltX * -10}px, ${tiltY * 12}px, 0)`;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    });

    homeSection.addEventListener("mouseleave", () => {
      if (photoFrame) photoFrame.style.transform = "translate3d(0, 0, 0)";
      if (badgeTopLeft) badgeTopLeft.style.transform = "translate3d(0, 0, 0)";
      if (badgeBottomLeft) badgeBottomLeft.style.transform = "translate3d(0, 0, 0)";
      if (badgeBottomRight) badgeBottomRight.style.transform = "translate3d(0, 0, 0)";
    });
  }
})();

/* =========================================================
   CYBER PARTICLE CANVAS NETWORK & CURSOR (Anandharaman Style)
========================================================= */
(function () {
  // 1. Particle Canvas Network
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 16), 85);
    const mouse = { x: null, y: null, radius: 160 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.4 ? 'rgba(6, 182, 212, 0.7)' : 'rgba(59, 130, 246, 0.7)';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 2;
            this.y -= (dy / dist) * force * 2;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect particles with cyan/blue lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // 2. Custom Pointer Cursor & Ring Follower
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');

  if (cursor && follower) {
    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function loop() {
      posX += (mouseX - posX) * 0.15;
      posY += (mouseY - posY) * 0.15;
      follower.style.left = posX + 'px';
      follower.style.top = posY + 'px';
      requestAnimationFrame(loop);
    }
    loop();

    // Enlarge cursor on interactive links/buttons
    document.querySelectorAll('a, button, .tech-card, .project-card, .cert-card, .cert-card-light').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(2.2)';
        cursor.style.backgroundColor = 'rgba(6, 182, 212, 0.9)';
        follower.style.transform = 'translate(-50%, -50%) scale(1.6)';
        follower.style.borderColor = 'rgba(99, 102, 241, 0.9)';
      });

      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.backgroundColor = '#06b6d4';
        follower.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.borderColor = '#06b6d4';
      });
    });
  }
})();

/* =========================================================
   FAQ ACCORDION INTERACTIVITY
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items
      faqItems.forEach((other) => {
        other.classList.remove('active');
        const btn = other.querySelector('.faq-toggle-btn');
        if (btn) btn.textContent = '+';
      });

      // Toggle current item
      if (!isOpen) {
        item.classList.add('active');
        const btn = item.querySelector('.faq-toggle-btn');
        if (btn) btn.textContent = '×';
      }
    });
  });
});

/* =========================================================
   INTERACTIVE ANIMATED BACKGROUND PARTICLE & MOUSE ENGINE
========================================================= */
(function () {
  const canvas = document.getElementById('ambient-particles-canvas');
  const mouseGlow = document.getElementById('mouse-ambient-glow');
  const heroSection = document.querySelector('section.home');
  const mouseMesh = document.getElementById('hero-mouse-mesh');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;
  let animationId = null;

  // Particle Settings
  const particles = [];
  const particleCount = window.innerWidth < 768 ? 32 : 62;
  const maxConnectDist = 125;
  const mouseRadius = 155;

  // Mouse State
  const mouse = {
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    active: false,
    lerpX: -9999,
    lerpY: -9999
  };

  // Shockwaves on click
  const shockwaves = [];

  // Theme Colors: Royal Indigo & Electric Violet
  const colors = [
    { r: 79, g: 70, b: 229 },   // Royal Indigo #4f46e5
    { r: 124, g: 58, b: 237 },  // Electric Violet #7c3aed
    { r: 99, g: 102, b: 241 }   // Soft Indigo
  ];

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  function createParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        radius: Math.random() * 1.8 + 1.4,
        color: color,
        baseAlpha: Math.random() * 0.3 + 0.35,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.025 + Math.random() * 0.02
      });
    }
  }

  // Mouse Move listener (Global)
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;

    if (mouseGlow) {
      mouseGlow.style.opacity = '1';
    }

    // Hero mouse mesh coordinates
    if (heroSection && mouseMesh) {
      const rect = heroSection.getBoundingClientRect();
      const hx = e.clientX - rect.left;
      const hy = e.clientY - rect.top;
      mouseMesh.style.setProperty('--mouse-x', `${hx}px`);
      mouseMesh.style.setProperty('--mouse-y', `${hy}px`);
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
    if (mouseGlow) {
      mouseGlow.style.opacity = '0';
    }
    if (mouseMesh) {
      mouseMesh.style.setProperty('--mouse-x', '50%');
      mouseMesh.style.setProperty('--mouse-y', '50%');
    }
  });

  // Touch Support
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
      if (mouseGlow) mouseGlow.style.opacity = '0.7';
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
    if (mouseGlow) mouseGlow.style.opacity = '0';
  });

  // Click shockwave ripple
  window.addEventListener('click', (e) => {
    shockwaves.push({
      x: e.clientX,
      y: e.clientY,
      radius: 5,
      maxRadius: 180,
      alpha: 0.5
    });
  });

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update Mouse Glow with smooth Lerp
    if (mouse.active && mouseGlow) {
      if (mouse.lerpX === -9999) {
        mouse.lerpX = mouse.x;
        mouse.lerpY = mouse.y;
      } else {
        mouse.lerpX += (mouse.x - mouse.lerpX) * 0.18;
        mouse.lerpY += (mouse.y - mouse.lerpY) * 0.18;
      }
      mouseGlow.style.left = `${mouse.lerpX}px`;
      mouseGlow.style.top = `${mouse.lerpY}px`;
    }

    // Process and draw shockwaves
    for (let s = shockwaves.length - 1; s >= 0; s--) {
      const sw = shockwaves[s];
      sw.radius += 5;
      sw.alpha *= 0.94;

      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(124, 58, 237, ${sw.alpha * 0.5})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Push particles touched by shockwave
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.x - sw.x;
        const dy = p.y - sw.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (Math.abs(dist - sw.radius) < 25 && dist > 0) {
          p.x += (dx / dist) * 3;
          p.y += (dy / dist) * 3;
        }
      }

      if (sw.alpha < 0.02 || sw.radius >= sw.maxRadius) {
        shockwaves.splice(s, 1);
      }
    }

    // Update & Draw Particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Wrap-around screen bounds
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      // Pulse alpha & radius
      p.pulsePhase += p.pulseSpeed;
      const pulseFactor = Math.sin(p.pulsePhase) * 0.2 + 1;
      const currentRadius = p.radius * pulseFactor;
      const currentAlpha = Math.min(1, Math.max(0.1, p.baseAlpha * (0.8 + 0.2 * Math.sin(p.pulsePhase))));

      // Mouse interaction (gentle elastic repulsion)
      if (mouse.active) {
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < mouseRadius && mdist > 0) {
          const force = (mouseRadius - mdist) / mouseRadius;
          const angle = Math.atan2(mdy, mdx);
          p.x += Math.cos(angle) * force * 1.8;
          p.y += Math.sin(angle) * force * 1.8;

          // Draw laser line to mouse
          const lineAlpha = (1 - mdist / mouseRadius) * 0.38;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${lineAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      // Draw particle node
      ctx.beginPath();
      ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha})`;
      ctx.fill();

      // Soft glow ring
      ctx.beginPath();
      ctx.arc(p.x, p.y, currentRadius * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha * 0.2})`;
      ctx.fill();
    }

    // Connect close particles with constellation lines
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxConnectDist) {
          const alpha = (1 - dist / maxConnectDist) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  // Handle Resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      createParticles();
    }, 150);
  });

  // Pause when tab not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationId) cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });

  // Initialize
  resizeCanvas();
  createParticles();
  animate();
})();




