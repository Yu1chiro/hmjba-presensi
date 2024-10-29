import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { 
  getDatabase, 
  ref, 
  set, 
  onValue,
  remove 
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

// Fungsi untuk menginisialisasi Firebase
const initializeFirebase = (firebaseConfig) => {
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  return database;
};

// Fungsi utama yang dijalankan saat DOM telah dimuat
document.addEventListener('DOMContentLoaded', () => {
  fetch('/firebase-config')
    .then(response => response.json())
    .then(config => {
      const database = initializeFirebase(config);
      initializeAppFunctions(database);
      initializeDataListener(database);
    })
    .catch(error => {
      console.error('Gagal mengambil konfigurasi Firebase:', error);
    });
});

// Fungsi untuk menginisialisasi fungsi-fungsi aplikasi
const initializeAppFunctions = (database) => {
  const setCoordinateButton = document.getElementById("set-coordinate");
  if (setCoordinateButton) {
    setCoordinateButton.addEventListener("click", () => {
      showCoordinateInput(database);
    });
  } else {
    console.error("Element dengan ID 'set-coordinate' tidak ditemukan.");
  }
};

// Fungsi untuk menampilkan input koordinat
const showCoordinateInput = (database, existingData = null) => {
  Swal.fire({
    title: existingData ? 'Edit Koordinat' : 'Masukkan Koordinat',
    html:
      `<input id="swal-input1" class="swal2-input" placeholder="Latitude contoh : -8.235162" value="${existingData ? existingData.latitude : ''}">` +
      `<input id="swal-input2" class="swal2-input" placeholder="Longitude contoh : 115.988762" value="${existingData ? existingData.longitude : ''}">`,
    focusConfirm: false,
    preConfirm: () => {
      const latitude = document.getElementById('swal-input1').value;
      const longitude = document.getElementById('swal-input2').value;
      return { latitude, longitude };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const { latitude, longitude } = result.value;
      updateTargetCoordinate(database, latitude, longitude);
    }
  });
};

// Fungsi untuk menyimpan koordinat ke Firebase
const updateTargetCoordinate = async (database, latitude, longitude) => {
  try {
    await set(ref(database, 'koordinat'), { latitude, longitude });
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Koordinat berhasil disimpan',
      timer: 1500
    });
  } catch (error) {
    console.error('Gagal menyimpan koordinat ke Firebase:', error);
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: 'Terjadi kesalahan saat menyimpan koordinat'
    });
  }
};

// Fungsi untuk menghapus koordinat
const deleteCoordinate = async (database) => {
  try {
    await remove(ref(database, 'koordinat'));
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Koordinat berhasil dihapus',
      timer: 1500
    });
  } catch (error) {
    console.error('Gagal menghapus koordinat:', error);
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: 'Terjadi kesalahan saat menghapus koordinat'
    });
  }
};

// Fungsi untuk memantau perubahan data
const initializeDataListener = (database) => {
  const koordinatRef = ref(database, 'koordinat');
  const dataKordinatElement = document.getElementById('data-kordinat');

  onValue(koordinatRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      dataKordinatElement.innerHTML = `
        <p>Latitude: ${data.latitude}</p>
        <p>Longitude: ${data.longitude}</p>
        <button onclick="window.editCoordinate()" class="font-bold text-yellow-500">Edit</button>
        <button onclick="window.deleteCoordinate()" class="font-bold text-red-500">Delete</button>
      `;

      // Membuat fungsi global untuk edit dan delete
      window.editCoordinate = () => showCoordinateInput(database, data);
      window.deleteCoordinate = () => {
        Swal.fire({
          title: 'Apakah anda yakin?',
          text: "Data koordinat akan dihapus!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ya, hapus!',
          cancelButtonText: 'Batal'
        }).then((result) => {
          if (result.isConfirmed) {
            deleteCoordinate(database);
          }
        });
      };
    } else {
      dataKordinatElement.innerHTML = '<p>Belum ada data koordinat harap set kordinat jika ingin menggunakan presensi</p>';
    }
  });
};