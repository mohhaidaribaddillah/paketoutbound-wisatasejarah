/* ============================================
   Gemilang Katun Outbound - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ===========================
  // 1. SIDEBAR MOBILE TOGGLE
  // ===========================
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  function openSidebar() {
    sidebar.classList.add('open');
    menuToggle.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    menuToggle.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // Close sidebar when clicking nav links on mobile
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
  sidebarLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });

  // Close sidebar on ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeSidebar();
    }
  });

  // ===========================
  // 2. SCROLL TO TOP BUTTON
  // ===========================
  const scrollTopBtn = document.getElementById('scrollTop');

  function toggleScrollTop() {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  if (scrollTopBtn) {
    window.addEventListener('scroll', toggleScrollTop, { passive: true });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===========================
  // 3. SMOOTH SCROLL FOR ANCHOR LINKS
  // ===========================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===========================
  // 4. ANIMATE ON SCROLL (Intersection Observer)
  // ===========================
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    animateElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ===========================
  // 5. COUNTER ANIMATION (Stats)
  // ===========================
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * (target - start) + start);

      if (target >= 1000) {
        el.textContent = current.toLocaleString('id-ID') + '+';
      } else {
        el.textContent = current + (target === 98 ? '%' : '+');
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const numbers = entry.target.querySelectorAll('.stat-number[data-target]');
          numbers.forEach(function (num) {
            animateCounter(num);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
      statsObserver.observe(statsGrid);
    }
  }

  // ===========================
  // 6. ACTIVE NAV LINK HIGHLIGHT
  // ===========================
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');

    let current = '';

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 200;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ===========================
  // 7. PREVENT HORIZONTAL SCROLL (Mobile Safety)
  // ===========================
  function preventHorizontalScroll() {
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
  }

  preventHorizontalScroll();

  // Re-apply on resize
  window.addEventListener('resize', function () {
    preventHorizontalScroll();
    // Close sidebar if resizing above mobile breakpoint
    if (window.innerWidth > 768) {
      closeSidebar();
    }
  });

  // ===========================
  // 8. LAZY LOAD IMAGES (Native fallback)
  // ===========================
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  }

  // ===========================
  // 9. STAGGER ANIMATION DELAYS
  // ===========================
  const featureCards = document.querySelectorAll('.feature-card.animate-on-scroll');
  featureCards.forEach(function (card, index) {
    card.style.transitionDelay = (index * 0.1) + 's';
  });

  const blogCards = document.querySelectorAll('.blog-card.animate-on-scroll');
  blogCards.forEach(function (card, index) {
    card.style.transitionDelay = (index * 0.1) + 's';
  });

  const testimonialCards = document.querySelectorAll('.testimonial-card.animate-on-scroll');
  testimonialCards.forEach(function (card, index) {
    card.style.transitionDelay = (index * 0.15) + 's';
  });

  // ===========================
  // 10. SIDEBAR CTA BUTTON PULSE ON SCROLL
  // ===========================
  const sidebarCta = document.querySelector('.sidebar-cta a');
  let ctaPulsed = false;

  window.addEventListener('scroll', function () {
    if (!ctaPulsed && window.scrollY > 600) {
      if (sidebarCta) {
        sidebarCta.style.animation = 'pulse-cta 0.6s ease';
        ctaPulsed = true;
        setTimeout(function () {
          sidebarCta.style.animation = '';
        }, 600);
      }
    }
  }, { passive: true });

  // ===========================
  // 11. TOC AUTO GENERATE & TOGGLE
  // ===========================
  const tocBody = document.querySelector('.toc-body');
  const tocHeader = document.querySelector('.toc-header');
  const tocToggle = document.querySelector('.toc-toggle');
  const tocList = document.querySelector('.toc-list');

  if (tocList && tocBody) {
    // Auto-generate TOC from article H2 and H3
    const articleBody = document.querySelector('.article-body');
    if (articleBody) {
      const headings = articleBody.querySelectorAll('h2, h3');
      headings.forEach(function (heading, index) {
        const id = 'section-' + index;
        heading.setAttribute('id', id);

        const li = document.createElement('li');
        if (heading.tagName === 'H3') {
          li.classList.add('toc-h3');
        }
        const a = document.createElement('a');
        a.setAttribute('href', '#' + id);
        a.textContent = heading.textContent;
        li.appendChild(a);
        tocList.appendChild(li);
      });
    }

    // Toggle TOC
    if (tocHeader) {
      tocHeader.addEventListener('click', function () {
        tocBody.classList.toggle('collapsed');
        if (tocToggle) {
          tocToggle.classList.toggle('collapsed');
        }
      });
    }
  }

  // ===========================
  // 12. FAQ ACCORDION
  // ===========================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function () {
        const isActive = item.classList.contains('active');

        // Close all FAQ items
        faqItems.forEach(function (fi) {
          fi.classList.remove('active');
        });

        // Open clicked if not already active
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ===========================
  // 13. SHARE BUTTONS FUNCTIONALITY
  // ===========================
  const shareButtons = document.querySelectorAll('.share-btn');

  shareButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      const pageUrl = encodeURIComponent(window.location.href);
      const pageTitle = encodeURIComponent(document.title);
      let shareUrl = '';

      if (btn.classList.contains('whatsapp')) {
        shareUrl = 'https://wa.me/?text=' + pageTitle + '%20' + pageUrl;
      } else if (btn.classList.contains('facebook')) {
        shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + pageUrl;
      } else if (btn.classList.contains('twitter')) {
        shareUrl = 'https://twitter.com/intent/tweet?text=' + pageTitle + '&url=' + pageUrl;
      } else if (btn.classList.contains('linkedin')) {
        shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + pageUrl;
      } else if (btn.classList.contains('copy-link')) {
        navigator.clipboard.writeText(window.location.href).then(function () {
          var originalHtml = btn.innerHTML;
          btn.innerHTML = '<i class="bi bi-check2"></i> <span>Tersalin!</span>';
          setTimeout(function () {
            btn.innerHTML = originalHtml;
          }, 2000);
        });
        return;
      }

      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
    });
  });

  // ===========================
  // 14. PROMO BANNER CLICK TO WA
  // ===========================
  const promoBanners = document.querySelectorAll('.promo-banner');
  promoBanners.forEach(function (banner) {
    banner.addEventListener('click', function () {
      window.open('https://wa.me/6282211221909?text=Halo%20Gemilang%20Katun%20Outbound%2C%20saya%20tertarik%20dengan%20paket%20outbound.', '_blank');
    });
  });

});
