(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const partnerKey = 'oda_p';
  let partner = new URLSearchParams(location.search).get('p');
  const validPartner = value => typeof value === 'string' && /^[a-z0-9_-]{1,48}$/i.test(value);
  try {
    if (validPartner(partner)) {
      localStorage.setItem(partnerKey, JSON.stringify({c: partner, t: Date.now()}));
    } else {
      const saved = JSON.parse(localStorage.getItem(partnerKey) || 'null');
      partner = saved && Date.now() - saved.t < 30 * 86400000 && validPartner(saved.c) ? saved.c : null;
    }
  } catch {
    partner = validPartner(partner) ? partner : null;
  }

  document.querySelectorAll('[data-intent]').forEach(link => {
    let message = 'Дмитрий, здравствуйте! Хочу обсудить ' + link.dataset.intent + '.';
    if (partner) message += ' Пришёл по рекомендации: ' + partner + '.';
    link.href = 'https://t.me/osipda?text=' + encodeURIComponent(message);
  });

  document.querySelectorAll('video').forEach(video => {
    video.addEventListener('play', () => {
      document.querySelectorAll('video').forEach(other => {
        if (other !== video) other.pause();
      });
    });
  });

  const revealTargets = document.querySelectorAll('.steps article, .pair article, .rates article, .feature, .about');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.animate([
          {opacity: .5, transform: 'translateY(20px)'},
          {opacity: 1, transform: 'translateY(0)'}
        ], {duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)'});
        observer.unobserve(entry.target);
      });
    }, {threshold: .15});
    revealTargets.forEach(target => observer.observe(target));
  }

  const artwork = document.querySelector('.hero-art');
  const crystal = artwork.querySelector('img');
  artwork.addEventListener('pointermove', event => {
    if (reducedMotion.matches || event.pointerType !== 'mouse') return;
    const bounds = artwork.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    crystal.style.transform = 'perspective(900px) rotateY(' + x * 5 + 'deg) rotateX(' + -y * 5 + 'deg) scale(1.015)';
  });
  artwork.addEventListener('pointerleave', () => { crystal.style.transform = ''; });
})();
