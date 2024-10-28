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

// Sélection des éléments
const confirmBtn = document.getElementById('confirm-btn');
const confirmationMessage = document.getElementById('confirmation-message');
const photoBtn = document.getElementById('photo-btn');
const mediaArea = document.getElementById('media-area');

// **Nouveau code pour la phrase de motivation**
// Sélection de l'élément où afficher la phrase
const motivationalPhraseElement = document.getElementById('motivational-phrase');

// Fonction pour afficher la phrase de motivation
function displayMotivationalPhrase(phrase) {
  motivationalPhraseElement.textContent = phrase;
}

// Fonction pour récupérer la phrase depuis l'API
function fetchMotivationalPhrase() {
  const today = new Date().toISOString().split('T')[0]; // Obtenir la date au format 'YYYY-MM-DD'
  const cachedPhrase = localStorage.getItem('phrase-' + today);

  if (cachedPhrase) {
    // Si la phrase du jour est déjà en cache, l'afficher
    displayMotivationalPhrase(cachedPhrase);
  } else {
    if (navigator.onLine) {
      fetch('https://zenquotes.io/api/today')
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            const phrase = data[0].q + " — " + data[0].a;
            displayMotivationalPhrase(phrase);
            // Stocker la phrase dans le localStorage
            localStorage.setItem('phrase-' + today, phrase);
          } else {
            displayMotivationalPhrase("Gardez le sourire, la vie est belle.");
          }
        })
        .catch(error => {
          console.log('Erreur lors de la récupération de la phrase :', error);
          displayMotivationalPhrase("Gardez le sourire, la vie est belle.");
        });
    } else {
      // L'utilisateur est hors ligne, afficher une phrase par défaut
      displayMotivationalPhrase("Vous êtes plus fort que vous ne le pensez.");
    }
  }
}

// Appeler la fonction au chargement de la page
fetchMotivationalPhrase();

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

// ... Votre code existant ...

// Variable pour l'état de la caméra (false par défaut pour utiliser la caméra arrière)
let useFrontCamera = false;

// Gérer la prise de photo
photoBtn.addEventListener('click', () => {
  startCamera();
});

function startCamera() {
  const constraints = {
    video: {
      facingMode: useFrontCamera ? 'user' : 'environment'
    }
  };

  if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        const video = document.createElement('video');
        video.autoplay = true;
        video.srcObject = stream;

        // Sélection du conteneur de la caméra
        const cameraContainer = document.getElementById('camera-container');
        cameraContainer.innerHTML = ''; // Nettoyer le conteneur

        // Ajouter la vidéo au conteneur
        cameraContainer.appendChild(video);

        // Bouton pour changer de caméra
        const switchCameraBtn = document.createElement('button');
        switchCameraBtn.textContent = 'Changer de caméra';
        switchCameraBtn.id = 'switch-camera-btn'; // Attribuer un ID pour le style
        cameraContainer.appendChild(switchCameraBtn);

        // Bouton pour capturer la photo
        const captureBtn = document.createElement('button');
        captureBtn.textContent = 'Capturer la photo';
        captureBtn.id = 'capture-btn'; // Attribuer un ID pour le style
        cameraContainer.appendChild(captureBtn);

        // Événement pour changer de caméra
        switchCameraBtn.onclick = () => {
          // Arrêter le flux vidéo actuel
          stream.getTracks().forEach(track => track.stop());
          // Basculer la caméra
          useFrontCamera = !useFrontCamera;
          // Redémarrer la caméra avec les nouveaux paramètres
          startCamera();
        };

        // Événement pour capturer la photo
        captureBtn.onclick = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0);

          // Arrêter la vidéo
          stream.getTracks().forEach(track => track.stop());
          video.remove();
          switchCameraBtn.remove();
          captureBtn.remove();

          // Afficher la photo capturée
          const img = document.createElement('img');
          img.src = canvas.toDataURL('image/png');

          // Vider le conteneur de la caméra et afficher l'image
          const mediaArea = document.getElementById('media-area');
          mediaArea.innerHTML = '';
          mediaArea.appendChild(img);

          // Enregistrer la photo en local (optionnel)
          const photoKey = 'photo-' + Date.now();
          localStorage.setItem(photoKey, img.src);
        };
      })
      .catch((error) => {
        console.log('Erreur lors de l\'accès à la caméra:', error);
        alert('Impossible d\'accéder à la caméra.');
      });
  } else {
    alert('Accès à la caméra non supporté par ce navigateur.');
  }
}

