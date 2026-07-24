// ============================================================
// Página principal — contador em tempo real, carrossel de fotos,
// player de áudio simples e interação da lista de sonhos
// ============================================================

/* -------------------- 1. CONTADOR REAL -------------------- */
// Data/hora de início lida do atributo data-start do HTML
const counterEl = document.getElementById('counter');
const startDate = new Date(counterEl.dataset.start); // ex: 2026-05-16T16:30:00

function updateCounter() {
  const now = new Date();

  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();
  let hours = now.getHours() - startDate.getHours();
  let minutes = now.getMinutes() - startDate.getMinutes();
  let seconds = now.getSeconds() - startDate.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }
  if (days < 0) {
    // dias do mês anterior ao mês atual
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
    months--;
  }
  if (months < 0) { months += 12; years--; }

  const totalMonths = years * 12 + months;

  // Se a data ainda não chegou, zera tudo (evita números negativos)
  if (now < startDate) {
    setCounterValues(0, 0, 0, 0, 0);
    return;
  }

  setCounterValues(totalMonths, days, hours, minutes, seconds);
}

function setCounterValues(months, days, hours, minutes, seconds) {
  document.getElementById('c-months').textContent = months;
  document.getElementById('c-days').textContent = days;
  document.getElementById('c-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('c-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('c-seconds').textContent = String(seconds).padStart(2, '0');
}

updateCounter();
setInterval(updateCounter, 1000);


/* -------------------- 2. CARROSSEL DE FOTOS -------------------- */
const swiper = new Swiper('.fotos-swiper', {
  direction: 'horizontal',
  slidesPerView: 2,
  loop: true,
  freemode: true,
  speed: 2000,

  autoplay: {
    delay: 0,
    disableOnInteraction: false,
  },
});


/* -------------------- 3. PLAYER DE ÁUDIO -------------------- */
// Funciona automaticamente assim que você adicionar o <source src="..."> no HTML
document.querySelectorAll('[data-audio-player]').forEach((player) => {
  const btn = player.querySelector('.audio-play-btn');
  const audio = player.querySelector('audio');
  const iconPlay = player.querySelector('.icon-play');
  const iconPause = player.querySelector('.icon-pause');
  const fill = player.querySelector('.audio-progress-fill');

  btn.addEventListener('click', () => {
    if (!audio.src) return; // nenhuma música adicionada ainda

    if (audio.paused) {
      audio.play();
      iconPlay.hidden = true;
      iconPause.hidden = false;
    } else {
      audio.pause();
      iconPlay.hidden = false;
      iconPause.hidden = true;
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    fill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
  });

  audio.addEventListener('ended', () => {
    iconPlay.hidden = false;
    iconPause.hidden = true;
    fill.style.width = '0%';
  });
});


/* -------------------- 4. LISTA DE SONHOS -------------------- */
// Clicar no coração marca/desmarca o item como realizado.
// O estado fica salvo no navegador (localStorage) para persistir depois de recarregar a página.
const wishItems = document.querySelectorAll('.wish-item');

wishItems.forEach((item, index) => {
  const key = `sonho-${index}`;
  const heart = item.querySelector('.wish-heart');
  const status = item.querySelector('.wish-status');

  // recupera estado salvo
  const saved = localStorage.getItem(key);
  if (saved === 'true') setWishState(item, heart, status, true);

  heart.addEventListener('click', () => {
    const isDone = item.dataset.done === 'true';
    setWishState(item, heart, status, !isDone);
    localStorage.setItem(key, String(!isDone));
  });
});

function setWishState(item, heart, status, done) {
  item.dataset.done = String(done);
  heart.innerHTML = done ? '&#10084;' : '&#9825;'; // coração cheio ou vazio
  status.innerHTML = done ? '&#10003;' : '&#10005;'; // check ou x
}
