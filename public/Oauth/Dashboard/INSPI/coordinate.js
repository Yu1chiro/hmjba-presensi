import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

// Fungsi untuk menginisialisasi Firebase setelah mengambil konfigurasi dari server
const initializeFirebase = (firebaseConfig) => {
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  return database;
};

// Fungsi utama yang dijalankan saat DOM telah dimuat
document.addEventListener('DOMContentLoaded', () => {
  // Mengambil konfigurasi Firebase dari server dan menginisialisasi Firebase
  fetch('/firebase-config')
    .then(response => response.json())
    .then(config => {
      const database = initializeFirebase(config);
      initializeAppFunctions(database);
    })
    .catch(error => {
      console.error('Gagal mengambil konfigurasi Firebase:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Tidak dapat menghubungkan ke database',
        confirmButtonColor: '#d33'
      });
    });
});

// Fungsi untuk menginisialisasi fungsi-fungsi lain setelah Firebase siap
const initializeAppFunctions = (database) => {
  const setCoordinateButton = document.getElementById("set-coordinate");
  if (setCoordinateButton) {
    setCoordinateButton.addEventListener("click", () => {
      Swal.fire({
        title: 'Masukkan Koordinat',
        html:
          '<input id="swal-input1" class="swal2-input" placeholder="Latitude contoh : -8.235162">' +
          '<input id="swal-input2" class="swal2-input" placeholder="Longitude contoh : 115.988762">',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        preConfirm: () => {
          const latitude = document.getElementById('swal-input1').value;
          const longitude = document.getElementById('swal-input2').value;
          
          // Validasi input
          if (!latitude || !longitude) {
            Swal.showValidationMessage('Harap isi kedua koordinat');
            return false;
          }
          
          // Validasi format angka
          if (isNaN(latitude) || isNaN(longitude)) {
            Swal.showValidationMessage('Koordinat harus berupa angka');
            return false;
          }
          
          return { latitude, longitude };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const { latitude, longitude } = result.value;
          updateTargetCoordinate(database, latitude, longitude);
        }
      });
    });
  } else {
    console.error("Element dengan ID 'set-coordinate' tidak ditemukan.");
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Tombol koordinat tidak ditemukan',
      confirmButtonColor: '#d33'
    });
  }
};

// Fungsi untuk menyimpan koordinat target ke Firebase
const updateTargetCoordinate = async (database, latitude, longitude) => {
  try {
    // Tampilkan loading
    Swal.fire({
      title: 'Menyimpan...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    await set(ref(database, 'koordinat'), { latitude, longitude });
    
    // Tutup loading dan tampilkan sukses
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: `Koordinat berhasil disimpan (Lat: ${latitude}, Long: ${longitude})`,
      timer: 2000,
      showConfirmButton: false
    });

  } catch (error) {
    console.error('Gagal menyimpan koordinat ke Firebase:', error);
    
    // Tampilkan pesan error
    Swal.fire({
      icon: 'error',
      title: 'Gagal Menyimpan',
      text: 'Terjadi kesalahan saat menyimpan koordinat',
      confirmButtonColor: '#d33'
    });
  }
};