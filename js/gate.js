// ============================================================
// Tela de entrada — valida a data "secreta" no formato DDMMAAAA
// ============================================================

// TROQUE aqui pela data correta de vocês
const CORRECT_DATE = { day: 16, month: 5, year: 2026 };

const form = document.getElementById('gate-form');
const input = document.getElementById('date-input');
const errorMsg = document.getElementById('gate-error');

// Permite digitar apenas números
input.addEventListener('input', () => {
  input.value = input.value.replace(/\D/g, '').slice(0, 8);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const value = input.value.trim();

  if (value.length !== 8) {
    showError();
    return;
  }

  const day = parseInt(value.slice(0, 2), 10);
  const month = parseInt(value.slice(2, 4), 10);
  const year = parseInt(value.slice(4, 8), 10);

  if (day === CORRECT_DATE.day && month === CORRECT_DATE.month && year === CORRECT_DATE.year) {
    // guarda que a pessoa já entrou, para não pedir de novo nesta sessão
    sessionStorage.setItem('entrou', 'sim');
    window.location.href = 'home.html';
    errorMsg.hidden = true;
  } else {
    showError();
  }
});

function showError() {
  errorMsg.hidden = false;
  input.classList.add('shake');
  setTimeout(() => input.classList.remove('shake'), 400);
}
