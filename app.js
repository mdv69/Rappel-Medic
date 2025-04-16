document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('confirm-btn');
  const message = document.getElementById('confirmation-message');
  const todayDate = document.getElementById('today-date');

  const todayKey = new Date().toISOString().split('T')[0];
  todayDate.textContent = `Nous sommes le ${todayKey}`;

  const takenToday = localStorage.getItem('taken-' + todayKey);
  if (takenToday === 'yes') {
    btn.classList.add('clicked');
    btn.textContent = '✅ Oui !';
    message.textContent = `Médicaments pris le ${todayKey}.`;
  }

  btn.addEventListener('click', () => {
    localStorage.setItem('taken-' + todayKey, 'yes');
    btn.classList.add('clicked');
    btn.textContent = '✅ Oui !';
    message.textContent = `Médicaments pris le ${todayKey}.`;
  });
});
