document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('confirm-btn');
  const message = document.getElementById('confirmation-message');

  const today = new Date();
  const todayKey = today.toISOString().split('T')[0]; // clé pour localStorage

  // Date formatée en français
  const formattedDate = today.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Vérifie si le médicament a déjà été pris aujourd’hui
  const takenToday = localStorage.getItem('taken-' + todayKey);
  if (takenToday === 'yes') {
    btn.classList.add('clicked');
    btn.textContent = '✅ Oui !';
    message.textContent = `Médicaments pris le ${formattedDate}.`;
  }

  // Gère le clic sur le bouton
  btn.addEventListener('click', () => {
    localStorage.setItem('taken-' + todayKey, 'yes');
    btn.classList.add('clicked');
    btn.textContent = '✅ Oui !';
    message.textContent = `Médicaments pris le ${formattedDate}.`;
  });
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').then(reg => {
    reg.update(); // 🔁 force l'update du SW au démarrage
  });
}

