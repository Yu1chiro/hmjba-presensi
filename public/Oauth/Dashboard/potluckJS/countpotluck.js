import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

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
        });
});

// Fungsi untuk menginisialisasi fungsi-fungsi lain setelah Firebase siap
const initializeAppFunctions = (database) => {
    const hitungStatistikKehadiran = () => {
        const presensiInspiRef = ref(database, 'Presensi-Potluck');
        const inspiTelatRef = ref(database, 'Potluck-Telat');

        let hadirCount = 0;
        let telatCount = 0;
        let izinCount = 0;
        let sakitCount = 0;
        let tidakHadirPresensi = 0;
        let tidakHadirTelat = 0;

        // Listener untuk Presensi-Inspi
        onValue(presensiInspiRef, (snapshot) => {
            hadirCount = 0; // Reset counter
            tidakHadirPresensi = 0; // Reset presensi counter

            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const keterangan = childSnapshot.val().keterangan;
                    console.log('Presensi-Potluck Keterangan:', keterangan); // Debugging
                    if (keterangan === 'Hadir') hadirCount++;
                    if (keterangan === 'Tidak Hadir') tidakHadirPresensi++;
                });
            }
            perbaruiStatistik();
        });

        // Listener untuk Inspi-Telat
        onValue(inspiTelatRef, (snapshot) => {
            telatCount = 0;
            tidakHadirTelat = 0; // Reset telat counter
            izinCount = 0;
            sakitCount = 0;

            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const status = childSnapshot.val().status;
                    console.log('Potluck-Telat Status:', status); // Debugging
                    switch (status) {
                        case 'Terlambat':
                            telatCount++;
                            break;
                        case 'Tidak Hadir':
                            tidakHadirTelat++;
                            break;
                        case 'Izin':
                            izinCount++;
                            break;
                        case 'Sakit':
                            sakitCount++;
                            break;
                    }
                });
            }
            perbaruiStatistik();
        });

        function perbaruiStatistik() {
            document.getElementById('quanty-hadir').textContent = hadirCount;
            document.getElementById('quanty-tdkhadir').textContent = tidakHadirPresensi + tidakHadirTelat;
            document.getElementById('quanty-telat').textContent = telatCount;
            document.getElementById('quanty-izin').textContent = izinCount;
            document.getElementById('quanty-sakit').textContent = sakitCount;
        }
    };

    // Panggil fungsi untuk memulai pemantauan statistik kehadiran
    hitungStatistikKehadiran();
};
