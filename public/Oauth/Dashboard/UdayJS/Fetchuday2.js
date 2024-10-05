import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getDatabase, ref, set, get, onChildAdded, onChildRemoved, remove} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

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
const dataRef = ref(database, 'Uday-Telat');

// Fungsi untuk memformat timestamp menjadi format yang mudah dibaca
const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
};
const removeAllData = async () => {
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: "Semua data akan dihapus!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus semua!',
        cancelButtonText: 'Batal'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const dataRef = ref(database, 'Uday-Telat');
            try {
                await set(dataRef, null);
                Swal.fire({
                    icon: 'success',
                    title: 'Data Berhasil di Hapus',
                });
            } catch (error) {
                console.error("Error removing all data from database", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Terjadi Kesalahan',
                    text: 'Terjadi kesalahan saat menghapus semua data.',
                });
            }
        }
    });
};
document.getElementById("remove-all2").addEventListener("click", removeAllData);

///// FETCHING
const extractTambahan = async () => {
    const dataRef = ref(database, '/Uday-Telat');

    try {
        const snapshot = await get(dataRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            const extractedData = [];

            Object.keys(data).forEach(key => {
                const item = data[key];
                extractedData.push({
                    NAMA: item.nama,
                    NIM: item.nim,
                    PRODI: item.programStudi,
                    JABATAN: item.jabatan,
                    KETERANGAN: item.status,
                    ALASAN: item.alasan
                    
                });
            });

            const worksheet = XLSX.utils.json_to_sheet(extractedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Uday-Telat");

            XLSX.writeFile(workbook, "Uday-Telat.xlsx");
            Swal.fire({
                title: "Export Excel Success",
                icon: "success"
              });
        } else {
            Swal.fire({
                title: "Data Kosong !",
                icon: "warning"
              });
        }    } catch (error) {
        console.error("Error extracting data from database", error);
        alert("Terjadi kesalahan saat mengekstrak data.");
    }
};
document.getElementById("extract-tambahan").addEventListener("click", extractTambahan);
// Ambil data dari Firebase dan tampilkan dalam tabel
onChildAdded(dataRef, (snapshot) => {
    const data = snapshot.val();
    const nim = snapshot.key;

    const row = document.createElement('tr');
    row.setAttribute('id', `row-${nim}`); // tambahkan id untuk setiap baris
    row.innerHTML = `
        <td class="text-center text-black px-3 py-2">${formatTimestamp(data.timestamp)}</td>
        <td class="text-center text-black px-3 py-2">${data.nama}</td>
        <td class="text-center text-black px-3 py-2">${nim}</td>
        <td class="text-center text-black px-3 py-2">${data.programStudi}</td>
        <td class="text-center text-black px-3 py-2">${data.jabatan}</td>
        <td class="text-center text-black px-3 py-2">${data.status}</td>
        <td class="text-start text-black px-3 py-2">${data.alasan}</td>
        <td class="text-center">
            <button class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"  onclick="hapusData('${nim}')">Hapus</button>
        </td>
    `;

    document.getElementById('Uday-Telat').appendChild(row);
});
// Tambahkan listener untuk event child_removed
onChildRemoved(dataRef, (snapshot) => {
    const nim = snapshot.key;
    const rowToRemove = document.getElementById(`row-${nim}`);
    if (rowToRemove) {
        rowToRemove.remove(); // hapus elemen HTML dari tabel
    }
});

// Fungsi untuk menghapus data berdasarkan nim
function hapusData(nim) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        remove(ref(database, `Uday-Telat/${nim}`))
    }
}
// Pastikan fungsi removeData tersedia di cakupan global
window.hapusData = hapusData;