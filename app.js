document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('confirm-btn');
  const message = document.getElementById('confirmation-message');

const today = new Date();
const todayKey = today.toISOString().split('T')[0]; // pour la clé localeStorage
const formattedDate = today.toLocaleDateString('fr-FR', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

  const takenToday = localStorage.getItem('taken-' + todayKey);
  if (takenToday === 'yes') {
    btn.classList.add('clicked');
    btn.textContent = '✅ Oui !';
    message.textContent = `Médicaments pris le ${formattedDate}.`;


  btn.addEventListener('click', () => {
    localStorage.setItem('taken-' + todayKey, 'yes');
    btn.classList.add('clicked');
    btn.textContent = '✅ Oui !';
   message.textContent = `Médicaments pris le ${formattedDate}.`;

  });
});
