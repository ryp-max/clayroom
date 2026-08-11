document.addEventListener('DOMContentLoaded', function () {

  // Mobile menu toggle
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
      var open = document.body.classList.contains('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      document.body.classList.remove('nav-open');
    });
  });

  // Nav pill gains contrast once the page scrolls
  var navEl = document.querySelector('.site-nav');
  if (navEl) {
    var onScroll = function () {
      navEl.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Reveal-on-scroll
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in-view'); });
    }
  }

  // Medium toggle + studio picker filter
  var mediumToggle = document.querySelector('.medium-toggle');
  if (mediumToggle) {
    var indicator = mediumToggle.querySelector('.medium-indicator');
    var buttons = Array.prototype.slice.call(mediumToggle.querySelectorAll('.medium-btn'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.studio-pick-card'));

    var positionIndicator = function (btn) {
      indicator.style.width = btn.offsetWidth + 'px';
      indicator.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
    };

    var setMedium = function (medium, btn) {
      buttons.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      positionIndicator(btn);
      cards.forEach(function (card, i) {
        var mediums = (card.dataset.medium || '').split(' ');
        var matches = mediums.indexOf(medium) !== -1;
        if (matches) {
          card.style.display = 'flex';
          card.style.transitionDelay = (i * 45) + 'ms';
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { card.classList.remove('is-hidden'); });
          });
        } else {
          card.style.transitionDelay = '0ms';
          card.classList.add('is-hidden');
          setTimeout(function () {
            if (card.classList.contains('is-hidden')) card.style.display = 'none';
          }, 320);
        }
      });
    };

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () { setMedium(btn.dataset.medium, btn); });
    });

    var activeBtn = mediumToggle.querySelector('.medium-btn.is-active') || buttons[0];
    requestAnimationFrame(function () { positionIndicator(activeBtn); });
    window.addEventListener('resize', function () {
      var current = mediumToggle.querySelector('.medium-btn.is-active');
      if (current) positionIndicator(current);
    });
  }

});
