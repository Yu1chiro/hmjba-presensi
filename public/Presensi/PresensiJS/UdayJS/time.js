// interface.js
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
// Fungsi untuk memeriksa dan mengatur status di localStorage
const checkAndSetStatus = (status) => {
    const currentStatus = localStorage.getItem('presensiStatus');
    if (currentStatus !== status) {
        localStorage.setItem('presensiStatus', status);
        return true; // Status berubah
    }
    return false; // Status tidak berubah
};

// Fungsi untuk me-refresh browser
const refreshBrowser = () => {
    location.reload();
};

// Fungsi untuk mengatur tampilan berdasarkan status di localStorage
const updateContentDisplay = () => {
    const mainContent = document.getElementById('main-content');
    const hiddenContent = document.getElementById('hidden-content');
    const currentStatus = localStorage.getItem('presensiStatus');

    if (currentStatus === 'late') {
        if (mainContent) mainContent.style.display = 'none';
        if (hiddenContent) hiddenContent.style.display = 'block';
    } else if (currentStatus === 'active') {
        if (mainContent) mainContent.style.display = 'block';
        if (hiddenContent) hiddenContent.style.display = 'none';
    } else {
        if (mainContent) mainContent.style.display = 'none';
        if (hiddenContent) hiddenContent.style.display = 'none';
    }
};

// Mengambil countdown dan status presensi secara real-time
const fetchCountdownAndStatus = () => {
    const countdownRef = ref(database, 'countdown-Inspi');
    const statusRef = ref(database, 'status-presensi');

    onValue(countdownRef, (snapshot) => {
        const countdownElement = document.getElementById('countdown');
        
        if (snapshot.exists()) {
            const countdownData = snapshot.val();
            const endDate = new Date(countdownData);
            if (checkAndSetStatus('active')) {
                // Status berubah menjadi aktif, refresh browser
                refreshBrowser();
            } else {
                startCountdown(endDate);
            }
        } else {
            // Jika data countdown tidak ada
            if (countdownElement) {
                countdownElement.textContent = 'PRESENSI DI TUTUP !';
                countdownElement.style.color = 'red';
                countdownElement.style.fontWeight = 'bold';
                countdownElement.style.textAlign = 'center';
            }
            if (checkAndSetStatus('closed')) {
                // Status berubah menjadi tutup
                refreshBrowser();
            }
        }
    });

    // Memantau perubahan status presensi
    onValue(statusRef, (snapshot) => {
        if (snapshot.exists()) {
            const status = snapshot.val();
            if (status === 'closed' && checkAndSetStatus('closed')) {
                // Status berubah menjadi tutup
                refreshBrowser();
            }
        }
    });
};

// Memulai countdown
const startCountdown = (endDate) => {
    const countdownElement = document.getElementById('countdown');
    
    if (!countdownElement) return;

    const updateCountdown = () => {
        const now = new Date();
        const timeDiff = endDate - now;

        if (timeDiff <= 0) {
            countdownElement.textContent = 'ANDA TERLAMBAT !';
            countdownElement.style.color = 'red';
            countdownElement.style.fontWeight = 'bold';

            // Set status late di localStorage
            if (checkAndSetStatus('late')) {
                updateContentDisplay(); // Update tampilan konten
            }

            clearInterval(intervalId); // Hentikan countdown
        } else {
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            countdownElement.textContent = `${hours} Jam ${minutes} Menit ${seconds} Detik`;
            countdownElement.style.color = 'white';
            countdownElement.style.fontWeight = 'bold';
            
            // Pastikan konten sesuai status aktif
            updateContentDisplay();
        }
    };

    updateCountdown(); // Panggil saat pertama kali
    const intervalId = setInterval(updateCountdown, 500);
};

// Fetch countdown dan status secara real-time saat halaman dimuat
document.addEventListener('DOMContentLoaded', (event) => {
    updateContentDisplay(); // Update tampilan berdasarkan status saat halaman dimuat
    fetchCountdownAndStatus();
});

// //////
// Function untuk meminta izin notifikasi
const requestNotificationPermission = () => {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            console.log('Notifikasi sudah diizinkan');
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    console.log('Izin notifikasi diberikan');
                } else {
                    console.log('Izin notifikasi ditolak');
                }
            });
        }
    } else {
        console.log('Browser tidak mendukung notifikasi.');
    }
};

// Function untuk menampilkan notifikasi
const showNotification = (title, options) => {
    if ('Notification' in window && Notification.permission === 'granted') {
        try {
            if (navigator.serviceWorker && navigator.serviceWorker.ready) {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.showNotification(title, options);
                });
            } else {
                new Notification(title, options);
            }
            console.log('Notifikasi ditampilkan:', title, options);
        } catch (error) {
            console.log('Gagal menampilkan notifikasi:', error);
        }
    } else {
        console.log('Notifikasi tidak diizinkan atau tidak didukung.');
    }
};

const checkCountdownAndNotify = (countdownDate) => {
    const now = new Date(); // Waktu saat ini
    const timeDiff = countdownDate - now; // Selisih waktu antara waktu countdown dan waktu sekarang

    // Jika waktu tersisa kurang dari atau sama dengan 2 menit dan lebih dari 0 detik
    if (timeDiff <= 2 * 60 * 2000 && timeDiff > 0) {
        // Menampilkan notifikasi pertama
        showNotification('Bro Jangan Lupa Isi Presensi !', {
            body: 'Tinggal 1 Menit Lagi Jangan Lupa Isi Presensi ☹️',
            icon: '/logo.png', // Ganti dengan path icon yang ingin ditampilkan
            tag: 'countdown-notification' // Tag digunakan untuk mengelompokkan notifikasi
        });

        // Notifikasi kedua setelah 20 detik
        setTimeout(() => {
            showNotification('Bro Jangan Lupa Isi Presensi !', {
                body: 'Tinggal 1 Menit Lagi Jangan Lupa Isi Presensi ☹️',
                icon: '/logo.png',
                tag: 'countdown-notification-2'
            });
        }, 2000); // 20000 ms = 20 detik

        // Notifikasi ketiga setelah 40 detik
        setTimeout(() => {
            showNotification('Bro Jangan Lupa Isi Presensi !', {
                body: 'Tinggal 1 Menit Lagi Jangan Lupa Isi Presensi ☹️',
                icon: '/logo.png',
                tag: 'countdown-notification-3'
            });
        }, 4000); // 40000 ms = 40 detik
        // Notifikasi ketiga setelah 40 detik
        setTimeout(() => {
            showNotification('Bro Jangan Lupa Isi Presensi !', {
                body: 'Tinggal 1 Menit Lagi Jangan Lupa Isi Presensi ☹️',
                icon: '/logo.png',
                tag: 'countdown-notification-4'
            });
        }, 6000); // 40000 ms = 40 detik
        setTimeout(() => {
            showNotification('Bro Jangan Lupa Isi Presensi !', {
                body: 'Tinggal 1 Menit Lagi Jangan Lupa Isi Presensi ☹️',
                icon: '/logo.png',
                tag: 'countdown-notification-5'
            });
        }, 8000); // 40000 ms = 40 detik
    }
};


// Function untuk memulai countdown dan pengecekan waktu secara periodik
const startCountdownChecker = () => {
    const countdownRef = ref(database, 'countdown-Inspi');

    // Mendengarkan perubahan nilai dari countdown di database
    onValue(countdownRef, (snapshot) => {
        const countdownTime = snapshot.val(); // Mengambil nilai countdown dari database
        
        if (countdownTime) {
            const countdownDate = new Date(countdownTime); // Mengonversi waktu countdown ke objek Date

            // Cek waktu secara periodik setiap 30 detik
            setInterval(() => {
                checkCountdownAndNotify(countdownDate); // Memeriksa apakah waktu countdown tersisa 2 menit atau kurang
            }, 30000); // 30000 ms = 30 detik
        } else {
            console.log('Countdown time tidak ditemukan di database.');
        }
    });
};

// Panggil fungsi permintaan izin notifikasi saat pertama kali website dibuka
document.addEventListener('DOMContentLoaded', () => {
    requestNotificationPermission();

    // Panggil fungsi untuk memulai pengecekan countdown setelah izin notifikasi diminta
    startCountdownChecker();
    
    // Mendaftarkan Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch((error) => {
            console.log('Service Worker registration failed:', error);
        });
    }
});
