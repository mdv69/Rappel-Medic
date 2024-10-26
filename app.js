// Enregistrer le Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
  .then((registration) => {
    console.log('Service Worker enregistré avec succès:', registration);
  })
  .catch((error) => {
    console.log('Erreur lors de l\'enregistrement du Service Worker:', error);
  });
}

// Demander la permission pour les notifications
if ('Notification' in window) {
  Notification.requestPermission()
  .then((permission) => {
    if (permission === 'granted') {
      scheduleDailyNotification();
    } else {
      alert('Les notifications sont désactivées. Vous ne recevrez pas de rappels.');
    }
  });
}

function scheduleDailyNotification() {
  // Ici, nous utilisons setTimeout pour la démonstration.
  // Pour une notification quotidienne réelle, vous devrez utiliser une technique côté serveur ou une API plus avancée.
  setTimeout(() => {
    showNotification();
  }, 5000); // Notification après 5 secondes pour le test
}

function showNotification() {
  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification('Rappel Médicaments', {
      body: 'Il est temps de prendre vos médicaments.',
      icon: 'icons/icon-192.png',
      tag: 'rappel-medicaments' // Permet de remplacer la notification précédente si elle existe
    });
  });
}

// Sélection des éléments
const confirmBtn = document.getElementById('confirm-btn');
const confirmationMessage = document.getElementById('confirmation-message');
const photoBtn = document.getElementById('photo-btn');
const mediaArea = document.getElementById('media-area');

// Fonction pour obtenir la date du jour au format 'YYYY-MM-DD'
function getTodayDateKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Fonction pour vérifier l'état de la prise
function checkMedicationStatus() {
  const today = getTodayDateKey();
  const status = localStorage.getItem(today);

  if (status === 'pris') {
    confirmationMessage.textContent = `✅ Vous avez déjà pris vos médicaments aujourd'hui (${today}).`;
  } else {
    confirmationMessage.textContent = `❗ Vous n'avez pas encore pris vos médicaments aujourd'hui.`;
  }
}

// Événement lors du clic sur le bouton de confirmation
confirmBtn.addEventListener('click', () => {
  const today = getTodayDateKey();
  localStorage.setItem(today, 'pris');

  // Mettre à jour le message de confirmation
  confirmationMessage.textContent = `✅ Vous avez pris vos médicaments le ${today}.`;
});

// Vérifier l'état de la prise au chargement de la page
checkMedicationStatus();

// Gérer la prise de photo
photoBtn.addEventListener('click', () => {
  if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      const video = document.createElement('video');
      video.autoplay = true;
      video.srcObject = stream;
      mediaArea.innerHTML = ''; // Nettoyer la zone média
      mediaArea.appendChild(video);

      // Bouton pour capturer la photo
      const captureBtn = document.createElement('button');
      captureBtn.textContent = 'Capturer la photo';
      mediaArea.appendChild(captureBtn);

      captureBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        // Arrêter la vidéo
        stream.getTracks().forEach(track => track.stop());
        video.remove();
        captureBtn.remove();

        // Afficher la photo capturée
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        mediaArea.appendChild(img);

        // Enregistrer la photo en local (optionnel)
        const photoKey = 'photo-' + Date.now();
        localStorage.setItem(photoKey, img.src);
      });
    })
    .catch((error) => {
      console.log('Erreur lors de l\'accès à la caméra:', error);
      alert('Impossible d\'accéder à la caméra.');
    });
  } else {
    alert('Accès à la caméra non supporté par ce navigateur.');
  }
});
