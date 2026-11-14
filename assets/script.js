(function () {
  var SERVICES = ['Web platforms', 'Mobile apps', 'Cloud and DevOps', 'Growth engineering'];

  var reduceMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('ds-motion');

    var candidates = [];
    function mark(el, variant, delay) {
      if (!el || el.hasAttribute('data-reveal')) return;
      el.setAttribute('data-reveal', variant || 'rise');
      if (delay) el.style.setProperty('--ds-delay', delay + 'ms');
      candidates.push(el);
    }

    var main = document.getElementById('main-content') || document.querySelector('main');
    if (main) {
      var hero = main.querySelector(':scope > section');

      if (hero) {
        Array.prototype.forEach.call(hero.children, function (el, i) {
          mark(el, 'rise', Math.min(i, 4) * 80);
        });
      }

      Array.prototype.forEach.call(main.querySelectorAll(':scope > section'), function (section) {
        if (section === hero) return;
        mark(section, 'rise');
        Array.prototype.forEach.call(section.querySelectorAll('article, .blog-card'), function (card, i) {
          mark(card, 'card', Math.min(i, 6) * 70);
        });
      });

      Array.prototype.forEach.call(main.querySelectorAll('.article-body img, .article-body figure'), function (el) {
        mark(el, 'image');
      });
    }

    if (candidates.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
            window.setTimeout(function () {
              entry.target.classList.add('is-settled');
            }, 1100);
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
      candidates.forEach(function (el) { observer.observe(el); });
    }
  }

  var toggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.getElementById('mobile-navigation');
  var menuIcon = toggle ? toggle.querySelector('.lucide-menu') : null;
  var closeIcon = toggle ? toggle.querySelector('[data-close-icon]') : null;

  function setOpen(open) {
    if (!toggle || !mobileNav) return;
    mobileNav.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    if (menuIcon) menuIcon.classList.toggle('hidden', open);
    if (closeIcon) closeIcon.classList.toggle('hidden', !open);
  }

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      setOpen(mobileNav.hidden);
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setOpen(false);
    });
  }

  var status = document.querySelector('[data-status-service]');
  if (status) {
    var index = 0;
    setInterval(function () {
      index = (index + 1) % SERVICES.length;
      status.textContent = SERVICES[index];
      status.classList.remove('is-swapping');
      void status.offsetWidth;
      status.classList.add('is-swapping');
    }, 2600);
  }

  var HERO_FRAMES = [
    { lead: 'Software that ships on time and stays', word: 'running', tail: '.' },
    { lead: 'Digital products designed, built and', word: 'shipped', tail: ' on schedule.' },
    { lead: 'Systems that are still', word: 'supported', tail: ' years later.' },
    { lead: 'Platforms that keep', word: 'evolving', tail: ' as you grow.' }
  ];

  var rotator = document.querySelector('[data-hero-rotator]');
  var heroTrack = rotator ? rotator.querySelector('[data-hero-track]') : null;
  var heroLead = rotator ? rotator.querySelector('[data-hero-lead]') : null;
  var heroTail = rotator ? rotator.querySelector('[data-hero-tail]') : null;

  if (rotator && heroTrack && heroLead && heroTail && !reduceMotion &&
      heroTrack.children.length === HERO_FRAMES.length + 1) {
    var heroIndex = 0;
    var heroH1 = rotator.closest('h1');

    var reserveHeroHeight = function () {
      if (!heroH1) return;
      var measured = heroH1.offsetHeight;
      var previous = parseFloat(heroH1.style.minHeight) || 0;
      heroH1.style.minHeight = Math.max(measured, previous) + 'px';
    };
    reserveHeroHeight();
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      document.fonts.ready.then(function () {
        if (heroIndex === 0) reserveHeroHeight();
      });
    }

    window.setInterval(function () {
      var next = (heroIndex + 1) % HERO_FRAMES.length;
      var wrap = next === 0;
      var displayIndex = wrap ? HERO_FRAMES.length : next;

      rotator.classList.add('is-changing');

      window.setTimeout(function () {
        heroIndex = next;
        heroLead.textContent = HERO_FRAMES[next].lead;
        heroTail.textContent = HERO_FRAMES[next].tail;
        heroTrack.style.setProperty('--hero-index', displayIndex);
        rotator.classList.remove('is-changing');

        if (wrap) {
          window.setTimeout(function () {
            heroTrack.style.transition = 'none';
            heroTrack.style.setProperty('--hero-index', 0);
            void heroTrack.offsetHeight;
            heroTrack.style.transition = '';
          }, 700);
        }
      }, 300);
    }, 3200);
  }

  document.querySelectorAll('[data-quote-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var lines = [];
      data.forEach(function (value, key) {
        if (String(value).trim()) lines.push(key + ': ' + value);
      });
      var name = (data.get('First Name') || '') + ' ' + (data.get('Last Name') || '');
      var subject = (form.getAttribute('data-subject') || 'Custom quote request') + (name.trim() ? ' - ' + name.trim() : '');
      window.location.href = 'mailto:hello@digiservice.pk?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
    });
  });
})();
