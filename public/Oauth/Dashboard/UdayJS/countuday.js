import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

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

const hitungStatistikKehadiran = () => {
    const presensiInspiRef = ref(database, 'Presensi-Uday');
    const inspiTelatRef = ref(database, 'Uday-Telat');

    let hadirCount = 0;
    let telatCount = 0;
    let izinCount = 0;
    let sakitCount = 0;

    // Listener untuk Presensi-Inspi
    onValue(presensiInspiRef, (snapshot) => {
        hadirCount = 0; // Reset counter
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const keterangan = childSnapshot.val().keterangan;
                if (keterangan === 'Hadir') hadirCount++;
            });
        }
        perbaruiStatistik();
    });

    // Listener untuk Inspi-Telat
    onValue(inspiTelatRef, (snapshot) => {
        telatCount = 0; // Reset counters
        izinCount = 0;
        sakitCount = 0;
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const status = childSnapshot.val().status;
                switch (status) {
                    case 'Terlambat':
                        telatCount++;
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
        document.getElementById('quanty-telat').textContent = telatCount;
        document.getElementById('quanty-izin').textContent = izinCount;
        document.getElementById('quanty-sakit').textContent = sakitCount;
    }
};

// Panggil fungsi untuk memulai pemantauan statistik kehadiran
hitungStatistikKehadiran();