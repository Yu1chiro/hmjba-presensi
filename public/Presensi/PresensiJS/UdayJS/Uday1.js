import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC_1C4BvKMopvJAahJYm9e1H25fblmq0Ts",
    authDomain: "absensi-project-9c7da.firebaseapp.com",
    databaseURL: "https://absensi-project-9c7da-default-rtdb.firebaseio.com",
    projectId: "absensi-project-9c7da",
    storageBucket: "absensi-project-9c7da.appspot.com",
    messagingSenderId: "282577205215",
    appId: "1:282577205215:web:db4a5079f1e462e6a6f66a",
    measurementId: "G-YKGFS1JRHY"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Fungsi untuk memeriksa izin lokasi
const checkLocationPermission = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolokasi tidak didukung oleh browser ini."));
            return;
        }

        navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
            resolve(permissionStatus.state);
        });
    });
};

// Fungsi untuk mendapatkan lokasi pengguna
const getLocation = () => {
    return new Promise((resolve, reject) => {
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
};

// Fungsi untuk menentukan keterangan berdasarkan lokasi
const determineKeterangan = (latitude, longitude) => {
    const targetLatitude = -8.1125983;
    const targetLongitude = 115.0856583;
    const tolerance = 0.00629;

    const isWithinLocation = Math.abs(latitude - targetLatitude) <= tolerance && Math.abs(longitude - targetLongitude) <= tolerance;
    return isWithinLocation ? "Hadir" : "Tidak Hadir";
};

// Fungsi untuk mendapatkan nama perangkat pengguna
const getDeviceName = () => {
    return navigator.userAgent;
};

// Fungsi untuk menampilkan loading SweetAlert
const showLoadingSwal = () => {
    return Swal.fire({
        title: 'Mengirim Presensi',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
};

// Fungsi untuk menyimpan data ke Firebase
const saveDataToFirebase = (data) => {
    const newDataRef = ref(database, 'Presensi-Uday/' + data.nim);
    return set(newDataRef, data);
};

// Event listener untuk tombol submit
document.getElementById("submit-data").addEventListener("click", async () => {
    const name = document.getElementById("Name").value;
    const nim = document.getElementById("Nim").value;
    const prodi = document.getElementById("Prodi").value;
    const Jabatan = document.getElementById("Jabatan").value;

    if (!name || !nim || !prodi || !Jabatan) {
        Swal.fire({
            icon: 'error',
            title: 'Data Tidak Lengkap',
            text: 'Harap isi semua field yang diperlukan.',
        });
        return;
    }

    let loadingSwal;
    try {
        const permissionStatus = await checkLocationPermission();
        
        if (permissionStatus === 'denied') {
            throw new Error('PERMISSION_DENIED');
        }

        loadingSwal = showLoadingSwal();

        const position = await getLocation();
        const { latitude, longitude } = position.coords;
        const keterangan = determineKeterangan(latitude, longitude);
        const deviceName = getDeviceName();

        const newData = {
            name,
            nim,
            prodi,
            Jabatan,
            keterangan,
            location: { latitude, longitude },
            deviceName,
            timestamp: Date.now()
        };

        await saveDataToFirebase(newData);

        // Menunggu minimal 2 detik sebelum menutup loading
        await new Promise(resolve => setTimeout(resolve, 800));

        if (loadingSwal) {
            loadingSwal.close();
        }

        await Swal.fire({
            icon: 'success',
            title: '<p class="swall-title text-green-700">Presensi Terkirim!</p>',
            confirmButtonText: 'Cek Keterangan',
            customClass: {
                confirmButton: 'swall-custom'
            }
        });

        const alertMessage = keterangan === "Hadir" ?
            {
                icon: 'success',
                title: '<p class="swall-title text-green-700">Anda Berada di Lokasi</p>',
                html: '<p class="font-bold swall-font">Keterangan : <span class="text-green-700 font-bold swall-font">Hadir</span></p>',
                showConfirmButton: false,
            } :
            {
                icon: 'error',
                title: '<p class="swall-title text-red-700">Anda Berada Diluar Lokasi !</p>',
                html: '<p class="font-bold swall-font">Keterangan : <span class="fw-bold text-red-700 swall-font">Tidak Hadir</span></p>',
                showConfirmButton: false,
            };
        await Swal.fire(alertMessage);

        // Reset form fields
        document.getElementById("Name").value = '';
        document.getElementById("Nim").value = '';
        document.getElementById("Prodi").value = '';
        document.getElementById("Jabatan").value = '';

    } catch (error) {
        console.error("Error:", error);

        if (loadingSwal) {
            loadingSwal.close();
        }

        if (error.message === 'PERMISSION_DENIED') {
            Swal.fire({
                icon: 'error',
                title: 'Akses Lokasi Ditolak',
                text: 'Harap izinkan akses lokasi untuk melanjutkan presensi.',
                confirmButtonText: 'Coba Lagi',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Mencoba kembali mendapatkan lokasi
                    navigator.geolocation.getCurrentPosition(() => {}, () => {}, { enableHighAccuracy: true });
                }
            });
        } else if (error.code === 2) { // POSITION_UNAVAILABLE
            Swal.fire({
                icon: 'error',
                title: 'Lokasi Tidak Tersedia',
                text: 'Tidak dapat mendapatkan lokasi Anda. Pastikan GPS aktif dan coba lagi.',
            });
        } else if (error.code === 3) { // TIMEOUT
            Swal.fire({
                icon: 'error',
                title: 'Waktu Habis',
                text: 'Waktu mendapatkan lokasi habis. Silakan coba lagi.',
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Gagal mengirim presensi. Silakan coba lagi.',
            });
        }
    }
});