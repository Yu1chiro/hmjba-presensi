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
        });
});

// Fungsi untuk menginisialisasi fungsi-fungsi lain setelah Firebase siap
const initializeAppFunctions = (database) => {

    document.getElementById('tambah-data-mahasiswa').addEventListener('click', () => {
        const button = document.getElementById('tambah-data-mahasiswa');
        button.disabled = true;
    
        const nama = document.getElementById('nama').value;
        const nim = document.getElementById('nim').value;
        const programStudi = document.getElementById('program-studi').value;
        const jabatan = document.getElementById('jabatan').value;
        const alasan = document.getElementById('alasan').value;
        let status;
    
        if (document.getElementById('Terlambat').checked) {
            status = "Terlambat";
        } else if (document.getElementById('Izin').checked) {
            status = "Izin";
        } else if (document.getElementById('Sakit').checked) {
            status = "Sakit";
        }
    
        // Validasi input
        if (!nama || !nim || !programStudi || !jabatan || !status) {
            alert('Semua field harus diisi!');
            button.disabled = false;
            return;
        }
    
        // Tampilkan loading SweetAlert
        Swal.fire({
            title: 'Mengirim data...',
            text: 'Harap tunggu',
            timer: 1000,  // 1 detik
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            },
        }).then(() => {
            // Proses pengiriman data setelah 1 detik
            const timestamp = new Date().toISOString();
            const dataRef = ref(database, 'Inspi-Telat/' + nim);
    
            set(dataRef, {
                nama: nama,
                nim: nim,
                programStudi: programStudi,
                jabatan: jabatan,
                status: status,
                alasan: alasan,
                timestamp: timestamp
            }).then(() => {
                button.disabled = false;
    
                // Reset form setelah data terkirim
                document.getElementById('nama').value = '';
                document.getElementById('nim').value = '';
                document.getElementById('program-studi').value = '';
                document.getElementById('jabatan').value = '';
                document.getElementById('alasan').value = '';
                document.getElementById('Terlambat').checked = false;
                document.getElementById('Izin').checked = false;
                document.getElementById('Sakit').checked = false;
    
                // Tampilkan pesan sukses
                Swal.fire({
                    icon: 'success',
                    title: 'Presensi Terkirim',
                    text: 'Data berhasil disimpan.'
                });
            }).catch((error) => {
                button.disabled = false;
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal Mengirim',
                    text: 'Gagal mengirim data: ' + error
                });
            });
        });
    });
};
    

