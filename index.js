
const email = document.getElementById('email');
const emailError = document.getElementById('emailError');
const button = document.getElementById('button');

if (button) {
  button.addEventListener('click', function () {
    if (!email || !email.value.trim()) {
      if (emailError) {
        emailError.textContent = 'Enter your email.';
        emailError.style.color = '#2c063e';
      }
      return;
    }
    window.location.href = 'feedback.html';
  });
}

const video = document.querySelector('.video-container video');

if (video) {
  video.muted = true;
  video.controls = false;
  video.loop = true;
  video.addEventListener('ended', () => {
    video.currentTime = 0;
    video.play().catch(() => {});
  });
  video.play().catch(() => {});
}

// Perfume slideshow: slide-in-from-right, one after another
(() => {
  const container = document.querySelector('.perfume-slideshow .slideshow');
  if (!container) return;

  const slides = Array.from(container.querySelectorAll('.slide'));
  const dots = Array.from(container.querySelectorAll('.dot'));
  let current = slides.findIndex(s => s.classList.contains('active'));
  if (current === -1) current = 0;
  const intervalMs = 3800;
  let timer = null;

  function goTo(index) {
    if (index === current) return;
    const prev = slides[current];
    const next = slides[index];

    // mark classes to trigger CSS transitions
    prev.classList.remove('active');
    prev.classList.add('prev');

    next.classList.add('active');

    dots[current]?.classList.remove('active');
    dots[index]?.classList.add('active');

    // cleanup previous after animation
    setTimeout(() => prev.classList.remove('prev'), 850);
    current = index;
  }

  function nextSlide() { goTo((current + 1) % slides.length); }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goTo(idx);
      timer = setInterval(nextSlide, intervalMs);
    });
  });

  timer = setInterval(nextSlide, intervalMs);
})();