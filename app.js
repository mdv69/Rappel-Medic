if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
  .then((registration) => {
    console.log('Service Worker enregistré avec succès:', registration);
  })
  .catch((error) => {
    console.log('Erreur lors de l\'enregistrement du Service Worker:', error);
  });
}
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
const confirmBtn = document.getElementById('confirm-btn');
confirmBtn.addEventListener('click', () => {
  const today = new Date().toLocaleDateString();
  localStorage.setItem(today, 'pris');
  alert('Prise confirmée pour le ' + today);
});
const photoBtn = document.getElementById('photo-btn');
const mediaArea = document.getElementById('media-area');

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
