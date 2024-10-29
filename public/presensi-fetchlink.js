import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

// Sembunyikan semua link presensi secara default
document.querySelectorAll('#presensi-inspi, #presensi-potluck, #presensi-uday').forEach(link => {
  link.style.display = 'none';
});

// Fungsi untuk menginisialisasi Firebase
const initializeFirebase = (firebaseConfig) => {
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  return database;
};

// Fungsi untuk memantau perubahan data presensi
const watchPresensiActive = (database) => {
  const presensiRef = ref(database, 'presensi-active/current');
  
  onValue(presensiRef, (snapshot) => {
    const data = snapshot.val();
    
    if (data && data.type) {
      // Sembunyikan semua link terlebih dahulu
      document.querySelectorAll('#presensi-inspi, #presensi-potluck, #presensi-uday').forEach(link => {
        link.style.display = 'none';
      });
      
      // Tampilkan link yang aktif
      const activeLink = document.getElementById(data.type);
      if (activeLink) {
        activeLink.style.display = 'block';
      }
    }
  }, (error) => {
    console.error('Error membaca data:', error);
  });
};

// Fungsi utama yang dijalankan saat DOM telah dimuat
document.addEventListener('DOMContentLoaded', () => {
  // Mengambil konfigurasi Firebase dari server
  fetch('/firebase-config')
    .then(response => response.json())
    .then(config => {
      const database = initializeFirebase(config);
      watchPresensiActive(database);
    })
    .catch(error => {
      console.error('Gagal mengambil konfigurasi Firebase:', error);
    });
});