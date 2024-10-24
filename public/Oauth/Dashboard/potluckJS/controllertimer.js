import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getDatabase, ref, set, remove } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

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

    const copyPresensiLink = () => {
        const link = "https://presensi-panitia.vercel.app/";
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(link)
                .then(() => {
                    Swal.fire({
                        title: "Sukses menerapkan timer & link presensi berhasil di salin!",
                        icon: "success",
                        timer: 4000,
                        showConfirmButton: false
                    });
                })
                .catch((err) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal Menyalin',
                        text: 'Tidak dapat menyalin link presensi ke clipboard. Silakan coba manual.',
                    });
                });
        } else {
            // Fallback jika navigator.clipboard tidak didukung
            Swal.fire({
                icon: 'error',
                title: 'Clipboard Tidak Didukung',
                text: 'Peramban ini tidak mendukung fungsi clipboard. Silakan salin link secara manual.',
            });
        }
    };
    
    // Mengatur countdown dengan waktu lokal
    const setCountdown = (time) => {
        const countdownRef = ref(database, 'countdown-potluck');
        
        const [hours, minutes] = time.split(':').map(Number);
        const now = new Date();
        const countdownDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
    
        // Jika waktu yang diatur lebih awal dari waktu saat ini, tambahkan satu hari
        if (countdownDate < now) {
            countdownDate.setDate(countdownDate.getDate() + 1);
        }
    
        // Simpan waktu dalam format ISO tanpa konversi tambahan
        set(countdownRef, countdownDate.toISOString())
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Timer Berhasil Diterapkan',
                    text: 'Link presensi telah disalin ke clipboard. Untuk melihat perubahan, silakan cek halaman presensi.',
                });
    
                // Otomatis menyalin link presensi setelah countdown berhasil diterapkan
                copyPresensiLink();
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Gagal mengatur timer. Silakan coba lagi.',
                });
            });
    };
    
    // Event listener untuk tombol set countdown
    document.getElementById('set-countdown').addEventListener('click', () => {
        const countdownInput = document.getElementById('write-countdown').value;
        if (countdownInput) {
            setCountdown(countdownInput);
        } else {
            Swal.fire({
                icon: 'warning',
                text: 'Pilih waktu terlebih dahulu',
            });
        }
    });
    
    // Menghapus countdown
    const deleteCountdown = () => {
        const countdownRef = ref(database, 'countdown-potluck');
        
        remove(countdownRef)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Presensi Berhasil di Tutup',
                    text: 'Untuk melihat perubahan silahkan cek halaman presensi',
                });
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Gagal menerapkan silahkan cek internet anda.',
                });
            });
    };
    
    // Event listener untuk tombol delete countdown
    document.getElementById('delete-countdown').addEventListener('click', () => {
        deleteCountdown();
    });

};    

// Fungsi untuk menyalin link presensi ke clipboard
