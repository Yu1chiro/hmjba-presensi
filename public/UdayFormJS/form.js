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

// Fungsi untuk mendapatkan lokasi pengguna
const getLocation = (callback, errorCallback) => {
    if (navigator.geolocation) {
        // Pilihan untuk meningkatkan akurasi geolokasi
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,  // Maksimum waktu menunggu (10 detik)
            maximumAge: 0    // Tidak menggunakan cache, selalu mendapatkan lokasi terbaru
        };

        navigator.geolocation.getCurrentPosition(callback, errorCallback, options);
    } else {
        errorCallback(new Error("Geolokasi tidak didukung oleh browser ini."));
    }
};

// Fungsi untuk menentukan keterangan berdasarkan lokasi
const determineKeterangan = (latitude, longitude) => {
    const targetLatitude = -8.1125983;  // Latitude lokasi
    const targetLongitude = 115.0856583;  // Longitude lokasi
    const tolerance =  0.00629;
    // const tolerance = 0.002695;  // Toleransi jarak dalam derajat

    const isWithinLocation = Math.abs(latitude - targetLatitude) <= tolerance && Math.abs(longitude - targetLongitude) <= tolerance;
    return isWithinLocation ? "Hadir" : "Tidak Hadir";
};

// Fungsi untuk mendapatkan nama perangkat pengguna
const getDeviceName = () => {
    return navigator.userAgent;
};

// Event listener untuk tombol submit
document.getElementById("submit-data").addEventListener("click", () => {
    const name = document.getElementById("Name").value;
    const nim = document.getElementById("Nim").value;
    const prodi = document.getElementById("Prodi").value;
    const Jabatan = document.getElementById("Jabatan").value;
    const statusMessage = document.getElementById("status-message");

    if (!name || !nim || !prodi || !Jabatan) {
        statusMessage.textContent = "Harap Isi Presensi Dengan Lengkap!";
        statusMessage.style.margin = '1rem 0';
        statusMessage.className = "text-danger fw-bold";
        return;
    }

    getLocation((position) => {
        const { latitude, longitude } = position.coords;
        const keterangan = determineKeterangan(latitude, longitude);
        const deviceName = getDeviceName();

        const newData = {
            name,
            nim,
            prodi,
            Jabatan,
            keterangan,
            location: {
                latitude,
                longitude
            },
            deviceName,  // Menambahkan nama perangkat ke dalam data yang dikirim
            timestamp: Date.now()
        };

        const submitButton = document.getElementById("submit-data");
        submitButton.classList.add("loading");
        submitButton.disabled = true;

        setTimeout(() => {
            const newDataRef = ref(database, 'data-absensi/' + nim);
            set(newDataRef, newData)
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: '<p class="swall-title text-success">Arigathanks Bro !</p>',
                        confirmButtonText: 'Cek Keterangan',
                        customClass: {
                            confirmButton: 'swall-custom'  // Gunakan kelas CSS yang sudah didefinisikan
                        }
                    }).then(() => {
                        const alertMessage = keterangan === "Hadir" ?
                            {
                                icon: 'success',
                                title: '<p class="swall-title text-success">Anda Berada di Lokasi</p>',
                                html: '<p class="fw-bold swall-font">Keterangan : <span class="text-success fw-bold swall-font">Hadir</span></p>',
                                showConfirmButton: false,
                            } :
                            {
                                icon: 'error',
                                title: '<p class="swall-title text-danger">Anda Berada Diluar Lokasi !</p>',
                                html: '<p class="fw-bold swall-font">Keterangan : <span class="fw-bold text-danger swall-font">Tidak Hadir</span></p><p class="text-danger text-lg swall-custom">Pastikan Anda Berada di Lokasi</p> <p class="text-danger text-lg swall-custom">Pastikan GPS Anda Aktif</p> <p class="text-danger text-lg swall-custom">Pastikan Browser Anda Mendukung</p>',
                                showConfirmButton: false,
                            };
                        Swal.fire(alertMessage);
                    });

                    document.getElementById("Name").value = '';
                    document.getElementById("Nim").value = '';
                    document.getElementById("Prodi").value = '';
                    document.getElementById("Jabatan").value = '';
                    submitButton.textContent = "Kirim Presensi";
                    submitButton.classList.remove("loading");
                    submitButton.disabled = false;
                })
                .catch((error) => {
                    console.error("Error saving data to database", error);
                    statusMessage.textContent = "";
                    statusMessage.className = "";
                    submitButton.textContent = "Kirim";
                    submitButton.disabled = false;
                });
        }, 200);  // Delay 0,2 detik
    }, (error) => {
        console.error("Error accessing location", error);

        if (error.code === error.PERMISSION_DENIED) {
            Swal.fire({
                icon: 'error',
                title: 'Presensi Tidak Dapat Terkirim',
                text: 'Harap Izinkan Akses Lokasi',
            });
        } else if (error.code === error.POSITION_UNAVAILABLE) {
            Swal.fire({
                icon: 'error',
                title: 'Presensi Tidak Dapat Terkirim',
                text: 'Lokasi Tidak Tersedia, Coba Lagi Nanti',
            });
        } else if (error.code === error.TIMEOUT) {
            Swal.fire({
                icon: 'error',
                title: 'Presensi Tidak Dapat Terkirim',
                text: 'Waktu Mendapatkan Lokasi Habis, Coba Lagi',
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Presensi Tidak Dapat Terkirim',
                text: 'Terjadi Kesalahan, Silakan Coba Lagi',
            });
        }
    });
});
