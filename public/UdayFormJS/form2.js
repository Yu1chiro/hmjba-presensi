import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getDatabase, ref, set,} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

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
const dataRef = ref(database, 'data-tambahan');

document.getElementById('tambah-data-mahasiswa').addEventListener('click', () => {
    const button = document.getElementById('tambah-data-mahasiswa');
    const statusSuccess = document.getElementById("status-success");
    button.classList.add("loading");
    button.disabled = true;
    const nama = document.getElementById('nama').value;
    const nim = document.getElementById('nim').value;
    const programStudi = document.getElementById('program-studi').value;
    const jabatan = document.getElementById('jabatan').value;
    const alasan = document.getElementById('alasan').value;
    let status = "";

    if (document.getElementById('Terlambat').checked) {
        status = "Terlambat";
    } else if (document.getElementById('Izin').checked) {
        status = "Izin";
    } else if (document.getElementById('Sakit').checked) {
        status = "Sakit";
    }

    // Validasi input
    if (!nama) {
        alert('Nama harus diisi!');
        button.innerHTML = 'Kirim Presensi';
        button.disabled = false;
        return;
    }
    if (!nim) {
        alert('NIM harus diisi!');
        button.innerHTML = 'Kirim Presensi';
        button.disabled = false;
        return;
    }
    if (!programStudi) {
        alert('Program Studi harus diisi!');
        button.innerHTML = 'Kirim Presensi';
        button.disabled = false;
        return;
    }
    if (!jabatan) {
        alert('Jabatan harus diisi!');
        button.innerHTML = 'Kirim Presensi';
        button.disabled = false;
        return;
    }
    if (!status) {
        alert('Status harus dipilih!');
        button.innerHTML = 'Kirim Presensi';
        button.disabled = false;
        return;
    }

    const timestamp = new Date().toISOString(); // Mendapatkan timestamp saat ini

    const dataRef = ref(database, 'data-tambahan/' + nim);
    set(dataRef, {
        nama: nama,
        nim: nim,
        programStudi: programStudi,
        jabatan: jabatan,
        status: status,
        alasan: alasan,
        timestamp: timestamp // Menambahkan timestamp ke data yang akan disimpan
    }).then(() => {
        button.style.fontWeight = 'bold';
        button.innerHTML = 'Kirim Presensi';
        button.classList.remove("loading");
        button.disabled = false;
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
            title: 'Presensi Terkirim'
        });
    }).catch((error) => {
        alert('Gagal mengirim data: ' + error);
        button.innerHTML = 'Kirim Presensi';
        button.disabled = false;
    });
});


