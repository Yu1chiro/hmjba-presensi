import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

// Fungsi untuk menginisialisasi Firebase
const initializeFirebase = (firebaseConfig) => {
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  return database;
};

// Fungsi untuk menyembunyikan semua link presensi
const hideAllPresensiLinks = () => {
  document.querySelectorAll('#presensi-inspi, #presensi-potluck, #presensi-uday').forEach(link => {
    link.style.display = 'none';
  });
};

// Fungsi untuk menyimpan pilihan presensi ke Firebase
const savePresensiSelection = async (database, selectedOption) => {
  try {
    const presensiRef = ref(database, 'presensi-active/current');
    await set(presensiRef, {
      type: selectedOption,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    throw new Error('Gagal menyimpan ke database');
  }
};

// Fungsi untuk menginisialisasi fungsi-fungsi aplikasi
const initializeAppFunctions = (database) => {
  // Pastikan semua link tersembunyi saat inisialisasi
  hideAllPresensiLinks();

  const setPresensiBtn = document.getElementById('set-presensi');
  if (!setPresensiBtn) {
    console.error('Button set-presensi tidak ditemukan');
    return;
  }

  setPresensiBtn.addEventListener('click', () => {
    Swal.fire({
      title: 'Pilih Jenis Presensi',
      input: 'select',
      inputOptions: {
        'presensi-inspi': 'Presensi Inspiration',
        'presensi-potluck': 'Presensi Mahasiswa/Potluck',
        'presensi-uday': 'Presensi United Day'
      },
      inputPlaceholder: 'Pilih jenis presensi',
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      showLoaderOnConfirm: true,
      preConfirm: (selectedOption) => {
        return savePresensiSelection(database, selectedOption)
          .then(() => {
            hideAllPresensiLinks();
            
            // Tampilkan link yang dipilih
            const selectedLink = document.getElementById(selectedOption);
            if (selectedLink) {
              selectedLink.style.display = 'block';
            }
            
            return selectedOption;
          })
          .catch(error => {
            Swal.showValidationMessage(`Gagal menyimpan: ${error}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Pengaturan presensi telah disimpan',
          confirmButtonColor: '#3085d6'
        });
      }
    });
  });
};

// Fungsi utama yang dijalankan saat DOM telah dimuat
document.addEventListener('DOMContentLoaded', () => {
  // Sembunyikan link saat pertama kali dimuat
  hideAllPresensiLinks();
  
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