/* Bootstrap handles tabs, dialogs, the gallery and the beginner guide. */
(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const intro = document.querySelector('.sunset-intro');
  let introSeen = false;
  try { introSeen = sessionStorage.getItem('club-intro-seen') === 'yes'; } catch { /* Storage may be unavailable. */ }
  if (intro && !reducedMotion && !introSeen) {
    try { sessionStorage.setItem('club-intro-seen', 'yes'); } catch { /* Keep the page usable. */ }
    document.body.classList.add('sunset-playing');
    intro.addEventListener('animationend', event => {
      if (event.animationName === 'intro-out') document.body.classList.remove('sunset-playing');
    });
  }
  const count = document.querySelector('#playerCount');
  const total = document.querySelector('#totalCost');
  const currency = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
  count?.addEventListener('change', () => {
    total.textContent = currency.format(Number(count.value) * 1200);
  });

  document.querySelector('#photoModal')?.addEventListener('show.bs.modal', event => {
    const trigger = event.relatedTarget;
    if (!trigger?.dataset.photo) return;
    const photo = document.querySelector('#expandedPhoto');
    photo.src = trigger.dataset.photo;
    photo.alt = trigger.querySelector('img').alt;
    document.querySelector('#photoTitle').textContent = trigger.dataset.caption;
  });

  // Content remains visible when JS, the observer or motion support is unavailable.
  if (!('IntersectionObserver' in window) || reducedMotion) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('reveal');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('#formats .col-lg-5, #formats .col-lg-7, #evening li, #company .col-lg-6, #company .col-lg-5, #faq .col-lg-4, #faq .accordion-item').forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${index % 4 * 70}ms`);
    observer.observe(element);
  });
})();
